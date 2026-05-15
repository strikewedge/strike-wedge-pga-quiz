import { useCallback, useMemo, useRef, useState } from "react";
import { getQuestions, type Variant } from "../data/questions";
import { tierForScore } from "../data/tiers";
import { useCountdown, formatTime } from "../hooks/useCountdown";
import { track } from "../lib/track";

type Props = {
  variant: Variant;
  onComplete: (score: number) => void;
};

const TOTAL_SECONDS = 60;
const URGENT_THRESHOLD = 10;

export function Quiz({ variant, onComplete }: Props) {
  const questions = useMemo(() => getQuestions(variant), [variant]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const firedRef = useRef(false);

  const finish = useCallback(
    (finalScore: number, finalAnswers: boolean[], timedOut: boolean) => {
      if (firedRef.current) return;
      firedRef.current = true;
      const tier = tierForScore(finalScore).discount;
      track({
        event: "quiz_finished",
        score: finalScore,
        tier,
        timedOut,
        answers: finalAnswers,
        variant,
      });
      onComplete(finalScore);
    },
    [onComplete, variant]
  );

  const remaining = useCountdown(TOTAL_SECONDS, true, () =>
    finish(score, answers, true)
  );

  const handlePick = (optionIndex: number) => {
    if (picked !== null) return;
    setPicked(optionIndex);
    const current = questions[index];
    const correct = optionIndex === current.correctIndex;
    const nextAnswers = [...answers, correct];
    setAnswers(nextAnswers);
    const nextScore = correct ? score + 1 : score;
    if (correct) setScore(nextScore);

    window.setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= questions.length) {
        finish(nextScore, nextAnswers, false);
        return;
      }
      setIndex(nextIndex);
      setPicked(null);
    }, 280);
  };

  const current = questions[index];
  const urgent = remaining <= URGENT_THRESHOLD;
  const progressPct = ((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 100;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-sw-cream">
      <header
        className={`sticky top-0 z-10 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 ${
          urgent ? "bg-sw-red text-sw-cream" : "bg-sw-green-deep text-sw-cream"
        } transition-colors duration-300`}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-baseline justify-between">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest opacity-80">
              Question {index + 1} of {questions.length}
            </span>
            <span
              className={`font-display font-extrabold tabular-nums text-[42px] sm:text-5xl leading-none ${
                urgent ? "timer-pulse" : ""
              }`}
              aria-live={urgent ? "assertive" : "off"}
            >
              {formatTime(remaining)}
            </span>
          </div>
          <div className="mt-3 h-1.5 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-sw-cream transition-[width] duration-100 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md w-full mx-auto flex flex-col">
        <h2
          key={current.id}
          className="font-display font-bold text-2xl sm:text-3xl leading-tight text-sw-ink fade-up"
        >
          {current.question}
        </h2>

        <ol className="mt-6 space-y-3" key={`opts-${current.id}`}>
          {current.options.map((option, i) => {
            const isPicked = picked === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handlePick(i)}
                  disabled={picked !== null}
                  className={`w-full text-left flex items-center gap-3 min-h-[64px] px-4 py-4 rounded-2xl border-2 font-medium text-[17px] sm:text-lg transition-all active:scale-[0.99] disabled:cursor-default ${
                    isPicked
                      ? "border-sw-green-deep bg-sw-green-deep text-sw-cream"
                      : picked !== null
                      ? "border-sw-stone bg-white text-sw-ink/45"
                      : "border-sw-stone bg-white text-sw-ink hover:border-sw-green-deep"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-full font-display font-bold text-sm ${
                      isPicked
                        ? "bg-sw-cream text-sw-green-deep"
                        : "bg-sw-stone text-sw-ink"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="leading-snug">{option}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
