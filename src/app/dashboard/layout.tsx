import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, isApproved: true },
  });

  if (user?.role === Role.ADMIN) {
    redirect("/admin");
  }

  if (user?.role !== Role.CLIENT || !user.isApproved) {
    redirect("/pending-approval");
  }

  return <DashboardShell mode="client">{children}</DashboardShell>;
}
