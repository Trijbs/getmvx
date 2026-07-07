/**
 * Promote a user to ADMIN by email — the only way to mint the first admin.
 * There is deliberately no self-serve path anywhere in the app.
 *
 * Usage:
 *   npx tsx prisma/promote-admin.ts you@example.com
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.poolQueryViaFetch = true;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx prisma/promote-admin.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
    select: { id: true, email: true, role: true },
  });
  console.log(`Promoted ${user.email} (${user.id}) to ${user.role}`);
}

main()
  .catch((error) => {
    console.error("Promotion failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
