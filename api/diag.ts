import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis } from "../lib/redis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expected = process.env.DASHBOARD_PIN;
  const provided =
    (req.headers["x-dashboard-pin"] as string | undefined) ??
    (typeof req.query.pin === "string" ? req.query.pin : undefined);
  if (!expected || !provided || provided !== expected) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  const dashboardPinSet = Boolean(process.env.DASHBOARD_PIN);
  const upstashUrlSet = Boolean(process.env.UPSTASH_REDIS_REST_URL);
  const upstashTokenSet = Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);
  const urlHost = (() => {
    try {
      return process.env.UPSTASH_REDIS_REST_URL
        ? new URL(process.env.UPSTASH_REDIS_REST_URL).host
        : null;
    } catch {
      return "invalid_url";
    }
  })();

  let redisCtor: "ok" | "threw" | "skipped" = "skipped";
  let redisCtorError: string | null = null;
  let pingResult: "ok" | "threw" | "skipped" = "skipped";
  let pingError: string | null = null;

  if (upstashUrlSet && upstashTokenSet) {
    try {
      const redis = getRedis();
      redisCtor = redis ? "ok" : "threw";
      if (redis) {
        try {
          await redis.ping();
          pingResult = "ok";
        } catch (e) {
          pingResult = "threw";
          pingError = e instanceof Error ? e.message : String(e);
        }
      }
    } catch (e) {
      redisCtor = "threw";
      redisCtorError = e instanceof Error ? e.message : String(e);
    }
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    ok: true,
    env: {
      dashboardPinSet,
      upstashUrlSet,
      upstashTokenSet,
      upstashUrlHost: urlHost,
      nodeEnv: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? null,
    },
    redisCtor,
    redisCtorError,
    pingResult,
    pingError,
  });
}
