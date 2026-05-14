import { Redis } from "@upstash/redis";

let cached: Redis | null = null;

function resolveCreds(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? null;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    null;
  if (!url || !token) return null;
  return { url, token };
}

export function getRedis(): Redis | null {
  if (cached) return cached;
  const creds = resolveCreds();
  if (!creds) return null;
  cached = new Redis(creds);
  return cached;
}

export const KEYS = {
  started: "quiz:started",
  finished: "quiz:finished",
  finishedScore: (n: number) => `quiz:finished:score:${n}`,
  finishedTier: (n: number) => `quiz:finished:tier:${n}`,
  finishedTimedOut: (b: boolean) => `quiz:finished:timedOut:${b}`,
  ctaClicked: "quiz:cta_clicked",
  ctaTier: (n: number) => `quiz:cta_clicked:tier:${n}`,
  qCorrect: (id: number) => `quiz:q:${id}:correct`,
  qWrong: (id: number) => `quiz:q:${id}:wrong`,
};
