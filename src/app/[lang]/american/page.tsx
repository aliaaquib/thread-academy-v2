/**
 * /tr, /ru, /ky MIRROR — the american coming-soon page.
 * Thin wrapper around the real implementation in the (en) tree.
 */
import { generateMetadata as enGenerateMetadata, default as EnPage } from "../../(en)/american/page";
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
