import type { Breed, Question } from "../types";
import { getBreedValue } from "./getBreedValue";

export const buildBucketsForQuestion = (q: Question, possible: Breed[]) => {
    const buckets: Record<string, number> = {};
    for (const b of possible) {
        const val = getBreedValue(b, q.factKey);
        if (val == null) buckets["unknown"] = (buckets["unknown"] || 0) + 1;
        else {
            buckets[String(val)] = (buckets[String(val)] || 0) + 1;
        }
    }
    return buckets;
}
