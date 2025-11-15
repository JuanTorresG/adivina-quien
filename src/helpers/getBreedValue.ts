import type { Breed, BreedValue } from "../types";

const MAP: Record<string, string> = {
    answer_hipoalergenico: "hipoalergenico",
    answer_tamanio: "tamanio",
    answer_nivel_energia: "nivel_energia",
    answer_necesidad_ejercicio: "necesidad_ejercicio",
    answer_ejercicio_horas: "ejercicio_horas",
    answer_muda: "muda",
    answer_aseo_frecuente: "aseo",
    answer_tolerancia_soledad: "tolerancia_soledad",
    answer_bueno_con_ninos: "bueno_con_ninos",
    answer_acepta_otras_mascotas: "acepta_otras_mascotas",
    answer_ladra: "ladrido",
    answer_vocal: "vocalizacion",
    answer_jugueton: "jugueton",
    answer_inteligencia: "inteligencia",
    answer_adiestrable: "adiestramiento",
    answer_tiene_predisposicion: "predisposiciones_salud",
    answer_predisposicion_nombre: "predisposiciones_salud",
    answer_rasgo_tag: "rasgos_tags",
    answer_rasgos_fisicos: "rasgos_fisicos",
    answer_categoria: "categoria",
    answer_quiere_raza_longeva: "esperanza_vida",
    answer_min_life: "esperanza_vida",
    answer_color: "color",
    answer_grupo: "grupo",

    answer_high_energy: "nivel_energia",
    answer_needs_exercise: "necesidad_ejercicio",
    answer_sheds: "muda",
    answer_high_grooming: "aseo",
    answer_size: "tamanio",
    answer_predisposition_name: "predisposiciones_salud",
};

export const getBreedValue = (b: Breed, factKey: string): BreedValue | undefined => {
    const asRecord = b as unknown as Record<string, unknown>;
    const mapped = MAP[factKey];

    if (mapped) {
        const val = asRecord[mapped];
        if (val === undefined) {
            if (mapped === "acepta_otras_mascotas") {
                return (asRecord["buen_con_otras_mascotas"] as BreedValue | undefined) ?? undefined;
            }
            return undefined;
        }

        if (Array.isArray(val)) return val as string[];
        if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
            return val as BreedValue;
        }

        return val as BreedValue;
    }

    const raw = asRecord[factKey];
    if (raw === undefined) return undefined;
    if (Array.isArray(raw)) return raw as string[];
    if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") return raw as BreedValue;
    return raw as BreedValue;
};