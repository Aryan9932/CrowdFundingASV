import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Testing PostgreSQL Connection...\n");
console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "✅ Found" : "❌ Missing"
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000, // 10 seconds timeout
});

async function testConnection() {
  try {
    console.log("\n🔌 Attempting to connect to NeonDB...");

    const client = await pool.connect();
    console.log("✅ Connection successful!");

    const result = await client.query("SELECT NOW(), version()");
    console.log("\n📊 Database Info:");
    console.log("Current Time:", result.rows[0].now);
    console.log("PostgreSQL Version:", result.rows[0].version);

    // Test if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log("\n📋 Tables in database:");
    if (tablesResult.rows.length === 0) {
      console.log("⚠️  No tables found. You need to create your schema!");
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`  - ${row.table_name}`);
      });
    }

    client.release();
    console.log("\n✅ All tests passed!");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Connection failed:");
    console.error("Error:", err.message);
    console.error("\n🔧 Troubleshooting steps:");
    console.error("1. Check your internet connection");
    console.error("2. Verify NeonDB project is active (not paused)");
    console.error("3. Check if DATABASE_URL is correct in .env");
    console.error(
      "4. Try accessing NeonDB dashboard: https://console.neon.tech"
    );
    console.error("5. Check if your IP is whitelisted (if firewall enabled)");
    process.exit(1);
  }
}

testConnection();
