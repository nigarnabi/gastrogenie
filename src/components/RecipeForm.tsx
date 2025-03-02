'use client';

import { useState } from "react";
import { fetchReceipes as serverFetchRecepies } from "@/actions/server/recepies";

 export interface Recipe {
    id: number;
    title: string;
    category: string;
    image: string;
    ingredients: string[];
}
import RecipeList from "./RecipeList";
import IngredientAutocomplete from "../components/IngredientAutocomplete";

export default function RecipeForm() {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]); // Store fetched recipes
    const [loading, setLoading] = useState(false); // Loading state 

    // ✅ Handle ingredient selection
  const handleSelectIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]); // ✅ Add ingredient to array
    }
  };

  // ✅ Remove an ingredient
  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToRemove));
  };

   
     // fetch recipes from API 
     const fetchRecipes = async () => {
        if( !ingredients) return;

        setLoading(true);
        try{ 
            const data = await serverFetchRecepies({ingrideints: ingredients});
            console.log(data);
            
            if (data) {
                // @ts-ignore
                setRecipes(data.map((recipe: any) => ({
                    id: recipe.id,
                    title: recipe.title,
                    category: recipe.strCategory,
                    image: recipe.image,
                    ingredients: [] // Add appropriate ingredients if available
                })));
            } else {
                setRecipes([]);
            }
        } catch (error) {
            console.error("Error fetching rescipes", error);
        } finally {
            setLoading(false);
        }  
     };
     
     return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold mb-4">Find Recipes with Your Ingredients</h2>
    
          {/* Ingredients Input */}
          <div className="mb-4">
            <label className="block font-medium">Enter Ingredients (comma-separated):</label>
            <IngredientAutocomplete onSelect={handleSelectIngredient}/>
            <div>
              {ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="inline-block bg-gray-200 text-gray-700 font-semibold p-2 rounded-lg mt-2 mr-2"
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
    
          {/* Generate Recipe Button */}
          <button
            onClick={fetchRecipes}
            disabled={loading}
            className="w-full bg-blue-500 text-white font-semibold p-2 hover:bg-blue-700 transition rounded mt-4"
          >
            {loading ? "Searching..." : "Find Recipes"}
          </button>
    
          {/* Display Recipes */}
          < RecipeList recipes={recipes} />
        </div>
      );
    }


