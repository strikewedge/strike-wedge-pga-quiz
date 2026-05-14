import { useEffect, useState } from "react";

const STORAGE_KEY = "strike_wedge_pga_quiz_2026";

export type Attempt = {
  completed: true;
  score: number;
  code: string;
  timestamp: string;
};

function readAttempt(): Attempt | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attempt;
    if (parsed && parsed.completed && typeof parsed.score === "number" && typeof parsed.code === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function useAttempt() {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAttempt(readAttempt());
    setHydrated(true);
  }, []);

  const save = (score: number, code: string) => {
    const next: Attempt = {
      completed: true,
      score,
      code,
      timestamp: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage may be disabled (Safari private). Still let the UI proceed.
    }
    setAttempt(next);
  };

  return { attempt, hydrated, save };
}
