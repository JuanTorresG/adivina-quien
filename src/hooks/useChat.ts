import { useCallback, useEffect, useRef, useState } from "react";
import type { AppFact, Breed, EngineEvent, GamePhase, Message, Question, Sender } from "../types";
import { breeds as defaultBreeds } from "../data/breeds";
import { createEngine as createEngineDefault } from "../engine/engine";
import { questions } from "../data/questions";
import { buildBucketsForQuestion } from "../helpers/buildBucketsForQuestion";
import { scoreBuckets } from "../helpers/scoreBuckets";
import { fastFilterForFacts } from "../helpers/fastFilter";
import type { Engine } from "json-rules-engine";
import { formatAnswer } from "../helpers/formatAnswer";

export const useChat = (opts?: { initialBreeds?: Breed[]; engine?: Engine | null }) => {
    const initialBreeds = opts?.initialBreeds ?? defaultBreeds;
    const engineRef = useRef(opts?.engine ?? createEngineDefault());

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "¡Hola! Piensa en una mascota (una de las del tablero) y yo te haré preguntas para adivinarla.",
            sender: "cpu",
        },
    ]);
    const messageIdRef = useRef(2);

    const [cpuFacts, setCpuFacts] = useState<AppFact>({});
    const [possibleBreeds, setPossibleBreeds] = useState<Breed[]>(initialBreeds);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [isCpuThinking, setIsCpuThinking] = useState(false);
    const [gamePhase, setGamePhase] = useState<GamePhase>("playing");

    const askedQuestionsRef = useRef<Set<string>>(new Set());
    const inProgressRef = useRef(false);
    const hasGuessedRef = useRef(false);
    const currentQuestionRef = useRef<Question | null>(null);
    const cacheRef = useRef<Map<string, unknown>>(new Map());

    const addMessage = useCallback((text: string, sender: Sender) => {
        const id = messageIdRef.current++;
        setMessages((prev) => [...prev, { id, text, sender }]);
    }, []);

    const fingerprintFacts = (breed: Breed, facts: AppFact) => `${breed.name}::${JSON.stringify(facts, Object.keys(facts).sort((a, b) => a.localeCompare(b)))}`;

    const chooseNextQuestion = useCallback((facts: AppFact | undefined, possible: Breed[], questionsList: Question[]) => {
        const factsObj = facts ?? {};
        const unanswered = questionsList.filter((q) => !(q.factKey in factsObj) && !askedQuestionsRef.current.has(q.factKey));
        if (unanswered.length === 0) return null;

        let best: Question | null = null;
        let bestScore = Infinity;

        for (const q of unanswered) {
            const buckets = buildBucketsForQuestion(q, possible);
            const score = scoreBuckets(buckets);
            if (score < bestScore) {
                bestScore = score;
                best = q;
            }
        }
        return best;
    }, []);

    const askNextQuestion = useCallback(() => {
        if (inProgressRef.current) return;
        inProgressRef.current = true;
        try {
            if (gamePhase !== "playing" || hasGuessedRef.current || currentQuestionRef.current) return;

            if (possibleBreeds.length === 1) {
                if (!hasGuessedRef.current) {
                    hasGuessedRef.current = true;
                    setGamePhase("guessing");
                    addMessage(`¿Estás pensando en... **${possibleBreeds[0].name}**?`, "cpu");
                }
                return;
            }

            const next = chooseNextQuestion(cpuFacts, possibleBreeds, questions);
            if (!next) {
                if (!hasGuessedRef.current) {
                    hasGuessedRef.current = true;
                    addMessage("Creo que ya no tengo más preguntas útiles. Voy a intentar adivinar...", "cpu");
                    if (possibleBreeds.length > 0) {
                        setGamePhase("guessing");
                        addMessage(`¿Estás pensando en... **${possibleBreeds[0].name}**?`, "cpu");
                    } else {
                        setGamePhase("over");
                        addMessage("No encontré coincidencias. ¿Quieres reiniciar?", "cpu");
                    }
                }
                return;
            }

            askedQuestionsRef.current.add(next.factKey);
            currentQuestionRef.current = next;
            setCurrentQuestion(next);
            setIsCpuThinking(false);
            addMessage(next.text, "cpu");
        } finally {
            inProgressRef.current = false;
        }
    }, [cpuFacts, possibleBreeds, gamePhase, addMessage, chooseNextQuestion]);

    const runRulesEngine = useCallback(async (facts: AppFact) => {
        if (!engineRef.current) return;
        setIsCpuThinking(true);

        const fastFiltered = fastFilterForFacts(possibleBreeds, facts);

        const engine = engineRef.current;
        const evaluations = await Promise.all(
            fastFiltered.map(async (breed) => {
                const key = fingerprintFacts(breed, facts);
                if (cacheRef.current.has(key)) return { breed, events: cacheRef.current.get(key) };
                try {
                    const res = await engine.run({ ...breed, ...facts });
                    const ev = res?.events ?? [];
                    cacheRef.current.set(key, ev);
                    return { breed, events: ev };
                } catch (err) {
                    console.error("engine.run error:", err);
                    cacheRef.current.set(key, []);
                    return { breed, events: [] };
                }
            })
        );

        const survivors = evaluations
            .filter((e) => {
                const events = e.events as EngineEvent[];
                return !events.some((ev) =>
                    typeof ev.params?.weight === "number" && ev.params.weight < 0
                );
            })
            .map((e) => e.breed);

        setPossibleBreeds(survivors);
        setIsCpuThinking(false);

        if (survivors.length === 0) {
            if (!hasGuessedRef.current) {
                addMessage("No encontré coincidencias. ¿Quieres reiniciar?", "cpu");
                hasGuessedRef.current = true;
                setGamePhase("over");
            }
        } else if (survivors.length === 1) {
            if (!hasGuessedRef.current) {
                hasGuessedRef.current = true;
                setGamePhase("guessing");
                addMessage(`¿Estás pensando en ${survivors[0].name}?`, "cpu");
            }
        }
    }, [possibleBreeds, addMessage]);

    const handleUserAnswer = useCallback(async (question: Question, value: boolean | string) => {
        if (isCpuThinking) return;

        currentQuestionRef.current = null;
        setCurrentQuestion(null);

        const userText = formatAnswer(question, value);

        addMessage(userText, "user");

        const newFacts = { ...cpuFacts, [question.factKey]: value };
        setCpuFacts(newFacts);

        await runRulesEngine(newFacts);

        askNextQuestion();
    }, [cpuFacts, isCpuThinking, addMessage, runRulesEngine, askNextQuestion]);

    const onGuestAnswer = useCallback((value: boolean) => {
        if (value) {
            addMessage("¡Genial! He adivinado tu mascota.", "cpu");
            setGamePhase("over");
        } else {
            addMessage("Vaya, no he adivinado tu mascota. ¡Bien jugado!", "cpu");
            setPossibleBreeds((prev) => prev.slice(1));
            hasGuessedRef.current = false;
            setGamePhase("playing");
            setTimeout(() => askNextQuestion(), 500);
        }
    }, [askNextQuestion, addMessage]);

    const restartGame = useCallback(() => {
        askedQuestionsRef.current.clear();
        hasGuessedRef.current = false;
        currentQuestionRef.current = null;
        cacheRef.current.clear();
        setMessages([
            {
                id: 1,
                text: "¡Hola! Piensa en una mascota (una de las del tablero) y yo te haré preguntas para adivinarla.",
                sender: "cpu",
            },
        ]);
        messageIdRef.current = 2;
        setCpuFacts({});
        setPossibleBreeds(initialBreeds);
        setCurrentQuestion(null);
        setIsCpuThinking(false);
        setGamePhase("playing");
        setTimeout(() => askNextQuestion(), 600);
    }, [askNextQuestion, initialBreeds]);

    useEffect(() => {
        const t = setTimeout(() => askNextQuestion(), 600);
        return () => clearTimeout(t);
    }, [askNextQuestion]);

    return {
        messages,
        isCpuThinking,
        gamePhase,
        currentQuestion,
        restartGame,
        handleUserAnswer,
        onGuestAnswer,
        possibleBreeds,
    };
};
