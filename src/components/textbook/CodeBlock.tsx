/**
 * CODE BLOCK — a code sample with a copy button, used in programming lessons.
 * The language label is just a caption; no syntax highlighting is applied.
 */
"use client";

import { useState, isValidElement } from "react";
import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

/**
 * Pull plain text out of whatever MDX hands us. MDX compiles block-level
 * component content as markdown, so plain text arrives wrapped in a <p>
 * element (String() on that gives "[object Object]"). This walks strings,
 * arrays and elements and returns just the text.
 */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** Dark .code-block with language label + copy button.
 *  `lang` is the code caption ("Python"); `uiLang` is the page language. */
export function CodeBlock({ lang, children, uiLang = "en" }: { lang?: string; children?: ReactNode; uiLang?: Lang }) {
  const [copied, setCopied] = useState(false);
  const code = textOf(children).replace(/^\n+|\n+$/g, "");
  const label = lang ?? t(uiLang, "tb.code");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="code-block">
      <div className="code-head">
        <span>{label}</span>
        <button type="button" className="copy-btn" onClick={copy}>
          {copied ? t(uiLang, "tb.copied") : t(uiLang, "tb.copy")}
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}
