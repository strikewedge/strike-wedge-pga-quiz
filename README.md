# Strike Wedge — 2026 PGA Championship Quiz

A 5-question, 60-second trivia quiz that lives at `pgaquiz.strikewedge.com` during PGA Championship week (May 14–17, 2026). Players unlock tiered discounts on Strike Wedge based on score, with a 20% floor for everyone who plays.

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4. Backend is two Vercel Functions (`api/track`, `api/stats`) that talk to Upstash Redis for anonymous counters.

## Scoring tiers

| Correct | Discount |
|---|---|
| 5 | 50% |
| 4 | 40% |
| 3 | 30% |
| 0–2 | 20% |

The CTA opens a Shopify auto-apply URL: `https://strikewedge.com/discount/<CODE>?redirect=/products/strike-wedge`.

## Edit content

- Questions: `src/data/questions.ts`
- Tiers / codes: `src/data/tiers.ts`
- Discount URL + sale-end label: `src/data/discount.ts`

## Dashboard

Private at `/dashboard`. Enter the PIN once on each device — it's cached in `localStorage` after that.

Shows: starts, finishes, completion rate, CTA clicks + CTR, score distribution, tier breakdown, timed-out vs answered-all, and per-question correct/wrong. Auto-refreshes every 10s.

## Develop

```
npm install
npm run dev
```

The `/api/*` routes need Vercel infrastructure — they won't respond locally unless you run `vercel dev`.

## Build

```
npm run build
```

## Deploy

1. Connect the GitHub repo to a Vercel project. Vercel auto-detects Vite — no config file required.
2. From the Vercel dashboard, install **Upstash → Redis** from the Marketplace and link it to this project. It auto-injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. Add a project environment variable: `DASHBOARD_PIN=<your-pin>` (any 4–6 digits).
4. Set the production domain to `pgaquiz.strikewedge.com`.

## Reset a single device

Clear the `localStorage` key `strike_wedge_pga_quiz_2026` (player) or `pga_quiz_dashboard_pin` (dashboard) in DevTools.

## Privacy

No PII captured. The `api/track` endpoint accepts only event name, score, tier, timed-out flag, and a per-question correct/wrong array. The single-attempt gate is a localStorage flag on the device — not a server-side identifier.
