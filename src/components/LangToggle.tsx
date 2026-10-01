/**
 * LANGUAGE TOGGLE — the EN / TR / RU / KY switch in the navbar.
 * Keeps the visitor on the equivalent page when that language has it;
 * otherwise lands on that language's homepage (never a dead page).
 *
 * Each page publishes a `thread-academy-langs` meta tag listing the
 * languages it exists in (see pageMetadata in src/lib/seo.tsx). The toggle
 * reads it and falls back to the homepage when the translation is missing.
 */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { LANGS, isLang, stripLangPrefix, withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

/** Languages the current page exists in, from its meta tag. */
function availableLangs(fallback: Lang): Lang[] {
  if (typeof document === "undefined") return [fallback];
  const content = document
    .querySelector('meta[name="thread-academy-langs"]')
    ?.getAttribute("content");
  const list = (content ?? "").split(",").map((s) => s.trim()).filter(isLang);
  return list.length > 0 ? list : [fallback];
}

export function LangToggle({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();
  const { path } = stripLangPrefix(pathname);

  function go(target: Lang) {
    if (target === lang) return;
    const href = availableLangs(lang).includes(target)
      ? withLang(path, target)
      : withLang("/", target);
    router.push(href);
  }

  return (
    <div className="lang-toggle" role="group" aria-label={t(lang, "nav.language")}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => go(l.code)}
          aria-pressed={l.code === lang}
          title={l.name}
          className={l.code === lang ? "active" : undefined}
        >
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
