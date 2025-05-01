// app/scripts/test-incident.ts
import { getIncidentResponse, logIncident } from "../utils/incidentResponse.server.js";

async function testIncidentLogging() {
  const threat = "SQL Injection";
  const responsePlan = getIncidentResponse(threat);
  
  try {
    const result = await logIncident(threat, responsePlan);
    console.log("Test incident logged successfully:", result);
  } catch (error) {
    console.error("Error logging test incident:", error);
  }
}

testIncidentLogging();
