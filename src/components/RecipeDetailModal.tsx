"use client";

import { X, Clock, Users, Heart, Copy, Share2, Check } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

type Props = {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite: (recipeId: string) => void;
  isFavorite: boolean;
};

export function RecipeDetailModal({
  recipe,
  open,
  onOpenChange,
  onToggleFavorite,
  isFavorite,
}: Props) {
  const [copied, setCopied] = useState(false);
  if (!recipe) return null;

  const allIngredients = [
    ...(recipe.extendedIngredients ?? []),
    ...(recipe.usedIngredients ?? []).map((ing) => ({
      ...ing,
      original:
        ing.original ??
        `${ing.amount ?? ""} ${ing.unit ?? ""} ${ing.name}`.trim(),
    })),
    ...(recipe.missedIngredients ?? []).map((ing) => ({
      ...ing,
      original:
        ing.original ??
        `${ing.amount ?? ""} ${ing.unit ?? ""} ${ing.name}`.trim(),
    })),
  ];

  const unique = allIngredients.filter(
    (ing, i, self) =>
      i ===
      self.findIndex((t) => t.name.toLowerCase() === ing.name.toLowerCase())
  );
  const usedNames = new Set(
    (recipe.usedIngredients ?? []).map((x) => x.name.toLowerCase())
  );

  const copyIngredients = () => {
    const text = unique
      .map(
        (ing) =>
          ing.original ||
          `${ing.amount ?? ""} ${ing.unit ?? ""} ${ing.name}`.trim()
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } catch {
        // ignore
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const instructions =
    recipe.instructions ||
    `1. Prepare all ingredients.\n2. Cook according to standard steps for this dish.\n3. Season and serve.\n4. Enjoy ${recipe.title}!`;
  const steps = instructions.split("\n").filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{recipe.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[90vh]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all"
              aria-label="Close"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-balance leading-tight">
                {recipe.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {recipe.isVegan && <Badge variant="secondary">Vegan</Badge>}
                {recipe.isVegetarian && !recipe.isVegan && (
                  <Badge variant="secondary">Vegetarian</Badge>
                )}
                {recipe.isGlutenFree && (
                  <Badge variant="secondary">Gluten Free</Badge>
                )}
                {recipe.isDairyFree && (
                  <Badge variant="secondary">Dairy Free</Badge>
                )}
                {recipe.readyInMinutes && recipe.readyInMinutes < 20 && (
                  <Badge variant="secondary">Quick</Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              {recipe.readyInMinutes && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {recipe.readyInMinutes} minutes
                    </div>
                    <div className="text-muted-foreground">Total time</div>
                  </div>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {recipe.servings} servings
                    </div>
                    <div className="text-muted-foreground">Serves</div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ingredients</h3>
              <ul className="space-y-2">
                {unique.map((ing, idx) => {
                  const used = usedNames.has(ing.name.toLowerCase());
                  return (
                    <li
                      key={`${ing.name}-${idx}`}
                      className={cn(
                        "flex items-start gap-3 p-2 rounded-lg transition-colors",
                        used && "bg-secondary/30"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0",
                          used ? "bg-secondary" : "bg-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "flex-1",
                          used && "font-medium text-secondary-foreground"
                        )}
                      >
                        {ing.original ||
                          `${ing.amount ?? ""} ${ing.unit ?? ""} ${
                            ing.name
                          }`.trim()}
                      </span>
                      {used && (
                        <Badge
                          variant="outline"
                          className="text-xs border-secondary text-secondary-foreground"
                        >
                          You have this
                        </Badge>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Preparation Steps</h3>
              <ol className="space-y-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      {i + 1}
                    </div>
                    <p className="flex-1 pt-1 leading-relaxed">
                      {step.replace(/^\d+\.\s*/, "")}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => onToggleFavorite(recipe.id)}
                variant={isFavorite ? "default" : "outline"}
                className="flex-1 gap-2"
              >
                <Heart
                  className={cn("h-4 w-4", isFavorite && "fill-current")}
                />
                {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
              </Button>
              <Button
                onClick={copyIngredients}
                variant="outline"
                className="flex-1 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Ingredients
                  </>
                )}
              </Button>
              <Button onClick={share} variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
