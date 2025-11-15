import React from "react";
import type { Breed } from "../types";

interface Props {
    breed: Breed | null;
    onClose: () => void;
}

export const BreedModal: React.FC<Props> = ({ breed, onClose }) => {
    if (!breed) return null;

    const name = breed.nombre ?? "Sin nombre";
    const category = breed.categoria ?? "N/A";
    const imgPath = `/${category}s/${breed.img}`;

    const renderMaybe = (label: string, v: unknown) => {
        if (v === undefined || v === null || (typeof v === "string" && v === "")) return null;
        if (Array.isArray(v) && v.length === 0) return null;
        return (
            <div className="mb-2">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="text-sm text-slate-800 mt-0.5">{Array.isArray(v) ? v.join(", ") : String(v)}</div>
            </div>
        );
    };

    return (
        <dialog
            open
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-label={`Detalles de ${name}`}
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative z-10 max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-auto max-h-[90vh]">
                <div className="flex items-start gap-4 p-6 border-b">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-800">{name}</h3>
                        <div className="text-sm text-slate-500 mt-1">{category.toUpperCase()}</div>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-2 p-2 rounded-md text-slate-600 hover:bg-slate-100"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 flex flex-col items-center gap-3">
                        <div className="w-full rounded-lg overflow-hidden bg-gray-50">
                            {/* Imagen */}
                            <img
                                src={imgPath}
                                alt={name}
                                className="w-full h-64 object-contain"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                            />
                        </div>
                        <div className="w-full bg-slate-50 p-3 rounded-lg text-sm text-slate-700">
                            {breed.tamanio && <div><strong>Tamaño:</strong> {breed.tamanio}</div>}
                            {breed.nivel_energia && <div><strong>Energía:</strong> {breed.nivel_energia}</div>}
                            {breed.aseo && <div><strong>Aseo:</strong> {breed.aseo}</div>}
                            {breed.hipoalergenico !== undefined && (
                                <div><strong>Hipoalergénico:</strong> {breed.hipoalergenico ? "Sí" : "No"}</div>
                            )}
                            {breed.esperanza_vida && (
                                <div><strong>Esperanza de vida:</strong> {breed.esperanza_vida.de} - {breed.esperanza_vida.a} años</div>
                            )}
                        </div>

                        <div className="w-full">
                            <button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">Cerrar</button>
                        </div>
                    </div>

                    <div className="md:col-span-2">

                        <div className="mb-4">
                            {renderMaybe("Origen", breed.origen)}
                            {renderMaybe("Grupo (perros)", breed.grupo)}
                            {renderMaybe("Ejercicio recomendado", breed.ejercicio_horas)}
                            {renderMaybe("Descripción de aseo", breed.descripcion_aseo)}
                        </div>

                        <div className="mb-4">
                            {renderMaybe("Rasgos físicos", breed.rasgos_fisicos)}
                            {renderMaybe("Temperamento", breed.temperamento)}
                            {renderMaybe("Comportamiento", breed.comportamiento)}
                        </div>

                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {breed.tolerancia_soledad && <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{`Soledad: ${breed.tolerancia_soledad}`}</span>}
                                {breed.bueno_con_ninos && <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{`Niños: ${breed.bueno_con_ninos}`}</span>}
                                {breed.buen_con_otras_mascotas && <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{`Otras mascotas: ${breed.buen_con_otras_mascotas}`}</span>}
                                {breed.ladrido && <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{`Ladrido: ${breed.ladrido}`}</span>}
                                {breed.adiestramiento && <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{`Adiestramiento: ${breed.adiestramiento}`}</span>}
                                {breed.jugueton && <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{`Juguetón: ${breed.jugueton}`}</span>}
                                {breed.inteligencia && <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{`Inteligencia: ${breed.inteligencia}`}</span>}
                                {breed.vocalizacion && <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{`Vocal: ${breed.vocalizacion}`}</span>}
                            </div>
                        </div>

                        <div className="mb-4">
                            {renderMaybe("Predisposiciones de salud", breed.predisposiciones_salud)}
                        </div>
                    </div>
                </div>
            </div>

        </dialog >
    );
}