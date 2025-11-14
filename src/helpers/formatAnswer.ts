import type { Question } from "../types";

export const formatAnswer = (question: Question, value: boolean | string): string => {
    if (question.type === "YES_NO") {
        return value ? "Sí" : "No";
    }
    return question.options?.find(o => o.value === value)?.text ?? String(value);
}