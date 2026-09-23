"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/** Reveal-answer practice items in the .practice design. */
export function PracticeQuestions({ children }: { children: ReactNode }) {
  return <div className="practice">{children}</div>;
}

export function PracticeItem({
  question,
  hint,
  children,
}: {
  question: string;
  hint?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="practice-item">
      <div className="p-q">{question}</div>
      {hint && <div className="p-hint">{hint}</div>}
      <button type="button" className="reveal-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? "Hide answer" : "Reveal answer"}
      </button>
      <div className={`practice-answer${open ? " visible" : ""}`}>{children}</div>
    </div>
  );
}
