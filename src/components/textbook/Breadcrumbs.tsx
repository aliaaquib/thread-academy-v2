/**
 * BREADCRUMBS — the Home / Subject / Grade / Chapter trail above page titles.
 * Pages pass it a list of crumbs; it renders the links (last one is plain text).
 */
import Link from "next/link";

export interface CrumbItem {
  label: string;
  href?: string;
}

/** .breadcrumb trail at the top of a lesson. */
export function Breadcrumbs({ items }: { items: CrumbItem[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && " / "}
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
        </span>
      ))}
    </nav>
  );
}
