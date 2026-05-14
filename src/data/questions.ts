export type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

export const questions: Question[] = [
  {
    id: 1,
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
    question: "Which trophy is awarded to the PGA Championship winner?",
    options: ["Claret Jug", "Wanamaker Trophy", "Green Jacket", "FedEx Cup"],
    correctIndex: 1,
  },
  {
    id: 4,
    question:
      "The last time Aronimink hosted the PGA Championship was 1962. Who won?",
    options: ["Arnold Palmer", "Jack Nicklaus", "Gary Player", "Ben Hogan"],
    correctIndex: 2,
  },
  {
    id: 5,
    question: "What is the par at Aronimink for the 2026 PGA Championship?",
    options: ["70", "71", "72", "73"],
    correctIndex: 0,
  },
];
