/**
 * SITE FOOTER — the link columns at the bottom of every page.
 * Edit the COLUMNS list below to change footer links.
 */
import Link from "next/link";
import Image from "next/image";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { getSubject } from "@/lib/subjects";
import { curriculumPath, subjectLandingPath } from "@/lib/curricula";

/** Site footer: brand, restrained link columns, and a quiet legal row.
 *  Follows the existing design language (hairlines, muted text, ink hover). */
export default function SiteFooter({ lang }: { lang: Lang }) {
  const subjectName = (slug: string) => getSubject(slug, lang)?.name ?? slug;
  const subjectHref = (slug: string) => {
    const href = subjectLandingPath(slug);
    return href ? withLang(href, lang) : withLang(curriculumPath("cambridge"), lang);
  };
  const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: t(lang, "footer.explore"),
      links: [
        { label: t(lang, "nav.curricula"), href: withLang("/curricula", lang) },
        { label: t(lang, "nav.resources"), href: withLang("/resources", lang) },
      ],
    },
    {
      heading: t(lang, "footer.learn"),
      links: [
        { label: subjectName("mathematics"), href: subjectHref("mathematics") },
        { label: subjectName("biology"), href: subjectHref("biology") },
        { label: subjectName("physics"), href: subjectHref("physics") },
        { label: subjectName("computer-science"), href: subjectHref("computer-science") },
      ],
    },
    {
      heading: t(lang, "footer.company"),
      links: [{ label: t(lang, "nav.about"), href: withLang("/about", lang) }],
    },
    {
      heading: t(lang, "footer.legal"),
      links: [
        { label: t(lang, "nav.nav.terms"), href: withLang("/terms", lang) },
        { label: t(lang, "nav.nav.privacy"), href: withLang("/privacy", lang) },
        { label: t(lang, "nav.nav.cookies"), href: withLang("/cookies", lang) },
      ],
    },
    {
      heading: t(lang, "footer.other"),
      links: [{ label: t(lang, "nav.search"), href: withLang("/search", lang) }],
    },
  ];
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Image
            src="/brand/logo-horizontal-light.png"
            alt="Thread Academy"
            width={758}
            height={328}
            className="footer-logo"
          />
          <p>{t(lang, "footer.tagline")}</p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <div className="footer-h">{col.heading}</div>
            <ul className="footer-links">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© Thread Academy</span>
        <span>{t(lang, "footer.curricula")}</span>
      </div>
    </footer>
  );
}
