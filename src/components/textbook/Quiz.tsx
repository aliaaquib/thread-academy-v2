"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

interface QuizApi {
  register: (id: string) => void;
  answer: (id: string, correct: boolean) => void;
}

const QuizContext = createContext<QuizApi | null>(null);

/** .quiz wrapper with dark .quiz-head and a live score once all questions are answered. */
export function Quiz({ title = "Check your understanding", children }: { title?: string; children: ReactNode }) {
  const ids = useRef(new Set<string>());
  const answered = useRef(new Set<string>());
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(0);
  const [score, setScore] = useState(0);

  const register = useCallback((id: string) => {
    if (!ids.current.has(id)) {
      ids.current.add(id);
      setTotal(ids.current.size);
    }
  }, []);

  const answer = useCallback((id: string, correct: boolean) => {
    if (answered.current.has(id)) return;
    answered.current.add(id);
    if (correct) setScore((s) => s + 1);
    setDone(answered.current.size);
  }, []);

  return (
    <QuizContext.Provider value={{ register, answer }}>
      <div className="quiz">
        <div className="quiz-head">{title}</div>
        <div className="quiz-body">{children}</div>
        <div className={`quiz-score${total > 0 && done === total ? " visible" : ""}`}>
          {total > 0 && done === total
            ? `You scored ${score} out of ${total}${score === total ? " — perfect! 🎉" : score >= Math.ceil(total / 2) ? " — well done." : " — review the lesson and try again."}`
            : ""}
        </div>
      </div>
    </QuizContext.Provider>
  );
}

export function QuizQuestion({
  question,
  options,
  answer,
  explanation,
}: {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}) {
  const id = useId();
  const api = useContext(QuizContext);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    api?.register(id);
  }, [api, id]);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    api?.answer(id, i === answer);
  };

  return (
    <div className="quiz-q">
      <p className="q-text">{question}</p>
      <div className="quiz-opts">
        {options.map((opt, i) => {
          let cls = "quiz-opt";
          if (picked !== null) {
            if (i === answer) cls += " correct";
            else if (i === picked) cls += " wrong";
          }
          return (
            <button key={i} type="button" className={cls} disabled={picked !== null} onClick={() => choose(i)}>
              {opt}
            </button>
          );
        })}
      </div>
      <div className={`quiz-explain${picked !== null && explanation ? " visible" : ""}`}>{explanation}</div>
    </div>
  );
}
