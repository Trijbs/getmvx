-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerified" TIMESTAMP(3);

-- Backfill: grandfather existing credentials users as verified so the new login
-- gate (auth.ts rejects credentials logins where emailVerified is null) doesn't
-- lock out accounts created before email verification existed.
UPDATE "User" SET "emailVerified" = now() WHERE "passwordHash" IS NOT NULL AND "emailVerified" IS NULL;
