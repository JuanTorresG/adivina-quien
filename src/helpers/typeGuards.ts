import type { EsperanzaVida } from "../types";

export const isEsperanzaVida = (v: unknown): v is EsperanzaVida => {
    if (v === null || v === undefined) return false;
    if (typeof v !== "object") return false;
    const obj = v as Record<string, unknown>;
    return typeof obj["de"] === "number" && typeof obj["a"] === "number";
};
