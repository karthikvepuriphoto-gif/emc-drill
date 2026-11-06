export type TopicId = "re" | "ce" | "esd" | "ri" | "fcc" | "ices" | "red";

export type Difficulty = "easy" | "medium" | "hard";

export type SourceConfidence = "full" | "preview" | "practice";

export type Question = {
  id: string;
  topic: TopicId;
  difficulty: Difficulty;
  stem: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  citation: string;
  area: string;
  sourceConfidence: SourceConfidence;
};

export type LearnCard = {
  id: string;
  title: string;
  body: string;
  citation: string;
};

export type LearnPack = {
  topic: TopicId;
  cards: LearnCard[];
};

export type PresentedQuestion = Question & {
  /** Display order: index into the original choices array. */
  choiceOrder: number[];
};

export type Miss = {
  id: string;
  stem: string;
  area: string;
  chosen: string;
  correct: string;
  explanation: string;
  citation: string;
};

export type Attempt = {
  id: string;
  nickname: string;
  topic: TopicId;
  score: number;
  correct: number;
  total: number;
  date: string;
  weak: { area: string; missed: number }[];
  misses: Miss[];
};

export type LearnRecord = {
  complete: boolean;
  seen: string[];
  completedAt?: string;
};

export type PersistedState = {
  nickname: string;
  learn: Partial<Record<TopicId, LearnRecord>>;
  attempts: Attempt[];
  learnStreak: number;
};
