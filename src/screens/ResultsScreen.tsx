import { PASS_PERCENT } from "../config";
import { ScoreMascot, moodFromScore } from "../components/ScoreMascot";
import { Nav } from "../components/Nav";
import { lastAttempt } from "../lib/storage";
import { areaLabel, topicById } from "../topics";
import type { Attempt, PersistedState } from "../types";

const LAST_KEY = "emc-drill-last-attempt";

function readSession(topicId: string): Attempt | null {
  try {
    const raw = sessionStorage.getItem(LAST_KEY);
    if (!raw) return null;
    const attempt = JSON.parse(raw) as Attempt;
    return attempt.topic === topicId ? attempt : null;
  } catch {
    return null;
  }
}

export function ResultsScreen({
  topicId,
  state,
}: {
  topicId: string;
  state: PersistedState;
}) {
  const topic = topicById(topicId);
  if (!topic) {
    return (
      <>
        <Nav title="Result" back={{ href: "#/", label: "Topics" }} />
        <main className="screen">
          <p className="status-line">Unknown topic.</p>
        </main>
      </>
    );
  }
  const stored = lastAttempt(state, topic.id);
  const session = readSession(topic.id);
  const attempt =
    stored && session
      ? stored.date >= session.date
        ? stored
        : session
      : (stored ?? session);

  if (!attempt) {
    return (
      <>
        <Nav
          title="Result"
          back={{ href: `#/topic/${topic.id}`, label: topic.code }}
        />
        <main className="screen">
          <p className="status-line">
            Finish a {topic.title} quiz on this device to see a score.
          </p>
          <div className="dock">
            <a className="btn primary" href={`#/topic/${topic.id}`}>
              Back to topic
            </a>
          </div>
        </main>
      </>
    );
  }

  const passed = attempt.score >= PASS_PERCENT;
  const mood = moodFromScore(attempt.score);

  return (
    <>
      <Nav
        title="Result"
        back={{ href: `#/topic/${topic.id}`, label: topic.code }}
      />
      <main className="screen">
        <div className="screen-body">
          <div className="score-block">
            <p className="score">
              {attempt.score}
              <span className="pct">%</span>
            </p>
            <p className="frac">
              {attempt.correct}/{attempt.total}
            </p>
            <ScoreMascot mood={mood} />
            <p className={passed ? "verdict ok" : "verdict bad"}>
              {passed
                ? "Quiz stays open for this topic. The learn pack stays complete."
                : `Under ${PASS_PERCENT}%. The learn pack is open again, and the quiz stays locked until you re-read the cards.`}
            </p>
          </div>
          <p className="section-label">Weak areas</p>
          <section className="group">
            {attempt.weak.length === 0 ? (
              <p className="pad">Nothing missed in this draw.</p>
            ) : (
              attempt.weak.map((w) => (
                <div className="row" key={w.area}>
                  <span className="row-title">{areaLabel(w.area)}</span>
                  <span className="row-value">{w.missed} missed</span>
                </div>
              ))
            )}
          </section>
          {attempt.misses.length > 0 && (
            <>
              <p className="section-label">Missed questions</p>
              <section className="group">
                {attempt.misses.map((m) => (
                  <div className="miss" key={m.id}>
                    <p className="row-title">{m.stem}</p>
                    <p className="row-sub">You chose: {m.chosen}</p>
                    <p className="row-sub">Answer: {m.correct}</p>
                    <p>{m.explanation}</p>
                    <p className="cite">{m.citation}</p>
                  </div>
                ))}
              </section>
            </>
          )}
        </div>
        <div className="dock">
          <a className="btn secondary" href={`#/learn/${topic.id}`}>
            {passed ? "Review cards" : "Re-read learn pack"}
          </a>
          {passed ? (
            <a className="btn primary" href={`#/quiz/${topic.id}`}>
              Try another draw
            </a>
          ) : (
            <button className="btn primary" type="button" disabled>
              Quiz locked
            </button>
          )}
        </div>
      </main>
    </>
  );
}
