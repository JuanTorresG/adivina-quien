import { getBreedValue } from "./";
import type { Breed, Question } from "../types";

export const buildBucketsForQuestion = (q: Question, possible: Breed[]) => {
    const buckets: Record<string, number> = {};

    const validOptionValues = q.options
        ? new Set(q.options.map(o => String(o.value)))
        : null;

    for (const b of possible) {
        let val = getBreedValue(b, q.factKey);

        if (Array.isArray(val)) {
            if (validOptionValues) {
                const match = val.find(item => validOptionValues.has(String(item)));
                val = match ? match : "unknown";
            } else {
                val = val.length > 0 ? val.slice().sort().join(",") : "unknown";
            }
        }

        if (val === null || val === undefined) {
            buckets["unknown"] = (buckets["unknown"] || 0) + 1;
        } else {
            const stringVal = String(val);
            buckets[stringVal] = (buckets[stringVal] || 0) + 1;
        }
    }
    return buckets;
};