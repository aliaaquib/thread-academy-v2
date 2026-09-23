import type { ReactNode } from "react";

/** .learn-list: two-column checkmark list of learning objectives. */
export function LearningObjectives({ children }: { children: ReactNode }) {
  return <ul className="learn-list">{children}</ul>;
}
