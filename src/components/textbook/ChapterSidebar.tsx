import Link from "next/link";

export interface SidebarTopic {
  slug: string;
  title: string;
  url: string;
}

/** Reference lesson sidebar: surface panel, back link to the level page,
 *  subject title in serif, chapter name as eyebrow, numbered lesson list
 *  with the active lesson in lime. */
export function ChapterSidebar({
  subjectName,
  chapterTitle,
  topics,
  currentSlug,
  backHref,
  backLabel,
}: {
  subjectName: string;
  chapterTitle: string;
  topics: SidebarTopic[];
  currentSlug: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <aside className="lesson-sidebar" aria-label="Chapter lessons">
      {backHref && (
        <Link className="side-back" href={backHref}>
          ← {backLabel ?? "Back"}
        </Link>
      )}
      <div className="side-title">{subjectName}</div>
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        {chapterTitle}
      </div>
      <ol className="side-list">
        {topics.map((t, i) => (
          <li key={t.slug}>
            <Link
              href={t.url}
              className={t.slug === currentSlug ? "active" : ""}
              aria-current={t.slug === currentSlug ? "page" : undefined}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{t.title}</span>
              <span aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
