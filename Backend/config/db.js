import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for NeonDB
  },
});

// Test connection
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected (NeonDB)");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err.message);
});

export default pool;
