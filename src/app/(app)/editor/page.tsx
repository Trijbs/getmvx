import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { EditorClient } from "@/components/editor/EditorClient";

export default async function EditorPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      links: { orderBy: { position: "asc" } },
      theme: true,
    },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const themes = await prisma.theme.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  return <EditorClient profile={profile} themes={themes} />;
}
