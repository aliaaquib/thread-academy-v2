"use client";

/**
 * BLOG ACTIONS — the Medium-style engagement row under the author byline:
 * Share (Web Share API, falls back to copying the link) and Save
 * (bookmarks the article in the reader's own browser via localStorage).
 * Only real, working buttons — no fake counts.
 */
import { useEffect, useState } from "react";

type Lang = "en" | "tr" | "ru" | "ky";

const STR: Record<Lang, Record<string, string>> = {
  en: { share: "Share", copied: "Link copied", save: "Save", saved: "Saved" },
  tr: { share: "Paylaş", copied: "Bağlantı kopyalandı", save: "Kaydet", saved: "Kaydedildi" },
  ru: { share: "Поделиться", copied: "Ссылка скопирована", save: "Сохранить", saved: "Сохранено" },
  ky: { share: "Бөлүшүү", copied: "Шилтеме көчүрүлдү", save: "Сактоо", saved: "Сакталды" },
};

function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  const seg = window.location.pathname.split("/")[1];
  return seg === "tr" || seg === "ru" || seg === "ky" ? seg : "en";
}

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "6px 4px",
  fontSize: 14,
  color: "#62665c",
};

export function BlogActions({ slug, title }: { slug: string; title: string }) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const s = STR[lang];
  const key = `blog:saved:${slug}`;

  useEffect(() => {
    setLang(detectLang());
    try {
      setSaved(localStorage.getItem(key) === "1");
    } catch {
      /* private mode */
    }
  }, [key]);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return; // user dismissed — stay quiet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNotice(s.copied);
      setTimeout(() => setNotice(""), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  function toggleSave() {
    const next = !saved;
    setSaved(next);
    try {
      if (next) localStorage.setItem(key, "1");
      else localStorage.removeItem(key);
    } catch {
      /* private mode */
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        borderTop: "1px solid #dfe2da",
        borderBottom: "1px solid #dfe2da",
        padding: "10px 0",
        margin: "0 0 44px",
      }}
    >
      <button type="button" onClick={share} aria-label={s.share} style={btn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        {notice || s.share}
      </button>
      <button
        type="button"
        onClick={toggleSave}
        aria-label={s.save}
        aria-pressed={saved}
        style={btn}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        {saved ? s.saved : s.save}
      </button>
    </div>
  );
}
