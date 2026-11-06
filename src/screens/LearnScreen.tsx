import { useEffect, useState } from "react";
import { Nav } from "../components/Nav";
import { loadLearn } from "../lib/content";
import { learnOf, noteCardSeen } from "../lib/storage";
import { topicById } from "../topics";
import type { LearnPack, PersistedState } from "../types";

export function LearnScreen({
  topicId,
  state,
  update,
}: {
  topicId: string;
  state: PersistedState;
  update: (recipe: (prev: PersistedState) => PersistedState) => void;
}) {
  const topic = topicById(topicId);
  const [pack, setPack] = useState<LearnPack | null>(null);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!topic) return;
    let cancel = false;
    loadLearn(topic.id)
      .then((p) => {
        if (!cancel) setPack(p);
      })
      .catch(() => {
        if (!cancel) setError("Could not load this learn pack.");
      });
    return () => {
      cancel = true;
    };
  }, [topic]);

  useEffect(() => {
    if (!topic || !pack) return;
    const card = pack.cards[index];
    if (!card) return;
    const ids = pack.cards.map((c) => c.id);
    update((prev) => noteCardSeen(prev, topic.id, card.id, ids));
  }, [topic, pack, index, update]);

  if (!topic) {
    return (
      <>
        <Nav title="Learn" back={{ href: "#/", label: "Topics" }} />
        <main className="screen">
          <p className="status-line">Unknown topic.</p>
        </main>
      </>
    );
  }
  if (error) {
    return (
      <>
        <Nav
          title="Learn"
          back={{ href: `#/topic/${topic.id}`, label: topic.code }}
        />
        <main className="screen">
          <p className="status-line">{error}</p>
        </main>
      </>
    );
  }
  if (!pack) {
    return (
      <>
        <Nav
          title="Learn"
          back={{ href: `#/topic/${topic.id}`, label: topic.code }}
        />
        <main className="screen">
          <p className="status-line">Loading cards…</p>
        </main>
      </>
    );
  }

  const card = pack.cards[index];
  const learn = learnOf(state, topic.id);
  const total = pack.cards.length;

  function go(next: number) {
    setIndex(Math.max(0, Math.min(total - 1, next)));
  }

  return (
    <>
      <Nav
        title={`${index + 1}/${total}`}
        back={{ href: `#/topic/${topic.id}`, label: topic.code }}
        trailing={<span className="nav-meta">Learn</span>}
      />
      <main className="screen">
        <div
          className="learn-panel"
          onTouchStart={(e) => {
            const x = e.changedTouches[0]?.clientX ?? 0;
            e.currentTarget.dataset.x = String(x);
          }}
          onTouchEnd={(e) => {
            const start = Number(e.currentTarget.dataset.x ?? "0");
            const end = e.changedTouches[0]?.clientX ?? start;
            const dx = end - start;
            if (dx < -48) go(index + 1);
            if (dx > 48) go(index - 1);
          }}
        >
          <div
            className="bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={index + 1}
            aria-label="Cards read"
          >
            <span style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
          <h2 className="learn-title">{card.title}</h2>
          <p className="learn-body">{card.body}</p>
          <p className="cite">{card.citation}</p>
          <div className="dots" aria-hidden="true">
            {pack.cards.map((c, i) => (
              <span key={c.id} className={i === index ? "dot on" : "dot"} />
            ))}
          </div>
        </div>
        <p className="caption">
          {learn.complete
            ? "Pack complete. The quiz is unlocked."
            : "Swipe or use Next. The quiz unlocks when every card has been on screen."}
        </p>
        <div className="dock">
          <button
            className="btn secondary"
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
          >
            Previous
          </button>
          {index < total - 1 ? (
            <button className="btn primary" type="button" onClick={() => go(index + 1)}>
              Next card
            </button>
          ) : learn.complete ? (
            <a className="btn primary" href={`#/quiz/${topic.id}`}>
              Start quiz
            </a>
          ) : (
            <button className="btn primary" type="button" disabled>
              Finish the card
            </button>
          )}
        </div>
      </main>
    </>
  );
}
