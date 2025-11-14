import type { QuestionYesNoValue } from "../types";

export const classifyYesNo = (val: (boolean | number | undefined)): QuestionYesNoValue => {
    if (val === true || val === 1) return 'true';
    if (val === false || val === 0) return 'false';
    if (typeof val === 'number') {
        if (val >= 4) return 'true';
        if (val <= 2) return 'false';
        return 'unknown';
    }
    return 'unknown';
};