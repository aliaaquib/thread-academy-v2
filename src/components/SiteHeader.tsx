"use client";

import Link from "next/link";
import { openSiteSearch } from "./search-bus";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/subjects", label: "Subjects" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

/** Reference nav: 78px sticky bar, mark-only skewed lime logo, five links,
 *  one circular search button that opens the search overlay;
 *  at <=980px only the search trigger remains. No login/signup. */
export default function SiteHeader() {
  return (
    <header className="nav">
      <Link href="/" className="brand" aria-label="Thread Academy home">
        <span className="brand-mark" aria-hidden="true" />
        <span>Thread Academy</span>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="nav-actions">
        <button className="nav-search" aria-label="Search" onClick={() => openSiteSearch()}>
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="2" />
            <path d="M13.5 13.5L17.5 17.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </header>
  );
}
