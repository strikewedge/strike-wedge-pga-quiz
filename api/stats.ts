import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis, KEYS } from "../lib/redis.js";

const SCORES = [0, 1, 2, 3, 4, 5];
const TIERS = [20, 30, 40, 50];
const QUESTION_IDS = [1, 2, 3, 4, 5];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ ok: false, error: "method_not_allowed" });
    }

    const expected = process.env.DASHBOARD_PIN;
    if (!expected) {
      return res.status(500).json({ ok: false, error: "pin_not_configured" });
    }

    const provided =
      (req.headers["x-dashboard-pin"] as string | undefined) ??
      (typeof req.query.pin === "string" ? req.query.pin : undefined);

    if (!provided || provided !== expected) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }

    let redis;
    try {
      redis = getRedis();
    } catch (e) {
      return res.status(500).json({
        ok: false,
        error: "redis_init_failed",
        detail: e instanceof Error ? e.message : String(e),
      });
    }
    if (!redis) {
      return res.status(503).json({ ok: false, error: "storage_unavailable" });
    }

    const keys: string[] = [
      KEYS.started,
      KEYS.finished,
      KEYS.ctaClicked,
      KEYS.finishedTimedOut(true),
      KEYS.finishedTimedOut(false),
      ...SCORES.map((s) => KEYS.finishedScore(s)),
      ...TIERS.map((t) => KEYS.finishedTier(t)),
      ...TIERS.map((t) => KEYS.ctaTier(t)),
      ...QUESTION_IDS.flatMap((id) => [KEYS.qCorrect(id), KEYS.qWrong(id)]),
    ];

    let raw: (string | number | null)[];
    try {
      raw = (await redis.mget(...keys)) as (string | number | null)[];
    } catch (e) {
      return res.status(500).json({
        ok: false,
        error: "read_failed",
        detail: e instanceof Error ? e.message : String(e),
      });
    }

    const n = (i: number) => Number(raw[i] ?? 0);
    let i = 0;
    const started = n(i++);
    const finished = n(i++);
    const ctaClicked = n(i++);
    const timedOutTrue = n(i++);
    const timedOutFalse = n(i++);

    const scoreCount: Record<string, number> = {};
    for (const s of SCORES) scoreCount[s] = n(i++);

    const tierCount: Record<string, number> = {};
    for (const t of TIERS) tierCount[t] = n(i++);

    const ctaByTier: Record<string, number> = {};
    for (const t of TIERS) ctaByTier[t] = n(i++);

    const perQuestion = QUESTION_IDS.map((id) => ({
      id,
      correct: n(i++),
      wrong: n(i++),
    }));

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      ok: true,
      started,
      finished,
      ctaClicked,
      completionRate: started > 0 ? finished / started : 0,
      ctaRate: finished > 0 ? ctaClicked / finished : 0,
      timedOut: { true: timedOutTrue, false: timedOutFalse },
      scoreCount,
      tierCount,
      ctaByTier,
      perQuestion,
    });
  } catch (e) {
    console.error("/api/stats unhandled:", e);
    return res.status(500).json({
      ok: false,
      error: "unhandled",
      detail: e instanceof Error ? e.message : String(e),
    });
  }
}
