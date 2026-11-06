import { lastAttempt, learnOf } from "../lib/storage";
import { TOPICS } from "../topics";
import type { PersistedState } from "../types";

export function HomeScreen({
  state,
  onNickname,
}: {
  state: PersistedState;
  onNickname: (nickname: string) => void;
}) {
  return (
    <div className="stack">
      <section className="hero">
        <p className="eyebrow">Learn, then quiz</p>
        <h1>EMC tests and the rules that sit behind them.</h1>
        <p className="lede">
          Short cards for the facts that show up on the bench, then a
          15-question adaptive quiz. Scores stay on this device. No account, no
          ads.
        </p>
        <label className="nick">
          Nickname for the score sheet
          <input
            value={state.nickname}
            placeholder="Optional, stored only here"
            maxLength={40}
            onChange={(e) => onNickname(e.target.value)}
            autoComplete="nickname"
          />
        </label>
        <p className="streak">
          Learn streak <strong>{state.learnStreak}</strong>
          <span>
            Packs finished in a row. A quiz under 70% resets it and locks that
            topic until you re-read.
          </span>
        </p>
      </section>
      <ul className="topic-list">
        {TOPICS.map((topic) => {
          const learn = learnOf(state, topic.id);
          const last = lastAttempt(state, topic.id);
          const seen = learn.seen.length;
          return (
            <li key={topic.id}>
              <a className="topic-row" href={`#/topic/${topic.id}`}>
                <span className="code">{topic.code}</span>
                <span className="topic-copy">
                  <strong>{topic.title}</strong>
                  <small>{topic.family}</small>
                </span>
                <span className="topic-meta">
                  <span className={learn.complete ? "pill ok" : "pill"}>
                    {learn.complete ? "Learn done" : `Learn ${seen} seen`}
                  </span>
                  <span className="pill">
                    {last ? `Last ${last.score}%` : "No score yet"}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
