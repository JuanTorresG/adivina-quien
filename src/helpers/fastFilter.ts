import type { Breed, AppFact } from "../types";
import { getBreedValue } from "./getBreedValue";
import { isEsperanzaVida } from "./typeGuards";

const normalize = (s: unknown): string => {
    if (s === null || s === undefined) return "";
    return String(s).toLowerCase().trim();
};

export const fastFilterForFacts = (pool: Breed[], facts: AppFact): Breed[] => {
    if (!facts || Object.keys(facts).length === 0) return pool.slice();

    const checkBoolean = (val: unknown, wantTrue: boolean): boolean => {
        if (typeof val === "boolean") return val === wantTrue;
        if (typeof val === "number") {
            const isHigh = val >= 4;
            return isHigh === wantTrue;
        }
        if (typeof val === "string") {
            const s = val.toLowerCase();
            if (s.includes("alto") || s.includes("muy alto")) return wantTrue === true;
            if (s.includes("bajo") || s.includes("muy bajo")) return wantTrue === false;
            return false;
        }
        return false;
    };

    const checkString = (val: unknown, needle: string): boolean => {
        if (!needle) return true;
        const n = normalize(needle);
        if (typeof val === "string") {
            const a = normalize(val);
            return a.includes(n) || n.includes(a);
        }
        if (Array.isArray(val)) {
            return val.some((item) => {
                const it = normalize(item);
                return it.includes(n) || n.includes(it);
            });
        }
        return false;
    };

    const matches = (breed: Breed, factKey: string, v: unknown): boolean => {
        const val = getBreedValue(breed, factKey);
        if (typeof v === "boolean") {
            return checkBoolean(val, v);
        }
        if (typeof v === "string") {
            if (v === "") return true;
            if (factKey === "answer_predisposicion_nombre" || factKey === "answer_predisposition_name") {
                if (!Array.isArray(val)) return false;
                return val.some((p) => normalize(p).includes(normalize(v)));
            }
            if (factKey === "answer_rasgo_tag") {
                return checkString(val, v);
            }
            if (factKey === "answer_rasgos_fisicos") {
                return checkString(val, v);
            }
            if (factKey === "answer_ejercicio_horas") {
                return checkString(val, v);
            }
            return checkString(val, v);
        }
        if (typeof v === "number") {
            if (isEsperanzaVida(val)) {
                return val.a >= v;
            }
            return false;
        }
        return true;
    };

    return pool.filter((b) => {
        for (const [factKey, v] of Object.entries(facts)) {
            if (!matches(b, factKey, v)) return false;
        }
        return true;
    });
};