/**
 * LESSON MDX SANITIZER — a remark plugin that keeps teacher-authored lesson
 * MDX safe to compile with blockJS:false.
 *
 * Why blockJS:false exists: quizzes pass plain data as JSX props
 * (options={["a", "b"]}, answer={3}), which needs JS expressions enabled.
 * But blockJS:false also lets raw HTML, event handlers and arbitrary
 * expressions through, and the bundled blockDangerousJS safety net only
 * blocks a fixed list of identifiers (eval, Function, process, …) — it does
 * NOT block fetch, localStorage, document, window, <script> elements or
 * onError-style handlers. A compromised teacher account could therefore run
 * JavaScript in every student's browser (stealing the tutor token from
 * localStorage, defacing lessons, phishing overlays).
 *
 * This plugin closes that hole at compile time (fail-closed: it THROWS, so a
 * bad lesson breaks the build instead of shipping). It enforces three rules:
 *
 * 1. ELEMENTS — dangerous intrinsic tags (<script>, <iframe>, <form>,
 *    <input>, <video>, …) are rejected outright.
 * 2. ATTRIBUTES — event-handler props (on*), dangerouslySetInnerHTML and
 *    srcDoc are rejected; javascript:/vbscript:/data: URLs in URL attributes
 *    are rejected.
 * 3. EXPRESSIONS — the only JavaScript allowed anywhere in lesson MDX
 *    (JSX props AND standalone {…} expressions) is pure data: string /
 *    number / boolean / null literals, arrays, plain objects, unary -/+/!
 *    and empty template literals. No identifiers, no calls, no member
 *    access, no functions. That covers every expression the real lessons
 *    use (quiz options/answers, RelatedTopics items) and nothing else.
 *
 * Raw HTML blocks get the same element/attribute treatment via a small
 * scanner. Unknown capitalized <Components> are left alone — they must come
 * from the MDX component map, and anything else fails at compile time.
 */
import type { Html, Root } from "mdast";
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement,
  MdxJsxTextElement,
} from "mdast-util-mdx-jsx";
import { visit } from "unist-util-visit";

/** Minimal ESTree shape — we only read `type` and recurse into children. */
interface EsNode {
  type: string;
  [key: string]: unknown;
}

function fail(what: string): never {
  throw new Error(`Security: ${what} is not allowed in lesson MDX.`);
}

/** Intrinsic tags that can execute code, load remote content, or capture
 *  input — never legitimate in lesson prose (quizzes render their own
 *  controls inside the Quiz components, not in MDX). */
const DANGEROUS_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "param",
  "link",
  "meta",
  "base",
  "basefont",
  "frame",
  "frameset",
  "noframe",
  "applet",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "option",
  "optgroup",
  "datalist",
  "fieldset",
  "video",
  "audio",
  "source",
  "track",
  "canvas",
  "map",
  "area",
  "marquee",
  "blink",
  "noscript",
  "template",
  "slot",
  "dialog",
  "html",
  "head",
  "body",
  "title",
]);

/** Attributes whose values are URLs (checked for javascript:/etc.). */
const URL_ATTRS = new Set([
  "href",
  "src",
  "srcset",
  "action",
  "formaction",
  "xlink:href",
  "cite",
  "data",
  "poster",
  "background",
  "longdesc",
]);

/** Normalize a URL value, then report whether its scheme is executable. */
function isDangerousUrl(value: string): boolean {
  // Strip whitespace/control characters — attackers hide behind "java\tscript:".
  const clean = value.replace(/[\u0000-\u0020]+/g, "");
  const scheme = clean.split(":")[0].toLowerCase();
  return scheme === "javascript" || scheme === "vbscript" || scheme === "data";
}

function checkAttributeName(name: string, where: string): void {
  const lower = name.toLowerCase();
  if (lower.startsWith("on")) fail(`event-handler attribute "${name}" on ${where}`);
  if (lower === "dangerouslysetinnerhtml" || lower === "srcdoc")
    fail(`attribute "${name}" on ${where}`);
}

/** The only JavaScript allowed in lesson MDX: pure data. */
function assertSafeValue(node: EsNode, where: string): void {
  switch (node.type) {
    case "Literal": {
      const v = node.value;
      if (v !== null && typeof v !== "string" && typeof v !== "number" && typeof v !== "boolean")
        fail(`non-data literal in ${where}`);
      if ((node as { regex?: unknown }).regex || (node as { bigint?: unknown }).bigint)
        fail(`regex/bigint literal in ${where}`);
      return;
    }
    case "ArrayExpression": {
      const elements = node.elements as Array<EsNode | null>;
      for (const el of elements ?? []) {
        if (el === null) fail(`sparse array in ${where}`);
        assertSafeValue(el, where);
      }
      return;
    }
    case "ObjectExpression": {
      const props = node.properties as EsNode[];
      for (const prop of props ?? []) {
        if (
          prop.type !== "Property" ||
          (prop as { computed?: boolean }).computed ||
          (prop as { kind?: string }).kind !== "init"
        )
          fail(`non-data object shape in ${where}`);
        assertSafeValue((prop as unknown as { value: EsNode }).value, where);
      }
      return;
    }
    case "UnaryExpression": {
      const op = node.operator as string;
      if (op !== "-" && op !== "+" && op !== "!") fail(`unary "${op}" in ${where}`);
      assertSafeValue(node.argument as EsNode, where);
      return;
    }
    case "TemplateLiteral": {
      const exprs = node.expressions as EsNode[];
      if ((exprs ?? []).length > 0) fail(`interpolated template in ${where}`);
      return;
    }
    default:
      fail(`"${node.type}" expression in ${where}`);
  }
}

/** Validate the ESTree attached to an MDX expression container. */
function assertSafeExpression(estree: EsNode | null | undefined, where: string): void {
  if (!estree || estree.type !== "Program") fail(`unparseable expression in ${where}`);
  const body = (estree as { body?: EsNode[] }).body;
  if (!Array.isArray(body)) fail(`unparseable expression in ${where}`);
  if (body.length === 0) return; // {/* comment */}
  if (body.length !== 1 || body[0].type !== "ExpressionStatement")
    fail(`multi-statement expression in ${where}`);
  assertSafeValue((body[0] as unknown as { expression: EsNode }).expression, where);
}

function checkAttributes(
  attributes: Array<MdxJsxAttribute | MdxJsxExpressionAttribute>,
  where: string,
): void {
  for (const attr of attributes) {
    // Spreads ({...props}) arrive as nameless expression attributes — reject.
    if (attr.type === "mdxJsxExpressionAttribute") fail(`spread attributes on ${where}`);
    checkAttributeName(attr.name, where);
    const value = attr.value;
    if (typeof value === "string") {
      if (URL_ATTRS.has(attr.name.toLowerCase()) && isDangerousUrl(value))
        fail(`unsafe URL in ${where} prop "${attr.name}"`);
    } else if (value !== null && typeof value === "object") {
      // MdxJsxAttributeValueExpression — a {…} prop value with data.estree.
      assertSafeExpression(
        (value as unknown as { data?: { estree?: EsNode } }).data?.estree,
        `${where} prop "${attr.name}"`,
      );
    }
    // null/undefined value = boolean shorthand (<div hidden />) — the name
    // check above is enough.
  }
}

/** Best-effort scan of raw HTML blocks (no lesson uses them today, but the
 *  CMS could introduce them). Fail-closed on anything dangerous. */
function checkRawHtml(value: string): void {
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b([^<>]*)>?/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(value)) !== null) {
    const tag = m[1].toLowerCase();
    const attrs = m[2] ?? "";
    if (DANGEROUS_TAGS.has(tag)) fail(`<${tag}> in raw HTML`);
    if (/\son[a-zA-Z]+\s*=/i.test(` ${attrs}`)) fail(`event-handler attribute in raw HTML <${tag}>`);
    const urlRe =
      /\b(href|src|srcset|action|formaction|xlink:href|cite|data|poster|background)\s*=\s*("[^"]*"|'[^']*'|[^\s"']+)/gi;
    let u: RegExpExecArray | null;
    while ((u = urlRe.exec(attrs)) !== null) {
      const v = u[2].replace(/^["']|["']$/g, "");
      if (isDangerousUrl(v)) fail(`unsafe URL in raw HTML <${tag}>`);
    }
  }
}

/** remark plugin — see the file header for the threat model. */
export function remarkSafeLessonMdx() {
  return (tree: Root) => {
    visit(tree, ["mdxJsxFlowElement", "mdxJsxTextElement"], (node) => {
      const el = node as MdxJsxFlowElement | MdxJsxTextElement;
      const name = el.name;
      if (!name) return; // fragment <>
      const where = `<${name}>`;
      if (name[0] === name[0].toLowerCase() && DANGEROUS_TAGS.has(name.toLowerCase()))
        fail(`${where} element`);
      checkAttributes(el.attributes, where);
    });
    visit(tree, ["mdxFlowExpression", "mdxTextExpression"], (node) => {
      assertSafeExpression(
        (node as { data?: { estree?: EsNode } }).data?.estree,
        "standalone expression",
      );
    });
    visit(tree, "html", (node) => {
      checkRawHtml((node as Html).value);
    });
  };
}
