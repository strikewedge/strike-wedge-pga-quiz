export type Tier = {
  minCorrect: number;
  discount: number;
  code: string;
  headline: string;
};

export const tiers: Tier[] = [
  { minCorrect: 5, discount: 50, code: "4SW2D07728CF", headline: "Perfect round." },
  { minCorrect: 4, discount: 40, code: "B79V9V7P584V", headline: "Tour-level read." },
  { minCorrect: 3, discount: 30, code: "ESRK9YMZGEYK", headline: "Solid bag." },
  { minCorrect: 0, discount: 20, code: "H2S3DC8WP35K", headline: "On the green at minimum." },
];

export function tierForScore(score: number): Tier {
  return (
    tiers.find((t) => score >= t.minCorrect) ?? tiers[tiers.length - 1]
  );
}
