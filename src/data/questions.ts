import type { Question } from "../types";

export const questions: Question[] = [
    {
        id: "q_categoria",
        text: " ¿es un perro o un gato?",
        factKey: "answer_categoria",
        type: "CHOICE",
        options: [
            { text: "Perro", value: "perro" },
            { text: "Gato", value: "gato" }
        ],
        mandatory: true,
        priority: 0,
        appliesTo: "both"
    },
    {
        id: "q_tamanio",
        text: "¿Qué tamaño aproximado tiene?",
        factKey: "answer_tamanio",
        type: "CHOICE",
        options: [
            { text: "Muy pequeño (toy)", value: "pequeño" },
            { text: "Pequeño / Mediano", value: "pequeño/mediano" },
            { text: "Mediano", value: "mediano" },
            { text: "Mediano / Grande", value: "mediano/grande" },
            { text: "Grande", value: "grande" },
            { text: "Muy grande / Gigante", value: "muy grande" }
        ],
        priority: 1,
        appliesTo: "both"
    },

    {
        id: "q_rasgos_fisicos_text",
        text: "¿Qué rasgos físicos destacarías (elige el que más se le parezca)?",
        factKey: "answer_rasgos_fisicos",
        type: "CHOICE",
        options: [
            { text: "Orejas largas / caídas", value: "orejas_largas" },
            { text: "Orejas erguidas / puntiagudas", value: "orejas_erguidas" },
            { text: "Hocico largo", value: "hocico_largo" },
            { text: "Hocico corto / cara chata", value: "cara_chata" },
            { text: "Pelaje rizado / abundante", value: "pelaje_rizado" },
            { text: "Pelaje corto y liso", value: "pelaje_corto" },
            { text: "Sin pelo", value: "sin_pelo" },
            { text: "Patrón moteado / manchas", value: "moteado" },
            { text: "Otro / No sé", value: "otro" }
        ],
        priority: 2,
        appliesTo: "both"
    },
    {
        id: "q_hipo",
        text: "¿Es hipoalergénico?",
        factKey: "answer_hipoalergenico",
        type: "YESNO",
        priority: 4,
        appliesTo: "both"
    },

    {
        id: "q_muda",
        text: "¿Muda mucho pelo?",
        factKey: "answer_muda",
        type: "YESNO",
        priority: 5,
        appliesTo: "both"
    },

    {
        id: "q_aseo_frecuente",
        text: "¿No necesita aseo/peluquería frecuente?",
        factKey: "answer_aseo_frecuente",
        type: "YESNO",
        priority: 6,
        appliesTo: "both"
    },
    {
        id: "q_nivel_energia",
        text: "¿Qué nivel de energía tiene?",
        factKey: "answer_nivel_energia",
        type: "CHOICE",
        options: [
            { text: "Muy alto / very active", value: "muy alto" },
            { text: "Alto", value: "alto" },
            { text: "Medio", value: "medio" },
            { text: "Bajo", value: "bajo" },
            { text: "Muy bajo / tranquilo", value: "muy bajo" }
        ],
        priority: 7,
        appliesTo: "both"
    },

    {
        id: "q_necesidad_ejercicio",
        text: "¿Cuánta actividad / ejercicio necesita?",
        factKey: "answer_necesidad_ejercicio",
        type: "CHOICE",
        options: [
            { text: "Muy alta (más de 2 horas / mucho juego)", value: "muy alto" },
            { text: "Alta (1-2 horas)", value: "alto" },
            { text: "Media (30-60 min)", value: "medio" },
            { text: "Baja (paseos cortos)", value: "bajo" },
            { text: "Muy baja", value: "muy bajo" }
        ],
        priority: 8,
        appliesTo: "both"
    },

    {
        id: "q_ejercicio_horas",
        text: "¿Cuánto ejercicio diario aproximado necesita?",
        factKey: "answer_ejercicio_horas",
        type: "CHOICE",
        options: [
            { text: "Más de 2 horas", value: "Más de 2 horas diarias" },
            { text: "1-2 horas", value: "1-2 horas al día" },
            { text: "Aprox. 1 hora / juegos", value: "Aprox. 1 hora al día" },
            { text: "Media hora (paseos suaves)", value: "Media hora al día (paseos suaves)" },
            { text: "Poca actividad", value: "Poca actividad; juego corto" }
        ],
        priority: 9,
        appliesTo: "both"
    },
    {
        id: "q_tolerancia_soledad",
        text: "¿Qué tolerancia a la soledad tiene?",
        factKey: "answer_tolerancia_soledad",
        type: "CHOICE",
        options: [
            { text: "Alta (soporta quedarse solo)", value: "alto" },
            { text: "Media", value: "medio" },
            { text: "Baja (necesita compañía)", value: "bajo" },
            { text: "Muy baja (no tolera soledad)", value: "muy bajo" }
        ],
        priority: 10,
        appliesTo: "both"
    },

    {
        id: "q_ninos",
        text: "¿Se lleva bien con niños?",
        factKey: "answer_bueno_con_ninos",
        type: "YESNO",
        priority: 11,
        appliesTo: "both"
    },

    {
        id: "q_otras_mascotas",
        text: "¿Se lleva bien con otras mascotas en casa?",
        factKey: "answer_acepta_otras_mascotas",
        type: "YESNO",
        priority: 12,
        appliesTo: "both"
    },

    {
        id: "q_vocal",
        text: "¿Es muy vocal (ladra o maúlla mucho)?",
        factKey: "answer_vocal",
        type: "YESNO",
        priority: 13,
        appliesTo: "both"
    },

    {
        id: "q_ladra",
        text: "¿Ladra mucho?",
        factKey: "answer_ladra",
        type: "YESNO",
        priority: 14,
        appliesTo: "perro"
    },

    {
        id: "q_jugueton",
        text: "¿Es juguetón / activo en juegos?",
        factKey: "answer_jugueton",
        type: "YESNO",
        priority: 15,
        appliesTo: "both"
    },

    {
        id: "q_inteligencia",
        text: "¿Qué nivel de inteligencia / capacidad de aprendizaje tiene?",
        factKey: "answer_inteligencia",
        type: "CHOICE",
        options: [
            { text: "Muy alto", value: "muy alto" },
            { text: "Alto", value: "alto" },
            { text: "Medio", value: "medio" },
            { text: "Bajo", value: "bajo" }
        ],
        priority: 16,
        appliesTo: "both"
    },

    {
        id: "q_adiestrable",
        text: "¿Es fácil de adiestrar?",
        factKey: "answer_adiestrable",
        type: "YESNO",
        priority: 17,
        appliesTo: "both"
    },
    {
        id: "q_has_predisposition",
        text: "¿Tiene alguna predisposición de salud en particular?",
        factKey: "answer_tiene_predisposicion",
        type: "YESNO",
        priority: 18,
        appliesTo: "both"
    },

    {
        id: "q_predisposition_name",
        text: "¿Qué predisposición tiene (o 'Otro / No sé')?",
        factKey: "answer_predisposicion_nombre",
        type: "CHOICE",
        options: [
            { text: "Displasia de cadera/codo", value: "Displasia de cadera/codo" },
            { text: "Cardiomiopatía / problemas cardiacos", value: "Cardiomiopatía" },
            { text: "Problemas oculares (cataratas, glaucoma)", value: "Problemas oculares" },
            { text: "Braquicefalia / problemas respiratorios", value: "Braquicefalia" },
            { text: "Atrofia retiniana / enfermedades genéticas", value: "Enfermedades genéticas" },
            { text: "Dilatación gástrica / torsión", value: "Dilatación gástrica" },
            { text: "Cáncer", value: "Cáncer" },
            { text: "Otro / No sé", value: "otro_o_no_se" }
        ],
        priority: 19,
        appliesTo: "both",
    },

    {
        id: "q_wants_long_lived",
        text: "¿Tiene una esperanza de vida larga?",
        factKey: "answer_quiere_raza_longeva",
        type: "YESNO",
        priority: 20,
        appliesTo: "both"
    },
    {
        id: "q_rasgo_tag",
        text: "¿Tiene algún rasgo físico identificado (tags) como 'sin_pelo', 'guantes_blancos', etc.?",
        factKey: "answer_rasgo_tag",
        type: "CHOICE",
        options: [
            { text: "No importa / No", value: "" },
            { text: "Guantes blancos (patas con blanco)", value: "guantes_blancos" },
            { text: "Ticked / Aguti", value: "ticked_aguti" },
            { text: "Sin pelo", value: "sin_pelo" },
            { text: "Orejas largas", value: "orejas_largas" },
            { text: "Pelaje moteado / manchas", value: "moteado" },
            { text: "Otro / No sé", value: "otro" }
        ],
        priority: 21,
        appliesTo: "both"
    },

    {
        id: "q_color",
        text: "¿Qué color / patrón del pelaje tiene?",
        factKey: "answer_color",
        type: "CHOICE",
        options: [

            { text: "Tricolor / Multicolor", value: "tricolor" },
            { text: "Manto dorado / amarillo", value: "dorado" },
            { text: "Negro", value: "negro" },
            { text: "Blanco / moteado", value: "moteado" },
            { text: "Otro / No sé", value: "otro" }
        ],
        priority: 22,
        appliesTo: "both"
    },
    {
        id: "q_group",
        text: "¿Tiene preferencia por el grupo de la raza (sólo perros)?",
        factKey: "answer_grupo",
        type: "CHOICE",
        options: [

            { text: "Herding (pastoreo)", value: "Herding" },
            { text: "Sporting", value: "Sporting" },
            { text: "Hound", value: "Hound" },
            { text: "Working", value: "Working" },
            { text: "Toy", value: "Toy" },
            { text: "Non-Sporting", value: "Non-Sporting" },
            { text: "Otro / No sé", value: "otro" }
        ],
        priority: 23,
        appliesTo: "perro"
    },

    {
        id: "q_orejas_perro",
        text: "Para perros: ¿las orejas son erguidas o caídas (si lo sabes)?",
        factKey: "answer_orejas",
        type: "CHOICE",
        options: [
            { text: "Erguidas / puntiagudas", value: "erguidas" },
            { text: "Caídas / largas", value: "caídas" },
            { text: "No sé / indiferente", value: "" }
        ],
        priority: 24,
        appliesTo: "perro"
    }
] as const;