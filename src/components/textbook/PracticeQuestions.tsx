/**
 * PRACTICE QUESTIONS — practice blocks inside lessons. Each item hides its
 * answer until the reader opens it, so they attempt the question first.
 */
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

/** Reveal-answer practice items in the .practice design. */
export function PracticeQuestions({ children }: { children: ReactNode }) {
  return <div className="practice">{children}</div>;
}

export function PracticeItem({
  question,
  hint,
  children,
  lang = "en",
}: {
  question: string;
  hint?: string;
  children: ReactNode;
  lang?: Lang;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="practice-item">
      <div className="p-q">{question}</div>
      {hint && <div className="p-hint">{hint}</div>}
      <button type="button" className="reveal-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? t(lang, "tb.hide") : t(lang, "tb.reveal")}
      </button>
      <div className={`practice-answer${open ? " visible" : ""}`}>{children}</div>
    </div>
  );
}
