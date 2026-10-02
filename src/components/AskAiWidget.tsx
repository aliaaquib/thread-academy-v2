"use client";

/**
 * ASK AI WIDGET — floating "Ask AI" button on every page of the academy.
 *
 * Mounted once in the root layout (src/app/layout.tsx) so it appears from
 * the homepage to the last lesson page, in all four languages.
 *
 * STYLING NOTE: this component uses inline styles only — no Tailwind classes.
 * The academy's stylesheet (src/app/globals.css) is hand-written custom CSS;
 * Tailwind utilities are not emitted, so class-based styling renders unstyled.
 *
 * How it works:
 *  1. Detects the page language from the URL prefix (/tr, /ru, /ky, else en).
 *  2. On send, it grabs the visible lesson text from the page and POSTs
 *     { question, lang, lesson: { title, url, excerpt } } to
 *     NEXT_PUBLIC_TUTOR_API_URL/api/ask (the Cloudflare tutor worker).
 *  3. If the worker URL is not set yet (or unreachable), it falls back to
 *     quoting the closest matching passages from the current page, and says
 *     plainly that the AI answer-writer isn't connected yet.
 *
 * The worker enforces the free quota (5 answers/day per IP, 429 when spent).
 */
import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_TUTOR_API_URL || "";
const ASK_ENDPOINT = API_URL ? `${API_URL.replace(/\/$/, "")}/api/ask` : "";

type Lang = "en" | "tr" | "ru" | "ky";

type Msg =
  | { role: "user"; text: string }
  | { role: "tutor"; text: string; remaining?: number }
  | { role: "note"; text: string };

const STR: Record<Lang, Record<string, string | ((n: number) => string)>> = {
  en: {
    label: "Ask AI",
    title: "Ask AI",
    greeting:
      "Hi! Ask me anything about what you're reading — I answer from the lesson text on this page. You get 5 free answers a day.",
    placeholder: "Ask a question…",
    send: "Send",
    connecting:
      "The AI answer-writer isn't connected yet — but here are the closest passages from this page:",
    limited: "You've used your 5 free answers for today. Come back tomorrow!",
    left: (n: number) => `${n} free answer${n === 1 ? "" : "s"} left today`,
    error: "Something went wrong on my side — please try again in a moment.",
    noPassage:
      "I couldn't find that on this page — try asking about a definition or a worked example from the lesson.",
    thinking: "Thinking…",
  },
  tr: {
    label: "Yapay Zekâya Sor",
    title: "Yapay Zekâya Sor",
    greeting:
      "Merhaba! Okuduğun her şeyi bana sorabilirsin — cevaplarımı bu sayfadaki ders metninden veririm. Günde 5 ücretsiz cevap hakkın var.",
    placeholder: "Bir soru sor…",
    send: "Gönder",
    connecting:
      "Yapay zekâ cevaplayıcı henüz bağlı değil — ama bu sayfadaki en yakın bölümler şunlar:",
    limited: "Bugünkü 5 ücretsiz cevabını kullandın. Yarın tekrar gel!",
    left: (n: number) => `Bugün ${n} ücretsiz cevap kaldı`,
    error: "Bir sorun oluştu — lütfen birazdan tekrar dene.",
    noPassage:
      "Bunu bu sayfada bulamadım — dersteki bir tanımı ya da çözümlü örneği sormayı dene.",
    thinking: "Düşünüyorum…",
  },
  ru: {
    label: "Спросить ИИ",
    title: "Спросить ИИ",
    greeting:
      "Привет! Спрашивай о том, что читаешь — я отвечаю по тексту урока на этой странице. У тебя 5 бесплатных ответов в день.",
    placeholder: "Задайте вопрос…",
    send: "Отправить",
    connecting:
      "ИИ-ответчик ещё не подключён — но вот самые близкие отрывки с этой страницы:",
    limited: "Ты использовал(а) все 5 бесплатных ответов на сегодня. Возвращайся завтра!",
    left: (n: number) => `Осталось бесплатных ответов сегодня: ${n}`,
    error: "Что-то пошло не так — попробуй ещё раз через минуту.",
    noPassage:
      "Я не нашёл(а) это на этой странице — попробуй спросить про определение или разобранный пример из урока.",
    thinking: "Думаю…",
  },
  ky: {
    label: "ЖИден суроо",
    title: "ЖИден суроо",
    greeting:
      "Салам! Окуп жатканың тууралуу суроо бер — жоопторду ушул барактагы сабактын текстинен берем. Күнүнө 5 акысыз жооп аласың.",
    placeholder: "Суроо бер…",
    send: "Жөнөтүү",
    connecting:
      "ЖИ жооп берүүчү азырынча туташтырыла элек — бирок бул барактагы эң жакын үзүндүлөр:",
    limited: "Бүгүнкү 5 акысыз жообуңду колдондуң. Эртең кайра кел!",
    left: (n: number) => `Бүгүн ${n} акысыз жооп калды`,
    error: "Бир нерсе туура эмес болду — бир аздан кийин кайра аракет кыл.",
    noPassage:
      "Муну бул барактан таба албадым — сабактагы аныктама же чыгарылган мисал жөнүндө сурап көр.",
    thinking: "Ойлодум…",
  },
};

function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  const seg = window.location.pathname.split("/")[1];
  return seg === "tr" || seg === "ru" || seg === "ky" ? seg : "en";
}

function pageExcerpt(): { title: string; url: string; excerpt: string } {
  if (typeof document === "undefined") return { title: "", url: "", excerpt: "" };
  const main = document.querySelector("main");
  const text = (main?.innerText || document.body.innerText || "").replace(/\s+/g, " ").trim();
  return {
    title: document.title,
    url: window.location.pathname,
    excerpt: text.slice(0, 6000),
  };
}

/** Tiny keyword fallback: closest paragraphs on the current page. */
function localPassages(question: string): string[] {
  if (typeof document === "undefined") return [];
  const main = document.querySelector("main");
  const text = main?.innerText || document.body.innerText || "";
  const paras = text
    .split(/\n{2,}|\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 60);
  const words = new Set(
    question
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
  if (!words.size) return [];
  return paras
    .map((p) => {
      const set = new Set(p.toLowerCase().split(/\s+/));
      let score = 0;
      words.forEach((w) => {
        if (set.has(w)) score += 1;
      });
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => (x.p.length > 500 ? x.p.slice(0, 500) + "…" : x.p));
}

export function AskAiWidget() {
  // Rendered only after mount: the language comes from the URL on the client,
  // so rendering during SSR/hydration would mismatch the static HTML.
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hover, setHover] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const s = STR[lang];
  const t = (k: string) => s[k] as string;

  useEffect(() => {
    setLang(detectLang());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "tutor", text: t("greeting") }]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  async function ask() {
    const q = input.trim();
    if (!q || busy) return;
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    try {
      if (!ASK_ENDPOINT) {
        // Worker not connected yet — quote the closest page passages honestly.
        const passages = localPassages(q);
        setMsgs((m) => [
          ...m,
          { role: "note", text: t("connecting") },
          ...(passages.length
            ? passages.map((p) => ({ role: "tutor" as const, text: p }))
            : [{ role: "tutor" as const, text: t("noPassage") }]),
        ]);
        return;
      }
      const lesson = pageExcerpt();
      const r = await fetch(ASK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q.slice(0, 500), lang, lesson }),
      });
      if (r.status === 429) {
        setMsgs((m) => [...m, { role: "tutor", text: t("limited") }]);
        return;
      }
      if (!r.ok) throw new Error(`tutor api ${r.status}`);
      const data = await r.json();
      setMsgs((m) => [
        ...m,
        { role: "tutor", text: String(data.answer || t("error")), remaining: data.remaining },
      ]);
    } catch (e) {
      console.error("ask ai failed", e);
      setMsgs((m) => [...m, { role: "tutor", text: t("error") }]);
    } finally {
      setBusy(false);
    }
  }

  if (!mounted) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label={t("label")}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            background: "#1a1a1a",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            padding: "12px 20px",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)",
            transform: hover ? "scale(1.05)" : "scale(1)",
            transition: "transform .15s ease",
          }}
        >
          <span aria-hidden="true">✦</span>
          {t("label")}
        </button>
      )}
      {open && (
        <div
          role="dialog"
          aria-label={t("title")}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            height: "min(70vh, 560px)",
            width: "min(92vw, 380px)",
            overflow: "hidden",
            borderRadius: 16,
            border: "2px solid #1a1a1a",
            background: "#fff",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#1a1a1a",
              padding: "12px 16px",
            }}
          >
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#fff" }}>
              <span aria-hidden="true" style={{ marginRight: 8 }}>
                ✦
              </span>
              {t("title")}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 20,
                lineHeight: 1,
                color: "rgba(255,255,255,.8)",
              }}
            >
              ×
            </button>
          </div>
          <div
            ref={boxRef}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              overflowY: "auto",
              background: "#faf8f2",
              padding: 16,
            }}
          >
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      maxWidth: "85%",
                      background: "#1a1a1a",
                      color: "#fff",
                      borderRadius: 16,
                      borderBottomRightRadius: 4,
                      padding: "10px 14px",
                      fontSize: 14,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ) : m.role === "note" ? (
                <p key={i} style={{ margin: 0, fontSize: 12, fontStyle: "italic", color: "#737373" }}>
                  {m.text}
                </p>
              ) : (
                <div key={i} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "92%",
                      background: "#fff",
                      border: "1px solid #e3ddd0",
                      borderRadius: 16,
                      borderBottomLeftRadius: 4,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "#1a1a1a",
                    }}
                  >
                    <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{m.text}</p>
                    {typeof m.remaining === "number" && (
                      <p
                        style={{
                          margin: "8px 0 0",
                          borderTop: "1px dashed #e3ddd0",
                          paddingTop: 6,
                          fontSize: 12,
                          color: "#737373",
                        }}
                      >
                        {(s.left as (n: number) => string)(m.remaining)}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
            {busy && (
              <p style={{ margin: 0, fontSize: 12, fontStyle: "italic", color: "#737373" }}>
                {t("thinking")}
              </p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              borderTop: "1px solid #e3ddd0",
              background: "#fff",
              padding: 12,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") ask();
              }}
              placeholder={t("placeholder")}
              maxLength={500}
              style={{
                flex: 1,
                minWidth: 0,
                borderRadius: 999,
                border: "1px solid #1a1a1a",
                padding: "10px 16px",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={ask}
              disabled={busy || !input.trim()}
              style={{
                flexShrink: 0,
                borderRadius: 999,
                background: "#1a1a1a",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                padding: "10px 16px",
                fontSize: 14,
                fontWeight: 600,
                opacity: busy || !input.trim() ? 0.4 : 1,
              }}
            >
              {t("send")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
