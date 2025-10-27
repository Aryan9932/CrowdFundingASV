import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function inspectDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL (NeonDB)\n");

    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log("📋 Tables in database:");
    for (const row of tablesResult.rows) {
      console.log(`\n📁 Table: ${row.table_name}`);

      // Get columns for each table
      const columnsResult = await client.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `,
        [row.table_name]
      );

      columnsResult.rows.forEach((col) => {
        console.log(
          `   - ${col.column_name}: ${col.data_type} ${
            col.is_nullable === "NO" ? "(required)" : "(optional)"
          }`
        );
      });
    }

    await client.end();
    console.log("\n✅ Database inspection complete!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    await client.end();
  }
}

inspectDatabase();
