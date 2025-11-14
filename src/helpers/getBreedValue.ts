import type { Breed } from "../types";
import { normalizeKey } from "../utils";

export const getBreedValue = (b: Breed, factKey: string): number | boolean | undefined => {
    const key = normalizeKey(factKey) as keyof Breed;
    const value = b[key];

    // If it's already a number or boolean, return directly.
    if (typeof value === "number" || typeof value === "boolean") {
        return value;
    }
    return undefined;
};