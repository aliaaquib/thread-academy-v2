/**
 * EXAM FOCUS — the signature block of the new topic structure (2026-10-22).
 * Teaches the exact phrasing that earns exam marks, next to the near-miss
 * phrasing that scores zero, plus the one common mistake for the topic.
 *
 * MDX usage (pure-data props, like <Quiz>):
 *   <ExamFocus
 *     items={[
 *       { good: "Mitochondria release energy from glucose.",
 *         bad: "Mitochondria make energy.",
 *         note: "Energy is released, never made." },
 *     ]}
 *     mistake="Giving the file size in bits when the question asks for bytes."
 *   />
 */
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

export interface ExamPair {
  /** The phrasing that earns the mark. */
  good: string;
  /** The near-miss phrasing that scores zero. */
  bad: string;
  /** Why the bad version fails (optional). */
  note?: string;
}

export function ExamFocus({
  items,
  mistake,
  lang = "en",
}: {
  items: ExamPair[];
  mistake?: string;
  lang?: Lang;
}) {
  const pairs = (items || []).filter((i) => i && i.good && i.bad);
  if (pairs.length === 0 && !mistake) return null;
  return (
    <div className="exam-focus">
      <div className="exam-focus-title">{t(lang, "tb.examfocus")}</div>
      {pairs.map((pair, i) => (
        <div className="exam-pair" key={i}>
          <div className="exam-row exam-good">
            <span className="exam-tag">{t(lang, "tb.examfocus.good")}</span>
            <span className="exam-text">“{pair.good}”</span>
          </div>
          <div className="exam-row exam-bad">
            <span className="exam-tag">{t(lang, "tb.examfocus.bad")}</span>
            <span className="exam-text">
              “{pair.bad}”{pair.note ? <span className="exam-note"> — {pair.note}</span> : null}
            </span>
          </div>
        </div>
      ))}
      {mistake && (
        <div className="exam-mistake">
          <span className="exam-tag">{t(lang, "tb.examfocus.mistake")}</span>
          <span className="exam-text">{mistake}</span>
        </div>
      )}
    </div>
  );
}
