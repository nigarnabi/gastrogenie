// Basic app-wide types mapped to Spoonacular "findByIngredients" + /recipes/{id}/information shape

export type DietaryFilter = "vegan" | "vegetarian" | "quick" | "high-protein";

export type IngredientBrief = {
  id?: number | string;
  name: string;
  amount?: number;
  unit?: string;
  original?: string;
};

export type Recipe = {
  id: string;
  title: string;
  image: string;
  // findByIngredients fields
  usedIngredientCount: number;
  missedIngredientCount: number;
  usedIngredients: IngredientBrief[];
  missedIngredients: IngredientBrief[];
  // optional detail/enrichment fields
  readyInMinutes?: number | null;
  servings?: number | null;
  rating?: number | null;
  calories?: number | null;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  extendedIngredients?: IngredientBrief[];
  instructions?: string | null;
};
