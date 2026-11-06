import type { LearnPack, Question, TopicId } from "../types";

const questions: Record<TopicId, () => Promise<Question[]>> = {
  re: () => import("../data/questions/re.json").then((m) => m.default as Question[]),
  ce: () => import("../data/questions/ce.json").then((m) => m.default as Question[]),
  esd: () => import("../data/questions/esd.json").then((m) => m.default as Question[]),
  ri: () => import("../data/questions/ri.json").then((m) => m.default as Question[]),
  fcc: () => import("../data/questions/fcc.json").then((m) => m.default as Question[]),
  ices: () => import("../data/questions/ices.json").then((m) => m.default as Question[]),
  red: () => import("../data/questions/red.json").then((m) => m.default as Question[]),
};

const learn: Record<TopicId, () => Promise<LearnPack>> = {
  re: () => import("../data/learn/re.json").then((m) => m.default as LearnPack),
  ce: () => import("../data/learn/ce.json").then((m) => m.default as LearnPack),
  esd: () => import("../data/learn/esd.json").then((m) => m.default as LearnPack),
  ri: () => import("../data/learn/ri.json").then((m) => m.default as LearnPack),
  fcc: () => import("../data/learn/fcc.json").then((m) => m.default as LearnPack),
  ices: () => import("../data/learn/ices.json").then((m) => m.default as LearnPack),
  red: () => import("../data/learn/red.json").then((m) => m.default as LearnPack),
};

export function loadQuestions(topic: TopicId): Promise<Question[]> {
  return questions[topic]();
}

export function loadLearn(topic: TopicId): Promise<LearnPack> {
  return learn[topic]();
}
