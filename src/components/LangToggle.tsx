/**
 * LANGUAGE DROPDOWN — the language picker in the navbar.
 * Shows the current language; opens a menu with English, Turkish,
 * Russian and Kyrgyz. Keeps the visitor on the equivalent page when
 * that language has it; otherwise lands on that language's homepage
 * (never a dead page).
 *
 * Each page publishes a `thread-academy-langs` meta tag listing the
 * languages it exists in (see pageMetadata in src/lib/seo.tsx). The
 * dropdown reads it and falls back to the homepage when the
 * translation is missing.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LANGS, isLang, stripLangPrefix, withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

/** Languages the current page exists in, from its meta tag. */
function availableLangs(fallback: Lang): Lang[] {
  if (typeof document === "undefined") return [fallback];
  const content = document
    .querySelector('meta[name="thread-academy-langs"]')
    ?.getAttribute("content");
  const list = (content ?? "").split(",").map((s) => s.trim()).filter(isLang);
  return list.length > 0 ? list : [fallback];
}

export function LangToggle({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();
  const { path } = stripLangPrefix(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  function go(target: Lang) {
    setOpen(false);
    if (target === lang) return;
    const href = availableLangs(lang).includes(target)
      ? withLang(path, target)
      : withLang("/", target);
    router.push(href);
  }

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  return (
    <div className="lang-dropdown" ref={rootRef}>
      <button
        type="button"
        className="lang-dropdown-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t(lang, "nav.language")}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="lang-dropdown-code">{current.code.toUpperCase()}</span>
        <svg
          className={open ? "lang-chevron open" : "lang-chevron"}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul className="lang-dropdown-menu" role="menu">
          {LANGS.map((l) => (
            <li key={l.code} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={l.code === lang}
                className={
                  l.code === lang
                    ? "lang-dropdown-item active"
                    : "lang-dropdown-item"
                }
                onClick={() => go(l.code)}
              >
                <span className="lang-dropdown-code">
                  {l.code.toUpperCase()}
                </span>
                <span className="lang-dropdown-name">{l.name}</span>
                {l.code === lang && (
                  <span className="lang-dropdown-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
