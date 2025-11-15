export const classifyYesNo = (val: unknown): "true" | "false" | "unknown" => {
    if (val === null || val === undefined) return "unknown";
    if (typeof val === "boolean") return val ? "true" : "false";
    if (typeof val === "number") return val >= 4 ? "true" : "false";
    if (typeof val === "string") {
        const s = val.toLowerCase();
        if (s.includes("muy alto") || s.includes("alto")) return "true";
        if (s.includes("muy bajo") || s.includes("bajo")) return "false";
        return "unknown";
    }
    if (Array.isArray(val)) return val.length > 0 ? "true" : "unknown";
    return "unknown";
};