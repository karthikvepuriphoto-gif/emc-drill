import { writeJson } from "./engine.mjs";
import { fccBank } from "./banks/fcc.mjs";
import { icesBank } from "./banks/ices.mjs";
import { redBank } from "./banks/red.mjs";
import { reBank } from "./banks/re.mjs";
import { ceBank } from "./banks/ce.mjs";
import { esdBank } from "./banks/esd.mjs";
import { riBank } from "./banks/ri.mjs";
import { learnPacks } from "./learn.mjs";

const banks = {
  fcc: fccBank(),
  ices: icesBank(),
  red: redBank(),
  re: reBank(),
  ce: ceBank(),
  esd: esdBank(),
  ri: riBank(),
};

for (const [topic, items] of Object.entries(banks)) {
  writeJson(`src/data/questions/${topic}.json`, items);
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const q of items) counts[q.difficulty] += 1;
  console.log(`${topic}: ${items.length} (e${counts.easy} m${counts.medium} h${counts.hard})`);
}

for (const [topic, pack] of Object.entries(learnPacks)) {
  if (pack.cards.length < 8 || pack.cards.length > 12) {
    throw new Error(`${topic} learn pack has ${pack.cards.length} cards`);
  }
  writeJson(`src/data/learn/${topic}.json`, pack);
}
console.log("learn packs written");
