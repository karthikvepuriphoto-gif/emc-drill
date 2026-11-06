import { SuggestLink, SuggestNote } from "../components/SuggestLink";
import { Nav } from "../components/Nav";
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
    <>
      <Nav
        title="EMC Drill"
        trailing={
          <a className="nav-action" href="#/history">
            History
          </a>
        }
      />
      <main className="screen">
        <p className="section-label">This device</p>
        <section className="group">
          <label className="row field-row">
            <span>Nickname</span>
            <input
              value={state.nickname}
              placeholder="Optional"
              maxLength={40}
              onChange={(e) => onNickname(e.target.value)}
              autoComplete="nickname"
              aria-label="Nickname for the score sheet"
            />
          </label>
          <div className="row">
            <span className="row-main">
              <span className="row-title">Learn streak</span>
              <span className="row-sub">
                Packs finished in a row. A quiz under 70% resets it and locks
                that topic until you re-read.
              </span>
            </span>
            <span className="row-value">{state.learnStreak}</span>
          </div>
        </section>
        <p className="caption">
          Short cards for the facts that show up on the bench, then a
          15-question adaptive quiz. Scores stay on this device. No account, no
          ads.
        </p>

        <p className="section-label">Topics</p>
        <ul className="group topic-list">
          {TOPICS.map((topic) => {
            const learn = learnOf(state, topic.id);
            const last = lastAttempt(state, topic.id);
            const seen = learn.seen.length;
            return (
              <li key={topic.id}>
                <a className="row topic-row" href={`#/topic/${topic.id}`}>
                  <span className="code">{topic.code}</span>
                  <span className="row-main">
                    <span className="row-title">{topic.title}</span>
                    <span className="row-sub">
                      {learn.complete ? "Learn done" : `Learn ${seen} seen`}
                      {" · "}
                      {topic.family}
                    </span>
                  </span>
                  {last ? <span className="row-value">{last.score}%</span> : null}
                  <svg viewBox="0 0 10 16" className="chev trail" aria-hidden="true">
                    <path
                      d="M2 2 L8 8 L2 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="section-label">Feedback</p>
        <section className="group">
          <SuggestLink className="row link-row" />
        </section>
        <SuggestNote />
        <p className="caption">
          Study tool for the bench. Limits are taken from the lab source pack
          (eCFR Part 15, ICES-002/003, the RED Guide, ETSI EN 301 489-1, REDCA
          TGN 01). Preview-only standards are marked and are not treated as the
          full text. Not a legal opinion and not a substitute for the standard.
        </p>
      </main>
    </>
  );
}
