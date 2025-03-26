import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as dotenv from "dotenv";
import { join } from "path";

const envPath = join(__dirname, "../../../../.env");
console.log("Loading .env file from:", envPath);

dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please check your .env file location and contents."
  );
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function main() {
  try {
    console.log("Starting migration...");

    // Drop all tables in correct order (respecting foreign keys)
    console.log("Dropping existing tables...");
    await sql`DROP TABLE IF EXISTS calls CASCADE`;
    await sql`DROP TABLE IF EXISTS organization_users CASCADE`;
    await sql`DROP TABLE IF EXISTS organizations CASCADE`;
    await sql`DROP TABLE IF EXISTS accounts CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;

    const migrationsPath = join(__dirname, "migrations");
    console.log("Migrations path:", migrationsPath);
    await migrate(db, { migrationsFolder: migrationsPath });
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
  process.exit(0);
}

main();
