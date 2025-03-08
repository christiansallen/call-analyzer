import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import { join } from "path";

// Load .env from root directory
dotenv.config({ path: join(__dirname, "../../.env") });

export default {
  schema: "./src/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
