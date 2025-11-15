import type { Question } from "../types";
import { parseYesNoString } from "./parseYesNoString";
import { isNoSeText } from "./isNoSeText";

const normalize = (s: unknown) => {
    if (s === null || s === undefined) return "";
    return String(s).toLowerCase().normalize("NFD").replaceAll(/[\u0300-\u036f]/g, "").trim();
};

export const resolveAnswerValue = (question: Question, raw: boolean | string): boolean | string => {
    if (typeof raw === "boolean") return raw;

    const rawStr = String(raw).trim();
    const norm = normalize(rawStr);

    const yn = parseYesNoString(rawStr);
    if (yn !== null && question.type === "YESNO") return yn;

    if (Array.isArray(question.options) && question.options.length > 0) {
        const byValue = question.options.find(o => normalize(String(o.value)) === norm);
        if (byValue) {
            const vnorm = normalize(String(byValue.value));
            if (vnorm === "otro" || vnorm === "otro_o_no_se" || vnorm === "otro_o_no_sé") return "";
            return byValue.value;
        }

        const byText = question.options.find(o => normalize(String(o.text ?? "")) === norm);
        if (byText) {
            const vnorm = normalize(String(byText.value));
            if (vnorm === "otro" || vnorm === "otro_o_no_se" || vnorm === "otro_o_no_sé") return "";
            return byText.value;
        }

        if (isNoSeText(rawStr)) {
            if (question.options.some(o => o.value === "")) return "";
            const optOtro = question.options.find(o => {
                const v = normalize(String(o.value));
                return v === "otro" || v === "otro_o_no_se";
            });
            if (optOtro) return "";
        }
    }

    if (isNoSeText(rawStr)) return "";

    return rawStr;
};