import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PublicProfile } from "@/components/profile/PublicProfile";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: { user: { select: { name: true, suspendedAt: true } } },
  });

  if (!profile || !profile.isPublic || profile.user.suspendedAt) {
    return { title: "Profile not found — MVX" };
  }

  const displayName = profile.user.name || profile.username;
  const description =
    profile.bio || `${displayName}'s links and social profiles on MVX`;

  return {
    title: `${displayName} — MVX`,
    description,
    openGraph: {
      title: `${displayName} — MVX`,
      description,
      url: `https://getmvx.cc/${username}`,
      siteName: "MVX",
      type: "profile",
      images: [
        {
          url: `https://getmvx.cc/api/og/${username}`,
          width: 1200,
          height: 630,
          alt: `${displayName} on MVX`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} — MVX`,
      description,
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { position: "asc" },
      },
      theme: true,
      user: {
        select: { name: true, image: true, suspendedAt: true },
      },
    },
  });

  // Suspended accounts disappear from the public surface entirely.
  if (!profile || !profile.isPublic || profile.user.suspendedAt) {
    notFound();
  }

  // Increment view count (non-blocking)
  prisma.profile
    .update({
      where: { id: profile.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  // Track view event (non-blocking)
  prisma.analyticsEvent
    .create({
      data: {
        profileId: profile.id,
        type: "VIEW",
      },
    })
    .catch(() => {});

  return <PublicProfile profile={profile} />;
}
