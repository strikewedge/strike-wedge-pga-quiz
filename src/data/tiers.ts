export type Tier = {
  minCorrect: number;
  discount: number;
  code: string;
  headline: string;
};

export const tiers: Tier[] = [
  { minCorrect: 5, discount: 50, code: "PGA50", headline: "Perfect round." },
  { minCorrect: 4, discount: 40, code: "PGA40", headline: "Tour-level read." },
  { minCorrect: 3, discount: 30, code: "PGA30", headline: "Solid bag." },
  { minCorrect: 0, discount: 20, code: "PGA20", headline: "On the green at minimum." },
];

export function tierForScore(score: number): Tier {
  return (
    tiers.find((t) => score >= t.minCorrect) ?? tiers[tiers.length - 1]
  );
}
