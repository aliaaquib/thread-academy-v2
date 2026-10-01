/**
 * ENGLISH SHELL — wraps every unprefixed (English) page.
 * Renders the header, footer and search overlay in English.
 * (Route groups in parentheses don't change the URL.)
 */
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SearchOverlayHost } from "@/components/SearchOverlayHost";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <SiteHeader lang="en" />
      <main className="view">{children}</main>
      <SiteFooter lang="en" />
      <SearchOverlayHost lang="en" />
    </div>
  );
}
