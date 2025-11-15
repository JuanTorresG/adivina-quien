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
        id: "q_tamanio",
        text: "¿De qué tamaño es (o esperas que sea)?",
        factKey: "answer_tamanio",
        type: "CHOICE",
        options: [
            { text: "Pequeño", value: "pequeño" },
            { text: "Pequeño / Mediano", value: "pequeño/mediano" },
            { text: "Mediano", value: "mediano" },
            { text: "Mediano / Grande", value: "mediano/grande" },
            { text: "Grande", value: "grande" },
            { text: "Muy grande / Gigante", value: "muy grande" }
        ]
    },

    {
        id: "q_hipo",
        text: "¿Necesitas que sea hipoalergénico?",
        factKey: "answer_hipoalergenico",
        type: "YESNO"
    },

    {
        id: "q_nivel_energia",
        text: "¿Qué nivel de energía prefieres?",
        factKey: "answer_nivel_energia",
        type: "CHOICE",
        options: [
            { text: "Muy alto / activo", value: "muy alto" },
            { text: "Alto", value: "alto" },
            { text: "Medio", value: "medio" },
            { text: "Bajo", value: "bajo" },
            { text: "Muy bajo / tranquilo", value: "muy bajo" }
        ]
    },

    {
        id: "q_necesidad_ejercicio",
        text: "¿Cuánta actividad / ejercicio (aprox.) necesitas que haga la raza?",
        factKey: "answer_necesidad_ejercicio",
        type: "CHOICE",
        options: [
            { text: "Muy alta (más de 2 horas / mucho juego)", value: "muy alto" },
            { text: "Alta (1-2 horas)", value: "alto" },
            { text: "Media (30-60 min)", value: "medio" },
            { text: "Baja (paseos cortos)", value: "bajo" },
            { text: "Muy baja", value: "muy bajo" }
        ]
    },

    {
        id: "q_ejercicio_horas",
        text: "Si pudieras elegir, ¿cuánto ejercicio diario aproximado esperas?",
        factKey: "answer_ejercicio_horas",
        type: "CHOICE",
        options: [
            { text: "Más de 2 horas", value: "Más de 2 horas diarias" },
            { text: "1-2 horas", value: "1-2 horas al día" },
            { text: "Aprox. 1 hora / juegos", value: "Aprox. 1 hora al día" },
            { text: "Media hora (paseos suaves)", value: "Media hora al día (paseos suaves)" },
            { text: "Poca actividad", value: "Poca actividad; juego corto" }
        ]
    },

    {
        id: "q_muda",
        text: "¿Te importa que muden mucho pelo?",
        factKey: "answer_muda",
        type: "YESNO"
    },

    {
        id: "q_aseo_frecuente",
        text: "¿Quieres una raza que no necesite aseo/baño/peluquería frecuente?",
        factKey: "answer_aseo_frecuente",
        type: "YESNO"
    },

    {
        id: "q_tolerancia_soledad",
        text: "¿Qué tolerancia a la soledad prefieres (por ejemplo si trabaja/estás fuera)?",
        factKey: "answer_tolerancia_soledad",
        type: "CHOICE",
        options: [
            { text: "Alta (soporta quedarse solo)", value: "alto" },
            { text: "Media", value: "medio" },
            { text: "Baja (necesita compañía)", value: "bajo" },
            { text: "Muy baja (no tolera soledad)", value: "muy bajo" }
        ]
    },

    {
        id: "q_ninos",
        text: "¿Debe llevarse bien con niños?",
        factKey: "answer_bueno_con_ninos",
        type: "YESNO"
    },

    {
        id: "q_otras_mascotas",
        text: "¿Debe llevarse bien con otras mascotas en casa?",
        factKey: "answer_acepta_otras_mascotas",
        type: "YESNO"
    },

    {
        id: "q_vocal",
        text: "¿Te molesta que sea muy vocal (ladre o maulle mucho)?",
        factKey: "answer_vocal",
        type: "YESNO"
    },

    {
        id: "q_ladra",
        text: "¿Es importante que no sea de los que ladran mucho?",
        factKey: "answer_ladra",
        type: "YESNO"
    },

    {
        id: "q_jugueton",
        text: "¿Quieres una mascota juguetona?",
        factKey: "answer_jugueton",
        type: "YESNO"
    },

    {
        id: "q_inteligencia",
        text: "¿Qué nivel de inteligencia / capacidad de aprendizaje prefieres?",
        factKey: "answer_inteligencia",
        type: "CHOICE",
        options: [
            { text: "Muy alto", value: "muy alto" },
            { text: "Alto", value: "alto" },
            { text: "Medio", value: "medio" },
            { text: "Bajo", value: "bajo" }
        ]
    },

    {
        id: "q_adiestrable",
        text: "¿Quieres una raza fácil de adiestrar?",
        factKey: "answer_adiestrable",
        type: "YESNO"
    },

    {
        id: "q_has_predisposition",
        text: "¿Te preocupa alguna predisposición de salud en particular?",
        factKey: "answer_tiene_predisposicion",
        type: "YESNO"
    },

    {
        id: "q_predisposition_name",
        text: "Si quieres, elige la predisposición que te preocupe (o 'Otro / No sé')",
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
        ]
    },

    {
        id: "q_rasgo_tag",
        text: "¿Buscas algún rasgo físico identificado (tags) como 'sin_pelo', 'guantes_blancos', etc.?",
        factKey: "answer_rasgo_tag",
        type: "CHOICE",
        options: [
            { text: "No", value: "" },
            { text: "Guantes blancos (patas con blanco)", value: "guantes_blancos" },
            { text: "Ticked / Aguti", value: "ticked_aguti" },
            { text: "Sin pelo", value: "sin_pelo" },
            { text: "Orejas largas", value: "orejas_largas" },
            { text: "Pelaje moteado / manchas", value: "moteado" },
            { text: "Otro / No sé", value: "otro" }
        ]
    },

    {
        id: "q_rasgos_fisicos_text",
        text: "¿Qué rasgos físicos destacarías? (opción que más se le parezca)",
        factKey: "answer_rasgos_fisicos",
        type: "CHOICE",
        options: [
            { text: "Orejas largas", value: "orejas_largas" },
            { text: "Hocico largo / perfil de pastor", value: "hocico_largo" },
            { text: "Hocico corto / cara chata", value: "cara_chata" },
            { text: "Pelaje rizado / abundante", value: "pelaje_rizado" },
            { text: "Pelaje moteado / manchas", value: "moteado" },
            { text: "Sin pelo", value: "sin_pelo" },
            { text: "Otro / No sé", value: "otro" }
        ]
    },

    {
        id: "q_wants_long_lived",
        text: "¿Te interesa una raza con esperanza de vida larga?",
        factKey: "answer_quiere_raza_longeva",
        type: "YESNO"
    },

    {
        id: "q_color",
        text: "¿Importa el color / patrón del pelaje?",
        factKey: "answer_color",
        type: "CHOICE",
        options: [
            { text: "No importa", value: "" },
            { text: "Tricolor / Multicolor", value: "tricolor" },
            { text: "Manto dorado / amarillo", value: "dorado" },
            { text: "Negro", value: "negro" },
            { text: "Blanco / moteado", value: "moteado" },
            { text: "Otro / No sé", value: "otro" }
        ]
    },

    {
        id: "q_group",
        text: "¿Tienes preferencia por el grupo de la raza (perros)?",
        factKey: "answer_grupo",
        type: "CHOICE",
        options: [
            { text: "No importa", value: "" },
            { text: "Herding (pastoreo)", value: "Herding" },
            { text: "Sporting", value: "Sporting" },
            { text: "Hound", value: "Hound" },
            { text: "Working", value: "Working" },
            { text: "Toy", value: "Toy" },
            { text: "Non-Sporting", value: "Non-Sporting" },
            { text: "Otro / No sé", value: "otro" }
        ]
    }
] as const;

export default questions;
