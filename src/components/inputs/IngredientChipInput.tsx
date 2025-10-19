"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fetchIngredients as serverFetchIngredients } from "@/actions/server/recipes";

type Props = {
  ingredients: string[];
  setIngredients: (ings: string[]) => void;
  placeholder?: string;
  onSubmit?: () => void; // <-- NEW: trigger search on Enter when input is empty
};

export default function IngredientChipInput({
  ingredients,
  setIngredients,
  placeholder,
  onSubmit,
}: Props) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const normalized = (s: string) => s.trim().toLowerCase();

  const addIngredient = (raw: string) => {
    const v = normalized(raw);
    if (!v) return;
    if (!ingredients.includes(v)) setIngredients([...ingredients, v]);
    setValue("");
    setOpen(false);
    setHighlight(-1);
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter((x) => x !== ing));
  };

  // Debounced suggestions
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const id = setTimeout(async () => {
      try {
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        const res = await serverFetchIngredients({ query: value, number: 8 });
        const names = (res ?? [])
          .map((x: any) => String(x.name || "").toLowerCase())
          .filter(Boolean);
        setSuggestions(names);
        setOpen(names.length > 0);
        setHighlight(0);
      } catch {
        /* ignore */
      }
    }, 280);

    return () => clearTimeout(id);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlight(-1);
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const filtered = useMemo(
    () => suggestions.filter((s) => !ingredients.includes(s)),
    [suggestions, ingredients]
  );

  return (
    <div className="relative" ref={boxRef}>
      <div className="flex flex-wrap gap-2 min-h-[44px]">
        {ingredients.map((ing) => (
          <Badge
            key={ing}
            variant="secondary"
            className="gap-1 pl-3 pr-2 py-1.5 text-sm capitalize"
          >
            {ing}
            <button
              onClick={() => removeIngredient(ing)}
              className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${ing}`}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (value.trim()) {
                // add chip if user typed something
                addIngredient(value);
              } else {
                // nothing typed -> submit search
                onSubmit?.();
              }
            } else if (e.key === "," || e.key === " ") {
              e.preventDefault();
              addIngredient(value);
            } else if (
              e.key === "Backspace" &&
              !value &&
              ingredients.length > 0
            ) {
              removeIngredient(ingredients[ingredients.length - 1]);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight((h) => Math.min(h + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={
            ingredients.length === 0
              ? placeholder ?? "e.g., chicken, tomato, cheese"
              : "Add more…"
          }
          className="flex-1 min-w-[180px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none px-2"
        />
      </div>

      {open && filtered.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md"
        >
          {filtered.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={i === highlight}
              className={cn(
                "cursor-pointer select-none rounded-sm px-3 py-2 text-sm capitalize outline-none",
                i === highlight
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent"
              )}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => addIngredient(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
