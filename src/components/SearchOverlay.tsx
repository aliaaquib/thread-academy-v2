"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface IndexEntry {
  kind: string;
  title: string;
  path: string;
  url: string;
  text: string;
}

/** Reference search overlay: fixed dimmed backdrop, panel with a bottom-rule
 *  input, and hairline result rows (title + curriculum path). Live-filters the
 *  static search index shipped at /search-index.json. */
export function SearchOverlay({
  open,
  initialQuery = "",
  onClose,
}: {
  open: boolean;
  initialQuery?: string;
  onClose: () => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [index, setIndex] = useState<IndexEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery(initialQuery);
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: IndexEntry[]) => setIndex(Array.isArray(data) ? data : []))
      .catch(() => setIndex([]));
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, [open, initialQuery]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const results = !q
    ? []
    : index
        .filter((e) => e.text.toLowerCase().includes(q) || e.title.toLowerCase().includes(q))
        .slice(0, 12);

  return (
    <div
      className="search-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label="Search lessons"
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
              placeholder="Search subjects, chapters, and topics"
              aria-label="Search lessons"
            />
            <button className="search-submit" type="submit">
              Search
            </button>
          </form>
          <button className="close-search" onClick={onClose} aria-label="Close search">
            ✕
          </button>
        </div>
        <div className="search-results">
          {!q ? (
            <div className="empty">Try &ldquo;linear equations&rdquo;, &ldquo;cell structure&rdquo;, &ldquo;Newton&rsquo;s laws&rdquo;, or &ldquo;variables&rdquo;.</div>
          ) : results.length > 0 ? (
            results.map((r) => (
              <Link key={r.url} className="search-result" href={r.url} onClick={onClose}>
                <b>{r.title}</b>
                <span>{r.path}</span>
              </Link>
            ))
          ) : (
            <div className="empty">No matching educational content yet. Try a subject, chapter, or broader topic.</div>
          )}
        </div>
      </div>
    </div>
  );
}
