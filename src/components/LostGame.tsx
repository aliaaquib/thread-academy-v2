"use client";

/**
 * LOST GAME — "Equation Catcher", the mini-game on the 404 page.
 * A target number is shown; math equations fall down the screen.
 * Tap the ones that equal the target (+10). Wrong taps cost a life;
 * letting a correct one fall past costs a life too. 3 lives, 60 seconds.
 * Pure CSS falling animation + intervals — no game library needed.
 * Language is detected from the URL prefix (/tr, /ru, /ky), English default.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

type Item = { id: number; x: number; text: string; value: number; duration: number };
type Phase = "idle" | "playing" | "over";

const TARGETS = [6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24];
const GAME_TIME = 60;
const CATCHES_PER_TARGET = 5;
const BEST_KEY = "lostgame_best";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Build an equation; when forceTarget is set, the equation equals it. */
function makeEquation(forceTarget: number | null): { text: string; value: number } {
  const kind = rand(0, 2);
  if (forceTarget !== null) {
    if (kind === 0) {
      const a = rand(1, forceTarget - 1);
      return { text: `${a} + ${forceTarget - a}`, value: forceTarget };
    }
    if (kind === 1) {
      const b = rand(1, 12);
      return { text: `${forceTarget + b} − ${b}`, value: forceTarget };
    }
    const factors: Array<[number, number]> = [];
    for (let i = 2; i <= Math.min(12, forceTarget); i++) {
      if (forceTarget % i === 0) factors.push([i, forceTarget / i]);
    }
    if (factors.length > 0) {
      const [x, y] = factors[rand(0, factors.length - 1)];
      return { text: `${x} × ${y}`, value: forceTarget };
    }
    const a = rand(1, forceTarget - 1);
    return { text: `${a} + ${forceTarget - a}`, value: forceTarget };
  }
  if (kind === 0) {
    const a = rand(2, 15);
    const b = rand(2, 15);
    return { text: `${a} + ${b}`, value: a + b };
  }
  if (kind === 1) {
    const a = rand(5, 25);
    const b = rand(2, a - 1);
    return { text: `${a} − ${b}`, value: a - b };
  }
  const a = rand(2, 9);
  const b = rand(2, 9);
  return { text: `${a} × ${b}`, value: a * b };
}

function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  const m = window.location.pathname.match(/^\/(tr|ru|ky)(?:\/|$)/);
  return ((m && m[1]) as Lang) || "en";
}

export default function LostGame() {
  const [lang, setLang] = useState<Lang>("en");
  const [phase, setPhase] = useState<Phase>("idle");
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [target, setTarget] = useState<number>(() => TARGETS[rand(0, TARGETS.length - 1)]);
  const [best, setBest] = useState(0);
  const [endReason, setEndReason] = useState<"lives" | "time">("time");
  const idRef = useRef(1);
  const catchesRef = useRef(0);
  const stateRef = useRef({ phase, target, score });
  stateRef.current = { phase, target, score };

  // Detect language + load best score on the client (avoids hydration mismatch).
  useEffect(() => {
    setLang(detectLang());
    try {
      setBest(Number(localStorage.getItem(BEST_KEY) || 0));
    } catch {
      /* private mode */
    }
  }, []);

  function pickNewTarget(except: number) {
    const pool = TARGETS.filter((n) => n !== except);
    setTarget(pool[rand(0, pool.length - 1)]);
  }

  function endGame(reason: "lives" | "time", finalScore: number) {
    setEndReason(reason);
    setPhase("over");
    setItems([]);
    setBest((prev) => {
      const nb = Math.max(prev, finalScore);
      try {
        localStorage.setItem(BEST_KEY, String(nb));
      } catch {
        /* private mode */
      }
      return nb;
    });
  }

  function loseLife() {
    setLives((l) => {
      if (l <= 1) {
        endGame("lives", stateRef.current.score);
        return 0;
      }
      return l - 1;
    });
  }

  function start() {
    setScore(0);
    setLives(3);
    setTimeLeft(GAME_TIME);
    setItems([]);
    catchesRef.current = 0;
    pickNewTarget(-1);
    setPhase("playing");
  }

  // Spawner: drops a new equation while playing; speeds up with score.
  useEffect(() => {
    if (phase !== "playing") return;
    const spawn = () => {
      const { target: cur, score: s } = stateRef.current;
      const isTarget = Math.random() < 0.35;
      let eq = makeEquation(isTarget ? cur : null);
      if (!isTarget && eq.value === cur) eq = makeEquation(null); // keep decoys wrong
      const duration = Math.max(3.2, 6.5 - s / 150);
      const item: Item = {
        id: idRef.current++,
        x: rand(4, 88),
        text: eq.text,
        value: eq.value,
        duration,
      };
      setItems((prev) => (prev.length > 14 ? prev : [...prev, item]));
    };
    spawn();
    const interval = Math.max(550, 950 - stateRef.current.score / 2);
    const id = setInterval(spawn, interval);
    return () => clearInterval(id);
  }, [phase]);

  // Countdown clock.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft((sec) => {
        if (sec <= 1) {
          endGame("time", stateRef.current.score);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  function tap(item: Item) {
    if (stateRef.current.phase !== "playing") return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (item.value === stateRef.current.target) {
      const ns = stateRef.current.score + 10;
      setScore(ns);
      stateRef.current.score = ns;
      // Every few catches, switch to a fresh target.
      catchesRef.current += 1;
      if (catchesRef.current >= CATCHES_PER_TARGET) {
        catchesRef.current = 0;
        pickNewTarget(stateRef.current.target);
      }
    } else {
      loseLife();
    }
  }

  function landed(item: Item) {
    if (stateRef.current.phase !== "playing") return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (item.value === stateRef.current.target) loseLife(); // missed a correct one
  }

  const hearts = "♥".repeat(Math.max(0, lives)) + "♡".repeat(Math.max(0, 3 - lives));

  return (
    <div className="lost-wrap">
      <p className="lost-eyebrow">404</p>
      <h1 className="lost-title">{t(lang, "game.404.title")}</h1>
      <p className="lost-lede">{t(lang, "game.404.lede")}</p>

      <div className="lost-hud">
        <div className="lost-target">
          {t(lang, "game.catch")}: <b>{target}</b>
        </div>
        <div className="lost-stat">
          {t(lang, "game.score")}: <b>{score}</b>
        </div>
        <div className="lost-stat lost-hearts" aria-label={t(lang, "game.lives")}>
          {hearts}
        </div>
        <div className="lost-stat">
          {t(lang, "game.time")}: <b>{timeLeft}s</b>
        </div>
      </div>

      <div className="lost-arena" role="application" aria-label={t(lang, "game.404.title")}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="lost-eq"
            style={{ left: `${item.x}%`, animationDuration: `${item.duration}s` }}
            onClick={() => tap(item)}
            onAnimationEnd={() => landed(item)}
          >
            {item.text}
          </button>
        ))}

        {phase === "idle" && (
          <div className="lost-overlay">
            <p className="lost-howto">{t(lang, "game.howto")}</p>
            <button type="button" className="lost-btn" onClick={start}>
              {t(lang, "game.start")}
            </button>
          </div>
        )}

        {phase === "over" && (
          <div className="lost-overlay">
            <p className="lost-over-title">
              {endReason === "lives" ? t(lang, "game.gameover") : t(lang, "game.timesup")}
            </p>
            <p className="lost-final">
              {t(lang, "game.final")}: <b>{score}</b>
              {best > 0 && (
                <span className="lost-best">
                  {" · "}
                  {t(lang, "game.best")}: <b>{best}</b>
                </span>
              )}
            </p>
            {score > 0 && score >= best && (
              <p className="lost-newbest">{t(lang, "game.newbest")}</p>
            )}
            <div className="lost-actions">
              <button type="button" className="lost-btn" onClick={start}>
                {t(lang, "game.playagain")}
              </button>
              <Link className="lost-btn lost-btn-ghost" href="/">
                {t(lang, "game.backhome")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
