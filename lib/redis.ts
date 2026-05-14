import { Redis } from "@upstash/redis";

let cached: Redis | null = null;

export function getRedis(): Redis | null {
  if (cached) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  cached = new Redis({ url, token });
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
