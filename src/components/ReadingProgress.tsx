"use client";

/**
 * READING PROGRESS — thin bar pinned to the top of the viewport that fills
 * as the reader scrolls through a blog article. Medium-style touch;
 * inline styles only (the academy's stylesheet is hand-written CSS).
 */
import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (p <= 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width: `${p * 100}%`,
        background: "var(--accent-deep)",
        zIndex: 60,
      }}
    />
  );
}
