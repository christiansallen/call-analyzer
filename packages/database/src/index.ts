import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;
console.log(import.meta.env);

if (!DATABASE_URL) {
  throw new Error("VITE_DATABASE_URL is not set");
}

const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from "./schema";
