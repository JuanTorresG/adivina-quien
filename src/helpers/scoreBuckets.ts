export const scoreBuckets = (buckets: Record<string, number>): number => {
    const total = Object.values(buckets).reduce((a, b) => a + b, 0);
    let e = 0;
    for (const v of Object.values(buckets)) {
        if (v === 0) continue;
        const p = v / total;
        e -= p * Math.log2(p);
    }
    return e;
};
