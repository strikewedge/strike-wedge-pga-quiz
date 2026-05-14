import { questions } from "../data/questions";
import { tierForScore } from "../data/tiers";
import { discountUrl, SALE_END_LABEL } from "../data/discount";
import { Logo } from "./Logo";

type Props = {
  score: number;
  alreadyPlayed?: boolean;
};

export function Result({ score, alreadyPlayed = false }: Props) {
  const tier = tierForScore(score);
  const url = discountUrl(tier.code);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-sw-cream">
      <header className="px-5 pt-6 pb-2 text-sw-green-deep">
        <Logo />
      </header>

      <main className="flex-1 flex flex-col justify-center px-5 py-6 max-w-md w-full mx-auto fade-up">
        {alreadyPlayed && (
          <p className="text-xs font-semibold uppercase tracking-widest text-sw-ink/55 mb-3">
            You've already played
          </p>
        )}

        <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-sw-green font-semibold mb-2">
          {tier.headline}
        </p>

        <h1 className="font-display font-extrabold leading-[1.02] tracking-tight text-sw-ink text-[40px] sm:text-5xl">
          You got {score} out of {questions.length}.
        </h1>

        <div className="mt-6 rounded-3xl bg-sw-green-deep text-sw-cream p-6 sm:p-7 shadow-xl shadow-sw-green-deep/20">
          <p className="text-sm uppercase tracking-widest text-sw-cream/70 font-semibold">
            Unlocked
          </p>
          <p className="font-display font-extrabold text-6xl sm:text-7xl leading-none mt-1">
            {tier.discount}% <span className="text-sw-gold">off</span>
          </p>
          <p className="mt-4 text-sw-cream/80 text-sm">
            Auto-applies at checkout. Code:{" "}
            <span className="font-mono font-semibold text-sw-cream tracking-wide">
              {tier.code}
            </span>
          </p>
        </div>

        <a
          href={url}
          className="mt-6 w-full inline-flex items-center justify-center bg-sw-ink hover:bg-sw-green-deep text-sw-cream font-display font-bold text-lg sm:text-xl py-5 rounded-2xl shadow-lg shadow-sw-ink/20 transition-colors active:scale-[0.99]"
        >
          Claim {tier.discount}% off →
        </a>

        <p className="text-center text-xs text-sw-ink/55 mt-4">
          {SALE_END_LABEL}
        </p>
      </main>
    </div>
  );
}
