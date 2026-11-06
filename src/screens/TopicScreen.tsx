import { useEffect, useState } from "react";
import { PASS_PERCENT } from "../config";
import { Nav } from "../components/Nav";
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
      <>
        <Nav title="EMC Drill" back={{ href: "#/", label: "Topics" }} />
        <main className="screen">
          <p className="status-line">Unknown topic.</p>
        </main>
      </>
    );
  }

  const learn = learnOf(state, topic.id);
  const last = lastAttempt(state, topic.id);
  const seen = total ? Math.min(learn.seen.length, total) : learn.seen.length;
  const locked = !learn.complete;
  const progress = total ? ((learn.complete ? total : seen) / total) * 100 : 0;

  return (
    <>
      <Nav title={topic.code} back={{ href: "#/", label: "Topics" }} />
      <main className="screen">
        <div className="screen-body">
          <p className="section-label">{topic.title}</p>
          <section className="group">
            <div className="row stack-row">
              <p className="row-title">{topic.blurb}</p>
              <p className="row-sub">{topic.family}</p>
            </div>
            <div className="row stack-row">
              <div className="row-between">
                <span>Learn pack</span>
                <span className="row-value">
                  {total === null
                    ? "…"
                    : `${learn.complete ? total : seen}/${total}`}
                </span>
              </div>
              <div
                className="bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total ?? 1}
                aria-valuenow={learn.complete ? (total ?? seen) : seen}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <p className="row-sub">
                Read every card. The quiz stays locked until the bar is full. A
                score under {PASS_PERCENT}% opens the pack again.
              </p>
            </div>
            {last && (
              <div className="row">
                <span className="row-main">
                  <span className="row-title">Last score</span>
                  <span className="row-sub">
                    {last.correct}/{last.total} ·{" "}
                    {new Date(last.date).toLocaleString()}
                  </span>
                </span>
                <span className="row-value">{last.score}%</span>
              </div>
            )}
          </section>
          {locked && (
            <p className="caption">
              Start quiz unlocks after you swipe through every card in this
              pack.
            </p>
          )}
        </div>
        <div className="dock">
          <a className="btn primary" href={`#/learn/${topic.id}`}>
            {learn.complete ? "Review cards" : "Open learn cards"}
          </a>
          {locked ? (
            <button className="btn secondary" type="button" disabled>
              Start quiz
            </button>
          ) : (
            <a className="btn secondary" href={`#/quiz/${topic.id}`}>
              Start quiz
            </a>
          )}
        </div>
      </main>
    </>
  );
}
