/**
 * SEARCH OVERLAY — the popup search panel opened from the nav search buttons.
 * Filters the built search index as the visitor types; Escape closes it.
 */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { langMeta, withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

interface IndexEntry {
  kind: string;
  title: string;
  path: string;
  url: string;
  text: string;
}

/** Reference search overlay: fixed dimmed backdrop, panel with a bottom-rule
 *  input, and hairline result rows (title + subject path). Live-filters the
 *  static search index shipped at /search-index.json. */
export function SearchOverlay({
  open,
  initialQuery = "",
  onClose,
  lang,
}: {
  open: boolean;
  initialQuery?: string;
  onClose: () => void;
  lang: Lang;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [index, setIndex] = useState<IndexEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery(initialQuery);
    fetch(withLang("/search-index.json", lang))
      .then((r) => (r.ok ? r.json() : []))
      .then((data: IndexEntry[]) => setIndex(Array.isArray(data) ? data : []))
      .catch(() => setIndex([]));
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, [open, initialQuery, lang]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const locale = langMeta(lang).locale;
  const q = query.trim().toLocaleLowerCase(locale);
  const results = !q
    ? []
    : index
        .filter(
          (e) =>
            e.text.includes(q) || e.title.toLocaleLowerCase(locale).includes(q)
        )
        .slice(0, 12);

  return (
    <div
      className="search-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label={t(lang, "overlay.aria")}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-panel">
        <div className="search-row">
          <form role="search" className="search-wrap overlay-search" onSubmit={(e) => e.preventDefault()}>
            <svg className="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              ref={inputRef}
              className="hero-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(lang, "overlay.placeholder")}
              aria-label={t(lang, "overlay.aria")}
            />
            <button className="search-submit" type="submit">
              {t(lang, "overlay.button")}
            </button>
          </form>
          <button className="close-search" onClick={onClose} aria-label={t(lang, "overlay.close")}>
            ✕
          </button>
        </div>
        <div className="search-results">
          {!q ? (
            <div className="empty">{t(lang, "overlay.empty")}</div>
          ) : results.length > 0 ? (
            results.map((r) => (
              <Link key={r.url} className="search-result" href={r.url} onClick={onClose}>
                <b>{r.title}</b>
                <span>{r.path}</span>
              </Link>
            ))
          ) : (
            <div className="empty">{t(lang, "overlay.none")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
