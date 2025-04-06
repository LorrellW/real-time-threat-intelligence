// app/routes/api/alerts.ts

import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { threat, riskScore } = await request.json();
    // Your processing logic...
    return json({ message: "Alerts processed successfully." });
  } catch (error) {
    console.error(error);
    return json({ error: "Error processing alerts" }, { status: 500 });
  }
};

