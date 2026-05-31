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
  MON_CHINH: {
    wrapper: "border-amber-200 bg-amber-50",
    label: "text-amber-700",
    text: "text-amber-950",
    dot: "bg-amber-400",
    icon: "🍛",
  },
  MAN_PHU: {
    wrapper: "border-red-200 bg-red-50",
    label: "text-red-600",
    text: "text-red-800",
    dot: "bg-red-400",
    icon: "🥘",
  },
  MON_CHAY_CHINH: {
    wrapper: "border-emerald-200 bg-emerald-50",
    label: "text-emerald-700",
    text: "text-emerald-800",
    dot: "bg-emerald-400",
    icon: "🥗",
  },
  MON_NUOC: {
    wrapper: "border-sky-200 bg-sky-50",
    label: "text-sky-700",
    text: "text-sky-800",
    dot: "bg-sky-400",
    icon: "🍜",
  },
  TRANG_MIENG: {
    wrapper: "border-fuchsia-200 bg-fuchsia-50",
    label: "text-fuchsia-700",
    text: "text-fuchsia-800",
    dot: "bg-fuchsia-400",
    icon: "🍮",
  },
} as const;

const dayGradients = [
  "from-coral/90 to-coral-dark",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-fuchsia-500 to-pink-600",
];

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
    <section className={cn("grid gap-6", compact ? "" : "rounded-2xl bg-white")}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="coral" dot>Menu tuần</Badge>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight text-slate-950">{displayTitle}</h2>
          {showCustomTitle ? <p className="mt-1 text-sm font-semibold text-slate-500">{customTitle}</p> : null}
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
            <CalendarDays size={15} />
            Thứ Hai đến Thứ Bảy, {formatDate(dates[0])} - {formatDate(dates[5])}
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-teal-200/60 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
          <Utensils size={15} />
          Ca trưa
        </div>
      </div>

      {/* Day cards */}
      <div className="grid gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        {dates.map((date, dayIndex) => {
          const gradient = dayGradients[dayIndex] ?? dayGradients[0];
          return (
            <article
              key={date.toISOString()}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-md transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              {/* Day header with gradient */}
              <header className={cn("bg-gradient-to-br px-4 py-3 text-white", gradient)}>
                <div className="text-xs font-bold uppercase tracking-widest text-white/75">
                  Thứ {weekDayLabels[dayIndex]}
                </div>
                <div className="mt-0.5 text-xl font-extrabold">{formatDate(date)}</div>
              </header>

              {/* Groups */}
              <div className="grid gap-2.5 p-3.5">
                {weeklyMenuGroups.map((group) => {
                  const style = groupStyles[group.key as keyof typeof groupStyles];
                  const dishes = group.slots
                    .map((slot) => ({
                      slot,
                      name: (cellMap.get(`${group.key}:${slot}:${dayIndex}`) ?? "").trim(),
                    }))
                    .filter((dish) => dish.name && dish.name !== "-");

                  return (
                    <div key={group.key} className={cn("rounded-xl border p-3", style?.wrapper ?? "border-slate-200 bg-slate-50")}>
                      <div className={cn("mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider", style?.label ?? "text-slate-600")}>
                        <span>{style?.icon}</span>
                        {group.label}
                      </div>
                      {dishes.length ? (
                        <div className="grid gap-1.5">
                          {dishes.map((dish) => (
                            <div
                              key={dish.slot}
                              className={cn("flex items-start gap-1.5 text-sm font-semibold leading-5", style?.text ?? "text-slate-700")}
                            >
                              <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", style?.dot ?? "bg-slate-400")} />
                              {dish.name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={cn("text-sm font-medium opacity-50", style?.text ?? "text-slate-500")}>
                          Đang cập nhật
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
