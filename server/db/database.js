const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  port: 5544,
  user: "postgres",
  password: "nithi@2005",
  database: "hotel_list_db",
});

module.exports = pool;