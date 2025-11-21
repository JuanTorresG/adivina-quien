export const scoreBuckets = (buckets: Record<string, number>): number => {
    const counts = Object.values(buckets);

    if (counts.length < 2) return 1000;

    const total = counts.reduce((a, b) => a + b, 0);
    const ideal = total / counts.length;

    let variance = 0;
    for (const c of counts) {
        variance += Math.pow(c - ideal, 2);
    }

    return variance;
};