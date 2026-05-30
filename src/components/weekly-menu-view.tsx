import { CalendarDays, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { getWeekDates, weeklyMenuGroups, weekDayLabels } from "@/lib/weekly-menu";

type Cell = {
  group: string;
  slot: string;
  dayIndex: number;
  dishName: string;
};

const groupStyles = {
  MON_CHINH: "border-amber-200 bg-amber-50 text-amber-950",
  MAN_PHU: "border-red-200 bg-red-50 text-red-800",
  MON_CHAY_CHINH: "border-emerald-200 bg-emerald-50 text-emerald-800",
  MON_NUOC: "border-sky-200 bg-sky-50 text-sky-800",
  TRANG_MIENG: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800",
} as const;

export function WeeklyMenuView({
  title,
  startDate,
  cells,
  compact = false,
}: {
  title: string;
  startDate: Date;
  cells: Cell[];
  compact?: boolean;
}) {
  const dates = getWeekDates(startDate);
  const cellMap = new Map(cells.map((cell) => [`${cell.group}:${cell.slot}:${cell.dayIndex}`, cell.dishName]));
  const displayTitle = `Menu tuần ${formatDate(dates[0])} - ${formatDate(dates[5])}`;
  const customTitle = title.trim();
  const showCustomTitle = customTitle && !customTitle.toUpperCase().startsWith("MENU");

  return (
    <section className={cn("grid gap-5", compact ? "" : "rounded-lg bg-white")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="coral">Menu tuần</Badge>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-950">{displayTitle}</h2>
          {showCustomTitle ? <p className="mt-1 text-sm font-semibold text-slate-500">{customTitle}</p> : null}
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
            <CalendarDays size={16} />
            Thứ Hai đến Thứ Bảy, {formatDate(dates[0])} - {formatDate(dates[5])}
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800">
          <Utensils size={16} />
          Ca trưa
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        {dates.map((date, dayIndex) => (
          <article key={date.toISOString()} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
              <div className="text-sm font-semibold text-teal-100">Thứ {weekDayLabels[dayIndex]}</div>
              <div className="text-xl font-bold">{formatDate(date)}</div>
            </header>
            <div className="grid gap-3 p-4">
              {weeklyMenuGroups.map((group) => {
                const dishes = group.slots
                  .map((slot) => ({
                    slot,
                    name: (cellMap.get(`${group.key}:${slot}:${dayIndex}`) ?? "").trim(),
                  }))
                  .filter((dish) => dish.name && dish.name !== "-");

                return (
                  <div key={group.key} className={cn("rounded-md border p-3", groupStyles[group.key])}>
                    <div className="mb-2 text-xs font-bold uppercase tracking-wide">{group.label}</div>
                    {dishes.length ? (
                      <div className="grid gap-2">
                        {dishes.map((dish) => (
                          <div key={dish.slot} className="text-sm font-semibold leading-5">
                            {dish.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm font-medium opacity-60">Đang cập nhật</div>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
