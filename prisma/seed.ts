import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

const themes = [
  {
    name: "Midnight",
    isDefault: true,
    config: {
      background: "#0c0c0e",
      cardBg: "#131316",
      textColor: "#f0eff4",
      mutedColor: "#8a8998",
      accentColor: "#9b7ef8",
      borderColor: "rgba(255,255,255,0.07)",
      buttonStyle: "filled",
      fontFamily: "Inter",
    },
  },
  {
    name: "Pure White",
    isDefault: true,
    config: {
      background: "#ffffff",
      cardBg: "#f5f5f5",
      textColor: "#111111",
      mutedColor: "#888888",
      accentColor: "#333333",
      borderColor: "#eeeeee",
      buttonStyle: "filled",
      fontFamily: "Inter",
    },
  },
  {
    name: "Gold Luxe",
    isDefault: true,
    config: {
      background: "#0e0b06",
      cardBg: "#1a1408",
      textColor: "#f0e8d0",
      mutedColor: "#7a6a4a",
      accentColor: "#c9a96e",
      borderColor: "rgba(201,169,110,0.2)",
      buttonStyle: "filled",
      fontFamily: "Inter",
    },
  },
  {
    name: "Ocean Blue",
    isDefault: true,
    config: {
      background: "#0a1628",
      cardBg: "#0f2035",
      textColor: "#e0f0ff",
      mutedColor: "#6b8db5",
      accentColor: "#5b9cf6",
      borderColor: "rgba(91,156,246,0.15)",
      buttonStyle: "filled",
      fontFamily: "Inter",
    },
  },
  {
    name: "Neon Pink",
    isDefault: true,
    config: {
      background: "#0e0812",
      cardBg: "#1a0f1f",
      textColor: "#f0e0f5",
      mutedColor: "#9b7ab0",
      accentColor: "#ff6b9d",
      borderColor: "rgba(255,107,157,0.15)",
      buttonStyle: "glow",
      fontFamily: "Inter",
    },
  },
  {
    name: "Forest",
    isDefault: true,
    config: {
      background: "#0a120a",
      cardBg: "#0f1a0f",
      textColor: "#e0f0e0",
      mutedColor: "#6b8b6b",
      accentColor: "#4ecb8d",
      borderColor: "rgba(78,203,141,0.15)",
      buttonStyle: "filled",
      fontFamily: "Inter",
    },
  },
  {
    name: "Sunset",
    isDefault: true,
    config: {
      background: "#120a08",
      cardBg: "#1f120e",
      textColor: "#f5e8e0",
      mutedColor: "#b08b70",
      accentColor: "#ff8c42",
      borderColor: "rgba(255,140,66,0.15)",
      buttonStyle: "filled",
      fontFamily: "Inter",
    },
  },
  {
    name: "Minimal Gray",
    isDefault: true,
    config: {
      background: "#f8f8f8",
      cardBg: "#ffffff",
      textColor: "#222222",
      mutedColor: "#999999",
      accentColor: "#555555",
      borderColor: "#e5e5e5",
      buttonStyle: "outlined",
      fontFamily: "Inter",
    },
  },
  {
    name: "Cyberpunk",
    isDefault: true,
    config: {
      background: "#0a0a0a",
      cardBg: "#111111",
      textColor: "#00ff9f",
      mutedColor: "#00cc7f",
      accentColor: "#ff00ff",
      borderColor: "rgba(0,255,159,0.2)",
      buttonStyle: "neon",
      fontFamily: "DM Mono",
    },
  },
  {
    name: "Warm Cream",
    isDefault: true,
    config: {
      background: "#faf5ef",
      cardBg: "#ffffff",
      textColor: "#2d2a26",
      mutedColor: "#8a8070",
      accentColor: "#c9a96e",
      borderColor: "rgba(45,42,38,0.1)",
      buttonStyle: "filled",
      fontFamily: "Inter",
    },
  },
];

async function main() {
  console.log("Seeding default themes...");

  for (const theme of themes) {
    // Default themes have no userId — they're global templates
    // We'll store them with a special system user or as standalone
    // For now, skip if already exists by name
    const existing = await (prisma as any).theme.findFirst({
      where: { name: theme.name, isDefault: true },
    });

    if (!existing) {
      // Create a system-level theme entry (no user tied to it)
      // We need to handle this since Theme requires userId
      // For default themes, we'll create them when users sign up
      console.log(`  Theme template: ${theme.name}`);
    }
  }

  console.log("Theme templates ready. They'll be assigned on user registration.");
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
