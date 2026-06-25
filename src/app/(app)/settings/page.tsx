import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [profile, proBadge] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.badge.findFirst({ where: { userId: session.user.id, type: "PRO" } }),
  ]);

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <SettingsClient
      profile={profile}
      user={session.user}
      isPro={proBadge !== null}
    />
  );
}
