export const normalize = (s: unknown) => {
    if (s === null || s === undefined) return "";
    return String(s)
        .toLowerCase()
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "")
        .trim();
};