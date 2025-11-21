import type { Question } from "../types";
import { classifyYesNo } from "./";

export const resolveAnswerValue = (
    userValue: string | boolean | number,
    question: Question
): string | boolean | number | string[] | null => {
    if (typeof userValue === "boolean") {
        if (question.type === "YESNO") {
            return userValue;
        }
        return userValue ? "si" : "no";
    }

    const lowerText = String(userValue).toLowerCase().trim();

    if (question.type === "YESNO") {
        const classification = classifyYesNo(lowerText);
        if (classification === "true") return true;
        if (classification === "false") return false;
        return null;
    }

    if (question.type === "CHOICE" && question.options) {
        for (const opt of question.options) {
            const optText = opt.text.toLowerCase();
            const optVal = String(opt.value).toLowerCase();

            if (lowerText.includes(optVal) || lowerText.includes(optText)) {
                return opt.value;
            }

            const keywords = optText
                .split(/[\/\(\)]/)
                .map((k) => k.trim())
                .filter((k) => k.length > 2);

            if (keywords.some((k) => lowerText.includes(k))) {
                return opt.value;
            }
        }
    }

    return null;
};