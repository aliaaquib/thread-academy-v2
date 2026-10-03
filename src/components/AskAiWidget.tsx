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
 *     NEXT_PUBLIC_TUTOR_API_URL/api/ask (the Cloudflare tutor worker),
 *     with `Authorization: Bearer <token>` when the student signed in.
 *  3. If the worker URL is not set yet (or unreachable), it falls back to
 *     quoting the closest matching passages from the current page, and says
 *     plainly that the AI answer-writer isn't connected yet.
 *
 * Sign-in (Phase 1b): a "Sign in with Google" button starts the worker's
 * OAuth flow; the worker redirects back with #tutor_token=<JWT>, which the
 * widget stores in localStorage and sends as a Bearer token. Signed-in
 * students get 30 answers/day; anonymous visitors get 5/day per IP.
 * The worker enforces the quotas (429 when spent).
 */
import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_TUTOR_API_URL || "";
const ASK_ENDPOINT = API_URL ? `${API_URL.replace(/\/$/, "")}/api/ask` : "";
const AUTH_BASE = API_URL ? API_URL.replace(/\/$/, "") : "";

const TOKEN_KEY = "tutor_token";
function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
function setToken(t: string) {
  try {
    localStorage.setItem(TOKEN_KEY, t);
  } catch {
    /* private mode — stay anonymous */
  }
}
function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* noop */
  }
}

type Lang = "en" | "tr" | "ru" | "ky";

type Msg =
  | { role: "user"; text: string }
  | { role: "tutor"; text: string; remaining?: number; signedIn?: boolean }
  | { role: "note"; text: string };

const STR: Record<Lang, Record<string, string | ((n: number) => string)>> = {
  en: {
    label: "Ask AI",
    title: "Ask AI",
    greeting:
      "Hi! Ask me anything — homework, a concept you didn't get, revision help. You get 5 free answers a day.",
    placeholder: "Ask a question…",
    send: "Send",
    connecting:
      "The AI answer-writer isn't connected yet — but here are the closest passages from this page:",
    limited: "You've used your 5 free answers for today. Sign up free for 30 a day — or come back tomorrow!",
    signIn: "Sign in with Google",
    signInNote: "Free · 30 answers a day instead of 5",
    signOut: "Sign out",
    leftSigned: (n: number) => `${n} of 30 free answers left today`,
    helloReply:
      "Hi there! Ask me anything — homework, a concept, revision. What are you working on?",
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
      "Merhaba! İstediğini sor — ödev, anlamadığın bir konu, tekrar yardımı. Günde 5 ücretsiz cevap hakkın var.",
    placeholder: "Bir soru sor…",
    send: "Gönder",
    connecting:
      "Yapay zekâ cevaplayıcı henüz bağlı değil — ama bu sayfadaki en yakın bölümler şunlar:",
    limited: "Bugünkü 5 ücretsiz cevabını kullandın. Ücretsiz kaydol, günde 30 cevap al — ya da yarın tekrar gel!",
    signIn: "Google ile giriş yap",
    signInNote: "Ücretsiz · günde 5 yerine 30 cevap",
    signOut: "Çıkış yap",
    leftSigned: (n: number) => `Bugün 30 ücretsiz cevaptan ${n} kaldı`,
    helloReply:
      "Merhaba! İstediğini sor — ödev, konu, tekrar. Ne üzerine çalışıyorsun?",
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
      "Привет! Спрашивай что угодно — домашку, непонятную тему, помощь с повторением. У тебя 5 бесплатных ответов в день.",
    placeholder: "Задайте вопрос…",
    send: "Отправить",
    connecting:
      "ИИ-ответчик ещё не подключён — но вот самые близкие отрывки с этой страницы:",
    limited: "Ты использовал(а) все 5 бесплатных ответов на сегодня. Зарегистрируйся бесплатно и получай 30 в день — или возвращайся завтра!",
    signIn: "Войти через Google",
    signInNote: "Бесплатно · 30 ответов в день вместо 5",
    signOut: "Выйти",
    leftSigned: (n: number) => `Осталось бесплатных ответов сегодня: ${n} из 30`,
    helloReply:
      "Привет! Спрашивай что угодно — домашку, тему, повторение. Над чем работаешь?",
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
      "Салам! Каалаганыңды сура — үй тапшырмасы, түшүнбөгөн тема, кайталоого жардам. Күнүнө 5 акысыз жооп аласың.",
    placeholder: "Суроо бер…",
    send: "Жөнөтүү",
    connecting:
      "ЖИ жооп берүүчү азырынча туташтырыла элек — бирок бул барактагы эң жакын үзүндүлөр:",
    limited: "Бүгүнкү 5 акысыз жообуңду колдондуң. Акысыз каттал — күнүнө 30 жооп ал — же эртең кайра кел!",
    signIn: "Google менен кирүү",
    signInNote: "Акысыз · күнүнө 5 эмес, 30 жооп",
    signOut: "Чыгуу",
    leftSigned: (n: number) => `Бүгүн 30 акысыз жооптон ${n} калды`,
    helloReply:
      "Салам! Каалаганыңды сура — үй тапшырмасы, тема, кайталоо. Эмне менен алектенип жатасың?",
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

/**
 * Plain greetings are answered locally — no API call, no free-answer spent.
 * Only matches when the WHOLE message is a greeting ("hi", not "hi, what is…").
 */
const GREETINGS: Record<Lang, string[]> = {
  en: ["hi", "hello", "hey", "yo", "hiya", "howdy", "good morning", "good afternoon", "good evening"],
  tr: ["merhaba", "selam", "selamlar", "hey", "gunaydin", "günaydın", "iyi gunler", "iyi günler", "iyi aksamlar", "iyi akşamlar"],
  ru: ["привет", "здравствуй", "здравствуйте", "хай", "доброе утро", "добрый день", "добрый вечер"],
  ky: ["салам", "саламатсыңбы", "саламатсызбы", "кутман таң", "кутман кун", "кутман күн", "кутман кеч"],
};

function isGreeting(q: string, lang: Lang): boolean {
  const norm = q
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return norm.length > 0 && GREETINGS[lang].includes(norm);
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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const s = STR[lang];
  const t = (k: string) => s[k] as string;

  useEffect(() => {
    setLang(detectLang());
    setMounted(true);
    // Pick up the session token from the Google OAuth redirect fragment
    // (#tutor_token=… — fragments never leave the browser).
    try {
      const m = window.location.hash.match(/[#&]tutor_token=([^&]+)/);
      if (m) {
        setToken(decodeURIComponent(m[1]));
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    } catch {
      /* noop */
    }
    const token = getToken();
    if (token && AUTH_BASE) {
      fetch(`${AUTH_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && d.user) setUser(d.user);
          else clearToken();
        })
        .catch(() => {
          /* stay anonymous */
        });
    }
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "tutor", text: t("greeting") }]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  function signIn() {
    if (!AUTH_BASE) return;
    const ret = encodeURIComponent(window.location.href.split("#")[0]);
    window.location.href = `${AUTH_BASE}/api/auth/login?return=${ret}`;
  }

  function signOut() {
    clearToken();
    setUser(null);
  }

  async function ask() {
    const q = input.trim();
    if (!q || busy) return;
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    // Greetings get an instant local reply — no API call, no quota spent.
    if (isGreeting(q, lang)) {
      setMsgs((m) => [...m, { role: "tutor", text: t("helloReply") }]);
      setBusy(false);
      return;
    }
    let token = getToken();
    // Two attempts max: if the token is rejected, drop it and retry anonymously.
    for (let attempt = 0; attempt < 2; attempt++) {
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
          break;
        }
        const lesson = pageExcerpt();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const r = await fetch(ASK_ENDPOINT, {
          method: "POST",
          headers,
          body: JSON.stringify({ question: q.slice(0, 500), lang, lesson }),
        });
        if (r.status === 401 && token) {
          clearToken();
          setUser(null);
          token = null;
          continue;
        }
        if (r.status === 429) {
          setMsgs((m) => [...m, { role: "tutor", text: t("limited") }]);
          break;
        }
        if (!r.ok) throw new Error(`tutor api ${r.status}`);
        const data = await r.json();
        if (data.signedIn && data.user && data.user.name) {
          setUser((u) => u || { name: String(data.user.name), email: "" });
        }
        setMsgs((m) => [
          ...m,
          {
            role: "tutor",
            text: String(data.answer || t("error")),
            remaining: data.remaining,
            signedIn: Boolean(data.signedIn),
          },
        ]);
        break;
      } catch (e) {
        console.error("ask ai failed", e);
        setMsgs((m) => [...m, { role: "tutor", text: t("error") }]);
        break;
      }
    }
    setBusy(false);
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
          {AUTH_BASE && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                borderBottom: "1px solid #e3ddd0",
                background: "#fff",
                padding: "8px 16px",
              }}
            >
              {user ? (
                <>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#525252",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ✦ {user.name}
                  </span>
                  <button
                    type="button"
                    onClick={signOut}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#737373",
                      textDecoration: "underline",
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    {t("signOut")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={signIn}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    justifyContent: "center",
                    background: "#fff",
                    border: "1px solid #1a1a1a",
                    borderRadius: 999,
                    cursor: "pointer",
                    padding: "8px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1a1a1a",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.6 2.8c2.2-2 3.8-5 3.8-8.8z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-3.7 2.9c1.9 3.7 5.9 6.7 10.5 6.7z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4L1.5 6.7C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.3l3.8-2.9z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.5 0 3.5 2.6 1.4 6.7l3.8 2.9c1-2.9 3.7-4.9 6.8-4.9z"
                    />
                  </svg>
                  {t("signIn")}
                </button>
              )}
            </div>
          )}
          {!user && AUTH_BASE && (
            <p
              style={{
                margin: 0,
                padding: "6px 16px 0",
                background: "#faf8f2",
                fontSize: 11,
                color: "#a3a3a3",
                textAlign: "center",
              }}
            >
              {t("signInNote")}
            </p>
          )}
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
                        {m.signedIn
                          ? (s.leftSigned as (n: number) => string)(m.remaining)
                          : (s.left as (n: number) => string)(m.remaining)}
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
