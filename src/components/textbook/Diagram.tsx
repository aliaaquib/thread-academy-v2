import type { ReactNode } from "react";

/** .diagram: bordered figure, usually wrapping inline SVG. */
export function Diagram({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="diagram">
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
