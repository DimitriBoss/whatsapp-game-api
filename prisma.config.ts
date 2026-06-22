// Prisma 7 config — CLI tooling only (migrations, schema)
// NOTE: The PrismaPg adapter is NOT configured here; it belongs in PrismaClient instantiation.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node --compiler-options {\"module\":\"commonjs\"} prisma/seed.ts",
  },
  datasource: {
    // DIRECT_URL = session-mode pooler (port 5432), bypasses PgBouncer for migrations
    url: process.env["DIRECT_URL"]!,
  },
});
