/**
 * Build-time script: scans content/ + data model and writes one search index
 * per language — public/search-index.json (English, unchanged path) plus
 * public/tr/search-index.json, public/ru/search-index.json and
 * public/ky/search-index.json. Runs automatically via the `prebuild` npm
 * script before `next build`. Run from the project root.
 *
 * Non-English indexes are built from the translated lesson content, which is
 * currently AI-generated drafts — they require qualified language/subject
 * review before production use. Missing translations simply produce fewer
 * entries — nothing is invented.
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildSearchIndex } from "../src/lib/search";
import { LANGS, langPrefix } from "../src/lib/i18n";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, "..");
process.chdir(projectRoot);

for (const l of LANGS) {
  const index = buildSearchIndex(l.code);
  const dir = join(projectRoot, "public", langPrefix(l.code).replace(/^\//, ""));
  mkdirSync(dir, { recursive: true });
  const outPath = join(dir, "search-index.json");
  writeFileSync(outPath, JSON.stringify(index, null, 1) + "\n", "utf8");
  console.log(`search-index [${l.code}]: ${index.length} entries → ${outPath}`);
}
