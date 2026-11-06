import { DB_NAME, PASS_PERCENT } from "../config";
import type {
  Attempt,
  LearnRecord,
  PersistedState,
  TopicId,
} from "../types";

const STORE = "kv";
const KEY = "state";
const LS_KEY = "emc-drill-state";

export const emptyState = (): PersistedState => ({
  nickname: "",
  learn: {},
  attempts: [],
  learnStreak: 0,
});

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(): Promise<PersistedState | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(KEY);
    req.onsuccess = () => resolve((req.result as PersistedState) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(state: PersistedState): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(state, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function readLocal(): PersistedState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function writeLocal(state: PersistedState) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export async function loadState(): Promise<PersistedState> {
  try {
    const fromDb = await idbGet();
    if (fromDb) return { ...emptyState(), ...fromDb };
  } catch {
    /* fall through to localStorage */
  }
  const local = readLocal();
  const state = local ? { ...emptyState(), ...local } : emptyState();
  try {
    await idbSet(state);
  } catch {
    /* localStorage remains the copy */
  }
  return state;
}

export async function saveState(state: PersistedState): Promise<void> {
  writeLocal(state);
  try {
    await idbSet(state);
  } catch {
    /* localStorage already written */
  }
}

export function learnOf(
  state: PersistedState,
  topic: TopicId,
): LearnRecord {
  return state.learn[topic] ?? { complete: false, seen: [] };
}

export function noteCardSeen(
  state: PersistedState,
  topic: TopicId,
  cardId: string,
  allCardIds: string[],
): PersistedState {
  const current = learnOf(state, topic);
  if (current.seen.includes(cardId)) return state;
  const seen = [...current.seen, cardId];
  const complete = allCardIds.every((id) => seen.includes(id));
  const justFinished = complete && !current.complete;
  return {
    ...state,
    learnStreak: justFinished ? state.learnStreak + 1 : state.learnStreak,
    learn: {
      ...state.learn,
      [topic]: {
        complete,
        seen,
        completedAt: justFinished
          ? new Date().toISOString()
          : current.completedAt,
      },
    },
  };
}

export function recordAttempt(
  state: PersistedState,
  attempt: Attempt,
): PersistedState {
  const failed = attempt.score < PASS_PERCENT;
  const learn = { ...state.learn };
  if (failed) {
    learn[attempt.topic] = { complete: false, seen: [] };
  }
  return {
    ...state,
    learn,
    learnStreak: failed ? 0 : state.learnStreak,
    attempts: [...state.attempts, attempt],
  };
}

export function lastAttempt(
  state: PersistedState,
  topic: TopicId,
): Attempt | undefined {
  for (let i = state.attempts.length - 1; i >= 0; i--) {
    if (state.attempts[i].topic === topic) return state.attempts[i];
  }
  return undefined;
}
