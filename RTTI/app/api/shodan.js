// /api/shodan.js
const { Client } = require('pg');
const fetch = require('node-fetch');
require('dotenv').config();

const client = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'threat_intel',
  password: 'securepass',
  port: 5432,
});

const API_KEY = process.env.SHODAN_API_KEY;
const IP = '8.8.8.8';
const URL = `https://api.shodan.io/shodan/host/${IP}?key=${API_KEY}`;

async function fetchShodanData() {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (!data.ports || data.ports.length === 0) {
      console.log("No open ports detected. Skipping database insertion.");
      return;
    }

    const threat_name = `Exposed Ports: ${data.ports.join(", ")}`;

    await client.connect();

    const query = `
      INSERT INTO threats (asset_id, threat_name, risk_level)
      VALUES ($1, $2, NULL)
      RETURNING *;
    `;

    const values = [1, threat_name];
    const res = await client.query(query, values);

    console.log("✅ Threat data inserted:", res.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching or inserting Shodan data:", error);
  } finally {
    await client.end();
  }
}

fetchShodanData();
