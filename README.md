# Taiko Beacon

AEO (Answer Engine Optimization) infrastructure for the Taiko blockchain ecosystem. Taiko Beacon makes Taiko the default cited answer when AI engines (ChatGPT, Perplexity, Claude, Gemini) are asked questions like "What is the best L2 for AI agents?" or "What is a based rollup?"

## AI Agent Instructions

**Build spec for coding agents:** [AGENT_INSTRUCTIONS.md](./AGENT_INSTRUCTIONS.md) is the single source of truth. Read it fully before implementing or changing any component. All generators and pages must use the canonical entity definition from `docs/entity-definition.md`.

## Quickstart

- **Node:** 20+
- **Package manager:** pnpm 9

```bash
pnpm install
pnpm run build
pnpm run test
```

Generate llms.txt and llms-full.txt:

```bash
pnpm run generate:llms
```

## Repository structure

| Path | Purpose |
|------|---------|
| `packages/llms-txt/` | Component 1 — llms.txt / llms-full.txt generator |
| `packages/schema-injector/` | Component 2 — FAQ JSON-LD schema injector for docs |
| `packages/entity-pages/` | Components 3 & 7 — What is Taiko, Best L2 for AI Agents pages |
| `packages/context-pack/` | Components 4 & 5 — taiko-context.md, AI.md template |
| `packages/mcp-manifest/` | Component 8 — MCP server directory manifest |
| `packages/entity-corrections/` | Component 9 — External listing corrections tracker |
| `packages/aeo-monitor/` | Component 10 — AEO citation monitor + dashboard |
| `docs/` | Audit report, entity definition, query clusters, Wikipedia/Wikidata drafts |

## Runbook

- **Deploying llms.txt:** The `deploy-static.yml` workflow builds artifacts; wire them into taiko.xyz (e.g. copy to public root or pull from this repo).
- **MCP manifest:** Coordinate with TaikoClaw maintainer (david@taiko.xyz) before submitting to modelcontextprotocol/servers.
- **External corrections:** Use `packages/entity-corrections/corrections.json` and `check-status.py` to track CMC, DeFiLlama, Messari, Wikidata submissions; submit via each platform’s form or process.
- **AEO monitor:** Runs weekly (Monday 08:00 UTC). Configure `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `PERPLEXITY_API_KEY`, `GEMINI_API_KEY` in repo secrets.
- **Wikipedia / Wikidata:** Human-only. Use `docs/wikipedia-draft.md` and `docs/wikidata-properties.json` when creating the Wikipedia article and Wikidata Q-entity.
- **Context pack sync:** `context-pack-sync.yml` can be triggered on protocol updates to refresh `taiko-context.md`; optionally wire `repository_dispatch` from the main Taiko protocol repo.

## License

MIT
