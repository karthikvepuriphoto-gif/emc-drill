import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

const base = "http://127.0.0.1:4173/emc-drill/#/";
const out = "/opt/cursor/artifacts";

function bank(topic) {
  return JSON.parse(readFileSync(`src/data/questions/${topic}.json`, "utf8"));
}

async function answerOne(page, questions, wantCorrect) {
  const stem = (await page.locator("h2.stem").innerText()).trim();
  const q = questions.find((item) => item.stem === stem);
  if (!q) throw new Error(`stem not in bank: ${stem.slice(0, 80)}`);
  const correct = q.choices[q.answerIndex];
  const buttons = page.locator("button.choice");
  const n = await buttons.count();
  let target = -1;
  for (let i = 0; i < n; i++) {
    const text = (await buttons.nth(i).innerText()).replace(/^\d+\s*/, "").trim();
    const isCorrect = text === correct;
    if (wantCorrect && isCorrect) target = i;
    if (!wantCorrect && !isCorrect && target < 0) target = i;
  }
  if (target < 0) throw new Error("no choice");
  await buttons.nth(target).click();
  const next = page.locator("button.btn.primary");
  await next.waitFor();
  await page.waitForFunction(() => {
    const btn = document.querySelector("button.btn.primary");
    return btn && !btn.disabled;
  });
  await next.click();
}

async function finishLearn(page) {
  for (let i = 0; i < 12; i++) {
    const start = page.getByRole("link", { name: "Start quiz" });
    if (await start.count()) return;
    const next = page.getByRole("button", { name: "Next card" });
    if (!(await next.count())) break;
    await next.click();
  }
}

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto(base, { waitUntil: "networkidle" });
await page.locator("h1").waitFor();
const suggest = page.locator("header a", { hasText: "Improve this quiz" });
const href = await suggest.getAttribute("href");
const target = await suggest.getAttribute("target");
if (href !== "https://form.jotform.com/263088344195060" || target !== "_blank") {
  throw new Error(`suggestion link wrong: ${href} ${target}`);
}
await page.screenshot({ path: `${out}/home.png` });

await page.locator("text=Start quiz").first().waitFor({ state: "attached" }).catch(() => {});
await page.goto(base + "topic/re");
const locked = page.getByRole("button", { name: "Start quiz" });
if (!(await locked.isDisabled())) throw new Error("quiz was not locked before learn");

await page.goto(base + "learn/re");
await page.locator(".card h2").waitFor();
await page.screenshot({ path: `${out}/learn.png` });
await finishLearn(page);
await page.getByRole("link", { name: "Start quiz" }).click();
await page.locator("h2.stem").waitFor();
await page.screenshot({ path: `${out}/quiz.png` });

const re = bank("re");
for (let i = 0; i < 15; i++) {
  await answerOne(page, re, true);
  if (i < 14) await page.locator("h2.stem").waitFor();
}
await page.locator("text=In the quiet zone").waitFor();
const high = await page.locator("h1").innerText();
if (!high.includes("%")) throw new Error(high);
const highScore = Number(high.match(/(\d+)%/)[1]);
if (highScore < 80) throw new Error(`expected high score, got ${highScore}`);
await page.locator("figure.mascot").waitFor();
await page.screenshot({ path: `${out}/results-high.png` });

await page.goto(base + "learn/ce");
await page.locator(".card h2").waitFor();
await finishLearn(page);
await page.goto(base + "quiz/ce");
await page.locator("h2.stem").waitFor();
const ce = bank("ce");
for (let i = 0; i < 15; i++) {
  await answerOne(page, ce, false);
  if (i < 14) await page.locator("h2.stem").waitFor();
}
await page.locator("text=Back to the learn cards").waitFor();
const low = await page.locator("h1").innerText();
const lowScore = Number(low.match(/(\d+)%/)[1]);
if (lowScore >= 50) throw new Error(`expected low score, got ${lowScore}`);
const lockedAgain = await page.getByRole("button", { name: "Quiz locked" }).isDisabled();
if (!lockedAgain) throw new Error("quiz should lock after a low score");
await page.screenshot({ path: `${out}/results-low.png` });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base);
await page.locator("h1").waitFor();
await page.screenshot({ path: `${out}/home-mobile.png` });

if (errors.length) throw new Error(errors.join("\n"));
console.log(`shots ok high=${highScore} low=${lowScore}`);
await browser.close();
