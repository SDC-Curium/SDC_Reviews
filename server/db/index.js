/* eslint-disable no-console */
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  // add to .env
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DBS,
  port: process.env.DB_PORT,
});

pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("PostgreSQL connected...");
  }
  // pool.end();
});

module.exports = pool;
