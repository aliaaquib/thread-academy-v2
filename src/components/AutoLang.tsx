/**
 * AUTO-LANGUAGE — first-visit browser language detection.
 *
 * The academy is a static export, so there is no server middleware to read
 * the Accept-Language header. Instead this tiny client component runs once
 * on page load and redirects visitors whose browser language is Turkish,
 * Russian or Kyrgyz to the matching /tr, /ru or /ky version of the page
 * they opened. Anything else (including English) stays on the default
 * English URLs.
 *
 * Rules:
 *  - Only fires on unprefixed URLs (no /tr, /ru or /ky already).
 *  - Never fires when the visitor already chose a language manually
 *    (the `ta-lang` cookie set by LangToggle) — the explicit choice wins.
 *  - Never fires for automated browsers (webdriver) so crawlers and
 *    previews are unaffected.
 *  - Uses location.replace() so the redirect doesn't pollute history.
 */
"use client";

import { useEffect } from "react";

const COOKIE = "ta-lang";

function browserLang(): "tr" | "ru" | "ky" | null {
  if (typeof navigator === "undefined") return null;
  const base = (navigator.language || "").toLowerCase().split("-")[0];
  if (base === "tr" || base === "ru" || base === "ky") return base;
  return null;
}

function hasLangPrefix(pathname: string): boolean {
  return /^\/(tr|ru|ky)(\/|$)/.test(pathname);
}

function hasLangCookie(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)ta-lang=(en|tr|ru|ky)(?:;|$)/.test(document.cookie);
}

export function AutoLang() {
  useEffect(() => {
    try {
      if (navigator.webdriver) return;
      const { pathname, search } = window.location;
      if (hasLangPrefix(pathname)) return;
      if (hasLangCookie()) return;
      const lang = browserLang();
      if (!lang) return;
      window.location.replace(`/${lang}${pathname}${search}`);
    } catch {
      // Never break page load over language detection.
    }
  }, []);
  return null;
}
