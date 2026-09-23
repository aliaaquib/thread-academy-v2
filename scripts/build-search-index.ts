/**
 * Build-time script: scans content/ + data model and writes public/search-index.json.
 * Runs automatically via the `prebuild` npm script before `next build`.
 * Run from the project root.
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildSearchIndex } from "../src/lib/search";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, "..");
process.chdir(projectRoot);

const index = buildSearchIndex();
const outPath = join(projectRoot, "public", "search-index.json");
mkdirSync(join(projectRoot, "public"), { recursive: true });
writeFileSync(outPath, JSON.stringify(index, null, 1) + "\n", "utf8");
console.log(`search-index.json: ${index.length} entries → ${outPath}`);
