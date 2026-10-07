"use client";

/**
 * AUTH BUTTON — the "Sign in" control in the site header.
 * Opens a small chooser: "I'm a student" (Google sign-in, the same account
 * and token the Ask AI tutor uses — 30 answers/day) or "I'm a teacher"
 * (opens the teacher CMS login in a new tab, where teachers sign in with
 * their teacher account and get the writing/publishing tools).
 * When signed in, shows the student's name with a Sign out option.
 */
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

const API_URL = process.env.NEXT_PUBLIC_TUTOR_API_URL || "";
const AUTH_BASE = API_URL ? API_URL.replace(/\/$/, "") : "";
const TOKEN_KEY = "tutor_token";
const CMS_LOGIN = "https://cms.threadacademy.aaquibali.com/login";

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function AuthButton({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Pick up the OAuth token if the callback landed on this page, then
  // verify it against the worker. Also re-check when another tab/widget
  // signs in or out (shared localStorage key).
  useEffect(() => {
    let cancelled = false;
    async function verify() {
      const m = window.location.hash.match(/[#&]tutor_token=([^&]+)/);
      if (m) {
        try {
          localStorage.setItem(TOKEN_KEY, m[1]);
        } catch {
          /* private mode */
        }
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      const token = readToken();
      if (!token || !AUTH_BASE) {
        if (!cancelled) {
          setName(null);
          setChecked(true);
        }
        return;
      }
      try {
        const res = await fetch(`${AUTH_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setName(data?.user?.name || null);
        } else {
          try {
            localStorage.removeItem(TOKEN_KEY);
          } catch {
            /* private mode */
          }
          if (!cancelled) setName(null);
        }
      } catch {
        if (!cancelled) setName(null);
      }
      if (!cancelled) setChecked(true);
    }
    verify();
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) verify();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
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

  function signInAsStudent() {
    if (!AUTH_BASE) return;
    const ret = encodeURIComponent(window.location.href.split("#")[0]);
    window.location.href = `${AUTH_BASE}/api/auth/login?return=${ret}`;
  }

  function signOut() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* private mode */
    }
    setName(null);
    setOpen(false);
  }

  if (!checked) return null;

  return (
    <div className="auth-dropdown" ref={boxRef}>
      {name ? (
        <>
          <button
            type="button"
            className="auth-btn"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="auth-avatar" aria-hidden="true">
              {name.trim().charAt(0).toUpperCase()}
            </span>
            <span className="auth-name">{name.split(" ")[0]}</span>
          </button>
          {open && (
            <div className="auth-dropdown-menu" role="menu">
              <button type="button" role="menuitem" className="auth-dropdown-item" onClick={signOut}>
                {t(lang, "nav.signout")}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            className="auth-btn"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {t(lang, "nav.signin")}
          </button>
          {open && (
            <div className="auth-dropdown-menu" role="menu">
              <div className="auth-dropdown-label">{t(lang, "auth.choose")}</div>
              <button type="button" role="menuitem" className="auth-dropdown-item" onClick={signInAsStudent}>
                <span className="auth-item-main">{t(lang, "auth.student")}</span>
                <span className="auth-item-sub">{t(lang, "auth.student.desc")}</span>
              </button>
              <a
                role="menuitem"
                className="auth-dropdown-item"
                href={CMS_LOGIN}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                <span className="auth-item-main">{t(lang, "auth.teacher")}</span>
                <span className="auth-item-sub">{t(lang, "auth.teacher.desc")}</span>
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
