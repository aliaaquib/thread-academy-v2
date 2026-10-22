/**
 * FILL IN THE BLANK — students type the missing word(s) in each sentence,
 * then check their answers. Runs entirely in the visitor's browser.
 *
 * MDX usage (pure-data props, like <Quiz>): each item's text carries one
 * blank written as ___ where the missing word belongs.
 *   <FillBlank
 *     title="Fill in the blank"
 *     items={[
 *       { text: "Plants make their own food by ___.", answer: "photosynthesis" },
 *     ]}
 *   />
 */
"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

export interface FillItem {
  text: string;
  answer: string;
}

function normalize(v: string): string {
  return v.trim().toLowerCase().replace(/\s+/g, " ");
}

export function FillBlank({
  title,
  items,
  lang = "en",
}: {
  title?: string;
  items: FillItem[];
  lang?: Lang;
}) {
  const clean = (items || []).filter((i) => i && i.text && i.answer);
  const [values, setValues] = useState<string[]>(() => clean.map(() => ""));
  const [checked, setChecked] = useState(false);

  if (clean.length === 0) return null;
  const isRight = (i: number) => normalize(values[i] ?? "") === normalize(clean[i].answer);
  const score = clean.reduce((n, _item, i) => n + (isRight(i) ? 1 : 0), 0);

  return (
    <div className="quiz fill-blank">
      <div className="quiz-head">{title ?? t(lang, "tb.fill.title")}</div>
      <div className="quiz-body">
        <p className="activity-instruction">{t(lang, "tb.fill.instruction")}</p>
        {clean.map((item, i) => {
          const parts = item.text.split("___");
          const state = !checked ? "" : isRight(i) ? " is-correct" : " is-wrong";
          return (
            <div className={`fill-row${state}`} key={i}>
              <p className="fill-sentence">
                {parts[0]}
                <input
                  className="fill-input"
                  type="text"
                  value={values[i] ?? ""}
                  disabled={checked}
                  onChange={(e) =>
                    setValues((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                  }
                  aria-label={t(lang, "tb.fill.title")}
                  autoComplete="off"
                  spellCheck={false}
                />
                {parts.slice(1).join("___")}
              </p>
              {checked && !isRight(i) && (
                <p className="fill-answer">{t(lang, "tb.fill.answeris", { answer: item.answer })}</p>
              )}
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
                setValues(clean.map(() => ""));
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
