import type { Difficulty, PresentedQuestion, Question } from "../types";

export type Rng = () => number;

export function nextDifficulty(
  answeredCorrect: number,
  answeredCount: number,
): Difficulty {
  if (answeredCount === 0) return "medium";
  const ratio = answeredCorrect / answeredCount;
  if (ratio >= 0.8) return "hard";
  if (ratio <= 0.5) return "easy";
  return "medium";
}

const BIAS = [0.7, 0.2, 0.1] as const;

export function chooseDifficulty(
  pref: Difficulty,
  available: ReadonlySet<Difficulty>,
  rng: Rng,
): Difficulty {
  const order: Difficulty[] =
    pref === "hard"
      ? ["hard", "medium", "easy"]
      : pref === "easy"
        ? ["easy", "medium", "hard"]
        : ["medium", "hard", "easy"];
  const opts = order
    .map((d, i) => ({ d, w: BIAS[i] }))
    .filter((o) => available.has(o.d));
  if (opts.length === 0) {
    throw new Error("No difficulties left in the bank");
  }
  const sum = opts.reduce((s, o) => s + o.w, 0);
  let roll = rng() * sum;
  for (const o of opts) {
    roll -= o.w;
    if (roll <= 0) return o.d;
  }
  return opts[opts.length - 1].d;
}

export function presentQuestion(
  q: Question,
  rng: Rng,
): PresentedQuestion {
  const choiceOrder = q.choices.map((_, i) => i);
  for (let i = choiceOrder.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = choiceOrder[i];
    choiceOrder[i] = choiceOrder[j];
    choiceOrder[j] = tmp;
  }
  return { ...q, choiceOrder };
}

export function pickQuestion(
  bank: Question[],
  used: ReadonlySet<string>,
  pref: Difficulty,
  rng: Rng = Math.random,
): PresentedQuestion {
  const remaining = bank.filter((q) => !used.has(q.id));
  if (remaining.length === 0) {
    throw new Error("Question bank exhausted");
  }
  const available = new Set<Difficulty>(remaining.map((q) => q.difficulty));
  const difficulty = chooseDifficulty(pref, available, rng);
  const pool = remaining.filter((q) => q.difficulty === difficulty);
  const q = pool[Math.floor(rng() * pool.length)];
  return presentQuestion(q, rng);
}

export function displayChoices(q: PresentedQuestion): string[] {
  return q.choiceOrder.map((i) => q.choices[i]);
}

export function isCorrectDisplayIndex(
  q: PresentedQuestion,
  displayIndex: number,
): boolean {
  return q.choiceOrder[displayIndex] === q.answerIndex;
}
