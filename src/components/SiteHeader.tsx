/**
 * SITE HEADER — the navigation bar shown on every page.
 * Logo, subject links, the language toggle, and the search button that
 * opens the search overlay.
 * (Approved design; edit links here, not the styling.)
 */
"use client";

import Link from "next/link";
import { openSiteSearch } from "./search-bus";
import { LangToggle } from "./LangToggle";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

/** Reference nav: 78px sticky bar, mark-only skewed lime logo, five links,
 *  language toggle + one circular search button that opens the search
 *  overlay; at <=980px the links collapse but toggle and search remain.
 *  No login/signup. */
export default function SiteHeader({ lang }: { lang: Lang }) {
  const NAV = [
    { href: withLang("/", lang), label: t(lang, "nav.home") },
    { href: withLang("/subjects", lang), label: t(lang, "nav.subjects") },
    { href: withLang("/resources", lang), label: t(lang, "nav.resources") },
    { href: withLang("/blog", lang), label: t(lang, "nav.blog") },
    { href: withLang("/about", lang), label: t(lang, "nav.about") },
  ];
  return (
    <header className="nav">
      <Link href={withLang("/", lang)} className="brand" aria-label={t(lang, "nav.brand.home")}>
        <span className="brand-mark" aria-hidden="true" />
        <span>Thread Academy</span>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="nav-actions">
        <LangToggle lang={lang} />
        <button className="nav-search" aria-label={t(lang, "nav.search")} onClick={() => openSiteSearch()}>
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="2" />
            <path d="M13.5 13.5L17.5 17.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </header>
  );
}
