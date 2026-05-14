# Strike Wedge — 2026 PGA Championship Quiz

A 5-question, 60-second trivia quiz that lives at `pgaquiz.strikewedge.com` during PGA Championship week (May 14–17, 2026). Players unlock tiered discounts on Strike Wedge based on score, with a 20% floor for everyone who plays.

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4. No backend — single-attempt enforcement is `localStorage`.

## Scoring tiers

| Correct | Discount | Code |
|---|---|---|
| 5 | 50% | `PGA50` |
| 4 | 40% | `PGA40` |
| 3 | 30% | `PGA30` |
| 0–2 | 20% | `PGA20` |

The CTA opens a Shopify auto-apply URL: `https://strikewedge.com/discount/<CODE>?redirect=/products/strike-wedge`.

## Edit content

- Questions: `src/data/questions.ts`
- Tiers / codes: `src/data/tiers.ts`
- Discount URL + sale-end label: `src/data/discount.ts`

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
```

## Deploy

Designed for Vercel. Connect the repo to a Vercel project and set the production domain to `pgaquiz.strikewedge.com`. Vercel auto-detects Vite — no config file required.

## Reset a single device

Clear the `localStorage` key `strike_wedge_pga_quiz_2026` in DevTools to allow a re-play.
