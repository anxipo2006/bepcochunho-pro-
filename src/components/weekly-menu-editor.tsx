import Link from "next/link";
import { Download, Trash2, Upload } from "lucide-react";
import {
  deleteWeeklyMenuAction,
  importWeeklyMenuAction,
  upsertWeeklyMenuAction,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/form";
import { cn, formatDate } from "@/lib/utils";
import {
  getWeekDates,
  makeWeeklyTitle,
  normalizeWeekStart,
  toDateInput,
  weekEndDate,
  weeklyMenuGroups,
  weekDayLabels,
} from "@/lib/weekly-menu";

type Cell = {
  group: string;
  slot: string;
  dayIndex: number;
  dishName: string;
};

type WeeklyMenu = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  cells: Cell[];
};

export function WeeklyMenuEditor({ weeklyMenu }: { weeklyMenu?: WeeklyMenu | null }) {
  const startDate = weeklyMenu?.startDate ?? nextMonday();
  const endDate = weeklyMenu?.endDate ?? weekEndDate(startDate);
  const title =
    weeklyMenu?.title && !weeklyMenu.title.toUpperCase().startsWith("MENU")
      ? weeklyMenu.title
      : makeWeeklyTitle(startDate, endDate);
  const dates = getWeekDates(startDate);
  const cellMap = new Map(
    (weeklyMenu?.cells ?? []).map((cell) => [`${cell.group}:${cell.slot}:${cell.dayIndex}`, cell.dishName]),
  );

  return (
    <div className="grid min-w-0 gap-4">
      <form action={upsertWeeklyMenuAction} className="grid min-w-0 gap-3">
        <input type="hidden" name="id" value={weeklyMenu?.id ?? ""} />
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_170px_auto] md:items-end">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Tên menu tuần
            <input className={inputClass} name="title" defaultValue={title} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Thứ Hai đầu tuần
            <input className={inputClass} type="date" name="startDate" defaultValue={toDateInput(startDate)} required />
          </label>
          <Button className="h-11">Lưu menu tuần</Button>
        </div>

        <div className="max-h-[calc(100vh-24rem)] min-h-[300px] overflow-auto rounded-lg border border-slate-300 bg-white">
          <table className="w-full min-w-[860px] border-collapse text-xs">
            <thead>
              <tr className="sticky top-0 z-10 bg-slate-100">
                <th className="w-36 border border-slate-300 p-1.5 text-left">Nhóm món</th>
                <th className="w-14 border border-slate-300 p-1.5">Mã món</th>
                {dates.map((date, index) => (
                  <th key={date.toISOString()} className="w-28 border border-slate-300 p-1.5">
                    <div>{formatDate(date)}</div>
                    <div className="font-semibold">Thứ {weekDayLabels[index]}</div>
                  </th>
                ))}
              </tr>
              <tr>
                <th colSpan={8} className="border border-slate-300 bg-yellow-200 p-1.5 text-center text-base font-bold text-red-600">
                  CA TRƯA
                </th>
              </tr>
            </thead>
            <tbody>
              {weeklyMenuGroups.map((group) =>
                group.slots.map((slot, slotIndex) => (
                  <tr key={`${group.key}:${slot}`}>
                    {slotIndex === 0 ? (
                      <th
                        rowSpan={group.slots.length}
                        className={cn("w-36 border border-slate-300 p-2 text-left text-sm font-bold", group.color)}
                      >
                        {group.label}
                      </th>
                    ) : null}
                    <td className="w-14 border border-slate-300 p-1 text-center font-medium">{slot}</td>
                    {dates.map((_, dayIndex) => (
                      <td key={dayIndex} className="border border-slate-300 p-1">
                        <input
                          className="h-8 w-full min-w-0 rounded border border-transparent px-1.5 text-xs outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                          name={`cell:${group.key}:${slot}:${dayIndex}`}
                          defaultValue={cellMap.get(`${group.key}:${slot}:${dayIndex}`) ?? ""}
                        />
                      </td>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500">
          Trên điện thoại có thể vuốt ngang bảng để nhập đủ 6 ngày, giống cấu trúc file menu mẫu.
        </p>
      </form>

      <div className="grid min-w-0 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <form action={importWeeklyMenuAction} encType="multipart/form-data" className="grid min-w-0 gap-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-end">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Tuần import
            <input className={inputClass} type="date" name="startDate" defaultValue={toDateInput(startDate)} required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            File CSV
            <input className="block h-11 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" type="file" name="file" accept=".csv,text/csv" required />
          </label>
          <Button variant="secondary">
            <Upload size={16} />
            Import
          </Button>
        </form>
        <div className="flex flex-wrap gap-2 md:justify-end">
          {weeklyMenu ? (
            <>
              <Link
                href={`/admin/menu/export/${weeklyMenu.id}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-teal-200 bg-white px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50"
              >
                <Download size={16} />
                Export CSV
              </Link>
              <form action={deleteWeeklyMenuAction}>
                <input type="hidden" name="id" value={weeklyMenu.id} />
                <Button variant="danger">
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function nextMonday() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return normalizeWeekStart(date);
}

