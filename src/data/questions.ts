import type { Question } from "../types";

export const questions: Question[] = [
    {
        id: "q_categoria",
        text: "¿Tu animal secreto es un Perro o un Gato?",
        factKey: "answer_categoria",
        type: "CHOICE",
        options: [
            { text: "Es un Perro", value: "perro" },
            { text: "Es un Gato", value: "gato" }
        ],
        mandatory: true,
        priority: 0,
        appliesTo: "both"
    },
    {
        id: "q_hipo",
        text: "¿Es una raza hipoalergénica?",
        factKey: "answer_hipoalergenico",
        type: "YESNO",
        priority: 1,
        appliesTo: "both"
    },
    {
        id: "q_tamanio",
        text: "¿De qué tamaño es el animal?",
        factKey: "answer_tamanio",
        type: "CHOICE",
        options: [
            { text: "Pequeño / muy pequeño", value: "pequeño" },
            { text: "Mediano", value: "mediano" },
            { text: "Grande / muy grande", value: "grande" },
            { text: "Gigante", value: "gigante" }
        ],
        priority: 2,
        appliesTo: "both"
    },

    // EJERCICIO (5 niveles)
    {
        id: "q_ejercicio",
        text: "¿Cuál es la **necesidad de ejercicio** del animal?",
        factKey: "answer_necesidad_ejercicio",
        type: "CHOICE",
        options: [
            { text: "Muy alta (Requiere actividad intensa diaria)", value: "muy alto" },
            { text: "Alta (Requiere mucho ejercicio diario)", value: "alto" },
            { text: "Media (Requiere ejercicio moderado)", value: "medio" },
            { text: "Baja (Requiere poco ejercicio)", value: "bajo" },
            { text: "Muy baja (Casi sin necesidad de ejercicio)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 3,
        appliesTo: "both"
    },

    // SOLEDAD (usa alias alta/media/baja)
    {
        id: "q_soledad",
        text: "¿Es un animal muy apegado o independiente? (**Tolerancia a la Soledad**)",
        factKey: "answer_tolerancia_soledad",
        type: "CHOICE",
        options: [
            { text: "Es muy apegado (Baja tolerancia a la soledad)", value: "baja_tolerancia" },
            { text: "Es equilibrado", value: "media_tolerancia" },
            { text: "Es muy independiente (Alta tolerancia a la soledad)", value: "alta_tolerancia" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 4,
        appliesTo: "both"
    },

    // BUENO CON NIÑOS (5 niveles)
    {
        id: "q_ninos",
        text: "¿Qué tan **bueno es con niños**?",
        factKey: "answer_bueno_con_ninos",
        type: "CHOICE",
        options: [
            { text: "Muy alto (Extremadamente tolerante y protector)", value: "muy alto" },
            { text: "Alto (Tolerante y protector)", value: "alto" },
            { text: "Medio (Bueno, pero requiere supervisión)", value: "medio" },
            { text: "Bajo (Requiere socialización, puede ser temperamental)", value: "bajo" },
            { text: "Muy bajo (No recomendado con niños)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 5,
        appliesTo: "both"
    },

    // OTRAS MASCOTAS (5 niveles)
    {
        id: "q_otras_mascotas",
        text: "¿Qué tan bien se lleva con **otras mascotas**?",
        factKey: "answer_acepta_otras_mascotas",
        type: "CHOICE",
        options: [
            { text: "Muy alto (Muy sociable)", value: "muy alto" },
            { text: "Alto (Generalmente amistoso y acepta otras mascotas)", value: "alto" },
            { text: "Medio (Puede ser bueno, pero requiere socialización cuidadosa)", value: "medio" },
            { text: "Bajo (Puede ser agresivo, territorial o con instinto de caza)", value: "bajo" },
            { text: "Muy bajo (Problemas serios con otras especies)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 6,
        appliesTo: "both"
    },

    // LADRIDO / VOCALIZACIÓN (5 niveles)
    {
        id: "q_ladrido",
        text: "¿Cuál es el nivel de **ladrido/vocalización** del animal?",
        factKey: "answer_ladrido",
        type: "CHOICE",
        options: [
            { text: "Muy alto (Extremadamente vocal)", value: "muy alto" },
            { text: "Alto (Muy vocal / Ladra mucho)", value: "alto" },
            { text: "Medio (Ladra o vocaliza ocasionalmente)", value: "medio" },
            { text: "Bajo (Rara vez ladra o vocaliza)", value: "bajo" },
            { text: "Muy bajo (Casi silencioso)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 7,
        appliesTo: "both"
    },

    // ASE0 (5 niveles)
    {
        id: "q_aseo",
        text: "¿Cuál es el **nivel de aseo** del animal?",
        factKey: "answer_aseo",
        type: "CHOICE",
        options: [
            { text: "Muy alto (Requiere aseo diario/profesional)", value: "muy alto" },
            { text: "Alto (Requiere aseo frecuente y detallado)", value: "alto" },
            { text: "Medio (Requiere aseo regular)", value: "medio" },
            { text: "Bajo (Requiere poco aseo)", value: "bajo" },
            { text: "Muy bajo (Casi sin aseo requerido)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 8,
        appliesTo: "both"
    },

    // MUDA (5 niveles)
    {
        id: "q_muda",
        text: "¿Cuál es el **nivel de muda** del animal?",
        factKey: "answer_muda",
        type: "CHOICE",
        options: [
            { text: "Muy alto (Muda excesiva)", value: "muy alto" },
            { text: "Alto (Muda abundante y frecuente)", value: "alto" },
            { text: "Medio (Muda moderada)", value: "medio" },
            { text: "Bajo (Muda mínima)", value: "bajo" },
            { text: "Muy bajo (Casi sin muda)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 9,
        appliesTo: "both"
    },

    // ADIESTRAMIENTO (5 niveles)
    {
        id: "q_adiestramiento",
        text: "¿Qué tan fácil o difícil es su **adiestramiento**?",
        factKey: "answer_adiestramiento",
        type: "CHOICE",
        options: [
            { text: "Muy alto (Aprende excepcionalmente rápido)", value: "muy alto" },
            { text: "Alto (Aprende rápido y disfruta)", value: "alto" },
            { text: "Medio (Necesita consistencia y un manejo firme)", value: "medio" },
            { text: "Bajo (Difícil / Terco)", value: "bajo" },
            { text: "Muy bajo (Extremadamente difícil)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 10,
        appliesTo: "both"
    },

    // ENERGÍA (5 niveles)
    {
        id: "q_energia",
        text: "¿Cuál es el **nivel de energía** del animal?",
        factKey: "answer_nivel_energia",
        type: "CHOICE",
        options: [
            { text: "Muy alto (Muy, muy activo)", value: "muy alto" },
            { text: "Alto (Activo / Enérgico)", value: "alto" },
            { text: "Medio (Equilibrado / Moderado)", value: "medio" },
            { text: "Bajo (Tranquilo / Poco activo)", value: "bajo" },
            { text: "Muy bajo (Casi nulo)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 11,
        appliesTo: "both"
    },

    // FAMILIAR (5 niveles)
    {
        id: "q_familiar",
        text: "¿Qué tan **familiar** es el animal?",
        factKey: "answer_familiar",
        type: "CHOICE",
        options: [
            { text: "Muy alto (Extremadamente afectuoso)", value: "muy alto" },
            { text: "Alto (Muy afectuoso y cariñoso)", value: "alto" },
            { text: "Medio (Afectuoso, pero independiente)", value: "medio" },
            { text: "Bajo (Reservado o distante)", value: "bajo" },
            { text: "Muy bajo (Muy distante)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 12,
        appliesTo: "both"
    },

    // JUGUETÓN (5 niveles)
    {
        id: "q_jugueton",
        text: "¿Cuál es el **nivel de juguetón** del animal?",
        factKey: "answer_jugueton",
        type: "CHOICE",
        options: [
            { text: "Muy alto (Siempre listo para jugar)", value: "muy alto" },
            { text: "Alto (Le encanta jugar / muy activo)", value: "alto" },
            { text: "Medio (Juega en momentos específicos o con moderación)", value: "medio" },
            { text: "Bajo (Poco interesado en el juego)", value: "bajo" },
            { text: "Muy bajo (Casi nunca juega)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 13,
        appliesTo: "both"
    },

    // INTELIGENCIA (5 niveles)
    {
        id: "q_inteligencia",
        text: "¿Cómo calificarías su **inteligencia**?",
        factKey: "answer_inteligencia",
        type: "CHOICE",
        options: [
            { text: "Muy alta (Resuelve problemas con facilidad)", value: "muy alto" },
            { text: "Alta (Resuelve problemas fácilmente)", value: "alto" },
            { text: "Media (Inteligencia estándar)", value: "medio" },
            { text: "Baja (Requiere más repetición para aprender)", value: "bajo" },
            { text: "Muy baja (Limitada capacidad de aprendizaje)", value: "muy bajo" },
            { text: "No estoy seguro", value: "no_se" }
        ],
        priority: 14,
        appliesTo: "both"
    }
];
