/**
 * LANGUAGES — the languages Thread Academy is published in.
 *
 * English is the default and keeps the existing root URLs (no prefix).
 * Turkish, Russian and Kyrgyz live under /tr, /ru and /ky.
 *
 * Teachers write each language's lessons themselves — there is no machine
 * translation anywhere in this file or the site.
 */
import { TR_OVERLAY } from "./lang/tr";
import { RU_OVERLAY } from "./lang/ru";
import { KY_OVERLAY } from "./lang/ky";

export const LANGS = [
  { code: "en", name: "English", native: "English", locale: "en-GB" },
  { code: "tr", name: "Turkish", native: "Türkçe", locale: "tr-TR" },
  { code: "ru", name: "Russian", native: "Русский", locale: "ru-RU" },
  { code: "ky", name: "Kyrgyz", native: "Кыргызча", locale: "ky-KG" },
] as const;

export type Lang = (typeof LANGS)[number]["code"];

/** The non-default languages — the ones that get a URL prefix. */
export const NON_DEFAULT_LANGS: Lang[] = ["tr", "ru", "ky"];

export function isLang(code: string): code is Lang {
  return (LANGS as readonly { code: string }[]).some((l) => l.code === code);
}

export function langMeta(lang: Lang): (typeof LANGS)[number] {
  return LANGS.find((l) => l.code === lang) ?? LANGS[0];
}

/** URL prefix for a language: "" for English, "/tr" etc. for the rest. */
export function langPrefix(lang: Lang): string {
  return lang === "en" ? "" : `/${lang}`;
}

/** Add the language prefix to a site-relative path ("/subjects" -> "/tr/subjects"). */
export function withLang(path: string, lang: Lang): string {
  if (lang === "en") return path;
  return `${langPrefix(lang)}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Split a path into its language and the unprefixed remainder. */
export function stripLangPrefix(path: string): { lang: Lang; path: string } {
  const m = path.match(/^\/(tr|ru|ky)(?=\/|$)/);
  if (!m) return { lang: "en", path };
  const rest = path.slice(m[0].length) || "/";
  return { lang: m[1] as Lang, path: rest };
}

/**
 * Per-language title/description overrides for subjects, chapters and topics.
 * Teachers fill these in through the CMS when they publish in another language.
 * Anything missing falls back to the English text — never to invented content.
 */
export interface LangOverlay {
  subjects: Record<string, { name?: string; tagline?: string; intro?: string; learn?: string[] }>;
  chapters: Record<string, { title?: string; desc?: string }>;
  /** Topic keys are "subject/slug" (e.g. "mathematics/variables") so the same
   *  slug in different subjects never collides. A bare slug key is also read
   *  as a legacy fallback. */
  topics: Record<string, { title?: string; desc?: string }>;
}

export function emptyOverlay(): LangOverlay {
  return { subjects: {}, chapters: {}, topics: {} };
}

/** The teacher-written title/description overrides for a language (null for English). */
export function getOverlay(lang: Lang): LangOverlay | null {
  if (lang === "tr") return TR_OVERLAY;
  if (lang === "ru") return RU_OVERLAY;
  if (lang === "ky") return KY_OVERLAY;
  return null;
}

/**
 * Reads the active language from route params of the [[...lang]] catch-all.
 * English pages carry no prefix, so a missing segment means English.
 */
export function langFromParams(params: { lang?: string[] } | undefined): Lang {
  const code = params?.lang?.[0];
  return code !== undefined && isLang(code) ? code : "en";
}

/** The generateStaticParams value for the [[...lang]] segment in one language. */
export function langParam(lang: Lang): { lang: string[] } {
  return { lang: lang === "en" ? [] : [lang] };
}
