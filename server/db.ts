import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Create SQLite database
const sqlite = new Database(process.env.DATABASE_URL.replace("file:", ""));

// Create a drizzle instance
export const db = drizzle(sqlite, { schema });
