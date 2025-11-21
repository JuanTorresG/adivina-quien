import type { RuleProperties } from "json-rules-engine";

export const rules: RuleProperties[] = [
    // =================================================================
    // 1. FILTRO DE ESPECIE (CRÍTICO)
    // =================================================================
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
        event: { type: "score", params: { reason: "Especie incorrecta", weight: -9999 } }
    },

    // =================================================================
    // 2. RASGOS FÍSICOS GENÉRICOS (REGLAS MAESTRAS)
    // =================================================================

    // REGLA MAESTRA DE ACIERTO
    {
        name: "Gen_Rasgo_Coincide",
        conditions: {
            all: [
                { fact: "confirmed_trait", operator: "notEqual", value: null },
                { fact: "confirmed_trait", operator: "notEqual", value: "" },
                {
                    fact: "rasgos_tags",
                    operator: "contains",
                    value: { fact: "confirmed_trait" }
                }
            ]
        },
        event: {
            type: "score",
            params: {
                reason: "Rasgo físico confirmado (Genérico)",
                weight: 600
            }
        }
    },

    // REGLA MAESTRA DE CASTIGO
    {
        name: "Gen_Rasgo_Castigo",
        conditions: {
            all: [
                { fact: "rejected_trait", operator: "notEqual", value: null },
                { fact: "rejected_trait", operator: "notEqual", value: "" },
                {
                    fact: "rasgos_tags",
                    operator: "contains",
                    value: { fact: "rejected_trait" }
                }
            ]
        },
        event: {
            type: "score",
            params: {
                reason: "Tiene un rasgo que el usuario rechazó",
                weight: -9999
            }
        }
    },

    // =================================================================
    // 3. TIPO DE PELAJE (LOGICA HÍBRIDA)
    // =================================================================

    // --- PELO CORTO / LARGO (Mantener la lógica inicial) ---
    {
        name: "Pelo_Corto_Match",
        conditions: {
            all: [
                { fact: "rasgos_tags", operator: "contains", value: "pelaje_corto" },
                { fact: "answer_pelaje_tipo", operator: "equal", value: "pelaje_corto" },
            ]
        },
        event: { type: "score", params: { reason: "Tiene pelo corto", weight: 100 } }
    },
    {
        name: "Pelo_Largo_Match",
        conditions: {
            all: [
                { fact: "rasgos_tags", operator: "contains", value: "pelaje_largo" },
                { fact: "answer_pelaje_tipo", operator: "equal", value: "pelaje_largo" },
            ]
        },
        event: { type: "score", params: { reason: "Tiene pelo largo", weight: 100 } }
    },

    // Contradicciones Cruzadas 
    {
        name: "Castigo_PeloLargo_SiUsuarioBuscaCorto",
        conditions: {
            all: [
                { fact: "answer_pelaje_tipo", operator: "equal", value: "pelaje_corto" },
                { fact: "rasgos_tags", operator: "contains", value: "pelaje_largo" }
            ]
        },
        event: { type: "score", params: { reason: "Tiene pelo largo y buscas corto", weight: -1000 } }
    },
    {
        name: "Castigo_PeloCorto_SiUsuarioBuscaLargo",
        conditions: {
            all: [
                { fact: "answer_pelaje_tipo", operator: "equal", value: "pelaje_largo" },
                { fact: "rasgos_tags", operator: "contains", value: "pelaje_corto" }
            ]
        },
        event: { type: "score", params: { reason: "Tiene pelo corto y buscas largo", weight: -9999 } }
    },

    // =================================================================
    // 4. TAMAÑO (Se mantienen como están)
    // =================================================================
    {
        name: "Tamanio_Exacto",
        conditions: {
            all: [
                { fact: "tamanio", operator: "equal", value: { fact: "answer_tamanio" } }
            ]
        },
        event: { type: "score", params: { reason: "Tamaño exacto", weight: 80 } }
    },
    {
        name: "Tamanio_Aproximado_Grande",
        conditions: {
            all: [
                { fact: "answer_tamanio", operator: "in", value: ["grande", "muy grande"] },
                { fact: "tamanio", operator: "in", value: ["grande", "muy grande", "gigante"] },
                { fact: "tamanio", operator: "notEqual", value: { fact: "answer_tamanio" } }
            ]
        },
        event: { type: "score", params: { reason: "Tamaño aproximado", weight: 40 } }
    },
    // Castigos de Tamaño (Incompatibilidad)
    {
        name: "Error_Extremo_Tamano",
        conditions: {
            any: [
                {
                    all: [
                        { fact: "answer_tamanio", operator: "in", value: ["pequeño", "toy"] },
                        { fact: "tamanio", operator: "in", value: ["grande", "muy grande", "gigante"] }
                    ]
                },
                {
                    all: [
                        { fact: "answer_tamanio", operator: "in", value: ["grande", "muy grande", "gigante"] },
                        { fact: "tamanio", operator: "in", value: ["pequeño", "toy"] }
                    ]
                }
            ]
        },
        event: { type: "score", params: { reason: "Error grave de tamaño", weight: -9999 } }
    },
    //... (Otras reglas de tamaño que no se modificaron)

    // =================================================================
    // 5. REGLAS DE NIVEL CON AGRUPAMIENTO BAJO/ALTO
    // =================================================================

    // --- REGLAS BASE DE NIVEL (APLICAR A TODAS LAS PROPIEDADES DE NIVEL) ---

    // =================================================================
    // ENERGÍA (nivel_energia)
    // =================================================================
    {
        name: "nivel_energia_Coincide_Alta",
        conditions: {
            all: [
                { fact: "answer_nivel_energia", operator: "equal", value: "alto" },
                { fact: "nivel_energia", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Energía ALTA coincide", weight: 30 } }
    },
    {
        name: "nivel_energia_Coincide_Media",
        conditions: {
            all: [
                { fact: "answer_nivel_energia", operator: "equal", value: "medio" },
                { fact: "nivel_energia", operator: "in", value: ["medio", "moderado", "medio/moderado"] }
            ]
        },
        event: { type: "score", params: { reason: "Energía MEDIA coincide", weight: 30 } }
    },
    {
        name: "nivel_energia_Coincide_Baja",
        conditions: {
            all: [
                { fact: "answer_nivel_energia", operator: "equal", value: "bajo" },
                { fact: "nivel_energia", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Energía BAJA coincide", weight: 30 } }
    },

    // =================================================================
    // NECESIDAD DE EJERCICIO (necesidad_ejercicio)
    // =================================================================
    {
        name: "necesidad_ejercicio_Coincide_Alta",
        conditions: {
            all: [
                { fact: "answer_necesidad_ejercicio", operator: "equal", value: "alto" },
                { fact: "necesidad_ejercicio", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Necesidad Ejercicio ALTA coincide", weight: 25 } }
    },
    {
        name: "necesidad_ejercicio_Coincide_Media",
        conditions: {
            all: [
                { fact: "answer_necesidad_ejercicio", operator: "equal", value: "medio" },
                { fact: "necesidad_ejercicio", operator: "in", value: ["medio", "moderado", "medio/moderado"] }
            ]
        },
        event: { type: "score", params: { reason: "Necesidad Ejercicio MEDIA coincide", weight: 25 } }
    },
    {
        name: "necesidad_ejercicio_Coincide_Baja",
        conditions: {
            all: [
                { fact: "answer_necesidad_ejercicio", operator: "equal", value: "bajo" },
                { fact: "necesidad_ejercicio", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Necesidad Ejercicio BAJA coincide", weight: 25 } }
    },

    // =================================================================
    // BUENO CON NIÑOS (bueno_con_ninos)
    // =================================================================
    {
        name: "bueno_con_ninos_Coincide_Alta",
        conditions: {
            all: [
                { fact: "answer_bueno_con_ninos", operator: "equal", value: "alto" },
                { fact: "bueno_con_ninos", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Bueno con Niños ALTO coincide", weight: 25 } }
    },
    {
        name: "bueno_con_ninos_Coincide_Media",
        conditions: {
            all: [
                { fact: "answer_bueno_con_ninos", operator: "equal", value: "medio" },
                { fact: "bueno_con_ninos", operator: "in", value: ["medio", "moderado", "medio/moderado"] }
            ]
        },
        event: { type: "score", params: { reason: "Bueno con Niños MEDIA coincide", weight: 25 } }
    },
    {
        name: "bueno_con_ninos_Coincide_Baja",
        conditions: {
            all: [
                { fact: "answer_bueno_con_ninos", operator: "equal", value: "bajo" },
                { fact: "bueno_con_ninos", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Bueno con Niños BAJO coincide", weight: 25 } }
    },

    // =================================================================
    // ACEPTA OTRAS MASCOTAS (acepta_otras_mascotas / buen_con_otras_mascotas)
    // Nota: Uso 'buen_con_otras_mascotas' para perros y 'acepta_otras_mascotas' para gatos según la data. Se usa solo 'acepta_otras_mascotas' para la regla genérica.
    // Asumo que se usará 'acepta_otras_mascotas' o 'buen_con_otras_mascotas' en el data final de la raza. Aquí usaré 'acepta_otras_mascotas' para simplificar la regla general.
    {
        name: "acepta_otras_mascotas_Coincide_Alta",
        conditions: {
            all: [
                { fact: "answer_acepta_otras_mascotas", operator: "equal", value: "alto" },
                { fact: "acepta_otras_mascotas", operator: "in", value: ["alto", "muy alto", "bueno"] } // Incluyo 'bueno'
            ]
        },
        event: { type: "score", params: { reason: "Acepta Mascotas ALTO coincide", weight: 25 } }
    },
    {
        name: "acepta_otras_mascotas_Coincide_Media",
        conditions: {
            all: [
                { fact: "answer_acepta_otras_mascotas", operator: "equal", value: "medio" },
                { fact: "acepta_otras_mascotas", operator: "in", value: ["medio", "moderado", "medio/moderado"] }
            ]
        },
        event: { type: "score", params: { reason: "Acepta Mascotas MEDIA coincide", weight: 25 } }
    },
    {
        name: "acepta_otras_mascotas_Coincide_Baja",
        conditions: {
            all: [
                { fact: "answer_acepta_otras_mascotas", operator: "equal", value: "bajo" },
                { fact: "acepta_otras_mascotas", operator: "in", value: ["bajo", "muy bajo", "malo"] } // Incluyo 'malo'
            ]
        },
        event: { type: "score", params: { reason: "Acepta Mascotas BAJA coincide", weight: 25 } }
    },

    // =================================================================
    // ADIESTRAMIENTO (adiestramiento)
    // =================================================================
    {
        name: "adiestramiento_Coincide_Alta",
        conditions: {
            all: [
                { fact: "answer_adiestramiento", operator: "equal", value: "alto" },
                { fact: "adiestramiento", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Adiestramiento ALTO coincide", weight: 25 } }
    },
    {
        name: "adiestramiento_Coincide_Media",
        conditions: {
            all: [
                { fact: "answer_adiestramiento", operator: "equal", value: "medio" },
                { fact: "adiestramiento", operator: "in", value: ["medio", "moderado", "medio/moderado"] }
            ]
        },
        event: { type: "score", params: { reason: "Adiestramiento MEDIA coincide", weight: 25 } }
    },
    {
        name: "adiestramiento_Coincide_Baja",
        conditions: {
            all: [
                { fact: "answer_adiestramiento", operator: "equal", value: "bajo" },
                { fact: "adiestramiento", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Adiestramiento BAJO coincide", weight: 25 } }
    },

    // =================================================================
    // JUGUETÓN (jugueton)
    // =================================================================
    {
        name: "jugueton_Coincide_Alta",
        conditions: {
            all: [
                { fact: "answer_jugueton", operator: "equal", value: "alto" },
                { fact: "jugueton", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Juguetón ALTO coincide", weight: 25 } }
    },
    {
        name: "jugueton_Coincide_Media",
        conditions: {
            all: [
                { fact: "answer_jugueton", operator: "equal", value: "medio" },
                { fact: "jugueton", operator: "in", value: ["medio", "moderado", "medio/moderado"] }
            ]
        },
        event: { type: "score", params: { reason: "Juguetón MEDIA coincide", weight: 25 } }
    },
    {
        name: "jugueton_Coincide_Baja",
        conditions: {
            all: [
                { fact: "answer_jugueton", operator: "equal", value: "bajo" },
                { fact: "jugueton", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Juguetón BAJO coincide", weight: 25 } }
    },

    // =================================================================
    // INTELIGENCIA (inteligencia)
    // =================================================================
    {
        name: "inteligencia_Coincide_Alta",
        conditions: {
            all: [
                { fact: "answer_inteligencia", operator: "equal", value: "alto" },
                { fact: "inteligencia", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Inteligencia ALTA coincide", weight: 25 } }
    },
    {
        name: "inteligencia_Coincide_Media",
        conditions: {
            all: [
                { fact: "answer_inteligencia", operator: "equal", value: "medio" },
                { fact: "inteligencia", operator: "in", value: ["medio", "moderado", "medio/moderado"] }
            ]
        },
        event: { type: "score", params: { reason: "Inteligencia MEDIA coincide", weight: 25 } }
    },
    {
        name: "inteligencia_Coincide_Baja",
        conditions: {
            all: [
                { fact: "answer_inteligencia", operator: "equal", value: "bajo" },
                { fact: "inteligencia", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Inteligencia BAJA coincide", weight: 25 } }
    },

    // =================================================================
    // TOLERANCIA A LA SOLEDAD (tolerancia_soledad) - REGLAS AJUSTADAS
    // =================================================================
    // Match: User wants independence (alta_tolerancia) and animal is independent (alto/muy alto)
    {
        name: "ToleranciaSoledad_Coincide_Alta",
        conditions: {
            all: [
                { fact: "answer_tolerancia_soledad", operator: "equal", value: "alta_tolerancia" },
                { fact: "tolerancia_soledad", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Independencia (Alta Tolerancia) coincide", weight: 25 } }
    },
    // Match: User wants company (baja_tolerancia) and animal is dependent (bajo/muy bajo)
    {
        name: "ToleranciaSoledad_Coincide_Baja",
        conditions: {
            all: [
                { fact: "answer_tolerancia_soledad", operator: "equal", value: "baja_tolerancia" },
                { fact: "tolerancia_soledad", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Dependencia (Baja Tolerancia) coincide", weight: 25 } }
    },
    // Match: User wants balance (media_tolerancia) and animal is balanced (medio/moderado)
    {
        name: "ToleranciaSoledad_Coincide_Media",
        conditions: {
            all: [
                { fact: "answer_tolerancia_soledad", operator: "equal", value: "media_tolerancia" },
                { fact: "tolerancia_soledad", operator: "in", value: ["medio", "moderado", "medio/moderado"] }
            ]
        },
        event: { type: "score", params: { reason: "Balance (Media Tolerancia) coincide", weight: 25 } }
    },

    // =================================================================
    // VOCALIZACIÓN / LADRIDO (REGLAS ESPECÍFICAS)
    // =================================================================
    // 1. Perros: Ladrido Match
    {
        name: "Ladrido_Perro_Match",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "perro" },
                { fact: "answer_vocalizacion", operator: "equal", value: "ruidoso" },
                { fact: "ladrido", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Ladrido (Perro) coincide con ruidoso", weight: 30 } }
    },
    // 2. Gatos: Vocalización Match
    {
        name: "Vocalizacion_Gato_Match",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "gato" },
                { fact: "answer_vocalizacion", operator: "equal", value: "ruidoso" },
                { fact: "vocalizacion", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Vocalización (Gato) coincide con ruidoso", weight: 30 } }
    },

    // =================================================================
    // 6. REGLAS DE CHOQUE (CASTIGOS POR INCOMPATIBILIDAD GRAVE)
    // =================================================================

    // --- CHOQUE DE ENERGÍA ---
    {
        name: "Choque_nivel_energia_Bajo_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_nivel_energia", operator: "equal", value: "bajo" },
                { fact: "nivel_energia", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Energía BAJA, es ALTA", weight: -9999 } }
    },
    {
        name: "Choque_nivel_energia_Alto_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_nivel_energia", operator: "in", value: ["alto"] },
                { fact: "nivel_energia", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Energía ALTA, es BAJA", weight: -9999 } }
    },
    {
        name: "Choque_nivel_energia_Medio_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_nivel_energia", operator: "equal", value: "medio" },
                { fact: "nivel_energia", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Energía MEDIA, es ALTA", weight: -1000 } }
    },
    {
        name: "Choque_nivel_energia_Medio_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_nivel_energia", operator: "equal", value: "medio" },
                { fact: "nivel_energia", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Energía MEDIA, es BAJA", weight: -1000 } }
    },

    // --- CHOQUE DE NECESIDAD DE EJERCICIO ---
    {
        name: "Choque_necesidad_ejercicio_Bajo_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_necesidad_ejercicio", operator: "equal", value: "bajo" },
                { fact: "necesidad_ejercicio", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Ejercicio BAJO, es ALTO", weight: -9999 } }
    },
    {
        name: "Choque_necesidad_ejercicio_Alto_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_necesidad_ejercicio", operator: "equal", value: "alto" },
                { fact: "necesidad_ejercicio", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Ejercicio ALTO, es BAJO", weight: -9999 } }
    },
    {
        name: "Choque_necesidad_ejercicio_Medio_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_necesidad_ejercicio", operator: "equal", value: "medio" },
                { fact: "necesidad_ejercicio", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Ejercicio MEDIA, es ALTO", weight: -1000 } }
    },
    {
        name: "Choque_necesidad_ejercicio_Medio_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_necesidad_ejercicio", operator: "equal", value: "medio" },
                { fact: "necesidad_ejercicio", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Ejercicio MEDIA, es BAJO", weight: -1000 } }
    },

    // --- CHOQUE DE BUENO CON NIÑOS ---
    {
        name: "Choque_bueno_con_ninos_Bajo_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_bueno_con_ninos", operator: "equal", value: "bajo" },
                { fact: "bueno_con_ninos", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Niños BAJO, es ALTO", weight: -9999 } }
    },
    {
        name: "Choque_bueno_con_ninos_Alto_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_bueno_con_ninos", operator: "equal", value: "alto" },
                { fact: "bueno_con_ninos", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Niños ALTO, es BAJO", weight: -9999 } }
    },
    {
        name: "Choque_bueno_con_ninos_Medio_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_bueno_con_ninos", operator: "equal", value: "medio" },
                { fact: "bueno_con_ninos", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Niños MEDIO, es ALTO", weight: -1000 } }
    },
    {
        name: "Choque_bueno_con_ninos_Medio_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_bueno_con_ninos", operator: "equal", value: "medio" },
                { fact: "bueno_con_ninos", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Niños MEDIO, es BAJO", weight: -1000 } }
    },

    // --- CHOQUE DE ACEPTA OTRAS MASCOTAS ---
    {
        name: "Choque_acepta_otras_mascotas_Bajo_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_acepta_otras_mascotas", operator: "equal", value: "bajo" },
                { fact: "acepta_otras_mascotas", operator: "in", value: ["alto", "muy alto", "bueno"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Mascotas BAJO, es ALTO", weight: -9999 } }
    },
    {
        name: "Choque_acepta_otras_mascotas_Alto_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_acepta_otras_mascotas", operator: "equal", value: "alto" },
                { fact: "acepta_otras_mascotas", operator: "in", value: ["bajo", "muy bajo", "malo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Mascotas ALTO, es BAJO", weight: -9999 } }
    },
    {
        name: "Choque_acepta_otras_mascotas_Medio_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_acepta_otras_mascotas", operator: "equal", value: "medio" },
                { fact: "acepta_otras_mascotas", operator: "in", value: ["alto", "muy alto", "bueno"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Mascotas MEDIO, es ALTO", weight: -1000 } }
    },
    {
        name: "Choque_acepta_otras_mascotas_Medio_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_acepta_otras_mascotas", operator: "equal", value: "medio" },
                { fact: "acepta_otras_mascotas", operator: "in", value: ["bajo", "muy bajo", "malo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Mascotas MEDIO, es BAJO", weight: -1000 } }
    },

    // --- CHOQUE DE ADIESTRAMIENTO ---
    {
        name: "Choque_adiestramiento_Bajo_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_adiestramiento", operator: "equal", value: "bajo" },
                { fact: "adiestramiento", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Adiestramiento BAJO, es ALTO", weight: -9999 } }
    },
    {
        name: "Choque_adiestramiento_Alto_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_adiestramiento", operator: "equal", value: "alto" },
                { fact: "adiestramiento", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Adiestramiento ALTO, es BAJO", weight: -9999 } }
    },
    {
        name: "Choque_adiestramiento_Medio_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_adiestramiento", operator: "equal", value: "medio" },
                { fact: "adiestramiento", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Adiestramiento MEDIO, es ALTO", weight: -1000 } }
    },
    {
        name: "Choque_adiestramiento_Medio_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_adiestramiento", operator: "equal", value: "medio" },
                { fact: "adiestramiento", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Adiestramiento MEDIO, es BAJO", weight: -1000 } }
    },

    // --- CHOQUE DE JUGUETÓN ---
    {
        name: "Choque_jugueton_Bajo_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_jugueton", operator: "equal", value: "bajo" },
                { fact: "jugueton", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Juguetón BAJO, es ALTO", weight: -9999 } }
    },
    {
        name: "Choque_jugueton_Alto_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_jugueton", operator: "equal", value: "alto" },
                { fact: "jugueton", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Juguetón ALTO, es BAJO", weight: -9999 } }
    },
    {
        name: "Choque_jugueton_Medio_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_jugueton", operator: "equal", value: "medio" },
                { fact: "jugueton", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Juguetón MEDIO, es ALTO", weight: -1000 } }
    },
    {
        name: "Choque_jugueton_Medio_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_jugueton", operator: "equal", value: "medio" },
                { fact: "jugueton", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Juguetón MEDIO, es BAJO", weight: -1000 } }
    },

    // --- CHOQUE DE INTELIGENCIA ---
    {
        name: "Choque_inteligencia_Bajo_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_inteligencia", operator: "equal", value: "bajo" },
                { fact: "inteligencia", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Inteligencia BAJA, es ALTA", weight: -9999 } }
    },
    {
        name: "Choque_inteligencia_Alto_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_inteligencia", operator: "equal", value: "alto" },
                { fact: "inteligencia", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Inteligencia ALTA, es BAJA", weight: -9999 } }
    },
    {
        name: "Choque_inteligencia_Medio_vs_Alto",
        conditions: {
            all: [
                { fact: "answer_inteligencia", operator: "equal", value: "medio" },
                { fact: "inteligencia", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Inteligencia MEDIO, es ALTA", weight: -1000 } }
    },
    {
        name: "Choque_inteligencia_Medio_vs_Bajo",
        conditions: {
            all: [
                { fact: "answer_inteligencia", operator: "equal", value: "medio" },
                { fact: "inteligencia", operator: "in", value: ["bajo", "muy bajo"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas Inteligencia MEDIO, es BAJA", weight: -1000 } }
    },

    // --- CHOQUE DE INDEPENDENCIA ---
    {
        name: "Choque_ToleranciaSoledad_Baja_vs_Alta",
        conditions: {
            all: [
                { fact: "answer_tolerancia_soledad", operator: "equal", value: "baja_tolerancia" }, // Quiere apego
                { fact: "tolerancia_soledad", operator: "in", value: ["alto", "muy alto"] } // Animal es muy independiente
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas dependencia, es independiente", weight: -9999 } }
    },
    {
        name: "Choque_ToleranciaSoledad_Alta_vs_Baja",
        conditions: {
            all: [
                { fact: "answer_tolerancia_soledad", operator: "equal", value: "alta_tolerancia" }, // Quiere independencia
                { fact: "tolerancia_soledad", operator: "in", value: ["bajo", "muy bajo"] } // Animal es muy dependiente
            ]
        },
        event: { type: "score", params: { reason: "Choque: Buscas independencia, es dependiente", weight: -9999 } }
    },

    // --- CHOQUE DE VOCALIZACIÓN ---
    // 3. Perros: Ladrido Clash
    {
        name: "Choque_Ladrido_Perro",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "perro" },
                { fact: "answer_vocalizacion", operator: "equal", value: "silencioso" },
                { fact: "ladrido", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Perro es muy ruidoso (ladra mucho)", weight: -9999 } }
    },
    // 4. Gatos: Vocalización Clash
    {
        name: "Choque_Vocalizacion_Gato",
        conditions: {
            all: [
                { fact: "answer_categoria", operator: "equal", value: "gato" },
                { fact: "answer_vocalizacion", operator: "equal", value: "silencioso" },
                { fact: "vocalizacion", operator: "in", value: ["alto", "muy alto"] }
            ]
        },
        event: { type: "score", params: { reason: "Choque: Gato es muy ruidoso (vocaliza mucho)", weight: -9999 } }
    },

    // --- CHOQUE HIPOALERGÉNICO (CRÍTICO) ---
    {
        name: "Choque_No_Hipoalergenico",
        conditions: {
            all: [
                { fact: "answer_hipoalergenico", operator: "equal", value: true },
                { fact: "hipoalergenico", operator: "equal", value: false }
            ]
        },
        event: { type: "score", params: { reason: "No es hipoalergénico", weight: -9999 } }
    }
];