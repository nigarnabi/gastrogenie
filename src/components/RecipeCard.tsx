"use client";

import { useState } from "react";
import { Heart, Clock, Star, Flame } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

type Props = {
  recipe: Recipe;
  onViewRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string) => void;
  isFavorite: boolean;
};

export function RecipeCard({
  recipe,
  onViewRecipe,
  onToggleFavorite,
  isFavorite,
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
  const pct = total > 0 ? (recipe.usedIngredientCount / total) * 100 : 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.title}
          className={cn(
            "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isFavorite && "fill-destructive text-destructive"
            )}
          />
        </button>

        {(recipe.isVegan || recipe.isVegetarian) && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {recipe.isVegan && <Badge variant="secondary">Vegan</Badge>}
            {recipe.isVegetarian && !recipe.isVegan && (
              <Badge variant="secondary">Vegetarian</Badge>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-balance group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {recipe.readyInMinutes && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{recipe.readyInMinutes} min</span>
            </div>
          )}
          {typeof recipe.rating === "number" && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>{recipe.rating.toFixed(1)}</span>
            </div>
          )}
          {recipe.calories && (
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4" />
              <span>{recipe.calories} cal</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ingredient Match</span>
            <span className="font-medium">
              {recipe.usedIngredientCount}/{total}
            </span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onViewRecipe(recipe)}
          className="w-full"
          variant="outline"
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
