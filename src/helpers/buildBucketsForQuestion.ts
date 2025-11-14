import type { Breed, Question } from "../types";
import { classifyYesNo } from "./classifyYesNo";
import { getBreedValue } from "./getBreedValue";

export const buildBucketsForQuestion = (q: Question, possibleBreeds: Breed[]): Record<string, number> => {
    const buckets: Record<string, number> = {};

    if (q.type === "YES_NO") {
        buckets["true"] = 0;
        buckets["false"] = 0;
        buckets["unknown"] = 0;

        for (const b of possibleBreeds) {
            const val = getBreedValue(b, q.factKey);
            const key = classifyYesNo(val);
            buckets[key] = (buckets[key] || 0) + 1;
        }
    } else if (q.type === "CHOICE" && q.options) {
        for (const opt of q.options) buckets[opt.value] = 0;
        buckets["unknown"] = 0;

        for (const b of possibleBreeds) {
            const val = getBreedValue(b, q.factKey);
            if (typeof val === "string" && val in buckets) {
                buckets[val] = (buckets[val] || 0) + 1;
            } else {
                buckets["unknown"]++;
            }
        }
    }

    return buckets;
};
