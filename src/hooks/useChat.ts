import { breeds as defaultBreeds } from './../data/breeds';
import { useCallback, useEffect, useRef, useState } from "react";
import type {
    AppFact,
    Breed,
    EngineEvent,
    GamePhase,
    Message,
    Question,
    Sender
} from "../types";
import { createEngine as createEngineDefault } from "../engine/engine";
import { questions } from "../data/questions";
import { buildBucketsForQuestion } from "../helpers/buildBucketsForQuestion";
import { scoreBuckets } from "../helpers/scoreBuckets";
import { fastFilterForFacts } from "../helpers/fastFilter";
import type { Engine } from "json-rules-engine";
import { formatAnswer } from "../helpers/formatAnswer";

export const useChat = (opts?: { initialBreeds?: Breed[]; engine?: Engine | null }) => {
    const initialBreeds = opts?.initialBreeds ?? defaultBreeds;
    const engineRef = useRef<Engine | null>(opts?.engine ?? createEngineDefault());

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "¡Hola! Piensa en una mascota (una de las del tablero) y yo te haré preguntas para adivinarla.",
            sender: "cpu",
        },
    ]);
    const messageIdRef = useRef<number>(2);

    const [cpuFacts, setCpuFacts] = useState<AppFact>({});
    const [possibleBreeds, setPossibleBreeds] = useState<Breed[]>(initialBreeds);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [isCpuThinking, setIsCpuThinking] = useState<boolean>(false);
    const [gamePhase, setGamePhase] = useState<GamePhase>("playing");

    const askedQuestionsRef = useRef<Set<string>>(new Set());
    const inProgressRef = useRef<boolean>(false);
    const hasGuessedRef = useRef<boolean>(false);
    const currentQuestionRef = useRef<Question | null>(null);
    const cacheRef = useRef<Map<string, EngineEvent[]>>(new Map());
    const runIdRef = useRef<number>(0);

    const addMessage = useCallback((text: string, sender: Sender) => {
        const id = messageIdRef.current++;
        setMessages((prev) => [...prev, { id, text, sender }]);
    }, []);

    const fingerprintFacts = useCallback((breed: Breed, facts: AppFact) => {
        const sorted = Object.keys(facts).sort((a, b) => a.localeCompare(b)).reduce<Record<string, unknown>>((acc, k) => {
            acc[k] = (facts as Record<string, unknown>)[k];
            return acc;
        }, {});
        return `${breed.nombre}::${JSON.stringify(sorted)}`;
    }, []);

    const chooseNextQuestion = useCallback(
        (facts: AppFact | undefined, possible: Breed[], questionsList: Question[]) => {
            const factsObj = facts ?? {};
            const unanswered = questionsList.filter(
                (q) => !(q.factKey in factsObj) && !askedQuestionsRef.current.has(q.factKey)
            );
            if (unanswered.length === 0) return null;
            if (possible.length === 0) return null;

            let best: Question | null = null;
            let bestScore = Infinity;
            const total = possible.length;

            for (const q of unanswered) {
                const buckets = buildBucketsForQuestion(q, possible);
                const nonUnknownSum = Object.entries(buckets).reduce((acc, [k, v]) => {
                    return k === "unknown" ? acc : acc + v;
                }, 0);

                if (nonUnknownSum === 0) continue;
                let maxNonUnknown = 0;
                for (const [k, v] of Object.entries(buckets)) {
                    if (k === "unknown") continue;
                    if (v > maxNonUnknown) maxNonUnknown = v;
                }
                if (maxNonUnknown === nonUnknownSum && nonUnknownSum === total) continue;

                const score = scoreBuckets(buckets);
                if (score < bestScore) {
                    bestScore = score;
                    best = q;
                }
            }

            return best;
        },
        []
    );
    const askNextQuestion = useCallback(() => {
        if (inProgressRef.current) return;
        inProgressRef.current = true;
        try {
            if (gamePhase !== "playing" || hasGuessedRef.current || currentQuestionRef.current) return;

            if (possibleBreeds.length === 1) {
                if (!hasGuessedRef.current) {
                    hasGuessedRef.current = true;
                    setGamePhase("guessing");
                    addMessage(`¿Estás pensando en... **${possibleBreeds[0].nombre}**?`, "cpu");
                }
                return;
            }

            const next = chooseNextQuestion(cpuFacts, possibleBreeds, questions);
            if (!next) {
                if (!hasGuessedRef.current) {
                    hasGuessedRef.current = true;
                    if (possibleBreeds.length > 0) {
                        setGamePhase("guessing");
                        addMessage(`¿Estás pensando en... **${possibleBreeds[0].nombre}**?`, "cpu");
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
        const engine = engineRef.current;
        if (!engine) return;

        const runId = ++runIdRef.current;
        setIsCpuThinking(true);

        try {
            const fastFiltered = fastFilterForFacts(possibleBreeds, facts);
            const evaluations = await Promise.all(
                fastFiltered.map(async (breed) => {
                    const key = fingerprintFacts(breed, facts);
                    if (cacheRef.current.has(key)) {
                        const cached = cacheRef.current.get(key);
                        return { breed, events: cached ?? [] };
                    }
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

            if (runIdRef.current !== runId) return;

            const scored = evaluations.map((ev) => {
                const events = ev.events ?? [];
                const total = events.reduce((acc, e) => {
                    const w = typeof e.params?.weight === "number" ? e.params.weight : 0;
                    return acc + w;
                }, 0);
                return { breed: ev.breed, events, score: total };
            });
            const survivors = scored
                .filter((s) => s.score >= 0)
                .sort((a, b) => b.score - a.score)
                .map((s) => s.breed);

            const finalCandidates = survivors.length > 0 ? survivors : scored.sort((a, b) => b.score - a.score).slice(0, 6).map(s => s.breed);

            if (runIdRef.current === runId) {
                setPossibleBreeds(finalCandidates);
            }
        } finally {
            if (runIdRef.current === runId) setIsCpuThinking(false);
        }
    }, [possibleBreeds, fingerprintFacts]);

    const handleUserAnswer = useCallback(async (question: Question, value: boolean | string) => {
        if (isCpuThinking) return;

        currentQuestionRef.current = null;
        setCurrentQuestion(null);

        const userText = formatAnswer(question, value);
        addMessage(userText, "user");

        setCpuFacts((prevFacts) => {
            const newFacts = { ...prevFacts, [question.factKey]: value };
            (async () => { await runRulesEngine(newFacts); })();
            return newFacts;
        });

        askedQuestionsRef.current.add(question.factKey);

    }, [isCpuThinking, addMessage, runRulesEngine]);

    const onGuestAnswer = useCallback((value: boolean) => {
        if (value) {
            addMessage("¡Genial! He adivinado tu mascota.", "cpu");
            setGamePhase("over");
        } else {
            addMessage("Vaya, no he adivinado tu mascota. ¡Bien jugado!", "cpu");

            setPossibleBreeds((prev) => {
                const next = prev.slice(1);

                hasGuessedRef.current = false;
                setGamePhase("playing");

                setTimeout(() => askNextQuestion(), 500);
                return next;
            });
        }
    }, [addMessage, askNextQuestion]);

    const restartGame = useCallback(() => {
        askedQuestionsRef.current.clear();
        hasGuessedRef.current = false;
        currentQuestionRef.current = null;
        cacheRef.current.clear();
        runIdRef.current = 0;

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

        setTimeout(() => askNextQuestion(), 400);
    }, [askNextQuestion, initialBreeds]);

    useEffect(() => {
        if (gamePhase === "playing" && !isCpuThinking && !inProgressRef.current) {
            askNextQuestion();
        }
    }, [isCpuThinking, gamePhase, askNextQuestion]);

    useEffect(() => {
        const t = setTimeout(() => askNextQuestion(), 400);
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