"use client";

import Link from "next/link";

const QUICK_LINKS = [
  { label: "Linear equations", href: "/subjects/mathematics/grade-9/algebra/linear-equations" },
  { label: "Cell structure", href: "/subjects/biology/grade-8/cell-biology/cell-structure" },
  { label: "Newton’s laws", href: "/subjects/physics/grade-8/forces/newtons-laws" },
  { label: "Variables", href: "/subjects/computer-science/grade-9/programming/variables" },
];

/** Reference quick links to featured lessons. The hero search field was removed;
 *  search now lives behind the search icon in the top navigation. */
export default function HeroSearch() {
  return (
    <div className="quick-links">
      <span>Try:</span>
      {QUICK_LINKS.map((l) => (
        <Link key={l.href} href={l.href}>
          {l.label}
        </Link>
      ))}
    </div>
  );
}
