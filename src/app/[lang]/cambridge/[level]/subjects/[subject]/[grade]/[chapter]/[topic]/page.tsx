/**
 * /tr, /ru, /ky MIRROR — the lesson page.
 * Thin wrapper around the real implementation in the (en) tree; this file
 * only defines which language prefixes to statically generate. Explicit
 * wrappers (not re-exports) so Next.js static analysis sees every export.
 */
import { generateMetadata as enGenerateMetadata, default as EnPage } from "../../../../../../../../(en)/cambridge/[level]/subjects/[subject]/[grade]/[chapter]/[topic]/page";
import { topicParams } from "@/lib/route-params";
import type { Lang } from "@/lib/i18n";
import type { Metadata } from "next";

export function generateStaticParams() {
  const params = (["tr", "ru", "ky"] as Lang[]).flatMap((lang) =>
    topicParams(lang).map((p) => ({ lang, ...p }))
  );
  // Static export requires at least one param; the dummy 404s in the page
  // (no such content exists). Removed automatically once real translations exist.
  return params.length > 0 ? params : [{ lang: "tr", subject: "__none__", grade: "grade-7", chapter: "__none__", topic: "__none__" }];
}

type MirrorProps = { params: Promise<Record<string, string | string[] | undefined>> };

export function generateMetadata(props: MirrorProps): Promise<Metadata> | Metadata {
  return (enGenerateMetadata as (p: MirrorProps) => Promise<Metadata> | Metadata)(  props);
}

export default function LangMirrorPage(props: MirrorProps) {
  const Page = EnPage as unknown as (p: MirrorProps) => React.ReactElement;
  return (
    <Page {...props} />
  );
}
