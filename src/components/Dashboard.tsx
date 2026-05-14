import { useCallback, useEffect, useRef, useState } from "react";
import { questions } from "../data/questions";
import { Logo } from "./Logo";

const PIN_KEY = "pga_quiz_dashboard_pin";
const REFRESH_MS = 10_000;

type Stats = {
  started: number;
  finished: number;
  ctaClicked: number;
  completionRate: number;
  ctaRate: number;
  timedOut: { true: number; false: number };
  scoreCount: Record<string, number>;
  tierCount: Record<string, number>;
  ctaByTier: Record<string, number>;
  perQuestion: { id: number; correct: number; wrong: number }[];
};

type State =
  | { kind: "needsPin" }
  | { kind: "loading"; pin: string }
  | { kind: "error"; pin: string | null; message: string }
  | { kind: "ok"; pin: string; stats: Stats; updatedAt: number };

export function Dashboard() {
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return { kind: "needsPin" };
    const saved = window.localStorage.getItem(PIN_KEY);
    return saved ? { kind: "loading", pin: saved } : { kind: "needsPin" };
  });
  const inFlight = useRef(false);

  const fetchStats = useCallback(async (pin: string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch(`/api/stats?pin=${encodeURIComponent(pin)}`, {
        cache: "no-store",
      });
      if (res.status === 401) {
        window.localStorage.removeItem(PIN_KEY);
        setState({ kind: "error", pin: null, message: "PIN didn't match." });
        return;
      }
      if (!res.ok) {
        setState({
          kind: "error",
          pin,
          message: `Server returned ${res.status}. Try again.`,
        });
        return;
      }
      const stats = (await res.json()) as Stats;
      window.localStorage.setItem(PIN_KEY, pin);
      setState({ kind: "ok", pin, stats, updatedAt: Date.now() });
    } catch (e) {
      setState({
        kind: "error",
        pin,
        message: e instanceof Error ? e.message : "Network error.",
      });
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    if (state.kind === "loading") {
      fetchStats(state.pin);
    }
  }, [state, fetchStats]);

  useEffect(() => {
    if (state.kind !== "ok") return;
    const id = window.setInterval(() => fetchStats(state.pin), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [state, fetchStats]);

  return (
    <div className="min-h-[100dvh] bg-sw-cream">
      <header className="px-5 pt-6 pb-2 flex items-center justify-between text-sw-green-deep">
        <a href="/" aria-label="Strike Wedge home">
          <Logo />
        </a>
        <span className="text-[11px] uppercase tracking-widest font-semibold text-sw-ink/45">
          Dashboard
        </span>
      </header>

      <main className="px-5 py-6 max-w-2xl w-full mx-auto fade-up">
        {(state.kind === "needsPin" ||
          (state.kind === "error" && state.pin === null)) && (
          <PinGate
            errorMessage={state.kind === "error" ? state.message : undefined}
            onSubmit={(pin) => setState({ kind: "loading", pin })}
          />
        )}

        {state.kind === "loading" && <Loading />}

        {state.kind === "error" && state.pin !== null && (
          <ErrorView
            message={state.message}
            onRetry={() => fetchStats(state.pin!)}
            onLogout={() => {
              window.localStorage.removeItem(PIN_KEY);
              setState({ kind: "needsPin" });
            }}
          />
        )}

        {state.kind === "ok" && (
          <StatsView
            stats={state.stats}
            updatedAt={state.updatedAt}
            onRefresh={() => fetchStats(state.pin)}
            onLogout={() => {
              window.localStorage.removeItem(PIN_KEY);
              setState({ kind: "needsPin" });
            }}
          />
        )}
      </main>
    </div>
  );
}

function PinGate({
  errorMessage,
  onSubmit,
}: {
  errorMessage?: string;
  onSubmit: (pin: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (v) onSubmit(v);
      }}
      className="mt-8 max-w-sm mx-auto"
    >
      <h1 className="font-display font-extrabold text-3xl text-sw-ink">
        Enter PIN
      </h1>
      <p className="mt-2 text-sw-ink/70 text-[15px]">
        Private dashboard. Ask the owner for the PIN.
      </p>
      <input
        type="password"
        inputMode="numeric"
        autoComplete="off"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="••••"
        className="mt-5 w-full bg-white border-2 border-sw-stone rounded-2xl px-4 py-4 text-2xl font-display font-bold tabular-nums tracking-[0.4em] text-center text-sw-ink focus:outline-none focus:border-sw-green-deep"
      />
      {errorMessage && (
        <p className="mt-3 text-sm text-sw-red font-medium" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={!value.trim()}
        className="mt-5 w-full bg-sw-green-deep hover:bg-sw-green disabled:opacity-50 text-sw-cream font-display font-bold text-lg py-4 rounded-2xl transition-colors active:scale-[0.99]"
      >
        Unlock
      </button>
    </form>
  );
}

function Loading() {
  return (
    <div className="mt-12 text-center text-sw-ink/55 text-sm uppercase tracking-widest">
      Loading…
    </div>
  );
}

function ErrorView({
  message,
  onRetry,
  onLogout,
}: {
  message: string;
  onRetry: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="mt-8 rounded-2xl border-2 border-sw-red bg-white p-5">
      <p className="font-semibold text-sw-red">{message}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 bg-sw-ink text-sw-cream font-display font-bold py-3 rounded-xl"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex-1 bg-white border-2 border-sw-stone text-sw-ink font-display font-bold py-3 rounded-xl"
        >
          Forget PIN
        </button>
      </div>
    </div>
  );
}

function StatsView({
  stats,
  updatedAt,
  onRefresh,
  onLogout,
}: {
  stats: Stats;
  updatedAt: number;
  onRefresh: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
        <Kpi label="Starts" value={stats.started} />
        <Kpi label="Finishes" value={stats.finished} />
        <Kpi label="Completion" value={pct(stats.completionRate)} />
        <Kpi label="CTA clicks" value={stats.ctaClicked} />
        <Kpi label="CTR" value={pct(stats.ctaRate)} />
        <Kpi
          label="Timed out"
          value={stats.timedOut.true}
          sub={`${stats.timedOut.false} answered all`}
        />
      </div>

      <Section title="Score distribution">
        <BarRows
          rows={[5, 4, 3, 2, 1, 0].map((s) => ({
            label: `${s}/5`,
            value: stats.scoreCount[s] ?? 0,
          }))}
        />
      </Section>

      <Section title="Tier breakdown">
        <BarRows
          rows={[50, 40, 30, 20].map((t) => ({
            label: `${t}% off`,
            value: stats.tierCount[t] ?? 0,
            sub: `${stats.ctaByTier[t] ?? 0} clicked`,
          }))}
        />
      </Section>

      <Section title="Per question">
        <ul className="space-y-3">
          {stats.perQuestion.map((q) => {
            const total = q.correct + q.wrong;
            const pctRight = total > 0 ? q.correct / total : 0;
            const text = questions.find((qq) => qq.id === q.id)?.question ?? `Q${q.id}`;
            return (
              <li
                key={q.id}
                className="bg-white border border-sw-stone rounded-xl p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13px] leading-snug text-sw-ink/85">
                    <span className="font-display font-bold text-sw-ink">
                      Q{q.id}.
                    </span>{" "}
                    {text}
                  </p>
                  <span className="text-xs font-semibold tabular-nums text-sw-ink/55 whitespace-nowrap">
                    {q.correct}/{total} • {pct(pctRight)}
                  </span>
                </div>
                <div className="mt-2 h-2 bg-sw-stone rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sw-green-deep"
                    style={{ width: `${pctRight * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <div className="mt-6 flex items-center justify-between text-xs text-sw-ink/55">
        <span>Updated {timeAgo(updatedAt)} · auto-refreshes every 10s</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="px-3 py-1.5 rounded-lg bg-sw-ink text-sw-cream font-semibold"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-white border border-sw-stone font-semibold text-sw-ink"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

function Kpi({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-sw-stone rounded-2xl p-3">
      <p className="text-[11px] uppercase tracking-widest font-semibold text-sw-ink/55">
        {label}
      </p>
      <p className="font-display font-extrabold text-2xl tabular-nums text-sw-ink mt-0.5">
        {value}
      </p>
      {sub && <p className="text-[11px] text-sw-ink/55 mt-0.5">{sub}</p>}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h2 className="font-display font-bold text-sw-ink text-lg">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BarRows({
  rows,
}: {
  rows: { label: string; value: number; sub?: string }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li
          key={r.label}
          className="bg-white border border-sw-stone rounded-xl p-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-sw-ink">{r.label}</span>
            <span className="text-sm tabular-nums font-semibold text-sw-ink">
              {r.value}
              {r.sub && (
                <span className="ml-2 text-xs font-normal text-sw-ink/55">
                  {r.sub}
                </span>
              )}
            </span>
          </div>
          <div className="mt-2 h-2 bg-sw-stone rounded-full overflow-hidden">
            <div
              className="h-full bg-sw-green-deep"
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function timeAgo(timestamp: number): string {
  const s = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  return `${m}m ago`;
}
