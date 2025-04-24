// db/db-connection.js
import pkg from "pg";
const { Client } = pkg;

// Prefer DATABASE_URL (Render sets it), else use local settings
const client = new Client(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }   // required on Render
      }
    : {
        host: "localhost",
        port: 5432,
        database: "threat_intel",
        user: "threat_user",
        password: "yourStrongPassword"
      }
);

await client.connect();
console.log("✅ Connected to PostgreSQL");

export default client;
