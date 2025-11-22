import { useCallback, useEffect, useRef, useState } from "react";
import { createEngine as createEngineDefault } from "../engine/engine";
import { breeds as defaultBreeds } from "./../data/breeds";
import { questions } from "../data/questions";
import type { Engine } from "json-rules-engine";
import type {
    AppFact,
    Breed,
    EngineEvent,
    GamePhase,
    Message,
    Question,
    Sender,
} from "../types";
import {
    buildBucketsForQuestion,
    scoreBuckets,
    formatAnswer,
    resolveAnswerValue,
    classifyYesNo,
} from "../helpers";

const DYNAMIC_ATTRIBUTES: Record<string, { label: string; isArray: boolean }> =
{
    rasgos_tags: { label: "¿Tiene el rasgo físico:", isArray: true },
    ejercicio_horas: {
        label: "¿Su necesidad de ejercicio es:",
        isArray: false,
    },
    descripcion_aseo: { label: "¿Requiere:", isArray: true },
    temperamento: { label: "¿Dirías que es:", isArray: true },
    comportamiento: { label: "¿Tiene este comportamiento:", isArray: true },
    predisposiciones_salud: { label: "¿Suele sufrir de:", isArray: true },
    origen: { label: "¿Es originario de:", isArray: false },
    grupo: { label: "¿Pertenece al grupo:", isArray: false },
};

export const useChat = (opts?: {
    initialBreeds?: Breed[];
    engine?: Engine | null;
}) => {
    const initialBreeds = opts?.initialBreeds ?? defaultBreeds;
    const engineRef = useRef<Engine | null>(
        opts?.engine ?? createEngineDefault()
    );

    const [messages, setMessages] = useState<Message[]>([]);
    const messageIdRef = useRef<number>(2);

    const [cpuFacts, setCpuFacts] = useState<AppFact>({});
    const [possibleBreeds, setPossibleBreeds] = useState<Breed[]>(initialBreeds);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [isCpuThinking, setIsCpuThinking] = useState<boolean>(false);
    const [gamePhase, setGamePhase] = useState<GamePhase>("playing");

    const askedQuestionsRef = useRef<Set<string>>(new Set());
    const askedTraitsRef = useRef<Set<string>>(new Set());
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
        const sorted = Object.keys(facts)
            .sort((a, b) => a.localeCompare(b))
            .reduce<Record<string, unknown>>((acc, k) => {
                acc[k] = (facts as Record<string, unknown>)[k];
                return acc;
            }, {});
        return `${breed.nombre}::${JSON.stringify(sorted)}`;
    }, []);
    const chooseNextQuestion = useCallback(
        (
            facts: AppFact | undefined,
            possible: Breed[],
            questionsList: Question[]
        ) => {
            const factsObj = facts ?? {};

            const mandatory = questionsList.find(
                (q) => q.mandatory && !(q.factKey in factsObj)
            );
            if (mandatory) return mandatory;

            const category = factsObj["answer_categoria"] as string | undefined;
            const availableQuestions = questionsList.filter(
                (q) =>
                    !(q.factKey in factsObj) &&
                    !askedQuestionsRef.current.has(q.factKey) &&
                    (q.appliesTo === undefined ||
                        q.appliesTo === "both" ||
                        !category ||
                        q.appliesTo === category)
            );

            const askedDynamicValuesSet = askedTraitsRef.current;

            if (
                (possible.length <= 2 && possible.length > 0) ||
                availableQuestions.length === 0
            ) {
                const topCandidate = possible[0];

                for (const [attrKey, config] of Object.entries(DYNAMIC_ATTRIBUTES)) {
                    const key = attrKey as keyof Breed;
                    const rawValue = topCandidate[key];

                    if (!rawValue) continue;

                    const valuesToCheck: string[] = config.isArray
                        ? (rawValue as string[])
                        : [rawValue as string];

                    for (const valueToAsk of valuesToCheck) {
                        if (askedDynamicValuesSet.has(valueToAsk)) continue;

                        const isCommonToAll = possible.every((breed) => {
                            const breedVal = breed[key];
                            if (!breedVal) return false;

                            if (config.isArray) {
                                return (breedVal as string[]).includes(valueToAsk);
                            } else {
                                return breedVal === valueToAsk;
                            }
                        });

                        if (isCommonToAll) continue;
                        console.log(
                            `Generando pregunta dinámica para ${attrKey} / valor ${valueToAsk}`
                        );
                        return {
                            id: `q_dyn_${attrKey}_${valueToAsk.replace(/\s+/g, "_")}`,
                            text: `${config.label} ${valueToAsk.replace(/_/g, " ")}?`,
                            factKey: `answer_${attrKey}`,
                            type: "YESNO",
                            priority: 999,
                            appliesTo: "both",
                            dynamicTrait: valueToAsk,
                        } as Question & { dynamicTrait?: string };
                    }
                }
            }
            console.log("Available questions for selection:", askedDynamicValuesSet);

            if (availableQuestions.length === 0 || possible.length === 0) return null;

            let best: Question | null = null;
            let bestScore = Infinity;

            for (const q of availableQuestions) {
                const priorityBias = typeof q.priority === "number" ? q.priority : 0;
                const buckets = buildBucketsForQuestion(q, possible);
                const nonUnknownSum = Object.entries(buckets).reduce(
                    (acc, [k, v]) => (k === "unknown" ? acc : acc + v),
                    0
                );
                if (nonUnknownSum === 0) continue;

                let maxNonUnknown = 0;
                for (const [k, v] of Object.entries(buckets)) {
                    if (k === "unknown") continue;
                    if (v > maxNonUnknown) maxNonUnknown = v;
                }
                if (
                    maxNonUnknown === nonUnknownSum &&
                    nonUnknownSum === possible.length
                )
                    continue;

                console.log(`Pregunta ${q.id} - buckets:`, buckets);

                const infoScore = scoreBuckets(buckets);
                const combined = infoScore + priorityBias * 0.5;

                if (combined < bestScore) {
                    bestScore = combined;
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
            if (
                gamePhase !== "playing" ||
                hasGuessedRef.current ||
                currentQuestionRef.current
            )
                return;

            if (possibleBreeds.length === 1) {
                if (!hasGuessedRef.current) {
                    hasGuessedRef.current = true;
                    setGamePhase("guessing");
                    addMessage(
                        `¿Estás pensando en... **${possibleBreeds[0].nombre}**?`,
                        "cpu"
                    );
                }
                return;
            }

            const next = chooseNextQuestion(cpuFacts, possibleBreeds, questions);

            if (!next) {
                if (!hasGuessedRef.current) {
                    hasGuessedRef.current = true;
                    if (possibleBreeds.length > 0) {
                        setGamePhase("guessing");
                        addMessage(
                            `Me estoy quedando sin preguntas... ¿Es **${possibleBreeds[0].nombre}**?`,
                            "cpu"
                        );
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

    const runRulesEngine = useCallback(
        async (facts: AppFact, candidates: Breed[]) => {
            const engine = engineRef.current;
            if (!engine) return;

            const runId = ++runIdRef.current;
            setIsCpuThinking(true);

            try {
                const evaluations = await Promise.all(
                    candidates.map(async (breed) => {
                        const key = fingerprintFacts(breed, facts);
                        if (cacheRef.current.has(key)) {
                            return { breed, events: cacheRef.current.get(key) ?? [] };
                        }
                        try {
                            const res = await engine.run({ ...breed, ...facts });
                            const ev = res?.events ?? [];
                            cacheRef.current.set(key, ev);
                            return { breed, events: ev };
                        } catch (err) {
                            console.error("engine.run error:", err);
                            return { breed, events: [] };
                        }
                    })
                );

                if (runIdRef.current !== runId) return;

                console.log(`evaluations for runId ${runId}:`, evaluations);
                console.log(`candidates for runId ${runId}:`, candidates);
                console.log(
                    `events for runId ${runId}:`,
                    evaluations.map((ev) => ev.events)
                );
                console.log(
                    `candidates with weights for runId ${runId}:`,
                    evaluations.map((ev) => {
                        const total = (ev.events ?? []).reduce(
                            (acc, e) =>
                                acc +
                                (typeof e.params?.weight === "number" ? e.params.weight : 0),
                            0
                        );
                        return { breed: ev.breed.nombre, score: total };
                    })
                );
                const scored = evaluations.map((ev) => {
                    const total = (ev.events ?? []).reduce(
                        (acc, e) =>
                            acc +
                            (typeof e.params?.weight === "number" ? e.params.weight : 0),
                        0
                    );
                    return { breed: ev.breed, events: ev.events, score: total };
                });
                const filteredScored = scored.filter((s) => s.score >= 0);

                const survivors = filteredScored.sort((a, b) => b.score - a.score);

                const finalCandidates = survivors.map((s) => s.breed);

                if (runIdRef.current === runId) {
                    setPossibleBreeds(finalCandidates);
                }
            } finally {
                if (runIdRef.current === runId) setIsCpuThinking(false);
            }
        },
        [fingerprintFacts]
    );

    const handleUserAnswer = useCallback(
        async (
            question: Question & { dynamicTrait?: string },
            value: boolean | string
        ) => {
            if (isCpuThinking) return;

            currentQuestionRef.current = null;
            setCurrentQuestion(null);

            let factValue = null;
            let userText = "";

            if (question.dynamicTrait) {
                const trait = question.dynamicTrait;
                askedTraitsRef.current.add(trait);

                let boolValue = value === true;
                if (typeof value === "string") {
                    const classified = classifyYesNo(value);
                    boolValue = classified === "true";
                } else if (typeof value === "boolean") {
                    boolValue = value;
                }
                factValue = boolValue;
                userText = boolValue ? "Sí" : "No";
            } else {
                factValue = resolveAnswerValue(value, question);
                if (
                    factValue === null ||
                    (typeof factValue === "string" && factValue === "")
                ) {
                    userText = "No sé / Indiferente";
                } else if (question.type === "YESNO") {
                    userText = factValue === true ? "Sí" : "No";
                } else {
                    userText = formatAnswer(question, factValue as string);
                }
            }

            addMessage(userText, "user");
            askedQuestionsRef.current.add(question.factKey);

            if (factValue === null) {
                return;
            }

            setCpuFacts((prevFacts) => {
                let engineValue = factValue;
                if (question.dynamicTrait) {
                    engineValue = factValue
                        ? question.dynamicTrait
                        : `!${question.dynamicTrait}`;
                }

                const newFacts = { ...prevFacts, [question.factKey]: engineValue };

                (async () => {
                    await runRulesEngine(newFacts, possibleBreeds);
                })();
                return newFacts;
            });
        },
        [isCpuThinking, addMessage, possibleBreeds, runRulesEngine]
    );

    const onGuestAnswer = useCallback(
        (value: boolean) => {
            if (value) {
                addMessage("¡Genial! He adivinado tu mascota.", "cpu");
                setGamePhase("over");
            } else {
                addMessage("Vaya, no he adivinado. Sigamos jugando...", "cpu");
                setPossibleBreeds((prev) => {
                    const next = prev.slice(1);
                    hasGuessedRef.current = false;
                    if (next.length === 0) {
                        setGamePhase("over");
                        addMessage(
                            "¡Me ganaste! No conozco más animales con esas características.",
                            "cpu"
                        );
                        return [];
                    }
                    setGamePhase("playing");
                    setTimeout(() => askNextQuestion(), 500);
                    return next;
                });
            }
        },
        [addMessage, askNextQuestion]
    );

    const restartGame = useCallback(() => {
        askedQuestionsRef.current.clear();
        askedTraitsRef.current.clear();
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
