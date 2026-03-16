import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distPath = join(__dirname, "../dist");

describe("llms-txt generate", () => {
  it("produces llms.txt with required headings and links", () => {
    const llmsPath = join(distPath, "llms.txt");
    try {
      const content = readFileSync(llmsPath, "utf-8");
      assert.ok(content.startsWith("# Taiko\n"), "starts with # Taiko");
      assert.ok(content.includes("## Canonical Pages"), "has Canonical Pages");
      assert.ok(content.includes("## Developer Resources"), "has Developer Resources");
      assert.ok(content.includes("taiko.xyz/what-is-taiko"), "has what-is-taiko link");
      assert.ok(content.includes("llms-full.txt"), "has llms-full.txt link");
    } catch (e) {
      if (e.code === "ENOENT") {
        assert.fail("dist/llms.txt not found — run pnpm run build && pnpm run generate first");
      }
      throw e;
    }
  });

  it("produces llms-full.txt with 150-word definition and JSON", () => {
    const fullPath = join(distPath, "llms-full.txt");
    try {
      const content = readFileSync(fullPath, "utf-8");
      assert.ok(content.includes("Based rollup"), "contains based rollup");
      assert.ok(content.includes("ERC-8004"), "contains ERC-8004");
      assert.ok(content.includes('"chain_id": 167000'), "contains structured JSON");
      assert.ok(content.includes("Top 10 FAQs"), "contains FAQ section");
    } catch (e) {
      if (e.code === "ENOENT") {
        assert.fail("dist/llms-full.txt not found — run pnpm run build && pnpm run generate first");
      }
      throw e;
    }
  });
});
