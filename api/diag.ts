import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis } from "../lib/redis.js";

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
  const kvUrlSet = Boolean(process.env.KV_REST_API_URL);
  const kvTokenSet = Boolean(process.env.KV_REST_API_TOKEN);
  const effectiveUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? null;
  const urlHost = (() => {
    try {
      return effectiveUrl ? new URL(effectiveUrl).host : null;
    } catch {
      return "invalid_url";
    }
  })();

  let redisCtor: "ok" | "threw" | "skipped" = "skipped";
  let redisCtorError: string | null = null;
  let pingResult: "ok" | "threw" | "skipped" = "skipped";
  let pingError: string | null = null;

  if ((upstashUrlSet || kvUrlSet) && (upstashTokenSet || kvTokenSet)) {
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
      kvUrlSet,
      kvTokenSet,
      urlHost,
      nodeEnv: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? null,
    },
    redisCtor,
    redisCtorError,
    pingResult,
    pingError,
  });
}
