/**
 * NOT FOUND — the 404 page. Catches every unmatched route in every language.
 * A friendly "you're lost" message plus the Equation Catcher mini-game
 * for students. Deliberately noindex: 404 pages should never be indexed.
 */
import type { Metadata } from "next";
import LostGame from "@/components/LostGame";

export const metadata: Metadata = {
  title: "Page not found — Thread Academy",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="lost-page">
      <LostGame />
    </main>
  );
}
