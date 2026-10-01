/**
 * HERO SEARCH — the quick links to popular lessons in the home page hero.
 * Links follow the page language and only include lessons that exist in it.
 */
import Link from "next/link";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

export interface QuickLink {
  label: string;
  href: string;
}

/** Reference quick links to featured lessons. The hero search field was removed;
 *  search now lives behind the search icon in the top navigation. */
export default function HeroSearch({ lang, links }: { lang: Lang; links: QuickLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="quick-links">
      <span>{t(lang, "hero.try")}</span>
      {links.map((l) => (
        <Link key={l.href} href={withLang(l.href, lang)}>
          {l.label}
        </Link>
      ))}
    </div>
  );
}
