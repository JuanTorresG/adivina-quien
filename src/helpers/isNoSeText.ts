import { normalize } from "./normalize";

export const isNoSeText = (s: string) => {
    const n = normalize(s);
    return (
        n === "" ||
        n === "no se" ||
        n === "nose" ||
        n === "no se / indiferente" ||
        n === "desconocido" ||
        n === "indiferente" ||
        n === "otro" ||
        n === "otro / no se" ||
        n === "otro / no sé" ||
        n === "ns" ||
        n === "?"
    );
};
