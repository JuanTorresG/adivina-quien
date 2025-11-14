import type { AppFact, Breed } from "../types";
import { getBreedValue } from "./getBreedValue";

export const fastFilterForFacts = (pool: Breed[], facts: AppFact): Breed[] => {
    if (!facts || Object.keys(facts).length === 0) return pool.slice();

    const checkBoolean = (val: unknown, v: boolean): boolean => {
        if (typeof val === "boolean") return val === v;
        if (typeof val === "number") {
            const isHigh = val >= 4;
            return isHigh === v;
        }
        return false;
    };

    const checkString = (val: unknown, v: string): boolean => {
        if (typeof val !== "string") return false;
        const a = String(val).toLowerCase();
        const bval = String(v).toLowerCase();
        return a.includes(bval) || bval.includes(a);
    };

    const matches = (b: Breed, factKey: string, v: unknown): boolean => {
        const val = getBreedValue(b, factKey);
        if (typeof v === "boolean") return checkBoolean(val, v);
        if (typeof v === "string") return checkString(val, v);
        return true;
    };

    return pool.filter((b) => {
        for (const [factKey, v] of Object.entries(facts)) {
            if (!matches(b, factKey, v)) return false;
        }
        return true;
    });
};
