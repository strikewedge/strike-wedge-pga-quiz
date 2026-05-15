import type { Variant } from "../data/questions";

export type TrackEvent =
  | { event: "quiz_started"; variant?: Variant }
  | {
      event: "quiz_finished";
      score: number;
      tier: number;
      timedOut: boolean;
      answers: boolean[];
      variant?: Variant;
    }
  | { event: "cta_clicked"; tier: number; variant?: Variant };

export function track(payload: TrackEvent): void {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // fire-and-forget; swallow
  }
}
