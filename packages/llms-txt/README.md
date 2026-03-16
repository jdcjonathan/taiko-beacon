# llms-txt (Component 1)

Generates `llms.txt` and `llms-full.txt` from the canonical entity definition in `docs/entity-definition.md`. Output is written to `dist/`.

## Run

```bash
pnpm run build
pnpm run generate
```

From repo root: `pnpm run generate:llms`

## Output

- `dist/llms.txt` — llms.txt standard format for AI crawlers (see llmstxt.org).
- `dist/llms-full.txt` — Same content plus full 150-word definition, structured JSON, and top 10 FAQs inline.

Deploy target: `taiko.xyz/llms.txt` and `taiko.xyz/llms-full.txt` (via deploy-static workflow).
