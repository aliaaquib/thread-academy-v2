/**
 * /tr, /ru, /ky MIRROR — the resources grade picker.
 */
import { generateMetadata as enGenerateMetadata, generateStaticParams as enGenerateStaticParams, default as EnPage } from "../../../../(en)/cambridge/resources/[subject]/page";
import type { Lang } from "@/lib/i18n";
import type { Metadata } from "next";

export function generateStaticParams() {
  return (["tr", "ru", "ky"] as Lang[]).flatMap((lang) =>
    (enGenerateStaticParams() as { subject: string }[]).map((p) => ({ lang, ...p }))
  );
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
