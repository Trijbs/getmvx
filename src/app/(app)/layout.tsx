import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardNav, MobileNav } from "@/components/dashboard/Nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has completed onboarding
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  // Allow access to onboarding page without profile
  // The middleware handles the actual protection

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <DashboardNav />
      <MobileNav />
      <main className="pl-[220px] max-lg:pl-0 max-lg:pb-16">
        <div className="mx-auto max-w-[1000px] px-6 py-8 max-lg:px-4">
          {children}
        </div>
      </main>
    </div>
  );
}
