/**
 * SITE HEADER — the navigation bar shown on every page.
 * Official Thread Academy logo, subject links, the language toggle,
 * and the search button that opens the search overlay.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { openSiteSearch } from "./search-bus";
import { LangToggle } from "./LangToggle";
import { AuthButton } from "./AuthButton";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

/** Official horizontal Thread Academy logo; at <=980px the links collapse
 *  but toggle and search remain; at <=650px the logo renders at 34px.
 *  Sign in lives in the nav-actions cluster (student = Google via the
 *  tutor worker, teacher = link to the teacher CMS login). */
export default function SiteHeader({ lang }: { lang: Lang }) {
  const NAV = [
    { href: withLang("/", lang), label: t(lang, "nav.home") },
    { href: withLang("/curricula", lang), label: t(lang, "nav.curricula") },
    { href: withLang("/resources", lang), label: t(lang, "nav.resources") },
    { href: withLang("/blog", lang), label: t(lang, "nav.blog") },
    { href: withLang("/about", lang), label: t(lang, "nav.about") },
  ];
  return (
    <header className="nav">
      <Link href={withLang("/", lang)} className="brand" aria-label={t(lang, "nav.brand.home")}>
        <Image
          src="/brand/logo-horizontal-light.png"
          alt="Thread Academy"
          width={758}
          height={328}
          className="brand-logo"
          priority
        />
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
        <AuthButton lang={lang} />
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
