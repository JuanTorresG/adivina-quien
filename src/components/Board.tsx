import { useState } from "react";
import type { Breed } from "../types";
import { Card } from "./Card";
import { BreedModal } from "./BreedModal";

interface Props {
    breeds: Breed[];
}

export const Board = ({ breeds }: Props) => {
    const [selected, setSelected] = useState<Breed | null>(null);

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-2">
                {breeds.map((breed) => (
                    <Card key={breed.nombre} breed={breed} onOpen={setSelected} />
                ))}
            </div>

            <BreedModal breed={selected} onClose={() => setSelected(null)} />
        </>
    );
};