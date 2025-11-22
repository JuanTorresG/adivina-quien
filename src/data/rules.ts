import type { RuleProperties } from "json-rules-engine";

export const rules: RuleProperties[] = [
    {
        name: "FiltroEspecie_Correcto",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: { fact: "categoria" } }
            ]
        },
        event: { type: "score", params: { reason: "Especie correcta", weight: 100 } }
    },
    {
        name: "FiltroEspecie_Incorrecto",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "notEqual", value: { fact: "categoria" } }
            ]
        },
        event: { type: "score", params: { reason: "Especie incorrecta", weight: -99999 } }
    },
    {
        name: "Hipoalergenico_Match",
        conditions: {
            all: [
                { fact: "answer_hipoalergenico", operator: "equal", value: true },
                { fact: "hipoalergenico", operator: "equal", value: true }
            ]
        },
        event: { type: "score", params: { reason: "Es hipoalergénico", weight: 150 } }
    },
    {
        name: "Choque_Hipoalergenico",
        conditions: {

            all: [
                { fact: "answer_hipoalergenico", operator: "equal", value: true },
                { fact: "hipoalergenico", operator: "equal", value: false }
            ]
        },
        event: { type: "score", params: { reason: "No es hipoalergénico (Castigo)", weight: -9999 } }
    },
    {
        name: "Tamanio_Exacto",
        conditions: {
            all: [

                {
                    fact: "tamanio",
                    operator: "contains",
                    value: { fact: "answer_tamanio" }
                }
            ]
        },
        event: {
            type: "score",
            params: { reason: "Tamaño exacto", weight: 80 }
        }
    },
    {
        name: "Tamanio_Incorrecto",
        conditions: {
            all: [
                {
                    fact: "answer_tamanio",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "tamanio",
                    operator: "doesNotContain",
                    value: { fact: "answer_tamanio" }
                }
            ]
        },
        event: {
            type: "score",
            params: { reason: "Tamaño incorrecto", weight: -99999 }
        }
    },
    {
        name: "ejercicio_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_necesidad_ejercicio", operator: "equal", value: { fact: "necesidad_ejercicio" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel Ejercicio coincide", weight: 30 } }
    },
    {
        name: "Choque_Ejercicio",
        conditions: {
            all: [
                {
                    fact: "answer_necesidad_ejercicio",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_necesidad_ejercicio",
                    operator: "notEqual",
                    value: { fact: "necesidad_ejercicio" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel Ejercicio diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Soledad_Match",
        conditions: {
            any: [
                { all: [{ fact: "answer_tolerancia_soledad", operator: "equal", value: { fact: "tolerancia_soledad" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel Ejercicio coincide", weight: 30 } }
    },
    {
        name: "Choque_Soledad",
        conditions: {
            all: [
                {
                    fact: "answer_tolerancia_soledad",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_tolerancia_soledad",
                    operator: "notEqual",
                    value: { fact: "tolerancia_soledad" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel Soledad diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "bueno_con_ninos_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_bueno_con_ninos", operator: "equal", value: { fact: "bueno_con_ninos" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel Ejercicio coincide", weight: 30 } }
    },
    {
        name: "Choque_BuenoConNinos",
        conditions: {
            all: [
                {
                    fact: "answer_bueno_con_ninos",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_bueno_con_ninos",
                    operator: "notEqual",
                    value: { fact: "bueno_con_ninos" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel Bueno con niños diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "OtrasMascotas_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_buen_con_otras_mascotas", operator: "equal", value: { fact: "buen_con_otras_mascotas" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel Ejercicio coincide", weight: 30 } }
    },
    {
        name: "Choque_OtrasMascotas",
        conditions: {
            all: [
                {
                    fact: "answer_buen_con_otras_mascotas",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_buen_con_otras_mascotas",
                    operator: "notEqual",
                    value: { fact: "buen_con_otras_mascotas" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel Acepta otras mascotas diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Ladrido_Coincide",
        conditions: {
            all: [
                { fact: "answer_ladrido", operator: "notEqual", value: undefined },
                {
                    any: [
                        { all: [{ fact: "answer_ladrido", operator: "equal", value: { fact: "ladrido" } }] },
                        { all: [{ fact: "answer_ladrido", operator: "equal", value: { fact: "vocalizacion" } }] }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel ladrido coincide", weight: 30 } }
    }
    ,
    {
        name: "Choque_Ladrido",
        conditions: {
            all: [
                { fact: "answer_ladrido", operator: "notEqual", value: undefined },
                {
                    any: [
                        { all: [{ fact: "answer_ladrido", operator: "notEqual", value: { fact: "ladrido" } }] },
                        { all: [{ fact: "answer_ladrido", operator: "notEqual", value: { fact: "vocalizacion" } }] }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel ladrido opuesto (Castigo)", weight: -2000 } }
    },
    {
        name: "Adiestramiento_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_adiestramiento", operator: "equal", value: { fact: "adiestramiento" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel de adiestramiento coincide", weight: 30 } }
    },
    {
        name: "Choque_Adiestramiento",
        conditions: {
            all: [
                {
                    fact: "answer_adiestramiento",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_adiestramiento",
                    operator: "notEqual",
                    value: { fact: "adiestramiento" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel Adiestramiento diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Jugueton_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_jugueton", operator: "equal", value: { fact: "jugueton" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel de juguetón coincide", weight: 30 } }
    },
    {
        name: "Choque_Jugueton",
        conditions: {
            all: [
                {
                    fact: "answer_jugueton",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_jugueton",
                    operator: "notEqual",
                    value: { fact: "jugueton" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel Juguetón diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Inteligencia_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_inteligencia", operator: "equal", value: { fact: "inteligencia" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel de inteligencia coincide", weight: 30 } }
    },
    {
        name: "Choque_Inteligencia",
        conditions: {
            all: [
                {
                    fact: "answer_inteligencia",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_inteligencia",
                    operator: "notEqual",
                    value: { fact: "inteligencia" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel inteligencia diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Aseo_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_aseo", operator: "equal", value: { fact: "aseo" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel de aseo coincide", weight: 30 } }
    },
    {
        name: "Choque_Aseo",
        conditions: {
            all: [
                {
                    fact: "answer_aseo",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_aseo",
                    operator: "notEqual",
                    value: { fact: "aseo" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel aseo diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Muda_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_muda", operator: "equal", value: { fact: "muda" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel de muda coincide", weight: 30 } }
    },
    {
        name: "Choque_Muda",
        conditions: {
            all: [
                {
                    fact: "answer_muda",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_muda",
                    operator: "notEqual",
                    value: { fact: "muda" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel muda diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Soledad_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_soledad", operator: "equal", value: { fact: "tolerancia_soledad" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel de tolerancia_soledad", weight: 30 } }
    },
    {
        name: "Choque_Soledad",
        conditions: {
            all: [
                {
                    fact: "answer_soledad",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_soledad",
                    operator: "notEqual",
                    value: { fact: "tolerancia_soledad" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel tolerancia_soledad diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Familiar_Coincide",
        conditions: {

            all: [{ fact: "answer_familiar", operator: "notEqual", value: undefined },
            { fact: "familiar", operator: "notEqual", value: undefined },
            { fact: "answer_familiar", operator: "equal", value: { fact: "familiar" } }
            ]
        },
        event: { type: "score", params: { reason: "Nivel de familiar", weight: 30 } }
    },
    {
        name: "Choque_Familiar",
        conditions: {
            all: [
                {
                    fact: "answer_familiar",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_familiar",
                    operator: "notEqual",
                    value: { fact: "familiar" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel familiar diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Acepta_Otras_Mascotas_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_acepta_otras_mascotas", operator: "equal", value: { fact: "acepta_otras_mascotas" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel de acepta_otras_mascotas", weight: 30 } }
    },
    {
        name: "Choque_Acepta_Otras_Mascotas",
        conditions: {
            all: [
                {
                    fact: "answer_acepta_otras_mascotas",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_acepta_otras_mascotas",
                    operator: "notEqual",
                    value: { fact: "acepta_otras_mascotas" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel acepta_otras_mascotas diferente (Castigo)", weight: -2000 } }
    },
    {
        name: "Rasgo_Tag_Coincide",
        conditions: {
            any: [
                { all: [{ fact: "answer_acepta_otras_mascotas", operator: "equal", value: { fact: "acepta_otras_mascotas" } }] },
            ]
        },
        event: { type: "score", params: { reason: "Nivel de acepta_otras_mascotas", weight: 30 } }
    },
    {
        name: "Choque_Acepta_Otras_Mascotas",
        conditions: {
            all: [
                {
                    fact: "answer_acepta_otras_mascotas",
                    operator: "notEqual",
                    value: undefined
                },
                {
                    fact: "answer_acepta_otras_mascotas",
                    operator: "notEqual",
                    value: { fact: "acepta_otras_mascotas" }
                }
            ]
        },
        event: { type: "score", params: { reason: "Nivel acepta_otras_mascotas diferente (Castigo)", weight: -9999 } }
    },
    {
        name: "Rasgo_Tag_Coincide",
        conditions: {
            all: [
                { fact: "answer_rasgos_tags", operator: "notEqual", value: undefined },
                { fact: "rasgos_tags", operator: "contains", value: { fact: "answer_rasgos_tags" } }
            ]
        },
        event: { type: "score", params: { reason: "Rasgo físico coincide", weight: 40 } }
    },
    {
        name: "Rasgo_Tag_Choque",
        conditions: {
            all: [
                { fact: "answer_rasgos_tags", operator: "notEqual", value: undefined },
                { fact: "rasgos_tags", operator: "doesNotContain", value: { fact: "answer_rasgos_tags" } }
            ]
        },
        event: { type: "score", params: { reason: "Rasgo físico contradicho", weight: -9999 } }
    },
    {
        name: "Descripcion_Aseo_Coincide",
        conditions: {
            all: [
                { fact: "answer_descripcion_aseo", operator: "notEqual", value: undefined },
                { fact: "descripcion_aseo", operator: "contains", value: { fact: "answer_descripcion_aseo" } }
            ]
        },
        event: { type: "score", params: { reason: "Necesidad de aseo coincide", weight: 30 } }
    },
    {
        name: "Descripcion_Aseo_Choque",
        conditions: {
            all: [
                { fact: "answer_descripcion_aseo", operator: "notEqual", value: undefined },
                { fact: "descripcion_aseo", operator: "doesNotContain", value: { fact: "answer_descripcion_aseo" } }
            ]
        },
        event: { type: "score", params: { reason: "Aseo contradicho", weight: -9999 } }
    },
    {
        name: "Temperamento_Coincide",
        conditions: {
            all: [
                { fact: "answer_temperamento", operator: "notEqual", value: undefined },
                { fact: "temperamento", operator: "contains", value: { fact: "answer_temperamento" } }
            ]
        },
        event: { type: "score", params: { reason: "Temperamento coincide", weight: 25 } }
    },
    {
        name: "Temperamento_Choque",
        conditions: {
            all: [
                { fact: "answer_temperamento", operator: "notEqual", value: undefined },
                { fact: "temperamento", operator: "doesNotContain", value: { fact: "answer_temperamento" } }
            ]
        },
        event: { type: "score", params: { reason: "Temperamento contradicho", weight: -9999 } }
    },
    {
        name: "Comportamiento_Coincide",
        conditions: {
            all: [
                { fact: "answer_comportamiento", operator: "notEqual", value: undefined },
                { fact: "comportamiento", operator: "contains", value: { fact: "answer_comportamiento" } }
            ]
        },
        event: { type: "score", params: { reason: "Comportamiento coincide", weight: 30 } }
    },
    {
        name: "Comportamiento_Choque",
        conditions: {
            all: [
                { fact: "answer_comportamiento", operator: "notEqual", value: undefined },
                { fact: "comportamiento", operator: "doesNotContain", value: { fact: "answer_comportamiento" } }
            ]
        },
        event: { type: "score", params: { reason: "Comportamiento contradicho", weight: -9999 } }
    },
    {
        name: "PredisposicionesSalud_Coincide",
        conditions: {
            all: [
                { fact: "answer_predisposiciones_salud", operator: "notEqual", value: undefined },
                { fact: "predisposiciones_salud", operator: "contains", value: { fact: "answer_predisposiciones_salud" } }
            ]
        },
        event: { type: "score", params: { reason: "Predisposición coincide", weight: 30 } }
    },
    {
        name: "PredisposicionesSalud_Choque",
        conditions: {
            all: [
                { fact: "answer_predisposiciones_salud", operator: "notEqual", value: undefined },
                { fact: "predisposiciones_salud", operator: "doesNotContain", value: { fact: "answer_predisposiciones_salud" } }
            ]
        },
        event: { type: "score", params: { reason: "Predisposición contradicha", weight: -9999 } }
    },
    {
        name: "Origen_Coincide",
        conditions: {
            all: [
                { fact: "answer_origen", operator: "notEqual", value: undefined },
                { fact: "origen", operator: "equal", value: { fact: "answer_origen" } }
            ]
        },
        event: { type: "score", params: { reason: "Origen coincide", weight: 30 } }
    },
    {
        name: "Origen_Choque",
        conditions: {
            all: [
                { fact: "answer_origen", operator: "notEqual", value: undefined },
                { fact: "origen", operator: "notEqual", value: { fact: "answer_origen" } }
            ]
        },
        event: { type: "score", params: { reason: "Origen diferente", weight: -9999 } }
    },
    {
        name: "Grupo_Coincide",
        conditions: {
            all: [
                { fact: "answer_grupo", operator: "notEqual", value: undefined },
                { fact: "grupo", operator: "equal", value: { fact: "answer_grupo" } }
            ]
        },
        event: { type: "score", params: { reason: "Grupo coincide", weight: 40 } }
    },
    {
        name: "Grupo_Choque",
        conditions: {
            all: [
                { fact: "answer_grupo", operator: "notEqual", value: undefined },
                { fact: "grupo", operator: "notEqual", value: { fact: "answer_grupo" } }
            ]
        },
        event: { type: "score", params: { reason: "Grupo diferente", weight: -9999 } }
    },
    {
        name: "EjercicioHoras_Coincide",
        conditions: {
            all: [
                { fact: "answer_ejercicio_horas", operator: "notEqual", value: undefined },
                { fact: "ejercicio_horas", operator: "equal", value: { fact: "answer_ejercicio_horas" } }
            ]
        },
        event: { type: "score", params: { reason: "Horario de ejercicio coincide", weight: 30 } }
    },
    {
        name: "EjercicioHoras_Choque",
        conditions: {
            all: [
                { fact: "answer_ejercicio_horas", operator: "notEqual", value: undefined },
                { fact: "ejercicio_horas", operator: "notEqual", value: { fact: "answer_ejercicio_horas" } }
            ]
        },
        event: { type: "score", params: { reason: "Horario de ejercicio diferente", weight: -9999 } }
    },
];