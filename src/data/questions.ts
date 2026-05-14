export type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

export const questions: Question[] = [
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
