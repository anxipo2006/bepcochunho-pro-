import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { inputClass } from "@/components/ui/form";
import { OrderForm } from "@/components/order-form";
import { WeeklyMenuView } from "@/components/weekly-menu-view";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { parseDateInput, toDateInput } from "@/lib/weekly-menu";

function defaultDeliveryDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toDateInput(tomorrow);
}

function dayIndexInWeek(date: Date, weekStart: Date) {
  const start = new Date(weekStart);
  start.setUTCHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setUTCHours(0, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { error?: string; deliveryDate?: string };
}) {
  const session = await auth();
  const selectedDateInput = searchParams.deliveryDate || defaultDeliveryDate();
  const selectedDate = parseDateInput(selectedDateInput);

  const weeklyMenu = await prisma.weeklyMenu.findFirst({
    where: {
      isActive: true,
      startDate: { lte: selectedDate },
      endDate: { gte: selectedDate },
    },
    orderBy: { startDate: "asc" },
    include: { cells: { orderBy: [{ group: "asc" }, { slot: "asc" }, { dayIndex: "asc" }] } },
  });

  const dayIndex = weeklyMenu ? dayIndexInWeek(selectedDate, weeklyMenu.startDate) : -1;
  const dayDishNames = weeklyMenu
    ? Array.from(
        new Set(
          weeklyMenu.cells
            .filter((cell) => cell.dayIndex === dayIndex)
            .filter((cell) => ["MON_CHINH", "MON_CHAY_CHINH", "MON_NUOC"].includes(cell.group))
            .map((cell) => cell.dishName.trim())
            .filter((name) => name && name !== "-"),
        ),
      )
    : [];

  const menuItems = dayDishNames.length
    ? await prisma.menuItem.findMany({
        where: {
          isAvailable: true,
          name: { in: dayDishNames },
        },
      })
    : [];
  const menuItemByName = new Map(menuItems.map((item) => [item.name, item]));
  const items = dayDishNames.flatMap((name) => {
    const item = menuItemByName.get(name);
    return item ? [item] : [];
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] lg:items-start">
      <div className="grid gap-6">
        {!session?.user.isApproved ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent>
              <Badge tone="amber">Chờ duyệt</Badge>
              <p className="mt-3 text-sm leading-6 text-amber-800">
                Tài khoản đang chờ Bếp xác minh hợp đồng. Bạn có thể xem menu nhưng chưa thể tạo đơn hàng.
              </p>
            </CardContent>
          </Card>
        ) : null}
        {searchParams.error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent>
              <p className="text-sm text-red-700">Không thể tạo đơn. Vui lòng kiểm tra lại menu hoặc số lượng.</p>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader
            title="Chọn ngày giao hàng"
            description="Bạn có thể đặt trước cho ngày trong tuần/tháng sau, miễn là Admin đã công bố menu tuần tương ứng."
          />
          <CardContent>
            <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Ngày giao
                <input className={inputClass} type="date" name="deliveryDate" defaultValue={selectedDateInput} min={toDateInput(new Date())} />
              </label>
              <Button type="submit">Xem menu ngày này</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="order-last lg:order-none">
          <CardHeader
            title="Menu tham khảo"
            description="Bảng menu của ngày giao đã chọn để bạn dễ dàng khảo sát và đối chiếu."
          />
          <CardContent>
            {weeklyMenu && dayIndex >= 0 && dayIndex < 6 ? (
              <WeeklyMenuView
                title={weeklyMenu.title}
                startDate={weeklyMenu.startDate}
                cells={weeklyMenu.cells}
                targetDayIndex={dayIndex}
              />
            ) : (
              <p className="text-sm text-slate-500">Chưa có menu cho ngày {formatDate(selectedDate)}. Vui lòng chọn ngày khác hoặc liên hệ Bếp.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:sticky lg:top-6">
        <Card>
          <CardHeader
            title={`Đặt món giao ngày ${formatDate(selectedDate)}`}
            description="Danh sách bên dưới lấy trực tiếp từ cột menu của ngày đã chọn trong menu tuần."
            action={<Badge tone="teal">Từ {formatCurrency(35000)}</Badge>}
          />
          <CardContent>
            {items.length > 0 ? (
              <OrderForm
                deliveryDate={selectedDateInput}
                items={items.map((item) => ({
                  id: item.id,
                  name: item.name,
                  category: item.category,
                  price: item.price.toString(),
                }))}
              />
            ) : (
              <p className="text-sm text-slate-500">
                Ngày này chưa có món có thể đặt. Nếu menu tuần đã có món nhưng chưa hiện ở đây, Admin chỉ cần bấm lưu lại menu tuần để hệ thống đồng bộ danh mục món.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
