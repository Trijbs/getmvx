-- One-time data backfill: convert legacy emoji values in Link."icon" to the
-- canonical platform keys used by the new branded vector icon system.
--
-- This is idempotent and safe to re-run: only exact emoji matches are updated,
-- and unknown/custom values are left untouched so they continue to render via
-- the emoji fallback in SocialIcon.
--
-- Keys match the mapping in src/components/brand/social/social-icons.tsx.

UPDATE "Link" SET "icon" = 'link'      WHERE "icon" = '🔗';
UPDATE "Link" SET "icon" = 'x'         WHERE "icon" = '𝕏';
UPDATE "Link" SET "icon" = 'youtube'   WHERE "icon" = '▶';
UPDATE "Link" SET "icon" = 'instagram' WHERE "icon" = '📸';
UPDATE "Link" SET "icon" = 'discord'   WHERE "icon" = '💬';
UPDATE "Link" SET "icon" = 'tiktok'    WHERE "icon" = '🎵';
UPDATE "Link" SET "icon" = 'twitch'    WHERE "icon" = '🎮';
UPDATE "Link" SET "icon" = 'spotify'   WHERE "icon" = '🎧';
UPDATE "Link" SET "icon" = 'github'    WHERE "icon" = '🐙';
UPDATE "Link" SET "icon" = 'linkedin'  WHERE "icon" = '💼';
UPDATE "Link" SET "icon" = 'website'   WHERE "icon" = '🌐';
UPDATE "Link" SET "icon" = 'email'     WHERE "icon" = '📧';
UPDATE "Link" SET "icon" = 'blog'      WHERE "icon" = '📝';
UPDATE "Link" SET "icon" = 'shop'      WHERE "icon" = '🛒';
UPDATE "Link" SET "icon" = 'portfolio' WHERE "icon" = '💡';
