import { useEffect, useState, type MouseEvent } from "react";
import { PASS_PERCENT, QUIZ_LENGTH } from "../config";
import { SuggestLink } from "../components/SuggestLink";
import { Nav } from "../components/Nav";
import { loadQuestions } from "../lib/content";
import {
  displayChoices,
  isCorrectDisplayIndex,
  nextDifficulty,
  pickQuestion,
} from "../lib/quiz";
import { learnOf, recordAttempt } from "../lib/storage";
import { areaLabel, topicById } from "../topics";
import type {
  Attempt,
  Miss,
  PersistedState,
  PresentedQuestion,
  Question,
} from "../types";

const LAST_KEY = "emc-drill-last-attempt";

export function QuizScreen({
  topicId,
  state,
  update,
}: {
  topicId: string;
  state: PersistedState;
  update: (recipe: (prev: PersistedState) => PersistedState) => void;
}) {
  const topic = topicById(topicId);
  const [bank, setBank] = useState<Question[] | null>(null);
  const [current, setCurrent] = useState<PresentedQuestion | null>(null);
  const [used, setUsed] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [misses, setMisses] = useState<Miss[]>([]);
  const [error, setError] = useState("");

  const unlocked = topic ? learnOf(state, topic.id).complete : false;

  useEffect(() => {
    if (!topic || !unlocked) return;
    let cancel = false;
    loadQuestions(topic.id)
      .then((qs) => {
        if (cancel) return;
        setBank(qs);
        setCurrent(pickQuestion(qs, new Set(), "medium"));
      })
      .catch(() => {
        if (!cancel) setError("Could not load this question bank.");
      });
    return () => {
      cancel = true;
    };
  }, [topic, unlocked]);

  if (!topic) {
    return (
      <>
        <Nav title="Quiz" back={{ href: "#/", label: "Topics" }} />
        <main className="screen">
          <p className="status-line">Unknown topic.</p>
        </main>
      </>
    );
  }

  const back = {
    href: `#/topic/${topic.id}`,
    label: topic.code,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      if (unlocked && current && !confirm("Leave this attempt? It will not be scored.")) {
        e.preventDefault();
      }
    },
  };

  if (!unlocked) {
    return (
      <>
        <Nav title="Quiz" back={back} />
        <main className="screen">
          <div className="screen-body">
            <p className="section-label">Locked</p>
            <section className="group">
              <p className="pad">
                Read the {topic.title} learn pack first. The quiz stays locked
                until every card has been on screen, and again after a score
                under {PASS_PERCENT}%.
              </p>
            </section>
          </div>
          <div className="dock">
            <a className="btn primary" href={`#/learn/${topic.id}`}>
              Open learn cards
            </a>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav title="Quiz" back={back} />
        <main className="screen">
          <p className="status-line">{error}</p>
        </main>
      </>
    );
  }
  if (!current || !bank) {
    return (
      <>
        <Nav title="Quiz" back={back} />
        <main className="screen">
          <p className="status-line">Drawing a question…</p>
        </main>
      </>
    );
  }

  const choices = displayChoices(current);
  const revealed = picked !== null;
  const running = answeredCount === 0 ? null : correctCount / answeredCount;

  function choose(displayIndex: number) {
    if (picked !== null) return;
    setPicked(displayIndex);
    if (!isCorrectDisplayIndex(current!, displayIndex)) {
      const miss: Miss = {
        id: current!.id,
        stem: current!.stem,
        area: current!.area,
        chosen: choices[displayIndex],
        correct: current!.choices[current!.answerIndex],
        explanation: current!.explanation,
        citation: current!.citation,
      };
      setMisses((m) => [...m, miss]);
    }
  }

  function finish(correct: number, total: number, allMisses: Miss[]) {
    const score = Math.round((correct / total) * 100);
    const counts = new Map<string, number>();
    for (const m of allMisses) counts.set(m.area, (counts.get(m.area) ?? 0) + 1);
    const stored: Attempt = {
      id: crypto.randomUUID(),
      nickname: state.nickname.trim(),
      topic: topic!.id,
      score,
      correct,
      total,
      date: new Date().toISOString(),
      weak: [...counts.entries()]
        .map(([area, missed]) => ({ area, missed }))
        .sort((a, b) => b.missed - a.missed),
      misses: allMisses,
    };
    sessionStorage.setItem(LAST_KEY, JSON.stringify(stored));
    update((prev) =>
      recordAttempt(prev, { ...stored, nickname: prev.nickname.trim() }),
    );
    window.location.hash = `#/results/${topic!.id}`;
  }

  function advance() {
    if (!revealed || !current) return;
    const ok = isCorrectDisplayIndex(current, picked!);
    const correct = correctCount + (ok ? 1 : 0);
    const answered = answeredCount + 1;
    if (answered >= QUIZ_LENGTH) {
      finish(correct, answered, misses);
      return;
    }
    const next = pickQuestion(
      bank!,
      new Set([...used, current.id]),
      nextDifficulty(correct, answered),
    );
    setUsed((u) => [...u, current.id]);
    setCorrectCount(correct);
    setAnsweredCount(answered);
    setCurrent(next);
    setPicked(null);
  }

  return (
    <>
      <Nav
        title={`${answeredCount + 1}/${QUIZ_LENGTH}`}
        back={back}
        trailing={<span className="nav-meta">{current.difficulty}</span>}
      />
      <main className="screen">
        <div className="screen-body">
          <div
            className="bar quiz-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={QUIZ_LENGTH}
            aria-valuenow={answeredCount}
          >
            <span style={{ width: `${(answeredCount / QUIZ_LENGTH) * 100}%` }} />
          </div>
          <p className="status-line">
            {running === null
              ? "Starts at medium, then follows how this attempt is going."
              : `Running ${correctCount}/${answeredCount}. ${
                  running >= 0.8
                    ? "Biasing harder."
                    : running <= 0.5
                      ? "Biasing easier."
                      : "Staying around medium."
                }`}
          </p>
          <h2 className="stem">{current.stem}</h2>
          <div className="choices" role="group" aria-label="Answers">
            {choices.map((choice, i) => {
              const correct = current.choiceOrder[i] === current.answerIndex;
              let cls = "choice";
              if (revealed && correct) cls += " is-correct";
              if (revealed && picked === i && !correct) cls += " is-wrong";
              return (
                <button
                  key={choice}
                  type="button"
                  className={cls}
                  disabled={revealed}
                  onClick={() => choose(i)}
                >
                  <span className="choice-key">{i + 1}</span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>
          {revealed && (
            <section className="group explain">
              <p>{current.explanation}</p>
              <p className="cite">{current.citation}</p>
              <p className={`src src-${current.sourceConfidence}`}>
                {current.sourceConfidence === "full"
                  ? "Source text: full public copy in the lab pack."
                  : current.sourceConfidence === "preview"
                    ? "Source text: preview only. This is not the full standard."
                    : "Source: typical IEC/CISPR practice, not a number invented for this quiz."}
              </p>
              <p className="row-sub">
                <SuggestLink /> — flag this item if the stem or the citation is
                off. Weak area: {areaLabel(current.area)}.
              </p>
            </section>
          )}
        </div>
        <div className="dock">
          <button
            className="btn primary"
            type="button"
            disabled={!revealed}
            onClick={advance}
          >
            {answeredCount + 1 >= QUIZ_LENGTH ? "See results" : "Next question"}
          </button>
        </div>
      </main>
    </>
  );
}
