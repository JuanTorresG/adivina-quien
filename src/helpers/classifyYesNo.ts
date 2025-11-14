import type { BreedValue, QuestionYesNoValue } from "../types";

export const classifyYesNo = (val: BreedValue): QuestionYesNoValue => {
    if (val === true) return "true";
    if (val === false) return "false";
    if (typeof val === "number") {
        if (val >= 4) return "true";
        if (val <= 2) return "false";
        return "unknown";
    }
    return "unknown";
};
