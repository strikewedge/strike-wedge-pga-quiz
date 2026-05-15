import { useState } from "react";
import { Landing } from "./components/Landing";
import { Quiz } from "./components/Quiz";
import { Result } from "./components/Result";
import { Dashboard } from "./components/Dashboard";
import { useAttempt } from "./hooks/useAttempt";
import { tierForScore } from "./data/tiers";
import { assignVariant, type Variant } from "./data/questions";
import { track } from "./lib/track";

type Phase = "landing" | "quiz" | "result";

const IS_DASHBOARD =
  typeof window !== "undefined" &&
  window.location.pathname.replace(/\/$/, "") === "/dashboard";

function App() {
  const { attempt, hydrated, save } = useAttempt();
  const [phase, setPhase] = useState<Phase>("landing");
  const [score, setScore] = useState(0);
  const [variant, setVariant] = useState<Variant | null>(null);

  if (IS_DASHBOARD) {
    return <Dashboard />;
  }

  if (!hydrated) {
    return <div className="min-h-[100dvh] bg-sw-cream" aria-hidden="true" />;
  }

  if (attempt) {
    return (
      <Result
        score={attempt.score}
        variant={attempt.variant}
        alreadyPlayed
      />
    );
  }

  if (phase === "landing") {
    return (
      <Landing
        onStart={() => {
          const v = assignVariant();
          setVariant(v);
          track({ event: "quiz_started", variant: v });
          setPhase("quiz");
        }}
      />
    );
  }

  if (phase === "quiz" && variant) {
    return (
      <Quiz
        variant={variant}
        onComplete={(finalScore) => {
          const tier = tierForScore(finalScore);
          save(finalScore, tier.code, variant);
          setScore(finalScore);
          setPhase("result");
        }}
      />
    );
  }

  return <Result score={score} variant={variant ?? undefined} />;
}

export default App;
