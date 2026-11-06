import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  chooseDifficulty,
  nextDifficulty,
  pickQuestion,
} from "../src/lib/quiz.ts";
import type { Difficulty, Question, TopicId } from "../src/types.ts";

const qDir = "src/data/questions";
const topics = readdirSync(qDir).filter((f) => f.endsWith(".json"));
const minBank = 80;
let failed = 0;

function fail(msg: string) {
  failed += 1;
  console.error(msg);
}

const allIds = new Set<string>();
for (const file of topics) {
  const items = JSON.parse(readFileSync(join(qDir, file), "utf8")) as Question[];
  const topic = file.replace(".json", "") as TopicId;
  if (items.length < minBank) fail(`${topic} has ${items.length}, want >= ${minBank}`);
  const diff: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  for (const q of items) {
    if (allIds.has(q.id)) fail(`duplicate id ${q.id}`);
    allIds.add(q.id);
    if (q.topic !== topic) fail(`${q.id} topic mismatch`);
    if (!["easy", "medium", "hard"].includes(q.difficulty)) fail(`${q.id} difficulty`);
    if (q.choices.length !== 2 && q.choices.length !== 4) fail(`${q.id} choices`);
    if (new Set(q.choices).size !== q.choices.length) fail(`${q.id} dup choice`);
    if (q.answerIndex < 0 || q.answerIndex >= q.choices.length) fail(`${q.id} answer`);
    if (!q.stem || !q.explanation || !q.citation || !q.area) fail(`${q.id} missing text`);
    const sentences = q.explanation.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length < 1 || sentences.length > 2) fail(`${q.id} sentences ${sentences.length}`);
    if (!["full", "preview", "practice"].includes(q.sourceConfidence)) {
      fail(`${q.id} confidence`);
    }
    diff[q.difficulty] += 1;
  }
  for (const d of ["easy", "medium", "hard"] as const) {
    if (diff[d] < 8) fail(`${topic} only ${diff[d]} ${d}`);
  }
  const used = new Set<string>();
  let correct = 0;
  let asked = 0;
  for (let n = 0; n < 15; n++) {
    const pref = nextDifficulty(correct, asked);
    const q = pickQuestion(items, used, pref, () => 0.1);
    if (used.has(q.id)) fail("repeat in draw");
    used.add(q.id);
    if (new Set(q.choiceOrder).size !== q.choices.length) fail("bad shuffle");
    correct += 1;
    asked += 1;
  }
  console.log(`ok ${topic} ${items.length}`);
}

const learnDir = "src/data/learn";
for (const file of readdirSync(learnDir)) {
  const pack = JSON.parse(readFileSync(join(learnDir, file), "utf8")) as {
    cards: { id: string }[];
  };
  if (pack.cards.length < 8 || pack.cards.length > 12) {
    fail(`${file} cards ${pack.cards.length}`);
  }
}

let hardPicks = 0;
const trials = 300;
const fake = new Set<Difficulty>(["easy", "medium", "hard"]);
for (let i = 0; i < trials; i++) {
  const roll = (i + 0.5) / trials;
  if (chooseDifficulty("hard", fake, () => roll) === "hard") hardPicks += 1;
}
if (hardPicks / trials < 0.6) fail(`hard bias weak: ${hardPicks / trials}`);
if (nextDifficulty(0, 0) !== "medium") fail("start");
if (nextDifficulty(8, 10) !== "hard") fail("80");
if (nextDifficulty(5, 10) !== "easy") fail("50");
if (nextDifficulty(7, 10) !== "medium") fail("70");

if (failed) {
  console.error(`${failed} problems`);
  process.exit(1);
}
console.log("validate ok");
