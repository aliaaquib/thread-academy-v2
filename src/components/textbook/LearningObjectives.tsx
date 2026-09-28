/**
 * LEARNING OBJECTIVES — the checkmark list of goals shown near the top of
 * a lesson, telling the reader what they will be able to do afterwards.
 */
import type { ReactNode } from "react";

/** .learn-list: two-column checkmark list of learning objectives. */
export function LearningObjectives({ children }: { children: ReactNode }) {
  return <ul className="learn-list">{children}</ul>;
}
