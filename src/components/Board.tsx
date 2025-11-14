import type { Breed } from "../types";
import { Card } from "./Card";

interface Props {
    breeds: Breed[];
}

export const Board = ({ breeds }: Props) => {
    console.log(breeds.length);
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-2">
            {breeds.map((breed) => (
                < Card key={breed.name} breed={breed} />
            ))}
        </div>
    )
};