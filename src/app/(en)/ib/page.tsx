/**
 * IB — coming-soon holding page (honest, no fake content).
 * When this curriculum goes active, its real landing replaces this file.
 */
import type { Metadata } from "next";
import ComingSoonCurriculum, { generateComingSoonMetadata } from "@/components/ComingSoonCurriculum";
import { requireLang, type LangParam } from "@/lib/route-lang";
import type { Lang } from "@/lib/i18n";

export function generateMetadata(props: { params: Promise<LangParam> }): Promise<Metadata> {
  return generateComingSoonMetadata("ib" as const, props);
}

export default async function Page(props: { params: Promise<LangParam> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  return <ComingSoonCurriculum id={"ib" as const} lang={lang} />;
}
