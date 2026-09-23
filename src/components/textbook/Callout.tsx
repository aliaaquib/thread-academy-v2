import type { ReactNode } from "react";

/** .callout with lime left border. kind="key" → soft lime background. */
export function Callout({ title, kind, children }: { title: string; kind?: "key"; children: ReactNode }) {
  return (
    <div className={`callout${kind === "key" ? " key" : ""}`}>
      <div className="callout-title">{title}</div>
      <div>{children}</div>
    </div>
  );
}

export function Definition({ term, children }: { term?: string; children: ReactNode }) {
  return (
    <Callout title={term ? `Definition: ${term}` : "Definition"}>
      {children}
    </Callout>
  );
}

export function ImportantNote({ title = "Note", children }: { title?: string; children: ReactNode }) {
  return <Callout title={title}>{children}</Callout>;
}

export function WorkedExample({ title = "Worked example", children }: { title?: string; children: ReactNode }) {
  return <Callout title={title}>{children}</Callout>;
}

export function Example({ title = "Example", children }: { title?: string; children: ReactNode }) {
  return <Callout title={title}>{children}</Callout>;
}

export function Summary({ children }: { children: ReactNode }) {
  return <Callout title="Key takeaways" kind="key">{children}</Callout>;
}
