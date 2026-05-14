import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis, KEYS } from "../lib/redis";

const VALID_TIERS = new Set([20, 30, 40, 50]);
const VALID_SCORES = new Set([0, 1, 2, 3, 4, 5]);
const QUESTION_COUNT = 5;

type Body = {
  event?: string;
  score?: number;
  tier?: number;
  timedOut?: boolean;
  answers?: unknown;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ ok: false, error: "method_not_allowed" });
    }

    const body = (typeof req.body === "string" ? safeJSON(req.body) : req.body) as Body;
    if (!body || typeof body.event !== "string") {
      return res.status(400).json({ ok: false, error: "bad_event" });
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

    const pipe = redis.pipeline();

    switch (body.event) {
      case "quiz_started":
        pipe.incr(KEYS.started);
        break;

      case "quiz_finished": {
        const score = body.score;
        const tier = body.tier;
        const timedOut = !!body.timedOut;
        if (typeof score !== "number" || !VALID_SCORES.has(score)) {
          return res.status(400).json({ ok: false, error: "bad_score" });
        }
        if (typeof tier !== "number" || !VALID_TIERS.has(tier)) {
          return res.status(400).json({ ok: false, error: "bad_tier" });
        }
        pipe.incr(KEYS.finished);
        pipe.incr(KEYS.finishedScore(score));
        pipe.incr(KEYS.finishedTier(tier));
        pipe.incr(KEYS.finishedTimedOut(timedOut));

        if (Array.isArray(body.answers)) {
          for (let i = 0; i < Math.min(body.answers.length, QUESTION_COUNT); i++) {
            const correct = body.answers[i];
            if (typeof correct !== "boolean") continue;
            pipe.incr(correct ? KEYS.qCorrect(i + 1) : KEYS.qWrong(i + 1));
          }
        }
        break;
      }

      case "cta_clicked": {
        const tier = body.tier;
        if (typeof tier !== "number" || !VALID_TIERS.has(tier)) {
          return res.status(400).json({ ok: false, error: "bad_tier" });
        }
        pipe.incr(KEYS.ctaClicked);
        pipe.incr(KEYS.ctaTier(tier));
        break;
      }

      default:
        return res.status(400).json({ ok: false, error: "unknown_event" });
    }

    try {
      await pipe.exec();
    } catch (e) {
      return res.status(500).json({
        ok: false,
        error: "write_failed",
        detail: e instanceof Error ? e.message : String(e),
      });
    }

    return res.status(204).end();
  } catch (e) {
    console.error("/api/track unhandled:", e);
    return res.status(500).json({
      ok: false,
      error: "unhandled",
      detail: e instanceof Error ? e.message : String(e),
    });
  }
}

function safeJSON(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
