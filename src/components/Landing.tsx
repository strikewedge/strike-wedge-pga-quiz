import { Logo } from "./Logo";

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-sw-cream">
      <header className="px-5 pt-6 pb-2 text-sw-green-deep">
        <Logo />
      </header>

      <main className="flex-1 flex flex-col justify-center px-5 py-6 max-w-md w-full mx-auto fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-sw-green font-semibold mb-3">
          Major championship sale
        </p>

        <h1 className="font-display font-extrabold leading-[1.02] tracking-tight text-sw-ink text-[40px] sm:text-5xl">
          2026 PGA Championship<br />
          <span className="text-sw-green-deep">Flash Sale</span>
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-sw-ink/80 leading-snug">
          5 questions. 60 seconds.{" "}
          <span className="font-semibold text-sw-ink">Up to 50% off.</span>
        </p>

        <ul className="mt-6 space-y-2.5 text-[15px] sm:text-base text-sw-ink/85">
          <li className="flex gap-2.5">
            <Check />
            <span>One attempt per device. No restarts.</span>
          </li>
          <li className="flex gap-2.5">
            <Check />
            <span>Sale ends Sunday when the Wanamaker is lifted.</span>
          </li>
        </ul>
      </main>

      <div className="sticky bottom-0 left-0 right-0 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-sw-cream via-sw-cream to-transparent">
        <button
          type="button"
          onClick={onStart}
          className="w-full bg-sw-green-deep hover:bg-sw-green active:bg-sw-green-deep text-sw-cream font-display font-bold text-lg sm:text-xl py-5 rounded-2xl shadow-lg shadow-sw-green-deep/20 transition-colors active:scale-[0.99]"
        >
          Start Quiz →
        </button>
        <p className="text-center text-xs text-sw-ink/55 mt-3">
          Tapping starts a 60-second timer
        </p>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="var(--color-sw-green-deep)" />
      <path
        d="M6 10.5L9 13.5L14.5 7.5"
        stroke="var(--color-sw-cream)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
