import { Logo } from "./Logo";

export function SaleEnded() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-sw-cream">
      <header className="px-5 pt-6 pb-2 text-sw-green-deep">
        <Logo />
      </header>

      <main className="flex-1 flex flex-col justify-center px-5 py-6 max-w-md w-full mx-auto fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-sw-green font-semibold mb-3">
          Adam Rai · 2026 PGA Champion
        </p>

        <h1 className="font-display font-extrabold leading-[1.02] tracking-tight text-sw-ink text-[40px] sm:text-5xl">
          The Wanamaker<br />has been lifted.
        </h1>

        <p className="mt-5 text-lg text-sw-ink/80 leading-snug">
          The flash sale is closed. Thanks for playing.
        </p>
      </main>

      <div className="sticky bottom-0 left-0 right-0 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-sw-cream via-sw-cream to-transparent">
        <a
          href="https://strikewedge.com"
          className="w-full inline-flex items-center justify-center bg-sw-green-deep hover:bg-sw-green text-sw-cream font-display font-bold text-lg sm:text-xl py-5 rounded-2xl shadow-lg shadow-sw-green-deep/20 transition-colors active:scale-[0.99]"
        >
          Shop Strike Wedge →
        </a>
        <p className="text-center text-xs text-sw-ink/55 mt-3">
          We'll see you at the next major.
        </p>
      </div>
    </div>
  );
}
