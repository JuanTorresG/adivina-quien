import type { RuleProperties } from "json-rules-engine";

export const rules: RuleProperties[] = [
    // Categoría (perro/gato)
    {
        name: "CategoryIsDog",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "perro" },
                { fact: "categoria", operator: "equal", value: "perro" }
            ]
        },
        event: { type: "score", params: { reason: "categoria coincide (perro)", weight: 12 } }
    },
    {
        name: "CategoryIsCat",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "gato" },
                { fact: "categoria", operator: "equal", value: "gato" }
            ]
        },
        event: { type: "score", params: { reason: "categoria coincide (gato)", weight: 12 } }
    },
    {
        name: "CategoryMismatchDog",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "perro" },
                { fact: "categoria", operator: "notEqual", value: "perro" }
            ]
        },
        event: { type: "score", params: { reason: "categoria no coincide (usuario dijo perro)", weight: -15 } }
    },
    {
        name: "CategoryMismatchCat",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "gato" },
                { fact: "categoria", operator: "notEqual", value: "gato" }
            ]
        },
        event: { type: "score", params: { reason: "categoria no coincide (usuario dijo gato)", weight: -15 } }
    },

    // Tamaño
    {
        name: "SizeIsSmall",
        conditions: {
            all: [
                { fact: "answer_size", operator: "equal", value: "pequeño" },
                { fact: "size", operator: "contains", value: "pequeño" }
            ]
        },
        event: { type: "score", params: { reason: "tamaño: pequeño", weight: 8 } }
    },
    {
        name: "SizeIsMedium",
        conditions: {
            all: [
                { fact: "answer_size", operator: "equal", value: "mediano" },
                { fact: "size", operator: "contains", value: "mediano" }
            ]
        },
        event: { type: "score", params: { reason: "tamaño: mediano", weight: 8 } }
    },
    {
        name: "SizeIsLarge",
        conditions: {
            all: [
                { fact: "answer_size", operator: "equal", value: "grande" },
                {
                    any: [
                        { fact: "size", operator: "contains", value: "grande" },
                        { fact: "size", operator: "contains", value: "gigante" },
                        { fact: "size", operator: "contains", value: "muy grande" }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "tamaño: grande/gigante", weight: 8 } }
    },
    {
        name: "SizeMismatchSmallToLarge",
        conditions: {
            all: [
                { fact: "answer_size", operator: "equal", value: "pequeño" },
                { fact: "size", operator: "contains", value: "grande" }
            ]
        },
        event: { type: "score", params: { reason: "mismatch size (usuario dijo pequeño, raza grande)", weight: -7 } }
    },

    // Energía
    {
        name: "HighEnergyMatch",
        conditions: {
            all: [
                { fact: "answer_high_energy", operator: "equal", value: true },
                { fact: "nivel_energia", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "alto nivel de energía coincide", weight: 6 } }
    },
    {
        name: "LowEnergyMatch",
        conditions: {
            all: [
                { fact: "answer_high_energy", operator: "equal", value: false },
                { fact: "nivel_energia", operator: "lessThanInclusive", value: 2 }
            ]
        },
        event: { type: "score", params: { reason: "bajo nivel de energía coincide", weight: 5 } }
    },
    {
        name: "EnergyMismatch",
        conditions: {
            any: [
                {
                    all: [
                        { fact: "answer_high_energy", operator: "equal", value: true },
                        { fact: "nivel_energia", operator: "lessThanInclusive", value: 2 }
                    ]
                },
                {
                    all: [
                        { fact: "answer_high_energy", operator: "equal", value: false },
                        { fact: "nivel_energia", operator: "greaterThanInclusive", value: 4 }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "mismatch energia", weight: -6 } }
    },

    // Ejercicio
    {
        name: "NeedsMuchExercise",
        conditions: {
            all: [
                { fact: "answer_needs_exercise", operator: "equal", value: true },
                { fact: "necesidad_ejercicio", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "requiere mucho ejercicio", weight: 6 } }
    },
    {
        name: "LowExerciseMatch",
        conditions: {
            all: [
                { fact: "answer_needs_exercise", operator: "equal", value: false },
                { fact: "necesidad_ejercicio", operator: "lessThanInclusive", value: 2 }
            ]
        },
        event: { type: "score", params: { reason: "no requiere mucho ejercicio", weight: 5 } }
    },
    {
        name: "ExerciseMismatch",
        conditions: {
            any: [
                {
                    all: [
                        { fact: "answer_needs_exercise", operator: "equal", value: true },
                        { fact: "necesidad_ejercicio", operator: "lessThanInclusive", value: 2 }
                    ]
                },
                {
                    all: [
                        { fact: "answer_needs_exercise", operator: "equal", value: false },
                        { fact: "necesidad_ejercicio", operator: "greaterThanInclusive", value: 4 }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "mismatch ejercicio", weight: -5 } }
    },

    // Hipoalergénico
    {
        name: "HypoallergenicMatch",
        conditions: {
            all: [
                { fact: "answer_hipoalergenico", operator: "equal", value: true },
                { fact: "hipoalergenico", operator: "equal", value: true }
            ]
        },
        event: { type: "score", params: { reason: "hipoalergénico coincide", weight: 14 } }
    },
    {
        name: "HypoallergenicMismatch",
        conditions: {
            all: [
                { fact: "answer_hipoalergenico", operator: "equal", value: true },
                { fact: "hipoalergenico", operator: "equal", value: false }
            ]
        },
        event: { type: "score", params: { reason: "usuario requiere hipoalergénico pero la raza no lo es", weight: -18 } }
    },

    // Muda / Aseo
    {
        name: "ShedsALotMatch",
        conditions: {
            all: [
                { fact: "answer_sheds", operator: "equal", value: true },
                { fact: "muda", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "mucha muda coincide", weight: 5 } }
    },
    {
        name: "LowShedMatch",
        conditions: {
            all: [
                { fact: "answer_sheds", operator: "equal", value: false },
                { fact: "muda", operator: "lessThanInclusive", value: 2 }
            ]
        },
        event: { type: "score", params: { reason: "poca muda coincide", weight: 4 } }
    },
    {
        name: "HighGroomingNeeds",
        conditions: {
            all: [
                { fact: "answer_high_grooming", operator: "equal", value: true },
                { fact: "aseo", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "necesita grooming frecuente", weight: 6 } }
    },

    // Tolerancia a soledad
    {
        name: "ToleratesAloneMatch",
        conditions: {
            all: [
                { fact: "answer_tolerancia_soledad", operator: "equal", value: true },
                { fact: "tolerancia_soledad", operator: "greaterThanInclusive", value: 3 }
            ]
        },
        event: { type: "score", params: { reason: "tolerancia a estar solo coincide", weight: 5 } }
    },
    {
        name: "ToleratesAloneMismatch",
        conditions: {
            all: [
                { fact: "answer_tolerancia_soledad", operator: "equal", value: true },
                { fact: "tolerancia_soledad", operator: "lessThanInclusive", value: 2 }
            ]
        },
        event: { type: "score", params: { reason: "no tolera soledad pero usuario dijo que sí", weight: -6 } }
    },

    // Social / niños / otras mascotas
    {
        name: "GoodWithKidsMatch",
        conditions: {
            all: [
                { fact: "answer_bueno_con_ninos", operator: "equal", value: true },
                { fact: "bueno_con_ninos", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "bueno con niños coincide", weight: 7 } }
    },
    {
        name: "GoodWithPetsMatch",
        conditions: {
            all: [
                { fact: "answer_acepta_otras_mascotas", operator: "equal", value: true },
                { fact: "buen_con_otras_mascotas", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "bueno con otras mascotas coincide", weight: 6 } }
    },

    // Vocal / ladrido / adiestramiento / juguetón / inteligencia
    {
        name: "BarksALotMatch",
        conditions: {
            all: [
                { fact: "answer_barks", operator: "equal", value: true },
                { fact: "ladrido", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "ladra mucho coincide", weight: 4 } }
    },
    {
        name: "TrainableMatch",
        conditions: {
            all: [
                { fact: "answer_trainable", operator: "equal", value: true },
                { fact: "adiestramiento", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "adiestrable coincide", weight: 5 } }
    },
    {
        name: "CatVocalMatch",
        conditions: {
            all: [
                { fact: "answer_vocal", operator: "equal", value: true },
                { fact: "vocalizacion", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "vocalización alta (gato)", weight: 6 } }
    },
    {
        name: "PlayfulMatch",
        conditions: {
            all: [
                { fact: "answer_playful", operator: "equal", value: true },
                { fact: "jugueton", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "juguetón coincide", weight: 5 } }
    },
    {
        name: "IntelligentMatch",
        conditions: {
            all: [
                { fact: "answer_intelligent", operator: "equal", value: true },
                { fact: "inteligencia", operator: "greaterThanInclusive", value: 4 }
            ]
        },
        event: { type: "score", params: { reason: "alta inteligencia coincide", weight: 4 } }
    },

    // Predisposiciones
    {
        name: "HealthPredispositionMatch",
        conditions: {
            all: [
                { fact: "answer_has_predisposition", operator: "equal", value: true },
                {
                    fact: "predisposiciones_salud",
                    operator: "contains",
                    value: { fact: "answer_predisposition_name" }
                }
            ]
        },
        event: { type: "score", params: { reason: "predisposición de salud coincide", weight: 8 } }
    },
    {
        name: "HealthPredispositionMismatch",
        conditions: {
            all: [
                { fact: "answer_has_predisposition", operator: "equal", value: true },
                {
                    not: {
                        fact: "predisposiciones_salud",
                        operator: "contains",
                        value: { fact: "answer_predisposition_name" }
                    }
                }
            ]
        },
        event: { type: "score", params: { reason: "predisposición buscada no coincide", weight: -6 } }
    }
] as const;
