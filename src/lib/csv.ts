import { topicById } from "../topics";
import type { Attempt } from "../types";

function cell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function attemptsToCsv(attempts: Attempt[]): string {
  const lines = ["nickname,topic,score,date"];
  for (const a of attempts) {
    const title = topicById(a.topic)?.title ?? a.topic;
    lines.push(
      [cell(a.nickname), cell(title), String(a.score), cell(a.date)].join(","),
    );
  }
  return lines.join("\n") + "\n";
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
