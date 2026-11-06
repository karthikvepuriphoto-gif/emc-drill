import { emptyState } from "../lib/storage";
import { attemptsToCsv, downloadCsv } from "../lib/csv";
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
    <article className="stack">
      <p className="eyebrow">On this device</p>
      <h1>Score history</h1>
      <p className="lede">
        Learn streak <strong>{state.learnStreak}</strong>. Nothing here is
        uploaded.
      </p>
      <label className="nick">
        Nickname on the CSV
        <input
          value={state.nickname}
          placeholder="Optional"
          maxLength={40}
          onChange={(e) =>
            update((s) => ({ ...s, nickname: e.target.value }))
          }
        />
      </label>
      {rows.length === 0 ? (
        <p>No quiz attempts yet. A learn streak still counts without a score.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Topic</th>
                <th>Score</th>
                <th>Weak area</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.date).toLocaleString()}</td>
                  <td>{topicById(a.topic)?.title ?? a.topic}</td>
                  <td>
                    {a.score}% ({a.correct}/{a.total})
                  </td>
                  <td>{a.weak[0] ? areaLabel(a.weak[0].area) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="actions">
        <button
          className="btn primary"
          type="button"
          disabled={rows.length === 0}
          onClick={() =>
            downloadCsv(
              "emc-drill-scores.csv",
              attemptsToCsv(state.attempts),
            )
          }
        >
          Export CSV
        </button>
        <button
          className="btn"
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
      </div>
    </article>
  );
}
