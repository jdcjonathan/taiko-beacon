# entity-corrections (Component 9)

Tracks correction status of external entity listings (CoinMarketCap, DeFiLlama, Messari, Wikidata). Use `corrections.json` as the single tracking document and `check-status.py` to print a status report.

## Run

```bash
python check-status.py
```

CMC and Messari corrections are submitted via each platform's form (see `corrections.json` for URLs). DeFiLlama and Wikidata are updated via PR or create-item flow. Update `corrections.json` when you submit or resolve (e.g. set `submitted_date`, `resolved_date`, `status`).
