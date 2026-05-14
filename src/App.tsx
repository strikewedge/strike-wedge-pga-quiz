import { useState } from "react";
import { Landing } from "./components/Landing";
import { Quiz } from "./components/Quiz";
import { Result } from "./components/Result";
import { Dashboard } from "./components/Dashboard";
import { useAttempt } from "./hooks/useAttempt";
import { tierForScore } from "./data/tiers";
import { track } from "./lib/track";

type Phase = "landing" | "quiz" | "result";

const IS_DASHBOARD =
  typeof window !== "undefined" &&
  window.location.pathname.replace(/\/$/, "") === "/dashboard";

function App() {
  const { attempt, hydrated, save } = useAttempt();
  const [phase, setPhase] = useState<Phase>("landing");
  const [score, setScore] = useState(0);

  if (IS_DASHBOARD) {
    return <Dashboard />;
  }

  if (!hydrated) {
    return <div className="min-h-[100dvh] bg-sw-cream" aria-hidden="true" />;
  }

  if (attempt) {
    return <Result score={attempt.score} alreadyPlayed />;
  }

  if (phase === "landing") {
    return (
      <Landing
        onStart={() => {
          track({ event: "quiz_started" });
          setPhase("quiz");
        }}
      />
    );
  }

  if (phase === "quiz") {
    return (
      <Quiz
        onComplete={(finalScore) => {
          const tier = tierForScore(finalScore);
          save(finalScore, tier.code);
          setScore(finalScore);
          setPhase("result");
        }}
      />
    );
  }

  return <Result score={score} />;
}

export default App;
