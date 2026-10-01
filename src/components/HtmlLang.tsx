/**
 * HTML LANG SETTER — keeps <html lang> correct when the visitor navigates
 * client-side between languages (e.g. /tr/… → /ru/…). The static HTML files
 * already carry the right lang attribute via the postbuild script
 * (scripts/fix-html-lang.mjs); this covers in-app navigation afterwards.
 */
"use client";

import { useEffect } from "react";
import { langMeta, type Lang } from "@/lib/i18n";

export function HtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = langMeta(lang).locale;
  }, [lang]);
  return null;
}
