export interface Breed {
    categoria: Categoria;
    img: string;
    name: string;
    size: string;
    nivel_energia?: number;
    necesidad_ejercicio?: number;
    ejercicio_horas?: string;
    aseo: number;
    descripcion_aseo: string;
    muda: number;
    hipoalergenico: boolean;
    tolerancia_soledad?: number;
    bueno_con_ninos?: number;
    buen_con_otras_mascotas?: number;
    ladrido?: number;
    adiestramiento?: number;
    temperamento: string;
    comportamiento: string;
    predisposiciones_salud: string[];
    esperanza_vida: string;
    origen: string;
    rasgos_fisicos: string;
    familiar?: number;
    jugueton?: number;
    inteligencia?: number;
    vocalizacion?: number;
    acepta_otras_mascotas?: number;
}
export type Categoria = "gato" | "perro";
export type EngineEvent = { params?: { weight?: number } };
export interface Question {
    id: string;
    text: string;
    factKey: FactKey;
    type: QuestionType;
    options?: Option[];
}

export type BreedValue = number | boolean | string | string[] | undefined;

export interface Option {
    text: string;
    value: string;
}

export type Message = { id: number; text: string; sender: Sender };

export type Sender = 'user' | 'cpu';

export type GamePhase = 'playing' | 'guessing' | 'over';

export type FactKey =
    | "answer_size"
    | "answer_hipoalergenico"
    | "answer_needs_exercise"
    | "answer_high_energy"
    | "answer_color"
    | "answer_temperamento"
    | "answer_predisposition_name"
    | "answer_has_predisposition"
    | "predisposiciones_salud";

export type FactValue = string | boolean;
export type AppFact = Partial<Record<FactKey, FactValue>>;
export interface FactKeyMap {
    answer_size?: string;
    answer_hipoalergenico?: boolean;
    answer_needs_exercise?: number;
    answer_high_energy?: number;
    answer_color?: string;
    answer_temperamento?: string;
    answer_predisposition_name?: string;
    answer_has_predisposition?: boolean;
    predisposiciones_salud?: string[];
}
export type AppFactStrict = Partial<FactKeyMap>;

export type QuestionType = 'CHOICE' | 'YES_NO';
export type QuestionYesNoValue = 'true' | 'false' | 'unknown';