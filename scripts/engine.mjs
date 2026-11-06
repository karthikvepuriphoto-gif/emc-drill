import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function shuffle(arr, seed) {
  const a = [...arr];
  let h = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 16), 2246822507) >>> 0;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function make(topic) {
  const items = [];
  const stems = new Set();
  function add(q) {
    const {
      difficulty,
      stem,
      choices,
      answer,
      explanation,
      citation,
      area,
      sourceConfidence = "full",
    } = q;
    if (stems.has(stem)) throw new Error(`duplicate stem: ${stem}`);
    stems.add(stem);
    if (choices.length !== 4 && choices.length !== 2) {
      throw new Error(`choice count ${choices.length}: ${stem}`);
    }
    if (new Set(choices).size !== choices.length) {
      throw new Error(`duplicate choice: ${stem}`);
    }
    if (!choices.includes(answer)) throw new Error(`answer not listed: ${stem} :: ${answer}`);
    let explanationText = explanation;
    let sentences = explanationText.split(/(?<=[.!?])\s+/).filter(Boolean);
    while (sentences.length > 2) {
      const last = sentences.pop();
      const prev = sentences[sentences.length - 1].replace(/[.!?]$/, "");
      const glued = last.charAt(0).toLowerCase() + last.slice(1);
      sentences[sentences.length - 1] = `${prev}, and ${glued}`;
    }
    explanationText = sentences.join(" ");
    if (sentences.length < 1) throw new Error(`empty explanation: ${stem}`);
    const ordered = shuffle(choices, hash(stem));
    items.push({
      id: `${topic}-${String(items.length + 1).padStart(3, "0")}`,
      topic,
      difficulty,
      stem,
      choices: ordered,
      answerIndex: ordered.indexOf(answer),
      explanation: explanationText,
      citation,
      area,
      sourceConfidence,
    });
  }
  function tf(difficulty, stem, isTrue, explanation, citation, area, sourceConfidence = "full") {
    add({
      difficulty,
      stem,
      choices: ["True", "False"],
      answer: isTrue ? "True" : "False",
      explanation,
      citation,
      area,
      sourceConfidence,
    });
  }
  return { add, tf, items };
}

export function writeJson(rel, data) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data));
}

export function otherValues(correct, pool, n = 3) {
  const wrong = [];
  for (const value of pool) {
    if (value !== correct && !wrong.includes(value)) wrong.push(value);
    if (wrong.length === n) break;
  }
  if (wrong.length !== n) {
    throw new Error(`need ${n} distractors for ${correct}, got ${wrong.length}`);
  }
  return wrong;
}
