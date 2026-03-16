import { readFileSync, existsSync } from "fs";
import { join } from "path";

const RESULTS_PATH = join(process.cwd(), "..", "results", "history.csv");

function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.trim().split("\n");
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    header.forEach((h, j) => {
      row[h] = values[j] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

export default function AEODashboard() {
  let rows: Record<string, string>[] = [];
  let citationRate = 0;
  let latestDate = "";
  let error = "";

  if (existsSync(RESULTS_PATH)) {
    try {
      const raw = readFileSync(RESULTS_PATH, "utf-8");
      rows = parseCSV(raw);
      const cited = rows.filter((r) => r.was_taiko_cited === "True").length;
      citationRate = rows.length > 0 ? Math.round((cited / rows.length) * 100) : 0;
      const dates = [...new Set(rows.map((r) => r.date))].sort().reverse();
      latestDate = dates[0] ?? "";
    } catch (e) {
      error = String(e);
    }
  } else {
    error = `CSV not found at ${RESULTS_PATH}. Run monitor.py to generate results.`;
  }

  const byEngine = new Map<string, { cited: number; total: number }>();
  for (const r of rows) {
    const e = r.engine ?? "unknown";
    if (!byEngine.has(e)) byEngine.set(e, { cited: 0, total: 0 });
    byEngine.get(e)!.total++;
    if (r.was_taiko_cited === "True") byEngine.get(e)!.cited++;
  }

  return (
    <main>
      <h1>AEO Citation Monitor</h1>
      <p>Taiko citation rate across AI engines. Data from <code>results/history.csv</code> (updated weekly).</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <section style={{ margin: "2rem 0" }}>
        <h2>Overall citation rate (all engines, all prompts)</h2>
        <p style={{ fontSize: "3rem", fontWeight: "bold" }}>{citationRate}%</p>
        {latestDate && <p>Latest run: {latestDate}</p>}
      </section>
      <section style={{ margin: "2rem 0" }}>
        <h2>By engine</h2>
        <table border={1} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "0.5rem" }}>Engine</th>
              <th style={{ padding: "0.5rem" }}>Cited</th>
              <th style={{ padding: "0.5rem" }}>Total</th>
              <th style={{ padding: "0.5rem" }}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(byEngine.entries()).map(([engine, { cited, total }]) => (
              <tr key={engine}>
                <td style={{ padding: "0.5rem" }}>{engine}</td>
                <td style={{ padding: "0.5rem" }}>{cited}</td>
                <td style={{ padding: "0.5rem" }}>{total}</td>
                <td style={{ padding: "0.5rem" }}>{total ? Math.round((cited / total) * 100) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section style={{ margin: "2rem 0" }}>
        <h2>Latest results (sample)</h2>
        <table border={1} style={{ borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr>
              <th style={{ padding: "0.5rem" }}>date</th>
              <th style={{ padding: "0.5rem" }}>engine</th>
              <th style={{ padding: "0.5rem" }}>prompt_id</th>
              <th style={{ padding: "0.5rem" }}>cluster</th>
              <th style={{ padding: "0.5rem" }}>Taiko cited</th>
              <th style={{ padding: "0.5rem" }}>position</th>
              <th style={{ padding: "0.5rem" }}>competitors</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(-50).reverse().map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "0.5rem" }}>{r.date}</td>
                <td style={{ padding: "0.5rem" }}>{r.engine}</td>
                <td style={{ padding: "0.5rem" }}>{r.prompt_id}</td>
                <td style={{ padding: "0.5rem" }}>{r.cluster}</td>
                <td style={{ padding: "0.5rem" }}>{r.was_taiko_cited}</td>
                <td style={{ padding: "0.5rem" }}>{r.taiko_position}</td>
                <td style={{ padding: "0.5rem" }}>{r.competitor_cited}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
