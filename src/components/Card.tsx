import type { Breed } from "../types";

interface Props {
    breed: Breed;
    onOpen?: (breed: Breed) => void;
}

export const Card = ({ breed, onOpen }: Props) => {
    const displayName = breed.nombre ?? "Sin nombre";
    const category = breed.categoria;
    const imgPath = `/${category}s/${breed.img}`;

    return (
        <div>
            <button
                type="button"
                onClick={() => onOpen?.(breed)}
                className="
                            w-36 min-h-56 md:w-48 md:h-5
                            flex flex-col items-center justify-start gap-0.5
                            bg-white/30 
                            backdrop-blur-sm
                            border border-white/50 
                            rounded-2xl p-4
                            shadow-lg
                            transition-all duration-300 ease-in-out 
                            transform
                            hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl 
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-blue-500
                            focus-visible:ring-offset-2
                            focus-visible:ring-offset-slate-100
                        "
            >
                <h2 className="text-slate-800 text-lg md:text-xl font-black text-center truncate w-full">
                    {displayName}
                </h2>

                <div className="w-full mt-2 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: 120 }}>
                    <img
                        className="w-full h-full object-cover"
                        loading="lazy"
                        src={imgPath}
                        alt={displayName}
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                    />
                </div>
            </button>
        </div>
    );
};