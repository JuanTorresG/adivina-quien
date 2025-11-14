import type { Breed, BreedValue } from "../types";
import { normalizeKey } from "../utils";

export const getBreedValue = (b: Breed, factKey: string): BreedValue => {
    const map: Record<string, string> = {
        answer_hipoalergenico: "hipoalergenico",
        answer_high_energy: "nivel_energia",
        answer_needs_exercise: "necesidad_ejercicio",
        answer_sheds: "muda",
        answer_high_grooming: "aseo",
        answer_bueno_con_ninos: "bueno_con_ninos",
        answer_acepta_otras_mascotas: "buen_con_otras_mascotas",
        answer_tolerancia_soledad: "tolerancia_soledad",
        answer_barks: "ladrido",
        answer_vocal: "vocalizacion",
        answer_playful: "jugueton",
        answer_intelligent: "inteligencia",
        answer_trainable: "adiestramiento",
        answer_has_predisposition: "predisposiciones_salud",
        answer_predisposition_name: "predisposiciones_salud",
        answer_rasgos_fisicos: "rasgos_fisicos",
        answer_categoria: "categoria",
        answer_size: "size",
    };

    const asRecord = b as unknown as Record<string, unknown>;
    const mapped = map[factKey];

    if (mapped) {
        const val = asRecord[mapped];
        if (val === undefined) return undefined;
        if (Array.isArray(val)) return val;
        if (typeof val === "number" || typeof val === "boolean" || typeof val === "string") return val;
        return undefined;
    }

    const key = normalizeKey(factKey) as keyof Breed;
    const raw = asRecord[key];

    if (raw === undefined) return undefined;
    if (Array.isArray(raw)) return raw as string[];
    if (typeof raw === "number" || typeof raw === "boolean" || typeof raw === "string") return raw;
    return undefined;
};
