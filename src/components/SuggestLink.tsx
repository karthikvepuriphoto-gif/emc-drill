import { SUGGESTION_FORM_URL, SUGGESTION_NOTE } from "../config";

export function SuggestLink({ className = "" }: { className?: string }) {
  return (
    <a
      className={className}
      href={SUGGESTION_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      Improve this quiz
    </a>
  );
}

export function SuggestNote() {
  return <p className="caption">{SUGGESTION_NOTE}</p>;
}
