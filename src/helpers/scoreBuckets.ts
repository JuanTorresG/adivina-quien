export const scoreBuckets = (buckets: Record<string, number>): number => {
    const vals = Object.values(buckets);
    if (vals.length === 0) return Infinity;
    const maxBucket = Math.max(...vals);
    const unknownCount = buckets['unknown'] || 0;
    return maxBucket + unknownCount * 0.5;
};
