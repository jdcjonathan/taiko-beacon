import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const manifestPath = join(__dirname, "../taiko-mcp-manifest.json");

describe("taiko-mcp-manifest.json", () => {
  it("is valid JSON and has required fields", () => {
    const raw = readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(raw);
    assert.strictEqual(manifest.name, "taiko");
    assert.strictEqual(manifest.displayName, "Taiko Blockchain");
    assert.strictEqual(manifest.chainId, 167000);
    assert.ok(Array.isArray(manifest.tools));
    assert.ok(manifest.tools.length >= 8);
    const toolNames = manifest.tools.map((t) => t.name);
    assert.ok(toolNames.includes("get_balance"));
    assert.ok(toolNames.includes("get_agent_registry"));
  });
});
