export type Size =
    | "pequeño/mediano"
    | "pequeño"
    | "mediano"
    | "grande"
    | "mediano/grande"
    | "muy grande"
    | "gigante";

export type Nivel = "muy bajo" | "bajo" | "medio" | "alto" | "muy alto";

export interface EsperanzaVida {
    de: number;
    a: number;
}

export type Categoria = "gato" | "perro";

export interface Breed {
    categoria: Categoria;
    img: string;
    nombre: string;
    tamanio: Size;
    nivel_energia?: Nivel;
    necesidad_ejercicio?: Nivel;
    ejercicio_horas?: string;
    aseo: Nivel;
    descripcion_aseo: string[];
    muda?: Nivel;
    hipoalergenico: boolean;
    tolerancia_soledad?: Nivel;
    bueno_con_ninos?: Nivel;
    buen_con_otras_mascotas?: Nivel;
    ladrido?: Nivel;
    adiestramiento?: Nivel;
    jugueton?: Nivel;
    inteligencia?: Nivel;
    temperamento: string[];
    comportamiento: string[];
    predisposiciones_salud?: string[];
    esperanza_vida?: EsperanzaVida | null;
    origen?: string;
    rasgos_fisicos?: string[];
    familiar?: Nivel;
    vocalizacion?: Nivel;
    acepta_otras_mascotas?: Nivel;
    grupo?: string;
    rasgos_tags?: string[];
}

export type EngineEvent = { params?: { weight?: number } };

export type Question = {
    id: string;
    factKey: string;
    text: string;
    type: "CHOICE" | "YESNO" | "OPEN";
    options?: { text: string; value: string }[];
    priority?: number;
    appliesTo?: "perro" | "gato" | "both";
    mandatory?: boolean;
}

export type BreedValue = number | boolean | string | string[] | undefined;

export interface Option {
    text: string;
    value: string;
}

export type Message = { id: number; text: string; sender: Sender };

export type Sender = 'user' | 'cpu';

export type GamePhase = 'playing' | 'guessing' | 'over';

export type QuestionType = 'CHOICE' | 'YESNO';
export type QuestionYesNoValue = 'true' | 'false' | 'unknown';
export type FactValue = string | boolean | number | string[] | null;
export type AppFact = Record<string, FactValue>;