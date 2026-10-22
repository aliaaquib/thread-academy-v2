/**
 * MATCH THE FOLLOWING — students pair each item on the left with the
 * correct option on the right, then check their answers. Runs entirely
 * in the visitor's browser; nothing is sent anywhere.
 *
 * MDX usage (pure-data props, like <Quiz>):
 *   <MatchActivity
 *     title="Match the following"
 *     pairs={[
 *       { left: "CPU", right: "Processes instructions" },
 *       { left: "RAM", right: "Stores data while the computer is on" },
 *     ]}
 *   />
 */
"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

export interface MatchPair {
  left: string;
  right: string;
}

/** Deterministic shuffle (seeded by content) so server and browser agree. */
function shuffled<T>(items: T[], seedText: string): T[] {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function MatchActivity({
  title,
  pairs,
  lang = "en",
}: {
  title?: string;
  pairs: MatchPair[];
  lang?: Lang;
}) {
  const clean = (pairs || []).filter((p) => p && p.left && p.right);
  const options = useMemo(
    () => shuffled(clean.map((p) => p.right), clean.map((p) => p.left + p.right).join("|")),
    [clean]
  );
  const [picks, setPicks] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  if (clean.length === 0) return null;
  const score = clean.reduce((n, p, i) => n + (picks[i] === p.right ? 1 : 0), 0);

  return (
    <div className="quiz match-activity">
      <div className="quiz-head">{title ?? t(lang, "tb.match.title")}</div>
      <div className="quiz-body">
        <p className="activity-instruction">{t(lang, "tb.match.instruction")}</p>
        {clean.map((pair, i) => {
          const state = !checked ? "" : picks[i] === pair.right ? " is-correct" : " is-wrong";
          return (
            <div className={`match-row${state}`} key={i}>
              <span className="match-left">{pair.left}</span>
              <select
                className="match-select"
                value={picks[i] ?? ""}
                disabled={checked}
                onChange={(e) => setPicks((prev) => ({ ...prev, [i]: e.target.value }))}
                aria-label={pair.left}
              >
                <option value="">{t(lang, "tb.match.choose")}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
        <div className="activity-actions">
          {!checked ? (
            <button type="button" className="quiz-submit" onClick={() => setChecked(true)}>
              {t(lang, "tb.activity.check")}
            </button>
          ) : (
            <button
              type="button"
              className="quiz-submit"
              onClick={() => {
                setChecked(false);
                setPicks({});
              }}
            >
              {t(lang, "tb.activity.retry")}
            </button>
          )}
        </div>
        <div className={`quiz-score${checked ? " visible" : ""}`}>
          {checked ? t(lang, "tb.quiz.scored", { score, total: clean.length }) : ""}
        </div>
      </div>
    </div>
  );
}
