export type MascotMood = "high" | "mid" | "low";

/** Map a percent score onto the three poses. */
export function moodFromScore(percent: number): MascotMood {
  if (percent >= 80) return "high";
  if (percent >= 50) return "mid";
  return "low";
}

type Props = {
  mood: MascotMood;
  label?: string;
};

/**
 * Inline isometric chamber + antenna. No network calls.
 * Replace this component later with a Hairline embed; keep `mood` as
 * "high" | "mid" | "low".
 */
export function ScoreMascot({ mood, label }: Props) {
  const caption =
    label ??
    (mood === "high"
      ? "In the quiet zone."
      : mood === "mid"
        ? "On the edge of the limit line."
        : "Back to the learn cards.");

  return (
    <figure className={`mascot mood-${mood}`} data-mascot-mood={mood}>
      <svg viewBox="0 0 240 200" role="img" aria-label={caption}>
        <polygon
          className="floor"
          points="120,168 208,128 120,88 32,128"
        />
        <polygon className="wall wall-left" points="32,128 120,88 120,36 32,76" />
        <polygon className="wall wall-right" points="120,88 208,128 208,76 120,36" />
        <g className="absorbers" fill="none">
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={`l${i}`}
              x1={48 + i * 14}
              y1={112 - i * 7}
              x2={48 + i * 14}
              y2={70 - i * 7}
            />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={`r${i}`}
              x1={136 + i * 14}
              y1={78 + i * 7}
              x2={136 + i * 14}
              y2={48 + i * 7}
            />
          ))}
        </g>
        <polygon className="door" points="78,128 108,114 108,78 78,92" />
        <circle className="led" cx="168" cy="96" r="4" />
        <g className="tripod">
          <line x1="120" y1="132" x2="100" y2="158" />
          <line x1="120" y1="132" x2="140" y2="158" />
          <line x1="120" y1="132" x2="120" y2="160" />
        </g>
        <g className="antenna">
          <line className="mast" x1="120" y1="132" x2="120" y2="48" />
          <line x1="108" y1="58" x2="132" y2="58" />
          <line x1="102" y1="70" x2="138" y2="70" />
          <line x1="96" y1="82" x2="144" y2="82" />
          <circle cx="120" cy="46" r="3" />
        </g>
        <g className="figure">
          <circle className="head" cx="168" cy="128" r="6" />
          <line className="torso" x1="168" y1="134" x2="168" y2="156" />
          <line className="arm" x1="168" y1="142" x2="184" y2="132" />
          <line className="arm-back" x1="168" y1="142" x2="154" y2="148" />
          <line className="leg" x1="168" y1="156" x2="158" y2="172" />
          <line className="leg-b" x1="168" y1="156" x2="178" y2="172" />
        </g>
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
