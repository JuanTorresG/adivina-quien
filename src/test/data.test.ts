// hooks/useChat.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppFact, Breed, GamePhase, Message, Question, Sender } from "../types";
import { breeds } from "../data/breeds";
import { createEngine } from "../engine/createEngine";
import { questions } from "../data/questions";
import { buildBucketsForQuestion, scoreBuckets } from "../helpers";
import { fastFilterForFacts } from "../helpers/fastFilter";

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "¡Hola! Piensa en una mascota (una de las del tablero) y yo te haré preguntas para adivinarla.",
            sender: "cpu",
        },
    ]);
    const messageIdRef = useRef(2);

    // facts conocidos por la CPU (respuestas del usuario)
    const [cpuFacts, setCpuFacts] = useState<AppFact>({});
    const engineRef = useRef(createEngine());
    const cacheRef = useRef(new Map<string, any>()); // cache para engine.run por breed+facts
    const [possibleBreeds, setPossibleBreeds] = useState<Breed[]>(breeds);

    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [isCpuThinking, setIsCpuThinking] = useState(false);
    const [gamePhase, setGamePhase] = useState<GamePhase>("playing");

    const askedQuestionsRef = useRef<Set<string>>(new Set());
    const inProgressRef = useRef(false);
    const hasGuessedRef = useRef(false);
    const currentQuestionRef = useRef<Question | null>(null);

    const addMessage = useCallback((text: string, sender: Sender) => {
        const id = messageIdRef.current++;
        setMessages((prev) => [...prev, { id, text, sender }]);
    }, []);

    // Fingerprint simple de facts + breed para cache
    const fingerprintFacts = (breed: Breed, facts: AppFact) => {
        return `${breed.name}::${JSON.stringify(facts, Object.keys(facts).sort())}`;
    };

    // Elección de la siguiente pregunta (sin cambios conceptuales)
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

    // Función para ejecutar el motor de reglas solo sobre los candidatos filtrados
    const runRulesEngine = useCallback(async (facts: AppFact) => {
        if (!engineRef.current) return;

        // 1) FILTRADO RÁPIDO en JS (reduce mucho el número de candidatos)
        const fastFiltered = fastFilterForFacts(possibleBreeds, facts);
        if (fastFiltered.length === 0) {
            setPossibleBreeds([]);
            setIsCpuThinking(false);
            addMessage("No se encontraron coincidencias con esas respuestas.", "cpu");
            setGamePhase("over");
            hasGuessedRef.current = true;
            return;
        }

        setIsCpuThinking(true);

        // 2) Ejecutar motor SOLO sobre los que quedan y memoizar evaluaciones por fingerprint
        const engine = engineRef.current;
        const evaluations = await Promise.all(
            fastFiltered.map(async (breed) => {
                const fp = fingerprintFacts(breed, facts);
                if (cacheRef.current.has(fp)) {
                    return { breed, events: cacheRef.current.get(fp) as any[] };
                }

                const combinedFacts = { ...breed, ...facts };
                try {
                    const res = await engine.run(combinedFacts);
                    const ev = res?.events ?? [];
                    cacheRef.current.set(fp, ev);
                    return { breed, events: ev };
                } catch (err) {
                    console.error("Error running engine for breed:", breed.name, err);
                    cacheRef.current.set(fp, []);
                    return { breed, events: [] };
                }
            })
        );

        // 3) Filtrar por eventos negativos (si tu lógica requiere también priorizar por peso, puedes hacerlo aquí)
        const survivors = evaluations
            .filter((e) => {
                const hasNegative = e.events.some((ev) => typeof ev.params?.weight === "number" && ev.params.weight < 0);
                return !hasNegative;
            })
            .map((e) => e.breed);

        // 4) Actualizar candidatos en una sola operación
        setPossibleBreeds(survivors);

        setIsCpuThinking(false);

        // 5) Si queda 1 -> adivinar, si 0 -> terminar, si >1 -> preguntar siguiente
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
        } else {
            // continúa preguntando
        }
    }, [possibleBreeds, addMessage]);

    // Preguntar siguiente (controla flujo y evita race conditions)
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

            // marcar y mostrar pregunta
            askedQuestionsRef.current.add(next.factKey);
            currentQuestionRef.current = next;
            setCurrentQuestion(next);
            setIsCpuThinking(false);
            addMessage(next.text, "cpu");
        } finally {
            inProgressRef.current = false;
        }
    }, [chooseNextQuestion, cpuFacts, possibleBreeds, gamePhase, addMessage]);

    // Manejo respuesta usuario
    const handleUserAnswer = useCallback(async (question: Question, value: boolean | string) => {
        if (isCpuThinking) return;

        // limpiar pregunta actual
        currentQuestionRef.current = null;
        setCurrentQuestion(null);

        // añadir mensaje del usuario
        const userText = question.type === "YES_NO" ? (value ? "Sí" : "No") : (question.options?.find((o) => o.value === value)?.text ?? String(value));
        addMessage(userText, "user");

        // actualizar facts
        setCpuFacts((prevFacts) => {
            const nextFacts = { ...prevFacts, [question.factKey]: value };
            // Ejecutar rule engine con los nuevos facts
            // NOTA: no await aquí para evitar bloquear la UI — runRulesEngine se encarga del state
            runRulesEngine(nextFacts).catch((e) => console.error(e));
            return nextFacts;
        });

        // preguntar siguiente (askNextQuestion se invocará al terminar runRulesEngine si procede)
    }, [isCpuThinking, addMessage, runRulesEngine]);

    const onGuestAnswer = useCallback((value: boolean) => {
        if (value) {
            addMessage("¡Genial! He adivinado tu mascota.", "cpu");
            setGamePhase("over");
        } else {
            addMessage("Vaya, no he adivinado tu mascota. ¡Bien jugado!", "cpu");
            setPossibleBreeds((prev) => prev.slice(1)); // quitar el primer candidato
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
        setPossibleBreeds(breeds);
        setCurrentQuestion(null);
        setIsCpuThinking(false);
        setGamePhase("playing");
        setTimeout(() => askNextQuestion(), 500);
    }, [askNextQuestion]);

    // iniciar juego: primera pregunta
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
    };
};
