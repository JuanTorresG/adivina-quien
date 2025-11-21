import type { Breed, BreedValue } from "../types";

const MAP: Record<string, string> = {
    // Estáticas
    answer_hipoalergenico: "hipoalergenico",
    answer_tamanio: "tamanio",
    answer_nivel_energia: "nivel_energia",
    answer_necesidad_ejercicio: "necesidad_ejercicio",
    answer_muda: "muda",
    answer_aseo: "aseo",                        // CORREGIDO (antes answer_aseo_frecuente)
    answer_tolerancia_soledad: "tolerancia_soledad",
    answer_bueno_con_ninos: "bueno_con_ninos",
    answer_acepta_otras_mascotas: "acepta_otras_mascotas",
    answer_ladrido: "ladrido",                    // CORREGIDO (antes answer_vocalizacion)
    answer_adiestramiento: "adiestramiento",
    answer_jugueton: "jugueton",
    answer_inteligencia: "inteligencia",
    answer_categoria: "categoria",
    answer_grupo: "grupo",

    // Dinámicas (Nuevas, para que funcionen las reglas dinámicas)
    answer_rasgos_tags: "rasgos_tags",
    answer_ejercicio_horas: "ejercicio_horas",
    answer_descripcion_aseo: "descripcion_aseo",
    answer_temperamento: "temperamento",
    answer_comportamiento: "comportamiento",
    answer_predisposiciones_salud: "predisposiciones_salud",
    answer_origen: "origen",
};

export const getBreedValue = (b: Breed, factKey: string): BreedValue | undefined => {
    const asRecord = b as unknown as Record<string, unknown>;
    const mappedKey = MAP[factKey];

    if (mappedKey) {
        const val = asRecord[mappedKey];

        // Fallbacks por si la base de datos tiene nombres antiguos en algunas propiedades
        if (val === undefined) {
            if (mappedKey === "acepta_otras_mascotas") {
                return (asRecord["buen_con_otras_mascotas"] as BreedValue | undefined) ?? undefined;
            }
            // Si mapeamos "ladrido", verificamos si existe bajo "vocalizacion" por si acaso
            if (mappedKey === "ladrido") {
                return (asRecord["vocalizacion"] as BreedValue | undefined) ?? undefined;
            }
            return undefined;
        }

        if (Array.isArray(val)) return val as string[];
        if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
            return val as BreedValue;
        }
        return val as BreedValue;
    }

    // Intento directo si no está en el mapa
    return asRecord[factKey] as BreedValue | undefined;
};