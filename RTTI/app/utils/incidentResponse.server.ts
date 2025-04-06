// app/utils/incidentResponse.server.ts
import client from "../db/db-connection"; // Adjust path as needed

export function getIncidentResponse(threat: string): string {
  const responsePlan: Record<string, string> = {
    "SQL Injection": "1. Block the attacking IP. 2. Patch the vulnerability. 3. Conduct forensic analysis.",
    "Phishing": "1. Notify affected users. 2. Change compromised credentials. 3. Update phishing filters.",
    "DDoS Attack": "1. Activate DDoS mitigation. 2. Enable rate limiting. 3. Monitor ongoing traffic.",
  };
  return responsePlan[threat] || "Refer to NIST SP 800-61 Rev. 2 for guidance.";
}

export async function logIncident(threat: string, responsePlan: string) {
  const queryText = `
    INSERT INTO incident_logs (threat, response_plan, timestamp)
    VALUES ($1, $2, NOW())
    RETURNING *;
  `;
  const values = [threat, responsePlan];

  try {
    const result = await client.query(queryText, values);
    console.log("Incident logged:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error logging incident:", error);
    throw error;
  }
}
