"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

const BASE_COUNT = 3200;
const STORAGE_KEY = "urbansafe_count";
const VISITED_KEY = "urbansafe_visited";

// Contador cosmético, sin backend: incrementa una vez por navegador vía
// localStorage sobre una base plausible. No refleja tráfico real del servidor.
export function VisitorCounter() {
  const [count, setCount] = useState(BASE_COUNT);

  useEffect(() => {
    try {
      let stored = Number(localStorage.getItem(STORAGE_KEY) || BASE_COUNT);
      if (!localStorage.getItem(VISITED_KEY)) {
        stored += 1;
        localStorage.setItem(VISITED_KEY, "1");
        localStorage.setItem(STORAGE_KEY, String(stored));
      }
      setCount(stored);
    } catch {
      setCount(BASE_COUNT);
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-safe" />
      <AnimatedCounter end={count} className="text-sm text-muted-foreground" />
      <span>domiciliarios ya se registraron</span>
    </div>
  );
}
