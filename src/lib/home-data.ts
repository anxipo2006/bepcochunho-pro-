import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const WEEKLY_MENU_CACHE_TAG = "weekly-menu";

export const getActiveWeeklyMenu = unstable_cache(
  async () =>
    prisma.weeklyMenu.findFirst({
      where: { isActive: true },
      orderBy: { startDate: "desc" },
      include: { cells: { orderBy: [{ group: "asc" }, { slot: "asc" }, { dayIndex: "asc" }] } },
    }),
  ["active-weekly-menu"],
  {
    revalidate: 300,
    tags: [WEEKLY_MENU_CACHE_TAG],
  },
);
