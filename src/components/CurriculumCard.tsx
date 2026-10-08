/**
 * CURRICULUM CARD — shared card for curriculum and level listings.
 * Used on the homepage curricula section and the curriculum landing page.
 * Disabled cards (coming-soon) render as non-interactive with reduced opacity.
 */
import Link from "next/link";
import type { Lang } from "@/lib/i18n";

export default function CurriculumCard({
  href,
  badge,
  title,
  lede,
  disabled,
}: {
  href: string;
  badge: string;
  title: string;
  lede: string;
  disabled?: boolean;
  lang: Lang;
}) {
  const card = (
    <>
      <div className="eyebrow">{badge}</div>
      <div className="subject-bottom">
        <div>
          <h3>{title}</h3>
          <div className="subject-meta">{lede}</div>
        </div>
        <span className="subject-arrow" aria-hidden="true">
          {disabled ? "○" : "↗"}
        </span>
      </div>
    </>
  );
  return disabled ? (
    <div className="subject-card" aria-disabled="true" style={{ cursor: "default", opacity: 0.75 }}>
      {card}
    </div>
  ) : (
    <Link className="subject-card" href={href}>
      {card}
    </Link>
  );
}
