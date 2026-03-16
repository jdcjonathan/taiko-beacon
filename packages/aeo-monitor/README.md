# aeo-monitor (Component 10)

AEO Citation Monitor: query OpenAI, Anthropic, Perplexity, and Gemini with the 20 standard prompts and record whether Taiko is cited. Results are written to `results/YYYY-MM-DD.json` and `results/history.csv`. Runs weekly via GitHub Actions (Monday 08:00 UTC).

## Backend

```bash
pip install openai anthropic requests pandas
export OPENAI_API_KEY=... ANTHROPIC_API_KEY=... PERPLEXITY_API_KEY=... GEMINI_API_KEY=...
python monitor.py
```

Configure repo secrets for the workflow. If a key is missing, that engine is skipped (placeholder response).

## Dashboard

Next.js 14 (App Router) dashboard reads `results/history.csv` and shows:

- Overall citation rate (hero)
- Citation rate by engine
- Latest results table

```bash
cd dashboard
pnpm install
pnpm run build
pnpm start
```

Deploy to Vercel (or similar) with build command `pnpm run build` and root `packages/aeo-monitor/dashboard`. Ensure `results/history.csv` is present in the repo (committed by the weekly cron).
