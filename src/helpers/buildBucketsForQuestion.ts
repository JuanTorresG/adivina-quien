import type { Breed, Question } from "../types";
import { classifyYesNo } from "./classifyYesNo";
import { getBreedValue } from "./getBreedValue";

export const buildBucketsForQuestion = (q: Question, possibleBreeds: Breed[]): Record<string, number> => {
    const buckets: Record<string, number> = {};

    if (q.type === "YESNO") {
        buckets["true"] = 0;
        buckets["false"] = 0;
        buckets["unknown"] = 0;

        for (const b of possibleBreeds) {
            const val = getBreedValue(b, q.factKey);
            const key = classifyYesNo(val);
            buckets[key] = (buckets[key] || 0) + 1;
        }
    } else if (q.type === "CHOICE" && q.options) {
        for (const opt of q.options) {
            buckets[opt.value] = 0;
        }
        buckets["unknown"] = 0;

        for (const b of possibleBreeds) {
            const val = getBreedValue(b, q.factKey);

            if (typeof val === "string") {
                if (val in buckets) {
                    buckets[val] = (buckets[val] || 0) + 1;
                } else {
                    let matched = false;
                    for (const opt of q.options) {
                        if (String(val).toLowerCase().includes(String(opt.value).toLowerCase())) {
                            buckets[opt.value] = (buckets[opt.value] || 0) + 1;
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) buckets["unknown"]++;
                }
            } else if (Array.isArray(val)) {
                let matched = false;
                for (const opt of q.options) {
                    if (val.some((v) => String(v).toLowerCase() === String(opt.value).toLowerCase())) {
                        buckets[opt.value] = (buckets[opt.value] || 0) + 1;
                        matched = true;
                        break;
                    }
                }
                if (!matched) buckets["unknown"]++;
            } else {
                buckets["unknown"]++;
            }
        }
    }

    return buckets;
};