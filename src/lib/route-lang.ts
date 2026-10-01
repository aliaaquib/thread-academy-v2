/**
 * ROUTE LANGUAGE — validates the language param for pages.
 * Used by the (en) tree (no lang param → English) and the [lang] mirror tree
 * (lang is a single string). Unknown prefixes (e.g. /fr/...) 404.
 * Kept out of lib/i18n.ts so node build scripts can import i18n safely.
 */
import { notFound } from "next/navigation";
import { isLang, type Lang } from "./i18n";

export type LangParam = { lang?: string | string[] };

export function requireLang(params: LangParam | undefined): Lang {
  const raw = params?.lang;
  const code = Array.isArray(raw) ? raw[0] : raw;
  if (code !== undefined && !isLang(code)) notFound();
  return code !== undefined && isLang(code) ? code : "en";
}
