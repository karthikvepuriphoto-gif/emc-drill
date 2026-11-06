import { useEffect, useState } from "react";
import { PASS_PERCENT } from "../config";
import { loadLearn } from "../lib/content";
import { lastAttempt, learnOf } from "../lib/storage";
import { topicById } from "../topics";
import type { PersistedState } from "../types";

export function TopicScreen({
  topicId,
  state,
}: {
  topicId: string;
  state: PersistedState;
}) {
  const topic = topicById(topicId);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!topic) return;
    let cancel = false;
    loadLearn(topic.id).then((pack) => {
      if (!cancel) setTotal(pack.cards.length);
    });
    return () => {
      cancel = true;
    };
  }, [topic]);

  if (!topic) {
    return (
      <p>
        Unknown topic. <a href="#/">Back to topics</a>
      </p>
    );
  }

  const learn = learnOf(state, topic.id);
  const last = lastAttempt(state, topic.id);
  const seen = total
    ? Math.min(learn.seen.length, total)
    : learn.seen.length;
  const locked = !learn.complete;

  return (
    <article className="stack">
      <p className="back">
        <a href="#/">All topics</a>
      </p>
      <p className="eyebrow">{topic.code}</p>
      <h1>{topic.title}</h1>
      <p className="lede">{topic.blurb}</p>
      <p className="family">{topic.family}</p>
      <div className="panel">
        <div className="panel-head">
          <h2>Learn pack</h2>
          <span>
            {total === null
              ? "…"
              : learn.complete
                ? `${total} of ${total} cards`
                : `${seen} of ${total} cards`}
          </span>
        </div>
        <div
          className="bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total ?? 1}
          aria-valuenow={learn.complete ? (total ?? seen) : seen}
        >
          <span
            style={{
              width: total
                ? `${((learn.complete ? total : seen) / total) * 100}%`
                : "0%",
            }}
          />
        </div>
        <p className="muted">
          Read every card. The quiz stays locked until the progress bar is
          full. A score under {PASS_PERCENT}% opens the pack again.
        </p>
        <div className="actions">
          <a className="btn primary" href={`#/learn/${topic.id}`}>
            {learn.complete ? "Review cards" : "Open learn cards"}
          </a>
          {locked ? (
            <button className="btn" type="button" disabled>
              Start quiz
            </button>
          ) : (
            <a className="btn" href={`#/quiz/${topic.id}`}>
              Start quiz
            </a>
          )}
        </div>
        {locked && (
          <p className="lock-note">
            Start quiz unlocks after you swipe through every card in this pack.
          </p>
        )}
        {last && (
          <p className="muted">
            Last score {last.score}% ({last.correct}/{last.total}) on{" "}
            {new Date(last.date).toLocaleString()}
          </p>
        )}
      </div>
    </article>
  );
}
