// helpers/fastFilter.ts
import type { Breed, AppFact } from '../types';

/**
 * Convierte un tamaño (string) de la raza a una forma normalizada
 */
const normalizeSize = (size?: string) => {
    if (!size) return '';
    const s = String(size).toLowerCase();
    if (s.includes('peque')) return 'pequeño';
    if (s.includes('med') || s.includes('/')) return 'mediano';
    if (s.includes('grand') || s.includes('gigante')) return 'grande';
    return s;
};

export const fastFilterForFacts = (breeds: Breed[], facts: AppFact): Breed[] => {
    if (!facts || Object.keys(facts).length === 0) return breeds;

    return breeds.filter((b) => {
        // categoría
        if (facts.answer_categoria && b.categoria && facts.answer_categoria !== b.categoria) return false;

        // tamaño (CHOICE)
        if (facts.answer_size) {
            const desired = String(facts.answer_size).toLowerCase();
            const breedSize = normalizeSize(b.size);
            // si el usuario dice 'pequeño' pero la raza es 'grande' -> descarta
            if (desired === 'pequeño' && breedSize === 'grande') return false;
            if (desired === 'grande' && breedSize === 'pequeño') return false;
            // si valores mixtos como "pequeño/mediano" en breed.size, normalizeSize devuelve mediano...
        }

        // hipoalergénico
        if (typeof facts.answer_hipoalergenico === 'boolean') {
            if (facts.answer_hipoalergenico && b.hipoalergenico !== true) return false;
        }

        // alta energía -> nivel_energia >= 4
        if (typeof facts.answer_high_energy === 'boolean') {
            if (facts.answer_high_energy && !(typeof b.nivel_energia === 'number' && b.nivel_energia >= 4)) return false;
            if (!facts.answer_high_energy && typeof b.nivel_energia === 'number' && b.nivel_energia >= 5) return false;
        }

        // necesita ejercicio
        if (typeof facts.answer_needs_exercise === 'boolean') {
            if (facts.answer_needs_exercise && !(typeof b.necesidad_ejercicio === 'number' && b.necesidad_ejercicio >= 4)) return false;
            if (!facts.answer_needs_exercise && typeof b.necesidad_ejercicio === 'number' && b.necesidad_ejercicio >= 5) return false;
        }

        // grooming / aseo
        if (typeof facts.answer_high_grooming === 'boolean') {
            if (facts.answer_high_grooming && !(typeof b.aseo === 'number' && b.aseo >= 4)) return false;
            if (!facts.answer_high_grooming && typeof b.aseo === 'number' && b.aseo >= 5) return false;
        }

        // mucha muda
        if (typeof facts.answer_sheds === 'boolean') {
            if (facts.answer_sheds && !(typeof b.muda === 'number' && b.muda >= 4)) return false;
            if (!facts.answer_sheds && typeof b.muda === 'number' && b.muda >= 5) return false;
        }

        // bueno con niños
        if (typeof facts.answer_bueno_con_ninos === 'boolean') {
            if (facts.answer_bueno_con_ninos && !(typeof b.bueno_con_ninos === 'number' && b.bueno_con_ninos >= 4)) return false;
            if (!facts.answer_bueno_con_ninos && typeof b.bueno_con_ninos === 'number' && b.bueno_con_ninos >= 5) return false;
        }

        // acepta otras mascotas
        if (typeof facts.answer_acepta_otras_mascotas === 'boolean') {
            if (facts.answer_acepta_otras_mascotas && !(typeof b.buen_con_otras_mascotas === 'number' && b.buen_con_otras_mascotas >= 4)) return false;
        }

        // vocal / ladrido
        if (typeof facts.answer_vocal === 'boolean') {
            const vocalVal = (b.vocalizacion ?? b.ladrido) as number | undefined;
            if (facts.answer_vocal && !(typeof vocalVal === 'number' && vocalVal >= 4)) return false;
        }

        // trainable, playful, intelligent (similares)
        if (typeof facts.answer_trainable === 'boolean' && facts.answer_trainable && !(typeof b.adiestramiento === 'number' && b.adiestramiento >= 4)) return false;
        if (typeof facts.answer_playful === 'boolean' && facts.answer_playful && !(typeof b.jugueton === 'number' && b.jugueton >= 4)) return false;
        if (typeof facts.answer_intelligent === 'boolean' && facts.answer_intelligent && !(typeof b.inteligencia === 'number' && b.inteligencia >= 4)) return false;

        // predisposiciones: si se especifica nombre, buscarlo en el array
        if (facts.answer_has_predisposition && facts.answer_predisposition_name) {
            const name = String(facts.answer_predisposition_name).toLowerCase();
            if (!Array.isArray(b.predisposiciones_salud) || !b.predisposiciones_salud.some((p) => String(p).toLowerCase().includes(name))) return false;
        }

        // si pasa todas las comprobaciones rápidas, se conserva
        return true;
    });
};
