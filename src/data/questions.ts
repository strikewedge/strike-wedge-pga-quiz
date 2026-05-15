export type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

export type Variant = "A" | "B";

export const VARIANTS: Variant[] = ["A", "B"];

export const questionsA: Question[] = [
  {
    id: 1,
    question: "Who designed Aronimink Golf Club?",
    options: [
      "A.W. Tillinghast",
      "Donald Ross",
      "Alister MacKenzie",
      "George Crump",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question:
      "The last time Aronimink hosted the PGA Championship was 1962. Who won?",
    options: ["Arnold Palmer", "Jack Nicklaus", "Gary Player", "Ben Hogan"],
    correctIndex: 2,
  },
  {
    id: 3,
    question:
      "Who holds the all-time PGA Championship scoring record (−21 in 2024)?",
    options: ["Brooks Koepka", "Rory McIlroy", "Xander Schauffele", "Jason Day"],
    correctIndex: 2,
  },
  {
    id: 4,
    question: "How many PGA Championships has Brooks Koepka won?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
  },
  {
    id: 5,
    question:
      "The PGA Championship switched from match play to stroke play in which year?",
    options: ["1948", "1958", "1962", "1970"],
    correctIndex: 1,
  },
];

export const questionsB: Question[] = [
  {
    id: 1,
    question: "Which trophy is awarded to the PGA Championship winner?",
    options: ["Claret Jug", "Wanamaker Trophy", "Green Jacket", "FedEx Cup"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Who is the defending PGA Championship winner heading into 2026?",
    options: [
      "Rory McIlroy",
      "Xander Schauffele",
      "Scottie Scheffler",
      "Brooks Koepka",
    ],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "Where is the 2026 PGA Championship being held?",
    options: [
      "Quail Hollow Club",
      "Aronimink Golf Club",
      "Valhalla Golf Club",
      "Oak Hill Country Club",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "The 2026 PGA Championship is which major of the calendar year?",
    options: ["First", "Second", "Third", "Fourth"],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "How many PGA Championships has Brooks Koepka won?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
  },
];

export function getQuestions(variant: Variant): Question[] {
  return variant === "B" ? questionsB : questionsA;
}

export function assignVariant(): Variant {
  return Math.random() < 0.5 ? "A" : "B";
}

export const questions = questionsA;
