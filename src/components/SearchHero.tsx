"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DietaryFilter } from "@/lib/types";
import IngredientChipInput from "@/components/inputs/IngredientChipInput";

type Props = {
  onSearch: (ingredients: string[], filters: DietaryFilter[]) => void;
  onSurpriseMe: () => void;
};

const FILTERS: { id: DietaryFilter; label: string }[] = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "quick", label: "Quick (<20 min)" },
  { id: "high-protein", label: "High Protein" },
];

export function SearchHero({ onSearch, onSurpriseMe }: Props) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<DietaryFilter[]>([]);

  const toggleFilter = (f: DietaryFilter) =>
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const handleSearch = () => {
    if (ingredients.length > 0) onSearch(ingredients, activeFilters);
  };

  return (
    <>
      {/* Fill the viewport (minus ~4rem navbar), center the card */}
      <section className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          <Card className="p-8 border border-border/50 rounded-2xl shadow-sm">
            <div className="space-y-6">
              {/* Centered heading + subheading */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Find Recipes with Your Ingredients
                </h1>
                <p className="text-muted-foreground">
                  Enter ingredients you have and discover delicious recipes you
                  can make
                </p>
              </div>

              {/* Chip input with soft surface + clear focus ring */}
              <div className="space-y-3">
                <div className="relative">
                  <div
                    className="flex flex-wrap gap-2 min-h-[48px] p-2 rounded-xl
                               bg-muted border border-border/60
                               focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
                               transition-all"
                  >
                    <IngredientChipInput
                      ingredients={ingredients}
                      setIngredients={setIngredients}
                      placeholder="e.g., chicken, tomato, cheese"
                      onSubmit={handleSearch}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Press Enter, comma, or space to add ingredients
                </p>
              </div>

              {/* Dietary Filters */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {FILTERS.map((f) => (
                    <Button
                      key={f.id}
                      variant={
                        activeFilters.includes(f.id) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => toggleFilter(f.id)}
                      className={cn(
                        "rounded-full transition-all",
                        activeFilters.includes(f.id) && "shadow-md"
                      )}
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSearch}
                  disabled={ingredients.length === 0}
                  size="lg"
                  className="flex-1 gap-2 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >
                  <Search className="h-4 w-4" />
                  Find Recipes
                </Button>
                <Button
                  onClick={onSurpriseMe}
                  variant="outline"
                  size="lg"
                  className="gap-2 rounded-xl hover:bg-accent transition-all bg-transparent"
                >
                  <Sparkles className="h-4 w-4" />
                  Surprise Me
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
