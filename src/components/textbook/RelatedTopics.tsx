import Link from "next/link";

export interface RelatedLink {
  title: string;
  href: string;
}

/** Related-topic rows in the reference chapter-link language. */
export function RelatedTopics({ items }: { items: RelatedLink[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="chapters" style={{ marginTop: 8 }}>
      {items.map((item, i) => (
        <Link key={item.href} className="chapter-link" href={item.href}>
          <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
          <span>
            <span className="chapter-title" style={{ fontSize: "1.35rem" }}>
              {item.title}
            </span>
          </span>
          <span className="chapter-status">Read lesson →</span>
        </Link>
      ))}
    </div>
  );
}
