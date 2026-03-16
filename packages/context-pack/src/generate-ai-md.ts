/**
 * CLI to generate a repo-specific AI.md from AI.md.template.
 * Usage: node dist/generate-ai-md.js <repo-name> "<description>" "<ecosystem role>" "<key files>" "<standards>" "<getting started>"
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, "..", "AI.md.template");

function main(): void {
  const args = process.argv.slice(2);
  if (args.length < 6) {
    console.error(
      "Usage: generate-ai-md <REPO_NAME> \"<REPO_DESCRIPTION>\" \"<ECOSYSTEM_ROLE>\" \"<KEY_FILES>\" \"<STANDARDS_USED>\" \"<GETTING_STARTED>\""
    );
    process.exit(1);
  }
  const [
    REPO_NAME,
    REPO_DESCRIPTION,
    ECOSYSTEM_ROLE,
    LIST_OF_IMPORTANT_FILES,
    STANDARDS_USED,
    GETTING_STARTED,
  ] = args;

  const template = readFileSync(templatePath, "utf-8");
  const out = template
    .replace(/\{REPO_NAME\}/g, REPO_NAME)
    .replace(/\{REPO_DESCRIPTION\}/g, REPO_DESCRIPTION)
    .replace(/\{ECOSYSTEM_ROLE\}/g, ECOSYSTEM_ROLE)
    .replace(/\{LIST_OF_IMPORTANT_FILES\}/g, LIST_OF_IMPORTANT_FILES)
    .replace(/\{STANDARDS_USED\}/g, STANDARDS_USED)
    .replace(/\{GETTING_STARTED\}/g, GETTING_STARTED);

  const outPath = process.cwd() + "/AI.md";
  writeFileSync(outPath, out);
  console.log("Wrote", outPath);
}

main();
