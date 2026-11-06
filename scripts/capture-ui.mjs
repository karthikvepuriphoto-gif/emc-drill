import { readFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const phase = process.argv[2] || "before";
const out = `/opt/cursor/artifacts/${phase}`;
mkdirSync(out, { recursive: true });
const origin = process.env.ORIGIN || "http://127.0.0.1:4173/emc-drill/";

const viewports = [
  ["phone", 390, 844],
  ["ipad-port", 820, 1180],
  ["ipad-land", 1180, 820],
  ["desktop", 1440, 900],
];

function bank(topic) {
  return JSON.parse(readFileSync(`src/data/questions/${topic}.json`, "utf8"));
}

async function finishLearn(page) {
  await page.goto(origin + "#/learn/re", { waitUntil: "domcontentloaded" });
  const start = page.getByRole("link", { name: "Start quiz" });
  for (let i = 0; i < 12; i++) {
    if (await start.count()) return;
    const next = page.getByRole("button", { name: "Next card" });
    if (await next.count()) {
      await next.click();
      continue;
    }
    await start.waitFor({ timeout: 4000 });
    return;
  }
  throw new Error("learn pack did not unlock");
}

async function answerOne(page, questions, wantCorrect) {
  const stem = (await page.locator("h2.stem").innerText()).trim();
  const q = questions.find((item) => item.stem === stem);
  if (!q) throw new Error(`missing stem ${stem.slice(0, 80)}`);
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
  if (target < 0) throw new Error("no target choice");
  await buttons.nth(target).click();
  await page.waitForFunction(() => {
    const btn = document.querySelector("button.btn.primary");
    return btn && !btn.disabled;
  });
  await page.locator("button.btn.primary").click();
}

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const consoleErrors = [];
const page = await browser.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));

async function shot(name) {
  await page.screenshot({ path: `${out}/${name}.png` });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) consoleErrors.push(`${name} horizontal overflow ${overflow}px`);
}

async function tapAudit(label) {
  const bad = await page.evaluate(() => {
    const hits = [];
    for (const el of document.querySelectorAll("a, button")) {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      if (r.height < 44 || r.width < 44) {
        const text = (el.innerText || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 48);
        hits.push(`${Math.round(r.width)}x${Math.round(r.height)} ${text}`);
      }
    }
    return hits;
  });
  if (bad.length) consoleErrors.push(`${label} small targets: ${bad.join(" | ")}`);
}

for (const [name, w, h] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(origin + "#/", { waitUntil: "networkidle" });
  await page.locator("text=Radiated emissions").waitFor();
  await shot(`${name}-home`);
  if (name === "phone") await tapAudit("phone-home");
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(origin + "#/learn/re", { waitUntil: "networkidle" });
await page.locator("h2").first().waitFor();

for (const [name, w, h] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await shot(`${name}-learn`);
}
if (viewports[0]) {
  await page.setViewportSize({ width: 390, height: 844 });
  await tapAudit("phone-learn");
}

await finishLearn(page);
const quizLink = page.getByRole("link", { name: "Start quiz" });
if (await quizLink.count()) await quizLink.click();
else await page.goto(origin + "#/quiz/re");
await page.locator("h2.stem").waitFor();
for (const [name, w, h] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await shot(`${name}-quiz`);
}
await page.setViewportSize({ width: 390, height: 844 });
await tapAudit("phone-quiz");

const re = bank("re");
for (let i = 0; i < 15; i++) {
  await answerOne(page, re, true);
  if (i < 14) await page.locator("h2.stem").waitFor();
}
await page.getByText("In the quiet zone").waitFor();
for (const [name, w, h] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await shot(`${name}-results`);
}
await page.setViewportSize({ width: 390, height: 844 });
await tapAudit("phone-results");

const real = consoleErrors.filter(
  (line) => !line.includes("favicon") && !line.includes("Failed to load resource"),
);
console.log(JSON.stringify({ phase, issues: real }, null, 2));
if (real.length) process.exitCode = 1;
await browser.close();
