// Shared constants — safe to import from both client and server code
// (unlike models/Question.ts, which pulls in mongoose).
export const TRACKS = [
  "Software Engineering",
  "Data Structures & Algorithms",
  "System Design",
  "Product & Business",
  "Data Science",
  "Behavioral / HR",
  "Custom Role",
] as const;

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type Track = (typeof TRACKS)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
