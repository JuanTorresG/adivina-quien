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

export type AppFact = Record<string, string | boolean>;

export interface Question {
    id: string;
    text: string;
    factKey: string;
    type: QuestionType;
    options?: Option[];
}

export interface Option {
    text: string;
    value: string;
}

export type QuestionType = 'CHOICE' | 'YES_NO';

export type Message = { id: number; text: string; sender: Sender };

export type Sender = 'user' | 'cpu';

export type GamePhase = 'playing' | 'guessing' | 'over';

export type QuestionYesNoValue = 'true' | 'false' | 'unknown';