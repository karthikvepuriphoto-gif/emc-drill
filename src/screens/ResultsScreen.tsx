import { PASS_PERCENT } from "../config";
import { ScoreMascot, moodFromScore } from "../components/ScoreMascot";
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
      <p>
        Unknown topic. <a href="#/">Back to topics</a>
      </p>
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
      <article className="stack">
        <h1>No result yet</h1>
        <p>Finish a {topic.title} quiz on this device to see a score.</p>
        <a className="btn" href={`#/topic/${topic.id}`}>
          Back to topic
        </a>
      </article>
    );
  }

  const passed = attempt.score >= PASS_PERCENT;
  const mood = moodFromScore(attempt.score);

  return (
    <article className="stack">
      <p className="back">
        <a href={`#/topic/${topic.id}`}>{topic.title}</a>
      </p>
      <p className="eyebrow">Result</p>
      <h1>
        {attempt.score}%{" "}
        <span className="score-frac">
          {attempt.correct}/{attempt.total}
        </span>
      </h1>
      <ScoreMascot mood={mood} />
      <p className={passed ? "verdict ok" : "verdict bad"}>
        {passed
          ? "Quiz stays open for this topic. The learn pack stays complete."
          : `Under ${PASS_PERCENT}%. The learn pack is open again, and the quiz stays locked until you re-read the cards.`}
      </p>
      <section className="panel">
        <h2>Weak areas</h2>
        {attempt.weak.length === 0 ? (
          <p>Nothing missed in this draw.</p>
        ) : (
          <ul className="weak">
            {attempt.weak.map((w) => (
              <li key={w.area}>
                <strong>{areaLabel(w.area)}</strong>
                <span>
                  {w.missed} missed
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      {attempt.misses.length > 0 && (
        <section className="stack">
          <h2>Missed questions</h2>
          {attempt.misses.map((m) => (
            <div className="card miss" key={m.id}>
              <h3>{m.stem}</h3>
              <p>
                You chose: {m.chosen}
                <br />
                Answer: {m.correct}
              </p>
              <p>{m.explanation}</p>
              <p className="cite">{m.citation}</p>
            </div>
          ))}
        </section>
      )}
      <div className="actions">
        <a className="btn" href={`#/learn/${topic.id}`}>
          {passed ? "Review cards" : "Re-read learn pack"}
        </a>
        {passed ? (
          <a className="btn primary" href={`#/quiz/${topic.id}`}>
            Try another draw
          </a>
        ) : (
          <button className="btn" type="button" disabled>
            Quiz locked
          </button>
        )}
      </div>
    </article>
  );
}
