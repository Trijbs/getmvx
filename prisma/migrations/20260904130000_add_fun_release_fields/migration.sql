-- Fun Release: additive fields for freemium features + easter eggs.
-- All additive with defaults — safe for existing rows. Applied at deploy (no automated migrate in CI).

-- Profilepodiums — tabbed sections ("stack" | "tabs")  [PRO]
ALTER TABLE "Profile" ADD COLUMN "podiumMode" TEXT NOT NULL DEFAULT 'stack';

-- Per-profile light/dark override ("dark" | "light")  [PRO]
ALTER TABLE "Profile" ADD COLUMN "colorMode" TEXT NOT NULL DEFAULT 'dark';

-- Status/audience labels shown as a pill on the link button  [FREE]
ALTER TABLE "Link" ADD COLUMN "label" TEXT;
ALTER TABLE "Link" ADD COLUMN "labelColor" TEXT;
