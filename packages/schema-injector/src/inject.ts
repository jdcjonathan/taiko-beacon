/**
 * FAQ Schema Injector — fetch docs HTML and inject FAQPage JSON-LD into <head>.
 * 1. Load faq-seed.json
 * 2. Optionally fetch sitemap and HTML (or accept local HTML paths)
 * 3. Match page path to FAQ entries, build FAQPage schema, inject, write to output/
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildFAQPageSchema, injectFAQIntoHead } from "./schema.js";
import type { FAQEntry } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");

function loadFAQSeed(): FAQEntry[] {
  const path = join(pkgRoot, "faq-seed.json");
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw) as FAQEntry[];
}

/**
 * Map URL path to page keys for FAQ selection.
 * e.g. /resources/faqs -> general, ai-agents, developer
 */
function pathToPages(path: string): string[] {
  const p = path.toLowerCase();
  if (p.includes("faq") || p.includes("resource")) return ["general", "ai-agents", "developer"];
  if (p.includes("erc-8004") || p.includes("x402") || p.includes("agent")) return ["ai-agents"];
  if (p.includes("getting-started") || p.includes("quickstart") || p.includes("bridge")) return ["developer"];
  return ["general"];
}

export function getFAQsForPath(faqSeed: FAQEntry[], path: string): FAQEntry[] {
  const pages = pathToPages(path);
  const set = new Set(pages);
  return faqSeed.filter((e) => set.has(e.page));
}

export function injectIntoHTML(html: string, path: string, faqSeed: FAQEntry[]): string {
  const entries = getFAQsForPath(faqSeed, path);
  if (entries.length === 0) return html;
  const schema = buildFAQPageSchema(entries);
  return injectFAQIntoHead(html, schema);
}

/**
 * Process a single HTML string (e.g. from fetch or file). Returns modified HTML.
 */
export function processHTML(html: string, pathOrPage: string, faqSeed?: FAQEntry[]): string {
  const seed = faqSeed ?? loadFAQSeed();
  return injectIntoHTML(html, pathOrPage, seed);
}

/**
 * CLI: read HTML from stdin or a file, inject schema, write to stdout or output file.
 * Usage: node dist/inject.js [path] [input.html] [output.html]
 * If no args: path=/, read stdin, write stdout.
 */
function main(): void {
  const args = process.argv.slice(2);
  const path = args[0] ?? "/";
  const seed = loadFAQSeed();

  if (args[1] && args[2]) {
    const inputPath = join(process.cwd(), args[1]);
    const outputPath = join(process.cwd(), args[2]);
    const html = readFileSync(inputPath, "utf-8");
    const out = processHTML(html, path, seed);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, out);
    console.log("Wrote", outputPath);
  } else {
    // stdin -> stdout
    const chunks: Buffer[] = [];
    process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
    process.stdin.on("end", () => {
      const html = Buffer.concat(chunks).toString("utf-8");
      const out = processHTML(html, path, seed);
      process.stdout.write(out);
    });
  }
}

if (process.argv[1]?.endsWith("inject.js")) {
  main();
}
