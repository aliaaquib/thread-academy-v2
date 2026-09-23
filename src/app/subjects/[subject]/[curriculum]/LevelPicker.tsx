"use client";

import Link from "next/link";
import { useState } from "react";
import type { Curriculum, Subject } from "@/lib/types";
import { resolveLevel } from "@/lib/curriculum";

/** Subject-aware level picker. Reuses the approved path-picker visual pattern
 *  (280px stage nav plus a surface stage panel with grade cards); the grade
 *  cards route through the subject flow instead of the curriculum-first flow. */
export default function LevelPicker({
  curriculum,
  subject,
}: {
  curriculum: Curriculum;
  subject: Subject;
}) {
  const levelSlugs = (stageSlug: string, years: { slug: string }[]) => [
    stageSlug,
    ...years.map((y) => y.slug),
  ];
  const offers = (slug: string) =>
    resolveLevel(curriculum.slug, slug)?.subjects.includes(subject.slug) ?? false;

  const stages = curriculum.stages.filter((s) =>
    levelSlugs(s.slug, s.years).some(offers)
  );
  const [active, setActive] = useState(stages[0]?.slug ?? "");
  const stage = stages.find((s) => s.slug === active) ?? stages[0];

  const levels = stage
    ? [
        { slug: stage.slug, name: stage.name },
        ...stage.years.map((y) => ({ slug: y.slug, name: y.name })),
      ].filter((l) => offers(l.slug))
    : [];

  return (
    <div className="path-picker">
      <div className="stage-nav" role="tablist" aria-label="Stages">
        {stages.map((s) => (
          <button
            key={s.slug}
            type="button"
            role="tab"
            aria-selected={s.slug === stage?.slug}
            className={`stage-btn${s.slug === stage?.slug ? " active" : ""}`}
            onClick={() => setActive(s.slug)}
          >
            <span>{s.name}</span>
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      {stage && (
        <div className="stage-panel">
          <h2>{stage.name}</h2>
          <p>
            Choose a level to open the {subject.name} chapters for {stage.name}.
          </p>
          <div className="grade-grid">
            {levels.map((level) => (
              <Link
                key={level.slug}
                className="grade-card"
                href={`/subjects/${subject.slug}/${curriculum.slug}/${level.slug}`}
              >
                <b>{level.name}</b>
                <span>View chapters →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
