import type { Breed } from "../types";

export const getBestPhysicalTrait = (breeds: Breed[]): string | null => {
    const counter: Record<string, number> = {};

    for (const b of breeds) {
        const traits = b.rasgos_fisicos ?? [];
        for (const t of traits) {
            if (t == null) continue;
            const key = String(t).toLowerCase().trim();
            if (!key) continue;
            counter[key] = (counter[key] || 0) + 1;
        }
    }

    const total = breeds.length;
    if (total === 0) return null;

    let bestTrait: string | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const [trait, count] of Object.entries(counter)) {
        const p = count / total;
        const score = Math.abs(0.5 - p);
        if (score < bestScore) {
            bestScore = score;
            bestTrait = trait;
        }
    }

    return bestTrait;
};