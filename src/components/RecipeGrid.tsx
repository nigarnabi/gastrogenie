import { RecipeCard } from "@/components/RecipeCard";
import type { Recipe } from "@/lib/types";

type Props = {
  recipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string) => void;
  favorites: Set<string>;
};

export function RecipeGrid({
  recipes,
  onViewRecipe,
  onToggleFavorite,
  favorites,
}: Props) {
  return (
    // Center the whole section
    <section className="container mx-auto max-w-6xl py-12">
      <header className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Recipes</h2>
        <p className="text-muted-foreground">
          Found {recipes.length} recipes matching your ingredients
        </p>
      </header>

      {/* Auto-fit grid centers nicely at any width */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onViewRecipe={onViewRecipe}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.has(recipe.id)}
          />
        ))}
      </div>
    </section>
  );
}
