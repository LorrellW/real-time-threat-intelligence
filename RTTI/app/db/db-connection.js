// app/db/db-connection.js
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',        // Your PostgreSQL server address
  port: 5432,               // Default PostgreSQL port
  database: 'threat_intel', // Your database name
  user: 'threat_user',      // Your database user
  password: 'yourStrongPassword', // Your database password
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch(err => console.error('Connection error', err.stack));

export default client;
