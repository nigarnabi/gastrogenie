import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Load favorite recipes from local storage
const loadFavorites = () => {
  if (typeof window === "undefined") return [];
  const savedFavorites = localStorage.getItem("favorites");
  return savedFavorites ? JSON.parse(savedFavorites) : [];
};


export interface Recipe {
  id: string;
  name: string;
  image: string; 
  ingredients: string[];
}

interface RecipeState {
  favorites: Recipe[]; // Store favorite recipes instead
}

const initialState: RecipeState = {
  favorites: loadFavorites(),
}

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<Recipe>) {
      state.favorites.push(action.payload);
      localStorage.setItem("favorites", JSON.stringify(state.favorites)); // Save to local storage  
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.favorites = state.favorites.filter(recipe => recipe.id !== action.payload);
      localStorage.setItem("favorites", JSON.stringify(state.favorites)); // Save to local storage
    },
  },
});

export const { addFavorite, removeFavorite } = recipeSlice.actions;
export default recipeSlice.reducer;
