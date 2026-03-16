#!/usr/bin/env python3
"""
AEO Citation Monitor — query OpenAI, Anthropic, Perplexity, Gemini with standard
prompts and record whether Taiko is cited. Writes results/YYYY-MM-DD.json and
appends to results/history.csv. Run weekly via aeo-monitor.yml (Monday 08:00 UTC).
"""
import csv
import json
import os
import re
from datetime import date
from pathlib import Path

PROMPTS_PATH = Path(__file__).parent / "prompts.json"
RESULTS_DIR = Path(__file__).parent / "results"
HISTORY_CSV = RESULTS_DIR / "history.csv"
COMPETITORS = ["base", "arbitrum", "optimism", "polygon"]


def load_prompts():
    with open(PROMPTS_PATH) as f:
        return json.load(f)


def taiko_position(text: str) -> int:
    """1 = first mention, 2 = second, etc., 0 = not mentioned."""
    lower = text.lower()
    if "taiko" not in lower:
        return 0
    pos = lower.index("taiko")
    return lower[:pos].count("taiko") + 1


def competitor_cited(text: str) -> list[str]:
    found = []
    lower = text.lower()
    for c in COMPETITORS:
        if c in lower:
            found.append(c)
    return found


def query_openai(prompt: str, api_key: str) -> str:
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        r = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
        )
        return (r.choices[0].message.content or "").strip()
    except Exception as e:
        return f"[OpenAI error: {e}]"


def query_anthropic(prompt: str, api_key: str) -> str:
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        m = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}],
        )
        return (m.content[0].text if m.content else "").strip()
    except Exception as e:
        return f"[Anthropic error: {e}]"


def query_perplexity(prompt: str, api_key: str) -> tuple[str, str]:
    try:
        import requests
        r = requests.post(
            "https://api.perplexity.ai/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.1-sonar-large-128k-online",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
            },
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        text = (data.get("choices", [{}])[0].get("message", {}).get("content") or "").strip()
        citations = json.dumps(data.get("citations", []))
        return text, citations
    except Exception as e:
        return f"[Perplexity error: {e}]", "[]"


def query_gemini(prompt: str, api_key: str) -> str:
    try:
        import requests
        r = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={api_key}",
            json={"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"maxOutputTokens": 500}},
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
        return (parts[0].get("text", "") if parts else "").strip()
    except Exception as e:
        return f"[Gemini error: {e}]"


def run_one(engine: str, prompt_id: str, cluster: str, prompt_text: str) -> dict:
    api_key = os.environ.get(f"{engine.upper()}_API_KEY") or os.environ.get("OPENAI_API_KEY" if engine == "openai" else "")
    text = ""
    citation_source = ""

    if engine == "openai" and api_key:
        text = query_openai(prompt_text, api_key)
    elif engine == "anthropic" and api_key:
        text = query_anthropic(prompt_text, api_key)
    elif engine == "perplexity" and api_key:
        text, citation_source = query_perplexity(prompt_text, api_key)
    elif engine == "gemini" and api_key:
        text = query_gemini(prompt_text, api_key)
    else:
        text = "[No API key — skipped]"

    was_taiko = "taiko" in text.lower()
    position = taiko_position(text) if was_taiko else 0
    competitors = competitor_cited(text)
    excerpt = (text[:200] + "…") if len(text) > 200 else text

    return {
        "engine": engine,
        "prompt_id": prompt_id,
        "cluster": cluster,
        "was_taiko_cited": was_taiko,
        "taiko_position": position,
        "citation_source": citation_source,
        "competitor_cited": competitors,
        "response_excerpt": excerpt,
    }


def main():
    prompts = load_prompts()
    engines = ["openai", "anthropic", "perplexity", "gemini"]
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    today = date.today().isoformat()
    rows = []
    for prompt in prompts:
        pid, prompt_text, cluster = prompt["id"], prompt["prompt"], prompt["cluster"]
        for engine in engines:
            row = run_one(engine, pid, cluster, prompt_text)
            rows.append(row)

    out_json = RESULTS_DIR / f"{today}.json"
    with open(out_json, "w") as f:
        json.dump({"date": today, "results": rows}, f, indent=2)
    print(f"Wrote {out_json}")

    csv_exists = HISTORY_CSV.exists()
    with open(HISTORY_CSV, "a", newline="") as f:
        w = csv.DictWriter(
            f,
            fieldnames=["date", "engine", "prompt_id", "cluster", "was_taiko_cited", "taiko_position", "competitor_cited"],
        )
        if not csv_exists:
            w.writeheader()
        for r in rows:
            w.writerow({
                "date": today,
                "engine": r["engine"],
                "prompt_id": r["prompt_id"],
                "cluster": r["cluster"],
                "was_taiko_cited": r["was_taiko_cited"],
                "taiko_position": r["taiko_position"],
                "competitor_cited": ",".join(r["competitor_cited"]) if r["competitor_cited"] else "",
            })
    print(f"Appended to {HISTORY_CSV}")


if __name__ == "__main__":
    main()
