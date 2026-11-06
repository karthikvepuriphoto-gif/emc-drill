import { emptyState } from "../lib/storage";
import { attemptsToCsv, downloadCsv } from "../lib/csv";
import { Nav } from "../components/Nav";
import { areaLabel, topicById } from "../topics";
import type { PersistedState } from "../types";

export function HistoryScreen({
  state,
  update,
}: {
  state: PersistedState;
  update: (recipe: (prev: PersistedState) => PersistedState) => void;
}) {
  const rows = [...state.attempts].reverse();

  return (
    <>
      <Nav title="History" back={{ href: "#/", label: "Topics" }} />
      <main className="screen">
        <div className="screen-body">
          <p className="section-label">On this device</p>
          <section className="group">
            <label className="row field-row">
              <span>Nickname</span>
              <input
                value={state.nickname}
                placeholder="Optional"
                maxLength={40}
                onChange={(e) =>
                  update((s) => ({ ...s, nickname: e.target.value }))
                }
                aria-label="Nickname on the CSV"
              />
            </label>
            <div className="row">
              <span className="row-title">Learn streak</span>
              <span className="row-value">{state.learnStreak}</span>
            </div>
          </section>
          <p className="caption">Nothing here is uploaded.</p>
          <p className="section-label">Attempts</p>
          {rows.length === 0 ? (
            <p className="caption">
              No quiz attempts yet. A learn streak still counts without a score.
            </p>
          ) : (
            <ul className="group">
              {rows.map((a) => (
                <li className="row" key={a.id}>
                  <span className="row-main">
                    <span className="row-title">
                      {topicById(a.topic)?.title ?? a.topic}
                    </span>
                    <span className="row-sub">
                      {new Date(a.date).toLocaleString()}
                      {a.weak[0] ? ` · ${areaLabel(a.weak[0].area)}` : ""}
                    </span>
                  </span>
                  <span className="row-value">
                    {a.score}%
                    <span className="row-sub">
                      {" "}
                      {a.correct}/{a.total}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dock">
          <button
            className="btn secondary"
            type="button"
            onClick={() => {
              if (
                confirm(
                  "Clear every score and learn flag stored on this device?",
                )
              ) {
                update(() => emptyState());
                sessionStorage.removeItem("emc-drill-last-attempt");
              }
            }}
          >
            Reset this device
          </button>
          <button
            className="btn primary"
            type="button"
            disabled={rows.length === 0}
            onClick={() =>
              downloadCsv("emc-drill-scores.csv", attemptsToCsv(state.attempts))
            }
          >
            Export CSV
          </button>
        </div>
      </main>
    </>
  );
}
