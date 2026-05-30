import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeWeeklyMenuCsv } from "@/lib/weekly-menu";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    : null;

  if (user?.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const weeklyMenu = await prisma.weeklyMenu.findUniqueOrThrow({
    where: { id: params.id },
    include: { cells: true },
  });

  const csv = serializeWeeklyMenuCsv({
    title: weeklyMenu.title,
    startDate: weeklyMenu.startDate,
    cells: weeklyMenu.cells,
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="weekly-menu-${weeklyMenu.startDate.toISOString().slice(0, 10)}.csv"`,
    },
  });
}
