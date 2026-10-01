/**
 * SEARCH BOX + RESULTS — the interactive part of the /search page.
 * (The page shell is page.tsx next to this file.)
 * Loads the language's search index (built at build time) and filters it in
 * the visitor's browser as they type. No server, no database.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { SearchEntry } from "@/lib/types";
import { langMeta, withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";

/** Unicode-aware tokenization: letters and numbers in any script. */
function tokens(q: string, locale: string): string[] {
  return q.toLocaleLowerCase(locale).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function score(entry: SearchEntry, toks: string[], locale: string): number {
  const hay = `${entry.title.toLocaleLowerCase(locale)} ${entry.text}`;
  let s = 0;
  for (const t of toks) {
    if (!hay.includes(t)) return -1;
    if (entry.title.toLocaleLowerCase(locale).includes(t)) s += 3;
    else s += 1;
  }
  return s;
}

/** /search results UI — the reference search-panel language:
 *  bottom-rule input, black button, hairline result rows. */
export default function SearchUI({ lang }: { lang: Lang }) {
  const locale = langMeta(lang).locale;
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const [value, setValue] = useState(initialQ);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  const kindLabel = (kind: SearchEntry["kind"]) => t(lang, `search.kind.${kind}`);

  useEffect(() => {
    let cancelled = false;
    fetch(withLang("/search-index.json", lang))
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
  }, [lang]);

  const results = useMemo(() => {
    if (!index) return [];
    const toks = tokens(q, locale);
    if (toks.length === 0) return [];
    return index
      .map((e) => ({ entry: e, s: score(e, toks, locale) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s || a.entry.title.localeCompare(b.entry.title, locale))
      .slice(0, 50)
      .map((r) => r.entry);
  }, [index, q, locale]);

  const searchPath = withLang("/search", lang);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setQ(value);
    router.replace(value ? `${searchPath}?q=${encodeURIComponent(value)}` : searchPath, {
      scroll: false,
    });
  }

  const example = t(lang, "search.empty.example");
  function tryExample() {
    setValue(example);
    setQ(example);
  }

  return (
    <div className="search-panel">
      <form onSubmit={submit} role="search" className="search-page-form">
        <div className="search-row">
          <input
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t(lang, "search.placeholder")}
            aria-label={t(lang, "search.aria")}
          />
          <button className="search-go" type="submit">
            {t(lang, "search.button")}
          </button>
        </div>
      </form>

      {failed && (
        <div className="empty">
          <b style={{ color: "var(--ink)" }}>{t(lang, "search.unavailable.title")}</b>
          <br />
          {t(lang, "search.unavailable.body")}
        </div>
      )}

      {!failed && index === null && <p className="empty">{t(lang, "search.loading.index")}</p>}

      {!failed && index !== null && tokens(q, locale).length === 0 && (
        <div className="empty">
          {t(lang, "search.empty.lede")}{" "}
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
            “{example}”
          </button>
          .
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            {tn(lang, "search.results", results.length, { n: results.length, q })}
          </p>
          <div className="search-results">
            {results.map((r) => (
              <Link key={`${r.kind}:${r.url}`} className="search-result" href={r.url}>
                <b>{r.title}</b>
                <span>
                  {kindLabel(r.kind)}
                  {r.path ? ` · ${r.path}` : ""}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {index !== null && tokens(q, locale).length > 0 && results.length === 0 && !failed && (
        <div className="empty">
          <b style={{ color: "var(--ink)" }}>{t(lang, "search.noresults.title")}</b>
          <br />
          {t(lang, "search.noresults.body", { q })}
        </div>
      )}
    </div>
  );
}
