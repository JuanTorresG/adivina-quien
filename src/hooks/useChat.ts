import { useCallback, useEffect, useRef, useState } from "react";
import type { AppFact, Breed, GamePhase, Message, Question, Sender } from "../types";
import type { Engine } from "json-rules-engine";
import { breeds } from "../data/breeds";
import { createEngine } from "../engine/engine";
import { questions } from "../data/questions";
import { buildBucketsForQuestion, scoreBuckets } from "../helpers";

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "¡Hola! Piensa en una mascota (una de las del tablero) y yo te haré preguntas para adivinarla.",
            sender: "cpu",
        },
    ]);

    const messageIdRef = useRef(2);
    const [cpuFacts, setCpuFacts] = useState<AppFact>({});
    const inProgressRef = useRef<boolean>(false);
    const [possibleBreeds, setPossibleBreeds] = useState<Breed[]>(breeds);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [isCpuThinking, setIsCpuThinking] = useState(false);
    const [gamePhase, setGamePhase] = useState<GamePhase>("playing");
    const engineRef = useRef<Engine>(createEngine());
    const askedQuestionsRef = useRef<Set<string>>(new Set());
    const hasGuessedRef = useRef<boolean>(false);
    const currentQuestionRef = useRef<Question | null>(null);

    const addMessage = useCallback((text: string, sender: Sender) => {
        const id = messageIdRef.current++;
        setMessages((prev) => [...prev, { id, text, sender }]);
    }, []);

    const chooseNextQuestion = useCallback((facts: AppFact | undefined, possibleBreeds: Breed[], questions: Question[]) => {
        const factsObj = facts ?? {};
        const unanswered = questions.filter((q) => !(q.factKey in factsObj) && !askedQuestionsRef.current.has(q.factKey));
        if (unanswered.length === 0) return null;

        let best: Question | null = null;
        let bestScore = Infinity;

        for (const q of unanswered) {
            const buckets = buildBucketsForQuestion(q, possibleBreeds);
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
        console.debug('runRulesEngine finished', { survivingCount: possibleBreeds.length, currentQuestion: currentQuestionRef.current?.factKey });

        try {
            if (gamePhase !== 'playing' || hasGuessedRef.current || currentQuestionRef.current) return;
            if (possibleBreeds.length === 1) {
                if (!hasGuessedRef.current) {
                    hasGuessedRef.current = true;
                    setGamePhase('guessing');
                    addMessage(`¿Estás pensando en... **${possibleBreeds[0].name}**?`, 'cpu');
                }
                return;
            }

            const next = chooseNextQuestion(cpuFacts, possibleBreeds, questions);
            if (!next) {
                if (!hasGuessedRef.current) {
                    hasGuessedRef.current = true;
                    setIsCpuThinking(false);
                    addMessage('Creo que ya no tengo más preguntas útiles. Voy a intentar adivinar...', 'cpu');
                    if (possibleBreeds.length > 0) {
                        setGamePhase('guessing');
                        addMessage(`¿Estás pensando en... **${possibleBreeds[0].name}**?`, 'cpu');
                    } else {
                        setGamePhase('over');
                        addMessage('No encontré coincidencias. ¿Quieres reiniciar?', 'cpu');
                    }
                }
                return;
            }

            // marcar y mostrar pregunta
            askedQuestionsRef.current.add(next.factKey);
            currentQuestionRef.current = next;
            setCurrentQuestion(next);
            setIsCpuThinking(false);
            addMessage(next.text, 'cpu');
        } finally {
            // liberar guard al final (importante)
            inProgressRef.current = false;
        }
    }, [chooseNextQuestion, cpuFacts, possibleBreeds, gamePhase, addMessage]);

    const runRulesEngine = useCallback(async (facts: AppFact) => {
        console.debug('askNextQuestion start', { inProgress: inProgressRef.current, currentQuestion: currentQuestionRef.current?.factKey, hasGuessed: hasGuessedRef.current, possibleCount: possibleBreeds.length });

        if (!engineRef.current) return;

        setIsCpuThinking(true);

        const evaluations = await Promise.all(
            possibleBreeds.map(async (breed) => {
                const combined = { ...breed, ...facts };

                try {
                    const res = await engineRef.current.run(combined);
                    return { breed, events: res.events ?? [] };
                } catch (err) {
                    console.error("Error evaluating breed:", err);
                    return { breed, events: [] };
                }
            })
        );

        const surviving = evaluations
            .filter((e) => {
                const hasNegative = e.events.some(
                    (ev) =>
                        typeof ev.params?.weight === "number" && ev.params.weight < 0
                );
                return !hasNegative;
            })
            .map((e) => e.breed);

        setPossibleBreeds(surviving);

        setTimeout(() => {
            setIsCpuThinking(false);
            if (surviving.length === 0) {
                if (!hasGuessedRef.current) {
                    addMessage(
                        "No se encontraron coincidencias, quieres jugar de nuevo?",
                        "cpu"
                    );
                    setGamePhase("over");
                    hasGuessedRef.current = true;
                }
            } else if (surviving.length === 1) {
                if (!hasGuessedRef.current) {
                    hasGuessedRef.current = true;
                    setGamePhase("guessing");
                    addMessage(`¿Estás pensando en ${surviving[0].name}?`, "cpu");
                }
            } else if (!currentQuestionRef.current && !inProgressRef.current) askNextQuestion();


        }, 500);
    },
        [possibleBreeds, askNextQuestion, addMessage]
    );

    const handleUserAnswer = useCallback(
        async (question: Question, value: boolean | string) => {
            if (isCpuThinking) return;

            currentQuestionRef.current = null;
            setCurrentQuestion(null);

            const userText =
                question.type === "YES_NO"
                    ? value
                        ? "Sí"
                        : "No"
                    : question.options?.find((opt) => opt.value === value)?.text || String(value);

            addMessage(userText, "user");

            const newFactKey: AppFact = { ...cpuFacts, [question.factKey]: value };
            setCpuFacts(newFactKey);

            await runRulesEngine(newFactKey);

            askNextQuestion();
        },
        [cpuFacts, isCpuThinking, addMessage, runRulesEngine, askNextQuestion]
    );

    const onGuestAnswer = useCallback((value: boolean) => {
        if (value) {
            addMessage("¡Genial! He adivinado tu mascota.", "cpu");
            setGamePhase("over");
        } else {
            addMessage("Vaya, no he adivinado tu mascota. ¡Bien jugado!", "cpu");

            setPossibleBreeds((prev) => {
                const [, ...rest] = prev;
                return rest;
            });

            hasGuessedRef.current = false;
            setGamePhase("playing");
            setTimeout(() => askNextQuestion(), 1000);
        }
    },
        [askNextQuestion, addMessage]
    );

    const restartGame = useCallback(() => {
        askedQuestionsRef.current.clear();
        hasGuessedRef.current = false;
        currentQuestionRef.current = null;
        setMessages([
            {
                id: 1,
                text: "¡Hola! Piensa en una mascota (una de las del tablero) y yo te haré preguntas para adivinarla.",
                sender: "cpu",
            },
        ]);
        messageIdRef.current = 2;
        setCpuFacts({});
        setPossibleBreeds(breeds);
        setCurrentQuestion(null);
        setIsCpuThinking(false);
        setGamePhase("playing");
        setTimeout(() => askNextQuestion(), 1000);
    }, [askNextQuestion]);

    useEffect(() => {
        const t = setTimeout(() => {
            askNextQuestion();
        }, 1000);

        return () => clearTimeout(t);
    }, [askNextQuestion]);

    return {
        // State
        messages,
        isCpuThinking,
        gamePhase,
        currentQuestion,

        // Actions
        restartGame,
        handleUserAnswer,
        onGuestAnswer,
    };
};
