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
import type { Engine } from "json-rules-engine";
import { formatAnswer } from "../helpers/formatAnswer";
import { resolveAnswerValue } from "../helpers/resolveAnswerValue";
import { classifyYesNo } from '../helpers/classifyYesNo';

export const useChat = (opts?: { initialBreeds?: Breed[]; engine?: Engine | null }) => {
    const initialBreeds = opts?.initialBreeds ?? defaultBreeds;
    const engineRef = useRef<Engine | null>(opts?.engine ?? createEngineDefault());

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
        const sorted = Object.keys(facts).sort((a, b) => a.localeCompare(b)).reduce<Record<string, unknown>>((acc, k) => {
            acc[k] = (facts as Record<string, unknown>)[k];
            return acc;
        }, {});
        return `${breed.nombre}::${JSON.stringify(sorted)}`;
    }, []);

    // --- LÓGICA DE SELECCIÓN DE PREGUNTA ---
    const chooseNextQuestion = useCallback(
        (facts: AppFact | undefined, possible: Breed[], questionsList: Question[]) => {
            const factsObj = facts ?? {};

            const mandatory = questionsList.find(q => q.mandatory && !(q.factKey in factsObj));
            if (mandatory) return mandatory;

            const category = factsObj["answer_categoria"] as string | undefined;
            const availableQuestions = questionsList.filter(
                (q) =>
                    !(q.factKey in factsObj) &&
                    !askedQuestionsRef.current.has(q.factKey) &&
                    (q.appliesTo === undefined || q.appliesTo === "both" || !category || q.appliesTo === category)
            );

            if ((possible.length <= 3 && possible.length > 0) || (availableQuestions.length === 0)) {
                const topCandidate = possible[0];
                const traitToAsk = topCandidate.rasgos_tags?.find(t => !askedTraitsRef.current.has(t));
                const isOnOtherCandidates = possible.slice(1).some(b => b.rasgos_tags?.includes(traitToAsk || ""));
                if ((!isOnOtherCandidates && traitToAsk) || (possible.length < 3 && traitToAsk)) {
                    return {
                        id: `q_trait_${traitToAsk}`,
                        text: `¿Tiene este rasgo fisico: ${traitToAsk.replace(/_/g, " ")}?`,
                        factKey: "answer_rasgos_fisicos",
                        type: "YESNO",
                        priority: 999,
                        appliesTo: "both",
                        dynamicTrait: traitToAsk
                    } as Question & { dynamicTrait?: string };
                }
            }

            if (availableQuestions.length === 0 || possible.length === 0) return null;

            let best: Question | null = null;
            let bestScore = Infinity;

            for (const q of availableQuestions) {
                const priorityBias = typeof q.priority === "number" ? q.priority : 0;
                const buckets = buildBucketsForQuestion(q, possible);
                const nonUnknownSum = Object.entries(buckets).reduce((acc, [k, v]) => k === "unknown" ? acc : acc + v, 0);
                if (nonUnknownSum === 0) continue;

                let maxNonUnknown = 0;
                for (const [k, v] of Object.entries(buckets)) {
                    if (k === "unknown") continue;
                    if (v > maxNonUnknown) maxNonUnknown = v;
                }
                if (maxNonUnknown === nonUnknownSum && nonUnknownSum === possible.length) continue;

                // ver si todas las razas posibles tienen el mismo valor de esta pregunta
                console.log(`Pregunta ${q.id} - buckets:`, buckets);

                const infoScore = scoreBuckets(buckets);
                const combined = infoScore + priorityBias * 0.5;

                if (combined < bestScore) {
                    bestScore = combined;
                    best = q;
                }
            }

            return best;
        }, []
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
                        addMessage(`Me estoy quedando sin preguntas... ¿Es **${possibleBreeds[0].nombre}**?`, "cpu");
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

    // Función auxiliar para correr reglas (ahora solo para ordenar/puntuar, no para filtrar duro)
    const runRulesEngine = useCallback(async (facts: AppFact, candidates: Breed[]) => {
        const engine = engineRef.current;
        if (!engine) return;

        const runId = ++runIdRef.current;
        setIsCpuThinking(true);

        try {
            // Usamos los candidatos ya filtrados por el Hard Filter
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
            console.log(`events for runId ${runId}:`, evaluations.map(ev => ev.events));
            console.log(`candidates with weights for runId ${runId}:`, evaluations.map(ev => {
                const total = (ev.events ?? []).reduce((acc, e) => acc + (typeof e.params?.weight === "number" ? e.params.weight : 0), 0);
                return { breed: ev.breed.nombre, score: total };
            }));
            const scored = evaluations.map((ev) => {
                const total = (ev.events ?? []).reduce((acc, e) => acc + (typeof e.params?.weight === "number" ? e.params.weight : 0), 0);
                return { breed: ev.breed, events: ev.events, score: total };
            });
            const filteredScored = scored.filter(s => s.score >= 0);

            // 3. Ordenamos los sobrevivientes por puntaje (de mayor a menor)
            const survivors = filteredScored.sort((a, b) => b.score - a.score);

            // 4. Mapeamos de vuelta a razas
            const finalCandidates = survivors.map(s => s.breed);

            if (runIdRef.current === runId) {
                setPossibleBreeds(finalCandidates);
            }
        } finally {
            if (runIdRef.current === runId) setIsCpuThinking(false);
        }
    }, [fingerprintFacts]);

    // ===============================================================
    // NUEVO HELPER: DESCARTE DURO (HARD FILTER)
    // ===============================================================
    const applyHardFilter = (
        candidates: Breed[],
        question: Question & { dynamicTrait?: string },
        resolvedValue: any
    ): Breed[] => {

        // 1. Lógica para preguntas dinámicas (Rasgos / Tags)
        if (question.dynamicTrait) {
            const trait = question.dynamicTrait;
            const wantsTrait = resolvedValue === true; // Usuario dijo SÍ

            return candidates.filter(breed => {
                const hasTrait = breed.rasgos_tags?.includes(trait);

                if (wantsTrait) {
                    // Usuario dice SÍ -> Descartar si NO lo tiene
                    return hasTrait;
                } else {
                    // Usuario dice NO -> Descartar si SÍ lo tiene
                    return !hasTrait;
                }
            });
        }

        // 2. Lógica para Hipoalergénico (Estricto)
        if (question.factKey === "answer_hipoalergenico" && typeof resolvedValue === "boolean") {
            return candidates.filter(breed => breed.hipoalergenico === resolvedValue);
        }

        // 3. Lógica para Tamaño
        if (question.factKey === "answer_tamanio") {
            const val = String(resolvedValue).toLowerCase();
            return candidates.filter(breed => {
                const bSize = String(breed.tamanio).toLowerCase();
                // Permitir cierta flexibilidad si es necesario, o ser estricto:
                if (val === "mediano") return bSize === "mediano";
                if (val === "pequeño") return bSize === "pequeño" || bSize === "toy";
                if (val === "grande") return bSize === "grande" || bSize === "muy grande";
                if (val === "muy grande") return bSize === "muy grande" || bSize === "gigante";
                return bSize === val;
            });
        }

        // 4. Lógica para Categoria (Perro vs Gato)
        if (question.factKey === "answer_categoria") {
            return candidates.filter(breed => breed.categoria === resolvedValue);
        }

        // 5. Lógica para Pelaje Tipo (Si no es dinámica)
        if (question.factKey === "answer_pelaje_tipo") {
            return candidates.filter(breed => {
                // Obtenemos los tags de la raza
                const tags = breed.rasgos_tags || [];
                // El valor resuelto será "pelaje_corto" o "pelaje_largo"
                return tags.includes(String(resolvedValue));
            });
        }

        // Para preguntas subjetivas (energía, niños), NO filtramos duro, dejamos que el Rules Engine ordene.
        return candidates;
    };

    const handleUserAnswer = useCallback(async (question: Question & { dynamicTrait?: string }, value: boolean | string) => {
        if (isCpuThinking) return;

        currentQuestionRef.current = null;
        setCurrentQuestion(null);

        let factValue: any = null;
        let userText = "";

        // --- 1. RESOLVER EL VALOR DE LA RESPUESTA ---
        if (question.dynamicTrait) {
            const trait = question.dynamicTrait;
            askedTraitsRef.current.add(trait);

            let boolValue = value === true;
            if (typeof value === 'string') {
                const classified = classifyYesNo(value);
                boolValue = classified === 'true';
            } else if (typeof value === 'boolean') {
                boolValue = value;
            }
            // Para el Rules Engine usamos string (!trait o trait), para el filtro usamos boolean
            factValue = boolValue; // Guardamos booleano para el HardFilter
            userText = boolValue ? "Sí" : "No";
        } else {
            factValue = resolveAnswerValue(value, question);
            if (factValue === null || (typeof factValue === "string" && factValue === "")) {
                userText = "No sé / Indiferente";
            } else if (question.type === "YESNO") {
                userText = (factValue === true) ? "Sí" : "No";
            } else {
                userText = formatAnswer(question, factValue as string);
            }
        }

        addMessage(userText, "user");
        askedQuestionsRef.current.add(question.factKey);

        if (factValue === null) {
            // Si responde "No sé", no filtramos nada, solo seguimos
            return;
        }

        // --- 2. APLICAR HARD FILTER (La magia del descarte) ---
        const filteredBreeds = applyHardFilter(possibleBreeds, question, factValue);

        // Si el filtro elimina a TODOS (error del usuario o contradicción),
        // podemos decidir no aplicar el filtro o mostrar un mensaje.
        // Aquí aplicamos la lógica: Si quedan candidatos, usalos. Si no, mantén los anteriores (soft fail).
        const nextBreeds = filteredBreeds.length > 0 ? filteredBreeds : possibleBreeds;

        if (filteredBreeds.length === 0) {
            console.warn("El filtro eliminó todas las razas. Ignorando filtro para no romper el juego.");
        }

        setPossibleBreeds(nextBreeds);

        // --- 3. ACTUALIZAR HECHOS Y RE-ORDENAR ---
        setCpuFacts((prevFacts) => {
            // Preparamos el valor para el motor de reglas (que prefiere strings para tags)
            let engineValue = factValue;
            if (question.dynamicTrait) {
                engineValue = factValue ? question.dynamicTrait : `!${question.dynamicTrait}`;
            }

            const newFacts = { ...prevFacts, [question.factKey]: engineValue };

            // Ejecutamos el motor SOLO para puntuar/ordenar los que sobrevivieron al filtro
            (async () => { await runRulesEngine(newFacts, nextBreeds); })();
            return newFacts;
        });

    }, [isCpuThinking, addMessage, possibleBreeds, runRulesEngine]); // Added dependencies

    const onGuestAnswer = useCallback((value: boolean) => {
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
                    addMessage("¡Me ganaste! No conozco más animales con esas características.", "cpu");
                    return [];
                }
                setGamePhase("playing");
                setTimeout(() => askNextQuestion(), 500);
                return next;
            });
        }
    }, [addMessage, askNextQuestion]);

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