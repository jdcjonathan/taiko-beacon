import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const src = join(__dirname, "..", "src");

describe("entity-pages MDX", () => {
  it("what-is-taiko.mdx has required frontmatter and content", () => {
    const content = readFileSync(join(src, "what-is-taiko.mdx"), "utf-8");
    assert.ok(content.includes('title: "What is Taiko?"'), "has title");
    assert.ok(content.includes('canonical: "https://taiko.xyz/what-is-taiko"'), "has canonical");
    assert.ok(content.includes("based rollup"), "has 50-word summary");
    assert.ok(content.includes("Taiko vs. Other L2s"), "has comparison table");
    assert.ok(content.includes("167000"), "has chain ID");
  });

  it("best-l2-for-ai-agents.mdx has required frontmatter and checklist", () => {
    const content = readFileSync(join(src, "best-l2-for-ai-agents.mdx"), "utf-8");
    assert.ok(content.includes("Best L2 for AI Agents"), "has title");
    assert.ok(content.includes('canonical: "https://taiko.xyz/best-l2-for-ai-agents"'), "has canonical");
    assert.ok(content.includes("Decision Checklist"), "has checklist");
    assert.ok(content.includes("ERC-8004"), "has agent standard");
  });
});
