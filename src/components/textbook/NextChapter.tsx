import Link from "next/link";

/** .next-lesson-card: footer navigation to the next lesson. */
export function NextChapter({
  kicker = "Next lesson",
  title,
  href,
}: {
  kicker?: string;
  title: string;
  href: string;
}) {
  return (
    <Link className="next-lesson-card" href={href}>
      <div>
        <span className="nl-kicker">{kicker}</span>
        <h3>{title}</h3>
      </div>
      <span className="nl-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
