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
        if (v === undefined || v === null) return null;
        if (typeof v === "string" && v.trim() === "") return null;
        if (Array.isArray(v) && v.length === 0) return null;

        return (
            <div className="mb-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
                <div className="text-sm text-slate-700 mt-1 leading-relaxed">
                    {Array.isArray(v) ? (
                        <ul className="list-disc list-inside space-y-1">
                            {v.map((item, i) => (
                                <li key={i}>{String(item)}</li>
                            ))}
                        </ul>
                    ) : (
                        String(v)
                    )}
                </div>
            </div>
        );
    };

    const renderBadge = (label: string, value?: string | string[] | number | boolean | undefined) => {
        if (value === undefined || value === null) return null;
        // If it's an array take first or join
        const display =
            Array.isArray(value) ? (value.length === 1 ? String(value[0]) : String(value.join(", "))) : String(value);

        if (!display || display === "undefined") return null;

        return (
            <div className="flex flex-col bg-slate-50 p-2 rounded border border-slate-100 min-w-[120px] text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">{label}</span>
                <span className="text-sm font-medium text-slate-800 capitalize mt-1 wrap-break-words">{display}</span>
            </div>
        );
    };

    return (
        <dialog
            open
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent w-full h-full"
            aria-label={`Detalles de ${name}`}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true" />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header Sticky */}
                <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-20">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{name}</h3>
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1 capitalize">
                            {category}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        aria-label="Cerrar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Columna Izquierda: Imagen y Stats Principales */}
                        <div className="md:col-span-5 flex flex-col gap-4">
                            <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                                <img
                                    src={imgPath}
                                    alt={name}
                                    className="w-full h-64 object-cover object-center"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/400?text=No+Image";
                                    }}
                                />
                            </div>

                            {/* Panel de Atributos Clave (rejilla responsive) */}
                            <div className="grid grid-cols-2 gap-2">
                                {renderBadge("Tamaño", breed.tamanio)}
                                {renderBadge("Energía", breed.nivel_energia)}
                                {renderBadge("Aseo", breed.aseo)}
                                {renderBadge("Muda", breed.muda)}
                                {renderBadge("Ejercicio", breed.necesidad_ejercicio)}
                                {renderBadge("Adiestramiento", breed.adiestramiento)}
                                <div className="flex flex-col bg-slate-50 p-2 rounded border border-slate-100 text-center">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold">Hipoalerg.</span>
                                    <span className={`text-sm font-medium capitalize ${breed.hipoalergenico ? "text-green-600" : "text-slate-800"}`}>
                                        {breed.hipoalergenico ? "Sí" : "No"}
                                    </span>
                                </div>

                                {breed.esperanza_vida && (
                                    <div className="col-span-2 bg-blue-50 p-2 rounded text-center border border-blue-100">
                                        <span className="text-[10px] text-blue-500 uppercase font-bold">Esperanza de Vida</span>
                                        <div className="text-sm font-medium text-blue-900">
                                            {breed.esperanza_vida.de} - {breed.esperanza_vida.a} años
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Columna Derecha: Detalles y Texto */}
                        <div className="md:col-span-7 space-y-6">
                            {/* Información General */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {renderMaybe("Origen", breed.origen)}
                                {renderMaybe("Grupo", breed.grupo)}
                                {renderMaybe("Rasgos Tags", breed.rasgos_tags)}
                                {renderMaybe("Rasgos Físicos", breed.rasgos_fisicos)}
                            </div>

                            <hr className="border-slate-100" />

                            {/* Temperamento y Comportamiento */}
                            <div className="space-y-4">
                                {renderMaybe("Temperamento", breed.temperamento)}
                                {renderMaybe("Comportamiento", breed.comportamiento)}
                                {renderMaybe("Familiar", breed.familiar)}
                                {renderMaybe("Vocalización", breed.vocalizacion)}
                            </div>

                            <hr className="border-slate-100" />

                            {/* Cuidados y Salud */}
                            <div className="space-y-4">
                                {renderMaybe("Rutina de Ejercicio (horas)", breed.ejercicio_horas)}
                                {renderMaybe("Necesidad de Ejercicio", breed.necesidad_ejercicio)}
                                {renderMaybe("Cuidados de Aseo", breed.descripcion_aseo)}
                                {renderMaybe("Aseo (nivel)", breed.aseo)}
                                {renderMaybe("Muda (nivel)", breed.muda)}
                                {renderMaybe("Predisposiciones de Salud", breed.predisposiciones_salud)}
                            </div>

                            <hr className="border-slate-100" />

                            {/* Badges de Comportamiento Social (Niveles) */}
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Sociabilidad</h4>
                                <div className="flex flex-wrap gap-2">
                                    {breed.tolerancia_soledad && (
                                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 shadow-sm">
                                            Soledad: <strong>{breed.tolerancia_soledad}</strong>
                                        </span>
                                    )}
                                    {breed.bueno_con_ninos && (
                                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 shadow-sm">
                                            Niños: <strong>{breed.bueno_con_ninos}</strong>
                                        </span>
                                    )}
                                    {(breed.buen_con_otras_mascotas || breed.acepta_otras_mascotas) && (
                                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 shadow-sm">
                                            Otras Mascotas: <strong>{breed.buen_con_otras_mascotas ?? breed.acepta_otras_mascotas}</strong>
                                        </span>
                                    )}
                                    {breed.ladrido && (
                                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 shadow-sm">
                                            Ladrido: <strong>{breed.ladrido}</strong>
                                        </span>
                                    )}
                                    {breed.vocalizacion && (
                                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 shadow-sm">
                                            Vocalización: <strong>{breed.vocalizacion}</strong>
                                        </span>
                                    )}
                                    {breed.adiestramiento && (
                                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 shadow-sm">
                                            Adiestramiento: <strong>{breed.adiestramiento}</strong>
                                        </span>
                                    )}
                                    {breed.inteligencia && (
                                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 shadow-sm">
                                            Inteligencia: <strong>{breed.inteligencia}</strong>
                                        </span>
                                    )}
                                    {breed.jugueton && (
                                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 shadow-sm">
                                            Juguetón: <strong>{breed.jugueton}</strong>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default BreedModal;
