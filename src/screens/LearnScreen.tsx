import { useEffect, useState } from "react";
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
      <p>
        Unknown topic. <a href="#/">Back to topics</a>
      </p>
    );
  }
  if (error) return <p>{error}</p>;
  if (!pack) return <p className="muted">Loading cards…</p>;

  const card = pack.cards[index];
  const learn = learnOf(state, topic.id);
  const total = pack.cards.length;
  const seenCount = pack.cards.filter((c) => learn.seen.includes(c.id)).length;

  function go(next: number) {
    setIndex(Math.max(0, Math.min(total - 1, next)));
  }

  return (
    <article className="stack">
      <p className="back">
        <a href={`#/topic/${topic.id}`}>{topic.title}</a>
      </p>
      <div className="panel-head">
        <h1>Learn · {topic.code}</h1>
        <span>
          Card {index + 1} of {total}
        </span>
      </div>
      <div
        className="bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={seenCount}
        aria-label="Cards read"
      >
        <span style={{ width: `${(seenCount / total) * 100}%` }} />
      </div>
      <div
        className="card"
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
        <h2>{card.title}</h2>
        <p>{card.body}</p>
        <p className="cite">{card.citation}</p>
      </div>
      <div className="actions">
        <button
          className="btn"
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
      <p className="muted">
        {learn.complete
          ? "Pack complete. The quiz is unlocked."
          : "Swipe or use Next. The quiz unlocks when every card has been on screen."}
      </p>
    </article>
  );
}
