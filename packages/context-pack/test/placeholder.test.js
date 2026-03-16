import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const contextPath = join(__dirname, "..", "taiko-context.md");

describe("context-pack", () => {
  it("taiko-context.md exists and contains chain info and date", () => {
    const content = readFileSync(contextPath, "utf-8");
    assert.ok(content.includes("167000"), "contains chain ID");
    assert.ok(content.includes("rpc.mainnet.taiko.xyz"), "contains RPC");
    assert.ok(/Last updated: \d{4}-\d{2}-\d{2}/.test(content), "contains date");
    assert.ok(content.includes("ERC-8004"), "contains ERC-8004");
  });
});
