import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pkgRoot = join(__dirname, "..");

describe("schema-injector", () => {
  it("faq-seed.json has 50 entries with question, answer, page, query_cluster", () => {
    const raw = readFileSync(join(pkgRoot, "faq-seed.json"), "utf-8");
    const arr = JSON.parse(raw);
    assert.ok(Array.isArray(arr));
    assert.ok(arr.length >= 50);
    for (const e of arr.slice(0, 5)) {
      assert.ok(e.question && e.answer && e.page && e.query_cluster);
    }
  });

  it("processHTML injects FAQPage JSON-LD before </head>", async () => {
    const { processHTML } = await import("../dist/inject.js");
    const html = "<!DOCTYPE html><html><head><title>Test</title></head><body></body></html>";
    const out = processHTML(html, "/resources/faqs");
    assert.ok(out.includes('"@context":"https://schema.org"'));
    assert.ok(out.includes('"@type":"FAQPage"'));
    assert.ok(out.includes("</script>"));
    const beforeHead = out.indexOf("</head>");
    const scriptPos = out.indexOf("application/ld+json");
    assert.ok(scriptPos > 0 && scriptPos < beforeHead);
  });
});
