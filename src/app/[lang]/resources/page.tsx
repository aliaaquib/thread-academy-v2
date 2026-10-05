/**
 * /tr, /ru, /ky MIRROR — the resources hub.
 * Thin wrapper around the real implementation in the (en) tree; this file
 * only defines which language prefixes to statically generate. Explicit
 * wrappers (not re-exports) so Next.js static analysis sees every export.
 */
import { generateMetadata as enGenerateMetadata, default as EnPage } from "../../(en)/resources/page";
import type { Lang } from "@/lib/i18n";
import type { Metadata } from "next";

export function generateStaticParams() {
  return (["tr", "ru", "ky"] as Lang[]).map((lang) => ({ lang }));
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
