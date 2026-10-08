/**
 * CHAPTER RESOURCES — the page at /cambridge/<level>/resources/<subject>/grade-<n>/<chapter>
 * (and /tr/cambridge/<level>/resources/…, /ru/…, /ky/…).
 * Worksheets, video links and interactive tools for one chapter.
 * Questions live in src/lib/resources.ts; videos are YouTube search links
 * built from the chapter name so they never go stale.
 * Non-English versions render only chapters that have genuinely translated lessons.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { PracticeItem, PracticeQuestions } from "@/components/textbook/PracticeQuestions";
import EquationSolver from "@/components/widgets/EquationSolver";
import { getSubject } from "@/lib/subjects";
import { getChapterForSubject } from "@/lib/stage-chapters";
import { getGradeForChapter, gradeSlug, parseGradeSlug } from "@/lib/grades";
import { getContentChapters } from "@/lib/content";
import { getChapterResources } from "@/lib/resources";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { resourceParams } from "@/lib/route-params";
import {
  resolveCurriculumLevel,
  levelStringKey,
  curriculumPath,
  levelPath,
  subjectPath,
  gradePath as gradeUrl,
  chapterPath as chapterUrl,
  resourcesPath,
  CURRICULUM_NAMES,
} from "@/lib/curricula";

export function generateStaticParams() {
  return resourceParams("en");
}

type Params = LangParam & { level: string; subject: string; grade: string; chapter: string };

/** The title + description Google and link previews show for this page. */
export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter, lang);
  if (!resolved || !subject || !grade || !chapter) return {};
  if (getGradeForChapter(params.subject, params.chapter) !== grade) return {};
  if (!resolved.level.grades.includes(grade)) return {};
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  return pageMetadata({
    title: `${t(lang, "resources.chapter.title", { chapter: chapter.title })} — ${levelName}`,
    description: t(lang, "resources.chapter.lede", {
      subject: subject.name,
      grade,
      chapter: chapter.title,
    }),
    path: resourcesPath(curriculum.id, level.id, params.subject, grade, params.chapter),
    lang,
  });
}

function ResourceSection({ id, eyebrow, title, lede, children }: {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} style={{ marginBottom: 72, scrollMarginTop: 100 }}>
      <div className="section-head">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <p>{lede}</p>
      </div>
      {children}
    </div>
  );
}

/** The page itself — what the visitor sees. */
export default async function ChapterResourcesPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter, lang);
  if (!resolved || !subject || !grade || !chapter) notFound();
  if (getGradeForChapter(params.subject, params.chapter) !== grade) notFound();
  if (!resolved.level.grades.includes(grade)) notFound();
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  const curriculumName = CURRICULUM_NAMES[curriculum.id];

  const resources = getChapterResources(params.subject, params.chapter, lang);
  const chapterBase = withLang(
    chapterUrl(curriculum.id, level.id, params.subject, grade, params.chapter),
    lang,
  );

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: curriculumName, href: withLang(curriculumPath(curriculum.id), lang) },
          { label: levelName, href: withLang(levelPath(curriculum.id, level.id) + "/subjects", lang) },
          { label: t(lang, "resources.meta.title"), href: withLang(levelPath(curriculum.id, level.id) + "/resources", lang) },
          { label: subject.name, href: withLang(subjectPath(curriculum.id, level.id, params.subject), lang) },
          {
            label: t(lang, "resources.chapter.grade", { grade }),
            href: withLang(gradeUrl(curriculum.id, level.id, params.subject, grade), lang),
          },
          { label: t(lang, "resources.chapter.title", { chapter: chapter.title }) },
        ]}
        title={t(lang, "resources.chapter.title", { chapter: chapter.title })}
        lede={t(lang, "resources.chapter.lede", {
          subject: subject.name,
          grade,
          chapter: chapter.title,
        })}
      />

      <div className="subject-overview">
        <div className="stage-line" style={{ marginBottom: 64 }} aria-label={t(lang, "resources.nav.onthispage")}>
          <a href="#notes">{t(lang, "resources.sec.notes")}</a>
          <a href="#worksheets">{t(lang, "resources.sec.worksheets")}</a>
          <a href="#videos">{t(lang, "resources.sec.videos")}</a>
          {resources.tools.length > 0 && <a href="#interactive-tools">{t(lang, "resources.sec.tools")}</a>}
          <a href="#revision">{t(lang, "resources.sec.revision")}</a>
        </div>

        <ResourceSection
          id="notes"
          eyebrow={t(lang, "resources.sec.notes")}
          title={t(lang, "resources.sec.notes.title")}
          lede={t(lang, "resources.sec.notes.lede")}
        >
          <div className="chapters">
            {resources.notes.map((note, i) => (
              <Link key={note.url} className="chapter-link" href={note.url}>
                <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="chapter-title">{note.title}</span>
                  <span className="chapter-desc">{note.desc}</span>
                </span>
                <span className="chapter-status">{t(lang, "resources.read.lesson")}</span>
              </Link>
            ))}
          </div>
        </ResourceSection>

        <ResourceSection
          id="worksheets"
          eyebrow={t(lang, "resources.sec.worksheets")}
          title={t(lang, "resources.sec.worksheets.title")}
          lede={t(lang, "resources.sec.worksheets.lede")}
        >
          {resources.worksheets.length > 0 ? (
            <PracticeQuestions>
              {resources.worksheets.map((w, i) => (
                <PracticeItem key={i} question={`${i + 1}. ${w.question}`} hint={w.hint}>
                  <p>{w.answer}</p>
                </PracticeItem>
              ))}
            </PracticeQuestions>
          ) : (
            <p className="empty-note">{t(lang, "resources.sec.worksheets.empty")}</p>
          )}
        </ResourceSection>

        <ResourceSection
          id="videos"
          eyebrow={t(lang, "resources.sec.videos")}
          title={t(lang, "resources.sec.videos.title")}
          lede={t(lang, "resources.sec.videos.lede")}
        >
          <div className="chapters">
            {resources.videos.map((video) => (
              <a
                key={video.url}
                className="video-row"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="video-play" aria-hidden="true">
                  ▶
                </span>
                <span>
                  <span className="chapter-title" style={{ fontSize: "1.2rem" }}>
                    {video.title}
                  </span>
                  <span className="chapter-desc">{t(lang, "resources.videos.youtube")}</span>
                </span>
                <span className="chapter-status">{t(lang, "resources.videos.watch")}</span>
              </a>
            ))}
          </div>
        </ResourceSection>

        {resources.tools.length > 0 && (
          <ResourceSection
            id="interactive-tools"
            eyebrow={t(lang, "resources.sec.tools")}
            title={t(lang, "resources.sec.tools.title")}
            lede={resources.tools[0].desc}
          >
            <EquationSolver />
          </ResourceSection>
        )}

        <ResourceSection
          id="revision"
          eyebrow={t(lang, "resources.sec.revision")}
          title={t(lang, "resources.sec.revision.title")}
          lede={t(lang, "resources.sec.revision.lede")}
        >
          <ul className="learn-list">
            {resources.revision.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p style={{ marginTop: 48 }}>
            <Link className="inline-link" href={chapterBase}>
              {t(lang, "resources.chapter.back", { chapter: chapter.title })}
            </Link>
          </p>
        </ResourceSection>
      </div>
    </>
  );
}
