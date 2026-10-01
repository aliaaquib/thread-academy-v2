/**
 * CALLOUT — a highlighted box inside lesson text for key ideas, warnings
 * and tips. kind="key" gives it the soft lime background.
 */
import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

/** .callout with lime left border. kind="key" → soft lime background. */
export function Callout({ title, kind, children }: { title: string; kind?: "key"; children: ReactNode }) {
  return (
    <div className={`callout${kind === "key" ? " key" : ""}`}>
      <div className="callout-title">{title}</div>
      <div>{children}</div>
    </div>
  );
}

/** Default titles follow the page language (teachers can override via props). */
export function Definition({ term, children, lang = "en" }: { term?: string; children: ReactNode; lang?: Lang }) {
  return (
    <Callout title={term ? t(lang, "tb.definition.term", { term }) : t(lang, "tb.definition")}>
      {children}
    </Callout>
  );
}

export function ImportantNote({ title, children, lang = "en" }: { title?: string; children: ReactNode; lang?: Lang }) {
  return <Callout title={title ?? t(lang, "tb.note")}>{children}</Callout>;
}

export function WorkedExample({ title, children, lang = "en" }: { title?: string; children: ReactNode; lang?: Lang }) {
  return <Callout title={title ?? t(lang, "tb.worked")}>{children}</Callout>;
}

export function Example({ title, children, lang = "en" }: { title?: string; children: ReactNode; lang?: Lang }) {
  return <Callout title={title ?? t(lang, "tb.example")}>{children}</Callout>;
}

export function Summary({ children, lang = "en" }: { children: ReactNode; lang?: Lang }) {
  return <Callout title={t(lang, "tb.takeaways")} kind="key">{children}</Callout>;
}
