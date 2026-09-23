import Link from "next/link";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Subjects", href: "/subjects" },
      { label: "Curriculum", href: "/curriculum" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Mathematics", href: "/subjects/mathematics" },
      { label: "Biology", href: "/subjects/biology" },
      { label: "Physics", href: "/subjects/physics" },
      { label: "Computer Science", href: "/subjects/computer-science" },
    ],
  },
  {
    heading: "Company",
    links: [{ label: "About", href: "/about" }],
  },
  {
    heading: "Other",
    links: [{ label: "Search", href: "/search" }],
  },
];

/** Site footer: brand, restrained link columns, and a quiet legal row.
 *  Follows the existing design language (hairlines, muted text, ink hover). */
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <b>Thread Academy</b>
          <p>Open educational knowledge, no account required.</p>
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
        <span>British · Cambridge · American · IB</span>
      </div>
    </footer>
  );
}
