// Prisma 7 config — connexion Supabase via session-mode pooler pour migrations
import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL = session-mode pooler (port 5432), contourne PgBouncer pour les migrations
    url: process.env["DIRECT_URL"]!,
  },
  adapter: () => {
    // Adapter pour le runtime (PrismaClient) — utilise le pooler transaction (port 6543)
    const connectionString = process.env["DATABASE_URL"]!;
    return new PrismaPg({ connectionString });
  },
});
