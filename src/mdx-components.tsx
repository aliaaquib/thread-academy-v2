/**
 * LESSON BUILDING BLOCKS — connects .mdx lesson files to their visual parts.
 *
 * When a lesson file uses <Quiz>, <Callout>, <Formula> etc., THIS file decides
 * which React component renders it. To change how a lesson element looks
 * everywhere, edit the component in src/components/textbook/ or src/components/widgets/.
 *
 * Use mdxComponentsForLang(lang) so every building block follows the page
 * language; mdxComponents is the English map (kept for compatibility).
 */
import Link from "next/link";
import type { AnchorHTMLAttributes, ComponentType, ReactElement, ReactNode } from "react";
import { Callout, Definition, Example, ImportantNote, Summary, WorkedExample } from "./components/textbook/Callout";
import { Formula } from "./components/textbook/Formula";
import { Diagram } from "./components/textbook/Diagram";
import { CodeBlock } from "./components/textbook/CodeBlock";
import { PracticeItem, PracticeQuestions } from "./components/textbook/PracticeQuestions";
import { Quiz, QuizQuestion } from "./components/textbook/Quiz";
import { LearningObjectives } from "./components/textbook/LearningObjectives";
import { RelatedTopics } from "./components/textbook/RelatedTopics";
import { NextChapter } from "./components/textbook/NextChapter";
import TryItPython from "./components/widgets/TryItPython";
import EquationSolver from "./components/widgets/EquationSolver";
import { withLang, type Lang } from "./lib/i18n";
import { t } from "./lib/strings";

/** Flatten MDX children to plain text (for fenced code blocks). */
function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  const el = node as ReactElement<{ children?: ReactNode }>;
  return textOf(el.props?.children);
}

/** Code-fence language captions, in the page language. */
function langNames(uiLang: Lang): Record<string, string> {
  return {
    python: t(uiLang, "tb.code.python"),
    py: t(uiLang, "tb.code.python"),
    maths: t(uiLang, "tb.code.maths"),
    math: t(uiLang, "tb.code.maths"),
    pseudocode: t(uiLang, "tb.code.pseudocode"),
    js: t(uiLang, "tb.code.javascript"),
    javascript: t(uiLang, "tb.code.javascript"),
    text: t(uiLang, "tb.code.example"),
    txt: t(uiLang, "tb.code.example"),
  };
}

/** Fenced ``` blocks render through the dark .code-block design. */
function Pre({ children, uiLang = "en" }: { children?: ReactNode; uiLang?: Lang }) {
  let lang = t(uiLang, "tb.code");
  let code = "";
  const child = Array.isArray(children) ? children[0] : children;
  if (child && typeof child === "object" && "props" in (child as object)) {
    const props = (child as ReactElement<{ className?: string; children?: ReactNode }>).props;
    const m = /language-([\w-]+)/.exec(props.className ?? "");
    if (m) lang = langNames(uiLang)[m[1].toLowerCase()] ?? m[1];
    code = textOf(props.children);
  } else {
    code = textOf(children);
  }
  return <CodeBlock lang={lang} uiLang={uiLang}>{code}</CodeBlock>;
}

/** Only these URL schemes are allowed in MDX links. Anything else
 *  (javascript:, data:, vbscript:, …) renders as plain text, never a link. */
function isSafeHref(href: string): boolean {
  const h = href.trim();
  if (h === "" || h.startsWith("/") || h.startsWith("#")) return true;
  return /^(https?:\/\/|mailto:|tel:)/i.test(h);
}

/** Site-internal MDX links follow the page language. */
function MdxLink({ uiLang = "en", ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { uiLang?: Lang }) {
  const href = props.href ?? "";
  if (!isSafeHref(href)) {
    // Unsafe scheme (e.g. javascript:) — render the text with no link.
    return <span>{props.children}</span>;
  }
  if (href.startsWith("/")) {
    return <Link href={withLang(href, uiLang)}>{props.children}</Link>;
  }
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
}

/** Injects the page language into every textbook component used in MDX. */
export function mdxComponentsForLang(lang: Lang): Record<string, ComponentType<any>> {
  const withLangProp = <P extends object>(C: ComponentType<P & { lang?: Lang }>) =>
    function WithLang(props: P) {
      return <C {...(props as P)} lang={lang} />;
    };
  const withUiLang = <P extends object>(C: ComponentType<P & { uiLang?: Lang }>) =>
    function WithUiLang(props: P) {
      return <C {...(props as P)} uiLang={lang} />;
    };
  return {
    pre: (props: { children?: ReactNode }) => <Pre {...props} uiLang={lang} />,
    a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <MdxLink {...props} uiLang={lang} />,
    table: (props: React.HTMLAttributes<HTMLTableElement>) => <table className="mdx-table" {...props} />,
    Callout,
    Definition: withLangProp(Definition),
    ImportantNote: withLangProp(ImportantNote),
    WorkedExample: withLangProp(WorkedExample),
    Example: withLangProp(Example),
    Summary: withLangProp(Summary),
    Formula,
    Diagram,
    CodeBlock: withUiLang(CodeBlock),
    PracticeQuestions,
    PracticeItem: withLangProp(PracticeItem),
    Quiz: withLangProp(Quiz),
    QuizQuestion: withLangProp(QuizQuestion),
    LearningObjectives,
    RelatedTopics: withLangProp(RelatedTopics),
    NextChapter: withLangProp(NextChapter),
    TryItPython: withLangProp(TryItPython),
    EquationSolver: withLangProp(EquationSolver),
  };
}

/** Component map passed to MDXRemote — the textbook vocabulary (English). */
export const mdxComponents: Record<string, ComponentType<any>> = mdxComponentsForLang("en");
