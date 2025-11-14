import type { Question } from "../types";

export const questions: Question[] = [
    {
        id: "q_categoria",
        text: "Primero, ¿es un perro o un gato?",
        factKey: "answer_categoria",
        type: "CHOICE",
        options: [
            { text: "Perro", value: "perro" },
            { text: "Gato", value: "gato" }
        ]
    },
    {
        id: "q_size",
        text: "¿De qué tamaño es? (pequeño/mediano/grande)",
        factKey: "answer_size",
        type: "CHOICE",
        options: [
            { text: "Pequeño", value: "pequeño" },
            { text: "Mediano", value: "mediano" },
            { text: "Grande", value: "grande" }
        ]
    },
    {
        id: "q_hypo",
        text: "¿Es hipoalergénico?",
        factKey: "answer_hipoalergenico",
        type: "YES_NO"
    },
    {
        id: "q_energy",
        text: "¿Tiene un nivel de energía alto?",
        factKey: "answer_high_energy",
        type: "YES_NO"
    },
    {
        id: "q_exercise",
        text: "¿Necesita mucho ejercicio (más de 1-2 horas)?",
        factKey: "answer_needs_exercise",
        type: "YES_NO"
    },
    {
        id: "q_kids",
        text: "¿Se lleva bien con los niños?",
        factKey: "answer_bueno_con_ninos",
        type: "YES_NO"
    },
    {
        id: "q_pets",
        text: "¿Se lleva bien con otras mascotas?",
        factKey: "answer_acepta_otras_mascotas",
        type: "YES_NO"
    },
    {
        id: "q_alone",
        text: "¿Tolera bien quedarse solo?",
        factKey: "answer_tolerancia_soledad",
        type: "YES_NO"
    },
    {
        id: "q_sheds",
        text: "¿Muda mucho pelo?",
        factKey: "answer_sheds",
        type: "YES_NO"
    },
    {
        id: "q_grooming",
        text: "¿Necesita aseo frecuente?",
        factKey: "answer_high_grooming",
        type: "YES_NO"
    },
    {
        id: "q_vocal",
        text: "¿Es muy vocal (maulla/ladra mucho)?",
        factKey: "answer_vocal",
        type: "YES_NO"
    },
    {
        id: "q_playful",
        text: "¿Es juguetón?",
        factKey: "answer_playful",
        type: "YES_NO"
    },
    {
        id: "q_intelligent",
        text: "¿Es de alta inteligencia / aprende rápido?",
        factKey: "answer_intelligent",
        type: "YES_NO"
    },
    {
        id: "q_barks",
        text: "¿Ladra/muestra vocalización alta?",
        factKey: "answer_barks",
        type: "YES_NO"
    },
    {
        id: "q_trainable",
        text: "¿Es fácil de adiestrar?",
        factKey: "answer_trainable",
        type: "YES_NO"
    },
    {
        id: "q_has_predisposition",
        text: "¿La raza tiene alguna predisposición de salud que te preocupe?",
        factKey: "answer_has_predisposition",
        type: "YES_NO"
    },
    {
        id: "q_rasgos_fisicos",
        text: "¿Qué rasgos físicos destacas? (elige la opción que más se acerque)",
        factKey: "answer_rasgos_fisicos",
        type: "CHOICE",
        options: [
            { text: "Pelaje con 'guantes' blancos en patas / patrón point (guantes)", value: "guantes_blancos" },
            { text: "Pelaje 'ticked' (aguti), apariencia salvaje/pequeña cabeza), sin guantes", value: "ticked_aguti" },
            { text: "Sin pelo (piel visible)", value: "sin_pelo" },
            { text: "Pelaje moteado/ manchas (p. ej. dálmata)", value: "moteado" },
            { text: "Hocico muy corto / cara chata", value: "cara_chata" },
            { text: "Otro / no sé", value: "otro" }
        ]
    },
] as const;
