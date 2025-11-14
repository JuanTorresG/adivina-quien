import type { Breed } from "../types";
interface Props {
    breed: Breed;
}

export const Card = ({ breed }: Props) => {
    return (
        <div>
            <button
                type="button"
                className="
        w-36 min-h-56 md:w-48 md:h-56 
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
                <h2 className="text-slate-800 text-xl font-black text-center truncate">
                    {breed.name}
                </h2>
                <img
                    className="w-full rounded-xl object-contain aspect-square"
                    loading="lazy"
                    src={`/${breed.categoria}s/${breed.img}`}
                    alt={breed.name}
                />
            </button>
        </div>
    )
};