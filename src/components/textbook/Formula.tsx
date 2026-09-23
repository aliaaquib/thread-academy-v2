import type { ReactNode } from "react";

/** Centred display formula in the design's tokens. */
export function Formula({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="formula">
      {label && <span className="formula-label">{label}</span>}
      <div>{children}</div>
    </div>
  );
}
