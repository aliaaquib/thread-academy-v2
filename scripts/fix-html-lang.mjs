/**
 * fix-html-lang.mjs — postbuild step for the static export.
 *
 * The root layout hardcodes <html lang="en"> (required by Next.js); the
 * [lang] tree can't change it at build time, so this script rewrites the
 * lang attribute in the generated HTML files for the /tr, /ru and /ky
 * mirrors. English files are left untouched.
 *
 * Usage: node scripts/fix-html-lang.mjs  (runs automatically via `postbuild`)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");

// Locale codes used in the lang attribute (BCP 47).
const LANG_DIRS = { tr: "tr", ru: "ru", ky: "ky" };

let fixed = 0;
const fixFile = (p, locale) => {
  let html = fs.readFileSync(p, "utf8");
  if (html.includes('<html lang="en"')) {
    html = html.replace('<html lang="en"', `<html lang="${locale}"`);
    fs.writeFileSync(p, html);
    fixed++;
  }
};
for (const [dir, locale] of Object.entries(LANG_DIRS)) {
  // /tr, /ru, /ky home pages export as top-level tr.html, ru.html, ky.html
  const topFile = path.join(outDir, `${dir}.html`);
  if (fs.existsSync(topFile)) fixFile(topFile, locale);
  // Everything else lives under tr/, ru/, ky/
  const base = path.join(outDir, dir);
  if (!fs.existsSync(base)) continue;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile() && entry.name.endsWith(".html")) fixFile(p, locale);
    }
  };
  walk(base);
}
console.log(`fix-html-lang: updated ${fixed} HTML files`);
