"use client";

import { useState } from "react";

/** Dark .code-block with language label + copy button. */
export function CodeBlock({ lang = "Code", children }: { lang?: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

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
        <span>{lang}</span>
        <button type="button" className="copy-btn" onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}
