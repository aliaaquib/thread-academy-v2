"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { SearchEntry } from "@/lib/types";

const KIND_LABEL: Record<SearchEntry["kind"], string> = {
  subject: "Subject",
  chapter: "Chapter",
  topic: "Lesson",
  resource: "Resource",
};

function tokens(q: string): string[] {
  return q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function score(entry: SearchEntry, toks: string[]): number {
  const hay = `${entry.title.toLowerCase()} ${entry.text}`;
  let s = 0;
  for (const t of toks) {
    if (!hay.includes(t)) return -1;
    if (entry.title.toLowerCase().includes(t)) s += 3;
    else s += 1;
  }
  return s;
}

/** /search results UI — the reference search-panel language:
 *  bottom-rule input, black button, hairline result rows. */
export default function SearchUI() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const [value, setValue] = useState(initialQ);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((r) => {
        if (!r.ok) throw new Error("index missing");
        return r.json();
      })
      .then((data: SearchEntry[]) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!index) return [];
    const toks = tokens(q);
    if (toks.length === 0) return [];
    return index
      .map((e) => ({ entry: e, s: score(e, toks) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 50)
      .map((r) => r.entry);
  }, [index, q]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setQ(value);
    router.replace(value ? `/search?q=${encodeURIComponent(value)}` : "/search", {
      scroll: false,
    });
  }

  function tryExample() {
    setValue("linear equations");
    setQ("linear equations");
  }

  return (
    <div className="search-panel">
      <form onSubmit={submit} role="search" className="search-page-form">
        <div className="search-row">
          <input
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search lessons, chapters, subjects, resources…"
            aria-label="Search lessons"
          />
          <button className="search-go" type="submit">
            Search
          </button>
        </div>
      </form>

      {failed && (
        <div className="empty">
          <b style={{ color: "var(--ink)" }}>Search is unavailable.</b>
          <br />
          The search index could not be loaded. Please check your connection and try again.
        </div>
      )}

      {!failed && index === null && <p className="empty">Loading the search index…</p>}

      {!failed && index !== null && tokens(q).length === 0 && (
        <div className="empty">
          Type above to search every lesson, chapter, subject and resource. Try{" "}
          <button
            type="button"
            onClick={tryExample}
            style={{
              border: 0,
              background: "transparent",
              padding: 0,
              fontWeight: 800,
              borderBottom: "2px solid var(--accent)",
            }}
          >
            “linear equations”
          </button>
          .
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
          </p>
          <div className="search-results">
            {results.map((r) => (
              <Link key={`${r.kind}:${r.url}`} className="search-result" href={r.url}>
                <b>{r.title}</b>
                <span>
                  {KIND_LABEL[r.kind]}
                  {r.path ? ` · ${r.path}` : ""}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {index !== null && tokens(q).length > 0 && results.length === 0 && !failed && (
        <div className="empty">
          <b style={{ color: "var(--ink)" }}>No results.</b>
          <br />
          Nothing matched “{q}”. Try different words, or browse subjects instead.
        </div>
      )}
    </div>
  );
}
