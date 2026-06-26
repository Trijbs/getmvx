import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Read directly from the environment instead of prisma's strict env() helper,
    // which throws at config-load when DATABASE_URL is absent (e.g. Vercel preview
    // builds). `prisma generate` doesn't need a live connection, so an empty
    // string is fine there; migrate/db commands still get the real URL at runtime.
    url: process.env.DATABASE_URL ?? "",
  },
});
