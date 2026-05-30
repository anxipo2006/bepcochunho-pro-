import Link from "next/link";
import { createMenuItemAction } from "@/actions/admin";
import { WeeklyMenuEditor } from "@/components/weekly-menu-editor";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/form";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: { weekId?: string; new?: string; error?: string };
}) {
  const [items, weeklyMenus] = await Promise.all([
    prisma.menuItem.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.weeklyMenu.findMany({
      take: 8,
      orderBy: { startDate: "desc" },
      include: { cells: { orderBy: [{ group: "asc" }, { slot: "asc" }, { dayIndex: "asc" }] } },
    }),
  ]);
  const selectedWeeklyMenu = searchParams.weekId
    ? weeklyMenus.find((menu) => menu.id === searchParams.weekId) ?? null
    : searchParams.new
      ? null
      : weeklyMenus[0] ?? null;

  return (
    <div className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="min-w-0">
          <CardHeader title="Tạo món lẻ" description="Dùng cho đặt hàng theo món và làm danh mục giá." />
          <CardContent>
            <form action={createMenuItemAction} className="grid gap-4">
              <Field label="Tên món">
                <input className={inputClass} name="name" required />
              </Field>
              <Field label="Danh mục">
                <select className={inputClass} name="category" defaultValue="MAN">
                  <option value="MAN">Món mặn</option>
                  <option value="CHAY">Món chay</option>
                  <option value="NUOC">Món nước</option>
                  <option value="THEM">Món thêm</option>
                </select>
              </Field>
              <Field label="Giá">
                <input className={inputClass} name="price" type="number" defaultValue={35000} min={0} />
              </Field>
              <Field label="Ảnh URL">
                <input className={inputClass} name="imageUrl" placeholder="https://..." />
              </Field>
              <Button>Tạo món</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader
            title="Menu tuần"
            description="Nhập trực tiếp bằng bảng tuần, import CSV hoặc export CSV để gửi đối tác."
            action={
              <div className="flex flex-wrap gap-2">
                <Badge tone="teal">Thứ 2 đến Thứ 7</Badge>
                <ButtonLink href="/admin/menu?new=1" variant="secondary">
                  Tạo tuần mới
                </ButtonLink>
              </div>
            }
          />
          <CardContent>
            {searchParams.error ? (
              <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                Thao tác menu tuần chưa hợp lệ. Vui lòng kiểm tra ngày đầu tuần hoặc file CSV.
              </div>
            ) : null}
            <WeeklyMenuEditor weeklyMenu={selectedWeeklyMenu} />
          </CardContent>
        </Card>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="min-w-0">
          <CardHeader title="Danh mục món" description="Giá mặc định dùng khi khách hàng đặt theo món." />
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">{item.name}</h3>
                  <Badge tone="slate">{item.category}</Badge>
                </div>
                <p className="mt-2 text-sm font-semibold text-coral-dark">
                  {item.category === "THEM" ? "Không báo giá riêng" : formatCurrency(item.price.toString())}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader title="Các menu đã tạo" description="Chọn một tuần để sửa, export hoặc xóa." />
          <CardContent className="grid gap-2">
            {weeklyMenus.map((menu) => (
              <Link
                key={menu.id}
                href={`/admin/menu?weekId=${menu.id}`}
                className={`rounded-lg border p-3 text-sm transition hover:border-teal-300 hover:bg-teal-50 ${
                  selectedWeeklyMenu?.id === menu.id
                    ? "border-teal-300 bg-teal-50"
                    : "border-slate-200"
                }`}
              >
                <div className="font-semibold text-slate-950">{menu.title}</div>
                <div className="mt-1 text-slate-500">
                  {formatDate(menu.startDate)} - {formatDate(menu.endDate)}
                </div>
              </Link>
            ))}
            {weeklyMenus.length === 0 ? <p className="text-sm text-slate-500">Chưa có menu tuần.</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
