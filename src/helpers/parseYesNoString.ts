import { normalize } from "./normalize";

export const parseYesNoString = (s: string): boolean | null => {
    const n = normalize(s);
    if (["si", "sí", "s", "yes", "y"].includes(n)) return true;
    if (["no", "n"].includes(n)) return false;
    return null;
};