"use client";

/**
 * AI TUTOR WIDGET — "ask in your own words" for every lesson page.
 *
 * How it works:
 *  1. On first open it lazy-loads two things: /tutor-index.json (lesson chunks
 *     + embedding vectors, built by scripts/build-tutor-index.py) and the
 *     transformers.js runtime from a CDN.
 *  2. The student's question is embedded in the browser and matched against
 *     the index with cosine similarity — retrieval is 100% client-side.
 *  3. If NEXT_PUBLIC_TUTOR_API_URL is set, the top chunks are sent to the
 *     tutor worker (tutor-worker/), which asks a language model to write a
 *     natural-language answer grounded in those chunks.
 *  4. Without the worker configured, the widget shows the matching lesson
 *     passages directly — still genuinely useful, and honest about it.
 */
import { useCallback, useEffect, useRef, useState } from "react";

const TRANSFORMERS_CDN = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/+esm";
// The embedding model is self-hosted at /tutor-model (no huggingface.co needed
// at runtime). dtype q8 = the 23MB quantized build, plenty for retrieval.
const MODEL_PATH = "/tutor-model";
const TOP_K = 5;
const MIN_SCORE = 0.32;
const API_URL = process.env.NEXT_PUBLIC_TUTOR_API_URL || "";

type Chunk = {
  id: string;
  url: string;
  lesson: string;
  breadcrumb: string;
  heading: string;
  text: string;
  v: number[];
};

type Source = { url: string; lesson: string; heading: string; text: string; score: number };

type Msg =
  | { role: "user"; text: string }
  | { role: "tutor"; text: string; sources?: Source[] }
  | { role: "note"; text: string };

function cosine(a: number[] | Float32Array, b: number[] | Float32Array): number {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}

async function embedQuery(pipe: any, text: string): Promise<Float32Array> {
  const out = await pipe(text, { pooling: "mean", normalize: true });
  return out.data as Float32Array;
}

export function TutorWidget() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [status, setStatus] = useState("");
  const [chunks, setChunks] = useState<Chunk[] | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const pipeRef = useRef<any>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const ensureLoaded = useCallback(async () => {
    if (pipeRef.current && chunks) return;
    setReady("loading");
    setStatus("Loading the lesson index…");
    try {
      const mod = await import(/* webpackIgnore: true */ TRANSFORMERS_CDN);
      setStatus("Loading the lesson index…");
      const res = await fetch("/tutor-index.json");
      if (!res.ok) throw new Error(`index HTTP ${res.status}`);
      const index = await res.json();
      if (!index.chunks?.length) throw new Error("index empty");
      setStatus("Loading the AI model (one-time download, ~25MB)…");
      const pipe = await mod.pipeline("feature-extraction", MODEL_PATH, { dtype: "q8" });
      pipeRef.current = pipe;
      setChunks(index.chunks as Chunk[]);
      setReady("ready");
      setStatus("");
    } catch (e) {
      console.error("tutor load failed", e);
      setStatus(e instanceof Error ? e.message : "unknown error");
      setReady("error");
    }
  }, [chunks]);

  useEffect(() => {
    if (open && ready === "idle") ensureLoaded();
  }, [open, ready, ensureLoaded]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const ask = useCallback(async () => {
    const q = input.trim();
    if (!q || busy || !pipeRef.current || !chunks) return;
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    try {
      const qv = await embedQuery(pipeRef.current, q);
      // Boost chunks from the lesson/chapter the student is currently reading —
      // a question asked on a lesson page is usually about that lesson.
      const path = window.location.pathname;
      const chapterPath = path.split("/").slice(0, 6).join("/");
      const scored: Source[] = chunks
        .map((c) => {
          let boost = 0;
          if (c.url === path) boost = 0.25;
          else if (c.url.startsWith(chapterPath) && chapterPath.length > 20) boost = 0.15;
          return {
            url: c.url,
            lesson: c.lesson,
            heading: c.heading,
            text: c.text,
            score: cosine(qv, c.v) + boost,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, TOP_K);

      if (scored[0].score < MIN_SCORE) {
        setMsgs((m) => [
          ...m,
          {
            role: "tutor",
            text: "I couldn't find this in your lessons — try asking about something from the chapter, like a definition or one of the worked examples.",
          },
        ]);
        return;
      }

      if (API_URL) {
        // Full mode: the worker writes a natural-language answer from these sources.
        const r = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            sources: scored.map((s) => ({ lesson: s.lesson, heading: s.heading, text: s.text.slice(0, 1200) })),
          }),
        });
        if (!r.ok) throw new Error(`tutor api ${r.status}`);
        const data = await r.json();
        setMsgs((m) => [...m, { role: "tutor", text: data.answer as string, sources: scored }]);
      } else {
        // Retrieval mode: show the matching passages straight from the lessons.
        setMsgs((m) => [
          ...m,
          {
            role: "note",
            text: "The AI answer-writer isn't connected yet — but here are the exact lesson passages that answer your question:",
          },
          ...scored.slice(0, 3).map((s) => ({
            role: "tutor" as const,
            text: s.text.length > 600 ? s.text.slice(0, 600) + "…" : s.text,
            sources: [s],
          })),
        ]);
      }
    } catch (e) {
      console.error("tutor ask failed", e);
      setMsgs((m) => [...m, { role: "tutor", text: "Something went wrong on my side — please try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  }, [input, busy, chunks]);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ask the AI tutor"
          style={{
            position: "fixed",
            right: 22,
            bottom: 22,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 20px",
            borderRadius: 999,
            background: "#1a1a1a",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 28px rgba(0,0,0,.25)",
          }}
        >
          <span aria-hidden>✦</span> Ask AI tutor
        </button>
      )}
      {open && (
        <div
          role="dialog"
          aria-label="AI tutor"
          style={{
            position: "fixed",
            right: 22,
            bottom: 22,
            zIndex: 60,
            width: "min(400px, calc(100vw - 44px))",
            height: "min(560px, calc(100dvh - 120px))",
            display: "flex",
            flexDirection: "column",
            background: "#fffdf8",
            border: "2px solid #1a1a1a",
            borderRadius: 14,
            boxShadow: "0 18px 60px rgba(0,0,0,.28)",
            overflow: "hidden",
            fontFamily: "inherit",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "#1a1a1a",
              color: "#fff",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>✦ AI Tutor</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>Answers from your Thread Academy lessons</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close tutor"
              style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}
            >
              ×
            </button>
          </div>

          <div ref={boxRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.length === 0 && ready === "ready" && (
              <div style={{ fontSize: 14, color: "#5f5f5c", lineHeight: 1.55 }}>
                Ask in your own words — e.g. <em>"why does binary use only 0 and 1?"</em> or{" "}
                <em>"how do I make a loop in Python?"</em> I answer from the lessons on this site, and link every
                answer to its source.
              </div>
            )}
            {ready === "loading" && (
              <div style={{ fontSize: 14, color: "#5f5f5c", lineHeight: 1.55 }}>
                {status || "Waking the tutor up…"}
                <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>
                  First visit downloads the tutor brain once — afterwards it's instant.
                </div>
              </div>
            )}
            {ready === "error" && (
              <div style={{ fontSize: 14, color: "#5f5f5c", lineHeight: 1.55 }}>
                <div style={{ color: "#a33", fontWeight: 700, marginBottom: 6 }}>The tutor couldn't load.</div>
                <div style={{ fontSize: 12.5, marginBottom: 10 }}>({status || "connection problem"})</div>
                <button
                  type="button"
                  onClick={() => {
                    setReady("idle");
                    ensureLoaded();
                  }}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    background: "#1a1a1a",
                    color: "#fff",
                    fontWeight: 800,
                    padding: "9px 18px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Try again
                </button>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i}>
                {m.role === "user" && (
                  <div
                    style={{
                      marginLeft: "auto",
                      maxWidth: "85%",
                      background: "#1a1a1a",
                      color: "#fff",
                      borderRadius: "12px 12px 4px 12px",
                      padding: "9px 13px",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.text}
                  </div>
                )}
                {m.role === "note" && (
                  <div style={{ fontSize: 13, color: "#5f5f5c", fontStyle: "italic", lineHeight: 1.5 }}>{m.text}</div>
                )}
                {m.role === "tutor" && (
                  <div
                    style={{
                      maxWidth: "92%",
                      background: "#fff",
                      border: "1px solid #e3ddd0",
                      borderRadius: "12px 12px 12px 4px",
                      padding: "10px 13px",
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "#1a1a1a",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.text}
                    {m.sources && m.sources.length > 0 && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed #e3ddd0" }}>
                        {m.sources.slice(0, 3).map((s) => (
                          <a
                            key={s.url + s.heading}
                            href={s.url}
                            style={{ display: "block", fontSize: 12.5, color: "#1a1a1a", fontWeight: 700, marginTop: 4 }}
                          >
                            → {s.lesson} <span style={{ fontWeight: 400, color: "#5f5f5c" }}>· {s.heading}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {busy && <div style={{ fontSize: 13, color: "#5f5f5c" }}>Thinking…</div>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
            style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #e3ddd0", background: "#fff" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ready === "ready" ? "Ask about any lesson…" : "Loading…"}
              disabled={ready !== "ready" || busy}
              aria-label="Ask the tutor a question"
              style={{
                flex: 1,
                border: "1px solid #1a1a1a",
                borderRadius: 999,
                padding: "10px 15px",
                fontSize: 14,
                outline: "none",
                background: "#fff",
                color: "#1a1a1a",
              }}
            />
            <button
              type="submit"
              disabled={ready !== "ready" || busy || !input.trim()}
              aria-label="Send question"
              style={{
                border: "none",
                borderRadius: 999,
                background: "#1a1a1a",
                color: "#fff",
                fontWeight: 800,
                padding: "10px 18px",
                fontSize: 14,
                cursor: "pointer",
                opacity: ready !== "ready" || busy || !input.trim() ? 0.4 : 1,
              }}
            >
              Ask
            </button>
          </form>
        </div>
      )}
    </>
  );
}
