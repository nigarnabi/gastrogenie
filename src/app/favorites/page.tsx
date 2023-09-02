"use client";

import { useSelector,useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { Recipe, removeFavorite } from "../../features/recipeSlice";
import { addFavorite } from "../../features/recipeSlice";
import { useEffect, useState } from "react";


export default function Favorites() {
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.recipe.favorites);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
      if (typeof window !== "undefined") {
        
        setLoading(true);
      }
      }, []);

      if (!loading) {
        return <p>Loading...</p>;
      }
    
    return (
        <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Favorite Recipes</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <div key={Math.random()} className="border p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg">{recipe.name}</h3>
              <img src={recipe.image} alt={recipe.name} className="w-full rounded-md mt-2" />

              <button
                onClick={() => dispatch(removeFavorite(recipe.id || recipe.name))}
                className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
    
}



