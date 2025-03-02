'use client';
import { useState, useEffect } from "react";
import { fetchIngredients as serverFetchIngredients } from "@/actions/server/recepies";


interface AutocompleteProps {
    onSelect: (ingredient: string) => void;
}
 export default function IngredientAutocomplete ({ onSelect }: AutocompleteProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch ingredients from API

    useEffect(() => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        const fetchIngredients = async () => {
            setLoading(true);
            try{
                const data = await serverFetchIngredients({query}); // call serverFetchIngredients with query
                setSuggestions(data.map((ingredient: any) => (
                    ingredient.name
            )));
            } catch (error) {
                console.error("Error fetching ingredients", error);
            } finally {
                setLoading(false);
            };
        };
        
        const debounce = setTimeout(() => {
            fetchIngredients();
        }, 300);

        
        
    }, [query]);

    return (
        <div className="relative">
            {/* Input Ingredients */}
            <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder=".g., chicken, tomato, cheese"
                className="w-full border p-2 rounded-lg shadow-sm"
                />
            {/* Suggestions */}
            {suggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto shadow-lg" >
                    {suggestions.map((ingredient) => (
                        <li
                        key={ingredient}
                        onClick = {() => {
                            onSelect(ingredient);
                            setQuery("");
                            setSuggestions([]);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {ingredient}

                        </li>
                    ))}
                </ul>
            )}
            

    
        </div>
    );
 }

