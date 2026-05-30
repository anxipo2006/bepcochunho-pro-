import { FloatingContact } from "@/components/floating-contact";
import { MotionLanding } from "@/components/motion-landing";
import { SiteHeader } from "@/components/site-header";
import { WeeklyMenuView } from "@/components/weekly-menu-view";
import { prisma } from "@/lib/prisma";

export default async function Home({ searchParams }: { searchParams: { consulted?: string } }) {
  const weeklyMenu = await prisma.weeklyMenu.findFirst({
    where: { isActive: true },
    orderBy: { startDate: "desc" },
    include: { cells: { orderBy: [{ group: "asc" }, { slot: "asc" }, { dayIndex: "asc" }] } },
  });

  return (
    <>
      <SiteHeader />
      <MotionLanding consulted={searchParams.consulted} />
      {weeklyMenu ? (
        <section id="menu-tuan" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <WeeklyMenuView title={weeklyMenu.title} startDate={weeklyMenu.startDate} cells={weeklyMenu.cells} compact />
          </div>
        </section>
      ) : null}
      <FloatingContact />
    </>
  );
}
