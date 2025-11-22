import type { Breed, BreedValue } from "../types";

const MAP: Record<string, string> = {
    answer_hipoalergenico: "hipoalergenico",
    answer_tamanio: "tamanio",
    answer_nivel_energia: "nivel_energia",
    answer_necesidad_ejercicio: "necesidad_ejercicio",
    answer_muda: "muda",
    answer_aseo: "aseo",
    answer_tolerancia_soledad: "tolerancia_soledad",
    answer_bueno_con_ninos: "bueno_con_ninos",
    answer_acepta_otras_mascotas: "acepta_otras_mascotas",
    answer_ladrido: "ladrido",
    answer_adiestramiento: "adiestramiento",
    answer_jugueton: "jugueton",
    answer_inteligencia: "inteligencia",
    answer_categoria: "categoria",
    answer_grupo: "grupo",

    answer_rasgos_tags: "rasgos_tags",
    answer_ejercicio_horas: "ejercicio_horas",
    answer_descripcion_aseo: "descripcion_aseo",
    answer_temperamento: "temperamento",
    answer_comportamiento: "comportamiento",
    answer_predisposiciones_salud: "predisposiciones_salud",
    answer_origen: "origen",
};

const LEGACY_ALIASES: Record<string, string[]> = {
    acepta_otras_mascotas: ["buen_con_otras_mascotas", "acepta_otras_mascotas"],
    ladrido: ["vocalizacion", "vocalizacion_nivel"],
};

const normalizeKey = (k: string) => String(k).toLowerCase().trim();

export const getBreedValue = (b: Breed, factKey: string): BreedValue | undefined => {
    const asRecord = b as unknown as Record<string, unknown>;
    const mappedKey = MAP[factKey];

    const readVal = (key: string) => {
        const v = asRecord[key];
        if (v === undefined) return undefined;
        if (typeof v === "string") return v.trim();
        return v;
    };

    if (mappedKey) {
        let val = readVal(mappedKey);
        if (val === undefined && LEGACY_ALIASES[mappedKey]) {
            for (const alt of LEGACY_ALIASES[mappedKey]) {
                val = readVal(alt);
                if (val !== undefined) break;
            }
        }
        if (val === undefined) {
            const normalized = normalizeKey(mappedKey);
            for (const k of Object.keys(asRecord)) {
                if (normalizeKey(k) === normalized) {
                    val = readVal(k);
                    break;
                }
            }
        }
        if (Array.isArray(val)) return val as string[];
        if (
            typeof val === "string" ||
            typeof val === "number" ||
            typeof val === "boolean"
        ) {
            return val as BreedValue;
        }
        return val as BreedValue | undefined;
    }
    if (asRecord[factKey] !== undefined) return asRecord[factKey] as BreedValue;
    const normalizedFactKey = normalizeKey(factKey);
    for (const k of Object.keys(asRecord)) {
        if (normalizeKey(k) === normalizedFactKey) return asRecord[k] as BreedValue;
    }
    return undefined;
};
