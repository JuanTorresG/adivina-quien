import type { RuleProperties } from "json-rules-engine";

export const rules: RuleProperties[] = [
    {
        name: "CategoriaCoincide",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "perro" },
                { fact: "categoria", operator: "equal", value: "perro" }
            ]
        },
        event: { type: "score", params: { reason: "categoria coincide (perro)", weight: 18 } }
    },
    {
        name: "CategoriaCoincideGato",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "gato" },
                { fact: "categoria", operator: "equal", value: "gato" }
            ]
        },
        event: { type: "score", params: { reason: "categoria coincide (gato)", weight: 18 } }
    },
    {
        name: "CategoriaMismatch",
        conditions: {
            any: [
                {
                    all: [
                        { fact: "answer_categoria", operator: "equal", value: "perro" },
                        { fact: "categoria", operator: "notEqual", value: "perro" }
                    ]
                },
                {
                    all: [
                        { fact: "answer_categoria", operator: "equal", value: "gato" },
                        { fact: "categoria", operator: "notEqual", value: "gato" }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "categoria no coincide", weight: -20 } }
    },
    {
        name: "TamanioPequenoMatch",
        conditions: {
            all: [
                { fact: "answer_tamanio", operator: "equal", value: "pequeño" },
                { fact: "tamanio", operator: "contains", value: "pequeño" }
            ]
        },
        event: { type: "score", params: { reason: "tamaño pequeño coincide", weight: 8 } }
    },
    {
        name: "TamanioPequenoMedioMatch",
        conditions: {
            all: [
                { fact: "answer_tamanio", operator: "equal", value: "pequeño/mediano" },
                { fact: "tamanio", operator: "contains", value: "pequeño" }
            ]
        },
        event: { type: "score", params: { reason: "tamaño pequeño/mediano coincide parcialmente", weight: 6 } }
    },
    {
        name: "TamanioMedioMatch",
        conditions: {
            all: [
                { fact: "answer_tamanio", operator: "equal", value: "mediano" },
                { fact: "tamanio", operator: "contains", value: "mediano" }
            ]
        },
        event: { type: "score", params: { reason: "tamaño mediano coincide", weight: 8 } }
    },
    {
        name: "TamanioGrandeMatch",
        conditions: {
            all: [
                { fact: "answer_tamanio", operator: "equal", value: "grande" },
                {
                    any: [
                        { fact: "tamanio", operator: "contains", value: "grande" },
                        { fact: "tamanio", operator: "contains", value: "muy grande" },
                        { fact: "tamanio", operator: "contains", value: "gigante" }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "tamaño grande coincide", weight: 8 } }
    },
    {
        name: "TamanioMismatch",
        conditions: {
            any: [
                {
                    all: [
                        { fact: "answer_tamanio", operator: "equal", value: "pequeño" },
                        {
                            any: [
                                { fact: "tamanio", operator: "contains", value: "grande" },
                                { fact: "tamanio", operator: "contains", value: "gigante" }
                            ]
                        }
                    ]
                },
                {
                    all: [
                        { fact: "answer_tamanio", operator: "equal", value: "grande" },
                        { fact: "tamanio", operator: "contains", value: "pequeño" }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "mismatch tamaño", weight: -8 } }
    },
    {
        name: "NivelEnergiaAltoMatch",
        conditions: {
            all: [
                { fact: "answer_nivel_energia", operator: "equal", value: "alto" },
                { fact: "nivel_energia", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "alto nivel de energía coincide", weight: 7 } }
    },
    {
        name: "NivelEnergiaBajoMatch",
        conditions: {
            all: [
                { fact: "answer_nivel_energia", operator: "equal", value: "bajo" },
                { fact: "nivel_energia", operator: "contains", value: "bajo" }
            ]
        },
        event: { type: "score", params: { reason: "bajo nivel de energía coincide", weight: 6 } }
    },
    {
        name: "EnergiaMismatch",
        conditions: {
            any: [
                {
                    all: [
                        { fact: "answer_nivel_energia", operator: "equal", value: "alto" },
                        { fact: "nivel_energia", operator: "contains", value: "bajo" }
                    ]
                },
                {
                    all: [
                        { fact: "answer_nivel_energia", operator: "equal", value: "bajo" },
                        { fact: "nivel_energia", operator: "contains", value: "alto" }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "mismatch energia", weight: -6 } }
    },
    {
        name: "NecesidadEjercicioAltaMatch",
        conditions: {
            all: [
                { fact: "answer_necesidad_ejercicio", operator: "equal", value: "alto" },
                { fact: "necesidad_ejercicio", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "necesita mucho ejercicio coincide", weight: 6 } }
    },
    {
        name: "NecesidadEjercicioBajaMatch",
        conditions: {
            all: [
                { fact: "answer_necesidad_ejercicio", operator: "equal", value: "bajo" },
                { fact: "necesidad_ejercicio", operator: "contains", value: "bajo" }
            ]
        },
        event: { type: "score", params: { reason: "no necesita mucho ejercicio coincide", weight: 5 } }
    },
    {
        name: "EjercicioMismatch",
        conditions: {
            any: [
                {
                    all: [
                        { fact: "answer_necesidad_ejercicio", operator: "equal", value: "alto" },
                        { fact: "necesidad_ejercicio", operator: "contains", value: "bajo" }
                    ]
                },
                {
                    all: [
                        { fact: "answer_necesidad_ejercicio", operator: "equal", value: "bajo" },
                        { fact: "necesidad_ejercicio", operator: "contains", value: "alto" }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "mismatch ejercicio", weight: -5 } }
    },
    {
        name: "HipoalergenicoMatch",
        conditions: {
            all: [
                { fact: "answer_hipoalergenico", operator: "equal", value: true },
                { fact: "hipoalergenico", operator: "equal", value: true }
            ]
        },
        event: { type: "score", params: { reason: "hipoalergénico coincide", weight: 15 } }
    },
    {
        name: "HipoalergenicoMismatch",
        conditions: {
            all: [
                { fact: "answer_hipoalergenico", operator: "equal", value: true },
                { fact: "hipoalergenico", operator: "equal", value: false }
            ]
        },
        event: { type: "score", params: { reason: "usuario requiere hipoalergénico pero la raza no lo es", weight: -18 } }
    },
    {
        name: "MudaAltaMatch",
        conditions: {
            all: [
                { fact: "answer_muda", operator: "equal", value: true },
                { fact: "muda", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "mucha muda coincide", weight: 5 } }
    },
    {
        name: "MudaBajaMatch",
        conditions: {
            all: [
                { fact: "answer_muda", operator: "equal", value: false },
                { fact: "muda", operator: "contains", value: "bajo" }
            ]
        },
        event: { type: "score", params: { reason: "poca muda coincide", weight: 4 } }
    },
    {
        name: "AseoAltoMatch",
        conditions: {
            all: [
                { fact: "answer_aseo_frecuente", operator: "equal", value: true },
                { fact: "aseo", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "necesita aseo frecuente coincide", weight: 6 } }
    },
    {
        name: "EjercicioHorasMatch",
        conditions: {
            all: [
                { fact: "answer_ejercicio_horas", operator: "notEqual", value: "" },
                { fact: "ejercicio_horas", operator: "contains", value: { fact: "answer_ejercicio_horas" } }
            ]
        },
        event: { type: "score", params: { reason: "coincide con la cantidad de ejercicio diaria (texto)", weight: 4 } }
    },
    {
        name: "ToleranciaSoledadMatch",
        conditions: {
            all: [
                { fact: "answer_tolerancia_soledad", operator: "equal", value: "alto" },
                { fact: "tolerancia_soledad", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "tolerancia a estar solo coincide", weight: 5 } }
    },
    {
        name: "ToleranciaSoledadMismatch",
        conditions: {
            all: [
                { fact: "answer_tolerancia_soledad", operator: "equal", value: "alto" },
                { fact: "tolerancia_soledad", operator: "contains", value: "bajo" }
            ]
        },
        event: { type: "score", params: { reason: "no tolera soledad pero usuario dijo que sí", weight: -7 } }
    },
    {
        name: "BuenoConNinosMatch",
        conditions: {
            all: [
                { fact: "answer_bueno_con_ninos", operator: "equal", value: true },
                { fact: "bueno_con_ninos", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "bueno con niños coincide", weight: 8 } }
    },
    {
        name: "BuenoConMascotasMatch",
        conditions: {
            all: [
                { fact: "answer_acepta_otras_mascotas", operator: "equal", value: true },
                {
                    any: [
                        { fact: "buen_con_otras_mascotas", operator: "contains", value: "alto" },
                        { fact: "acepta_otras_mascotas", operator: "contains", value: "alto" },
                        { fact: "acepta_otras_mascotas", operator: "contains", value: "muy alto" }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "bueno con otras mascotas coincide", weight: 7 } }
    },
    {
        name: "VocalidadMatch",
        conditions: {
            all: [
                { fact: "answer_vocal", operator: "equal", value: true },
                {
                    any: [
                        { fact: "vocalizacion", operator: "contains", value: "alto" },
                        { fact: "ladrido", operator: "contains", value: "alto" }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "vocalización alta coincide", weight: 5 } }
    },
    {
        name: "LadraMuchoMatch",
        conditions: {
            all: [
                { fact: "answer_ladra", operator: "equal", value: true },
                { fact: "ladrido", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "ladra mucho coincide", weight: 4 } }
    },
    {
        name: "AdiestrableMatch",
        conditions: {
            all: [
                { fact: "answer_adiestrable", operator: "equal", value: true },
                { fact: "adiestramiento", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "adiestrable coincide", weight: 6 } }
    },
    {
        name: "JuguetonMatch",
        conditions: {
            all: [
                { fact: "answer_jugueton", operator: "equal", value: true },
                { fact: "jugueton", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "juguetón coincide", weight: 5 } }
    },
    {
        name: "InteligenteMatch",
        conditions: {
            all: [
                { fact: "answer_inteligente", operator: "equal", value: true },
                { fact: "inteligencia", operator: "contains", value: "alto" }
            ]
        },
        event: { type: "score", params: { reason: "alta inteligencia coincide", weight: 5 } }
    },
    {
        name: "RasgoTagMatch",
        conditions: {
            all: [
                { fact: "answer_rasgo_tag", operator: "notEqual", value: "" },
                { fact: "rasgos_tags", operator: "contains", value: { fact: "answer_rasgo_tag" } }
            ]
        },
        event: { type: "score", params: { reason: "rasgo tag coincide", weight: 6 } }
    },
    {
        name: "RasgoFisicoMatch",
        conditions: {
            all: [
                { fact: "answer_rasgos_fisicos", operator: "notEqual", value: "" },
                { fact: "rasgos_fisicos", operator: "contains", value: { fact: "answer_rasgos_fisicos" } }
            ]
        },
        event: { type: "score", params: { reason: "rasgo físico coincide", weight: 5 } }
    },
    {
        name: "PredisposicionSaludMatch",
        conditions: {
            all: [
                { fact: "answer_tiene_predisposicion", operator: "equal", value: true },
                {
                    fact: "predisposiciones_salud",
                    operator: "contains",
                    value: { fact: "answer_predisposicion_nombre" }
                }
            ]
        },
        event: { type: "score", params: { reason: "predisposición de salud coincide", weight: 8 } }
    },
    {
        name: "PredisposicionSaludMismatch",
        conditions: {
            all: [
                { fact: "answer_tiene_predisposicion", operator: "equal", value: true },
                {
                    not: {
                        fact: "predisposiciones_salud",
                        operator: "contains",
                        value: { fact: "answer_predisposicion_nombre" }
                    }
                }
            ]
        },
        event: { type: "score", params: { reason: "predisposición buscada no coincide", weight: -6 } }
    },
    {
        name: "QuiereLongevoMatch",
        conditions: {
            all: [
                { fact: "answer_quiere_raza_longeva", operator: "equal", value: true },
                { fact: "esperanza_vida.a", operator: "greaterThan", value: 12 }
            ]
        },
        event: { type: "score", params: { reason: "usuario quiere raza longeva y coincide", weight: 7 } }
    },
    {
        name: "QuiereLongevoMismatch",
        conditions: {
            all: [
                { fact: "answer_quiere_raza_longeva", operator: "equal", value: true },
                { fact: "esperanza_vida.a", operator: "lessThan", value: 11 }
            ]
        },
        event: { type: "score", params: { reason: "usuario quiere longevidad pero raza con baja esperanza de vida", weight: -6 } }
    },
    {
        name: "MinLifeMatch",
        conditions: {
            all: [
                { fact: "answer_min_life", operator: "greaterThan", value: 0 },
                { fact: "esperanza_vida.a", operator: "greaterThan", value: { fact: "answer_min_life" } }
            ]
        },
        event: { type: "score", params: { reason: "esperanza de vida > mínimo pedido", weight: 6 } }
    },
    {
        name: "MinLifeMismatch",
        conditions: {
            any: [
                {
                    all: [
                        { fact: "answer_min_life", operator: "greaterThan", value: 0 },
                        { fact: "esperanza_vida.a", operator: "lessThan", value: { fact: "answer_min_life" } }
                    ]
                },
                {
                    all: [
                        { fact: "answer_min_life", operator: "greaterThan", value: 0 },
                        { fact: "esperanza_vida", operator: "equal", value: null }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "esperanza de vida inferior al mínimo", weight: -6 } }
    },
    {
        name: "OrigenMatch",
        conditions: {
            all: [
                { fact: "answer_origen", operator: "notEqual", value: "" },
                { fact: "origen", operator: "contains", value: { fact: "answer_origen" } }
            ]
        },
        event: { type: "score", params: { reason: "origen coincide (parcial)", weight: 2 } }
    },
    {
        name: "ColorMatch",
        conditions: {
            all: [
                { fact: "answer_color", operator: "notEqual", value: "" },
                { fact: "color", operator: "contains", value: { fact: "answer_color" } }
            ]
        },
        event: { type: "score", params: { reason: "color coincide", weight: 3 } }
    },
    {
        name: "GrupoMatch",
        conditions: {
            all: [
                { fact: "answer_grupo", operator: "notEqual", value: "" },
                { fact: "grupo", operator: "contains", value: { fact: "answer_grupo" } }
            ]
        },
        event: { type: "score", params: { reason: "grupo coincide", weight: 4 } }
    },
    {
        name: "TemperamentoKeywordMatch",
        conditions: {
            all: [
                { fact: "answer_temperamento_keyword", operator: "notEqual", value: "" },
                { fact: "temperamento", operator: "contains", value: { fact: "answer_temperamento_keyword" } }
            ]
        },
        event: { type: "score", params: { reason: "temperamento (keyword) coincide", weight: 3 } }
    },
    {
        name: "ComportamientoKeywordMatch",
        conditions: {
            all: [
                { fact: "answer_comportamiento_keyword", operator: "notEqual", value: "" },
                { fact: "comportamiento", operator: "contains", value: { fact: "answer_comportamiento_keyword" } }
            ]
        },
        event: { type: "score", params: { reason: "comportamiento (keyword) coincide", weight: 3 } }
    },
    {
        name: "ContradiccionPenalizacion",
        conditions: {
            any: [
                {
                    all: [
                        { fact: "answer_hipoalergenico", operator: "equal", value: true },
                        { fact: "hipoalergenico", operator: "equal", value: false }
                    ]
                },
                {
                    all: [
                        { fact: "answer_muda", operator: "equal", value: true },
                        { fact: "muda", operator: "contains", value: "bajo" }
                    ]
                },
                {
                    all: [
                        { fact: "answer_bueno_con_ninos", operator: "equal", value: true },
                        { fact: "bueno_con_ninos", operator: "contains", value: "bajo" }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "contradicción entre respuestas y raza", weight: -10 } }
    }
];
