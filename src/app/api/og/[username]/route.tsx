import { prisma } from "@/lib/db";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      user: { select: { name: true } },
      theme: true,
    },
  });

  if (!profile) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "#0c0c0e",
            color: "#f0eff4",
            fontFamily: "Inter",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 800, color: "#c9a96e" }}>
            MVX
          </div>
          <div style={{ fontSize: 24, marginTop: 16, color: "#8a8998" }}>
            Profile not found
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const config = (profile.theme?.config as Record<string, string>) || {
    background: "#0c0c0e",
    accentColor: "#c9a96e",
    textColor: "#f0eff4",
    mutedColor: "#8a8998",
  };

  const displayName = profile.user.name || profile.username;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: config.background,
          color: config.textColor,
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: config.accentColor,
          }}
        />

        {/* Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: config.accentColor,
            color: config.background,
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          {profile.username.charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {displayName}
        </div>

        {/* Username */}
        <div
          style={{
            fontSize: 20,
            color: config.mutedColor,
            marginBottom: 16,
          }}
        >
          @{profile.username}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div
            style={{
              fontSize: 18,
              color: config.mutedColor,
              maxWidth: 600,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            {profile.bio.length > 100
              ? profile.bio.slice(0, 100) + "..."
              : profile.bio}
          </div>
        )}

        {/* MVX branding */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            fontSize: 16,
            color: config.mutedColor,
            opacity: 0.5,
          }}
        >
          getmvx.cc
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
