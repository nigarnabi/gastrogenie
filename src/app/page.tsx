"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigation } from "@/components/Navigation";
import { SearchHero } from "@/components/SearchHero";
import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeGridSkeleton } from "@/components/RecipeSkeleton";
import { RecipeDetailModal } from "@/components/RecipeDetailModal";
import { fetchReceipes as serverFetchReceipes } from "@/actions/server/recipes";
import { addFavorite, removeFavorite } from "@/features/recipeSlice";
import type { RootState } from "@/store/store";
import type { DietaryFilter, Recipe } from "@/lib/types";
import { toast } from "sonner";

export default function HomePage() {
  const dispatch = useDispatch();
  const favoritesArr = useSelector((s: RootState) => s.recipe.favorites);
  const favorites = useMemo(
    () => new Set(favoritesArr.map((f) => f.id)),
    [favoritesArr]
  );

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const onToggleFavorite = (id: string) => {
    if (favorites.has(id)) {
      dispatch(removeFavorite(id));
    } else {
      const r = recipes.find((x) => x.id === id);
      if (r)
        dispatch(
          addFavorite({
            id: r.id,
            name: r.title,
            image: r.image,
            ingredients: [],
          })
        );
    }
  };

  const onViewRecipe = (r: Recipe) => {
    setSelected(r);
    setModalOpen(true);
  };

  const onSearch = async (ings: string[], filters: DietaryFilter[]) => {
    setHasSearched(true);
    if (ings.length === 0) return;
    setLoading(true);
    try {
      const data = await serverFetchReceipes({ ingrideints: ings, number: 18 });
      const mapped: Recipe[] = (data ?? []).map((d: any) => ({
        id: String(d.id),
        title: d.title,
        image: d.image,
        usedIngredientCount:
          d.usedIngredientCount ?? d.usedIngredients?.length ?? 0,
        missedIngredientCount:
          d.missedIngredientCount ?? d.missedIngredients?.length ?? 0,
        usedIngredients: (d.usedIngredients ?? []).map((x: any) => ({
          name: x.name,
          amount: x.amount,
          unit: x.unit,
          original: x.original,
        })),
        missedIngredients: (d.missedIngredients ?? []).map((x: any) => ({
          name: x.name,
          amount: x.amount,
          unit: x.unit,
          original: x.original,
        })),
        readyInMinutes: d.readyInMinutes ?? null,
        servings: d.servings ?? null,
        rating: d.spoonacularScore ? d.spoonacularScore / 20 : null,
        calories: d.calories ?? null,
        isVegan: d.vegan ?? false,
        isVegetarian: d.vegetarian ?? false,
        isGlutenFree: d.glutenFree ?? false,
        isDairyFree: d.dairyFree ?? false,
      }));

      // (optional) simple client-side filters
      const filtered = mapped.filter((r) =>
        filters.every((f) => {
          if (f === "vegan") return r.isVegan;
          if (f === "vegetarian") return r.isVegetarian || r.isVegan;
          if (f === "quick") return (r.readyInMinutes ?? 999) < 20;
          if (f === "high-protein") return true;
          return true;
        })
      );

      setRecipes(filtered);
    } finally {
      setLoading(false);
    }
  };

  const onSurpriseMe = () => {
    const presets = [
      ["chicken", "tomato", "basil"],
      ["egg", "spinach", "cheese"],
      ["rice", "shrimp", "garlic"],
    ];
    const pick = presets[Math.floor(Math.random() * presets.length)];
    onSearch(pick, []);
  };

  const showEmptyCentered = hasSearched && !loading && recipes.length === 0;

  return (
    <main>
      <Navigation />

      {/* Centered hero */}
      <SearchHero onSearch={onSearch} onSurpriseMe={onSurpriseMe} />

      {/* Results / Loading / Empty — each centered in its own viewport */}
      {loading ? (
        <RecipeGridSkeleton />
      ) : recipes.length > 0 ? (
        <RecipeGrid
          recipes={recipes}
          onViewRecipe={onViewRecipe}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
        />
      ) : showEmptyCentered ? (
        <section className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4">
          <div className="text-center max-w-xl">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full border flex items-center justify-center">
              👩‍🍳
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Start by adding a few ingredients
            </h3>
            <p className="text-muted-foreground">
              We’ll find recipes you can make with what’s already in your
              kitchen.
            </p>
          </div>
        </section>
      ) : null}

      <RecipeDetailModal
        recipe={selected}
        open={modalOpen}
        onOpenChange={(o) => (setModalOpen(o), !o && setSelected(null))}
        onToggleFavorite={onToggleFavorite}
        isFavorite={selected ? favorites.has(selected.id) : false}
      />
    </main>
  );
}
