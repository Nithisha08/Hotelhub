/**
 * Creates the hotels table (and indexes) by running db/schema.sql.
 *
 * Usage (from the server/ folder):
 *   npm run setup
 *
 * Requires a reachable PostgreSQL instance configured in .env
 * (or with matching PG* environment variables).
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function setup() {
  const client = new Client({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT) || 5544,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || "hotel_list_db",
  });

  await client.connect();
  console.log("Connected to database. Applying schema...");

  const schemaPath = path.join(__dirname, "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  await client.query(schemaSql);
  console.log("Schema applied successfully.");
  console.log("Next: npm run seed  (to insert demo hotels)");

  await client.end();
  console.log("Done!");
}

setup().catch((error) => {
  console.error("Setup failed:", error.message);
  process.exit(1);
});
