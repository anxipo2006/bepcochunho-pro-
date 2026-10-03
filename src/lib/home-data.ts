import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const WEEKLY_MENU_CACHE_TAG = "weekly-menu";

const getCachedActiveWeeklyMenu = unstable_cache(
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

export async function getActiveWeeklyMenu() {
  try {
    return await getCachedActiveWeeklyMenu();
  } catch (error) {
    console.error("Unable to load public weekly menu", error);
    return null;
  }
}
