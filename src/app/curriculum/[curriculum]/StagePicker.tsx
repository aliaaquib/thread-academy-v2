"use client";

import Link from "next/link";
import { useState } from "react";
import type { Curriculum } from "@/lib/types";

/** Reference curriculum detail picker: 280px stage nav plus a surface
 *  stage panel with grade cards. Stage switching is client-side. */
export default function StagePicker({ curriculum }: { curriculum: Curriculum }) {
  const [active, setActive] = useState(curriculum.stages[0]?.slug ?? "");
  const stage = curriculum.stages.find((s) => s.slug === active) ?? curriculum.stages[0];

  return (
    <div className="path-picker">
      <div className="stage-nav" role="tablist" aria-label="Stages">
        {curriculum.stages.map((s) => (
          <button
            key={s.slug}
            type="button"
            role="tab"
            aria-selected={s.slug === stage.slug}
            className={`stage-btn${s.slug === stage.slug ? " active" : ""}`}
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
          <p>Continue to the subjects available in this part of the {curriculum.name} curriculum.</p>
          <div className="grade-grid">
            {stage.years.map((year) => (
              <Link
                key={year.slug}
                className="grade-card"
                href={`/curriculum/${curriculum.slug}/${year.slug}`}
              >
                <b>{year.name}</b>
                <span>Browse subjects →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
