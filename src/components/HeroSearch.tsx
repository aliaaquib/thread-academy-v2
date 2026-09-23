"use client";

import Link from "next/link";

const QUICK_LINKS = [
  { label: "Linear equations", href: "/subjects/mathematics/british/year-8/algebra/linear-equations" },
  { label: "Cell structure", href: "/subjects/biology/cambridge/igcse/cell-biology/cell-structure" },
  { label: "Newton’s laws", href: "/subjects/physics/cambridge/igcse/forces/newtons-laws" },
  { label: "Variables", href: "/subjects/computer-science/cambridge/igcse/programming/variables" },
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
