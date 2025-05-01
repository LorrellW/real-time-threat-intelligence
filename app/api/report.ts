// /app/routes/api/report.ts

import { json } from "@remix-run/node";
import { getThreatSummary } from "~/utils/report.server";

export const loader = async () => {
  const reportData = await getThreatSummary(); // pull from DB
  return json(reportData); // or render an HTML/Markdown page
};

export async function getThreatSummary() {
  const client = await db.connect();
  const result = await client.query(`
    SELECT a.name AS asset, t.threat_name, t.risk_level, t.trend_score, t.mitigation
    FROM threats t
    JOIN assets a ON t.asset_id = a.id
    ORDER BY t.risk_level DESC;
  `);
  return result.rows;
}
