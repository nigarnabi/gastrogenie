" use client";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "@/features/recipeSlice";
import { RootState } from "../store/store"
import { Recipe } from "./RecipeForm";



export default function RecipeList( {recipes}: {recipes: Recipe[]}) {
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.recipe.favorites);

    // check if recipe is already a favorite
    const isFavorite = (id:number) => favorites.some((recipe) => recipe.id === id.toString());

    return (
        <div className="mt-6">
            <h1 className="text-3xl text-bold font-semibold mb-4" >Recipes</h1>
            {recipes.length === 0 ? (
                 <p className="text-gray-500">No recipes found. Try different ingredients.</p>
            ):(
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="border border-gray-300  p-4 rounded-lg shadow-md">
                            <h4 className="font-semibold text-gray-700 text-lg ">{recipe.title}</h4>
                            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded-md mt-2" />
                            
                            {/* //save or remove favorite */}
                            <button
                            onClick={() => 
                                isFavorite(recipe.id) ? 
                                dispatch(removeFavorite(recipe.id.toString())) :
                                dispatch(addFavorite({ id: recipe.id.toString(), name: recipe.title, image: recipe.image, ingredients: [] }))
                            }
                            className={`mt-2 w-full ${
                                isFavorite(recipe.id) ? "bg-red-500" : "bg-blue-500"
                              } text-white py-2 rounded-lg hover:opacity-80 transition`}
                            >
                                {isFavorite(recipe.id) ? "Remove Favorite" : "Add Favorite"}
                            </button>
                        </div>
                        ))}
                </div>
                    )}

        </div>
);


}