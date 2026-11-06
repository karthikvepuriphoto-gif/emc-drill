import { useCallback, useEffect, useState, type ReactNode } from "react";
import { emptyState, loadState, saveState } from "./lib/storage";
import { HistoryScreen } from "./screens/HistoryScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { LearnScreen } from "./screens/LearnScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { TopicScreen } from "./screens/TopicScreen";
import type { PersistedState } from "./types";

type Route =
  | { name: "home" }
  | { name: "history" }
  | { name: "topic"; id: string }
  | { name: "learn"; id: string }
  | { name: "quiz"; id: string }
  | { name: "results"; id: string };

function parseHash(hash: string): Route {
  const parts = hash.replace(/^#/, "").split("/").filter(Boolean);
  if (parts[0] === "history") return { name: "history" };
  if (parts[0] === "topic" && parts[1]) return { name: "topic", id: parts[1] };
  if (parts[0] === "learn" && parts[1]) return { name: "learn", id: parts[1] };
  if (parts[0] === "quiz" && parts[1]) return { name: "quiz", id: parts[1] };
  if (parts[0] === "results" && parts[1])
    return { name: "results", id: parts[1] };
  return { name: "home" };
}

export default function App() {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(window.location.hash),
  );
  const [state, setState] = useState<PersistedState | null>(null);

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    let cancel = false;
    loadState()
      .then((s) => {
        if (!cancel) setState(s);
      })
      .catch(() => {
        if (!cancel) setState(emptyState());
      });
    return () => {
      cancel = true;
    };
  }, []);

  const update = useCallback(
    (recipe: (prev: PersistedState) => PersistedState) => {
      setState((prev) => {
        if (!prev) return prev;
        const next = recipe(prev);
        void saveState(next);
        return next;
      });
    },
    [],
  );

  let body: ReactNode = <p className="status-line">Loading scores on this device…</p>;
  if (state) {
    if (route.name === "home") {
      body = (
        <HomeScreen
          state={state}
          onNickname={(nickname) => update((s) => ({ ...s, nickname }))}
        />
      );
    } else if (route.name === "history") {
      body = <HistoryScreen state={state} update={update} />;
    } else if (route.name === "topic") {
      body = <TopicScreen topicId={route.id} state={state} />;
    } else if (route.name === "learn") {
      body = <LearnScreen topicId={route.id} state={state} update={update} />;
    } else if (route.name === "quiz") {
      body = <QuizScreen topicId={route.id} state={state} update={update} />;
    } else {
      body = <ResultsScreen topicId={route.id} state={state} />;
    }
  }

  return <div className="app">{body}</div>;
}
