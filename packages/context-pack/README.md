# context-pack (Components 4 & 5)

Generates **taiko-context.md** (single Markdown file for LLM system prompts) and provides the **AI.md** template for taikoxyz repos.

## Generate taiko-context.md

From repo root:

```bash
pnpm run generate:context
```

Or from this package:

```bash
pnpm run build
```

Output: `packages/context-pack/taiko-context.md`. Hosted at raw GitHub URL for pasting into agents.

## Generate repo-specific AI.md

Use the template and CLI to fill placeholders:

```bash
pnpm run build
node dist/generate-ai-md.js "taiko-node" "Taiko node implementation." "Core node for Taiko L2." "README.md, package.json" "N/A" "1. Clone 2. Install 3. Run"
```

Writes `AI.md` in the current directory. Template: `AI.md.template`.
