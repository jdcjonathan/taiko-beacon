# Taiko AEO Audit Report

Full audit findings that motivated the Taiko Beacon project. See [AGENT_INSTRUCTIONS.md](../AGENT_INSTRUCTIONS.md) for the build spec.

## Summary

A full audit of Taiko's current AEO (Answer Engine Optimization) signals revealed the following gaps.

## Findings

1. **`llms.txt` does not exist** at taiko.xyz or docs.taiko.xyz — AI crawlers (GPTBot, ClaudeBot, PerplexityBot) have no canonical guidance on how to index Taiko.

2. **No canonical "What is Taiko?" page** on taiko.xyz — LLMs currently assemble Taiko's definition from three conflicting third-party sources (Bitfinex Blog 2024, Coins.ph 2022, IQ.wiki), none of which mention based rollup, ERC-8004, or AI agent positioning.

3. **No Wikipedia page** for Taiko (blockchain) — the highest-weighted single source in LLM training data is unserved; searching "Taiko" on Wikipedia returns the Japanese drum.

4. **FAQs page at docs.taiko.xyz/resources/faqs/ has no FAQPage JSON-LD schema** — plain Docusaurus HTML; 3× citation uplift from schema is not being captured.

5. **No AI.md or taiko-context.md in any official GitHub repo** — a community-built LobeHub skill for taiko-node exists but is unofficial and outdated.

6. **MCP server directory has no official Taiko entry** — community-only presence on LobeHub, not the official modelcontextprotocol.io/servers registry.

7. **CoinMarketCap description contains "founders of Taiko are Daniel Wang and Daniel Wang"** — duplicated name error, no mention of based sequencing, ERC-8004, or AI agents; this is likely the most-cited Taiko description in LLM training data.

8. **No Wikidata Q-entity** for Taiko blockchain.

9. **No AEO citation monitoring** — no system exists to measure whether any fix is working.

## Remediation

Taiko Beacon addresses these via the components described in AGENT_INSTRUCTIONS.md (llms.txt, entity pages, schema injector, context pack, MCP manifest, entity corrections, AEO monitor).
