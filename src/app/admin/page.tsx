import { MenuCategory, OrderStatus } from "@prisma/client";
import Link from "next/link";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/form";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusLabel = {
  ALL: "Tất cả trạng thái",
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  DELIVERED: "Đã giao (Cũ)",
  PAID: "Đã thanh toán",
  DEBT: "Ghi công nợ",
  CANCELLED: "Đã hủy",
} as const;

const categoryLabel = {
  MAN: "Món chính",
  CHAY: "Món chay",
  NUOC: "Món nước",
  THEM: "Món thêm",
} as const;

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function defaultRange() {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 6);
  return { from: toDateInput(from), to: toDateInput(today) };
}

function dayKey(date: Date) {
  return toDateInput(date);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string; status?: string };
}) {
  const defaults = defaultRange();
  const fromInput = searchParams.from || defaults.from;
  const toInput = searchParams.to || defaults.to;
  const status = Object.keys(statusLabel).includes(searchParams.status ?? "")
    ? searchParams.status || "ALL"
    : "ALL";
  const orderStatus = status === "ALL" ? undefined : (status as OrderStatus);
  const fromDate = parseDateInput(fromInput);
  const toDate = parseDateInput(toInput);
  const toExclusive = new Date(toDate);
  toExclusive.setUTCDate(toExclusive.getUTCDate() + 1);

  const orders = await prisma.order.findMany({
    where: {
      deliveryDate: { gte: fromDate, lt: toExclusive },
      ...(orderStatus ? { status: orderStatus } : {}),
    },
    orderBy: [{ deliveryDate: "asc" }, { createdAt: "asc" }],
    include: {
      user: true,
      orderItems: { include: { menuItem: true } },
    },
  });

  const itemTotals = new Map<string, { name: string; category: MenuCategory; quantity: number; amount: number }>();
  const customerTotals = new Map<string, { name: string; quantity: number; amount: number; orders: number }>();
  const dayTotals = new Map<string, { date: Date; quantity: number; amount: number; orders: number }>();
  const categoryTotals = new Map<string, { label: string; quantity: number; amount: number }>();
  const statusTotals = new Map<string, number>();

  for (const order of orders) {
    let orderQuantity = 0;
    statusTotals.set(order.status, (statusTotals.get(order.status) ?? 0) + 1);

    for (const item of order.orderItems) {
      const amount = item.quantity * Number(item.menuItem.price);
      orderQuantity += item.quantity;

      const itemCurrent = itemTotals.get(item.menuItemId) ?? {
        name: item.menuItem.name,
        category: item.menuItem.category,
        quantity: 0,
        amount: 0,
      };
      itemCurrent.quantity += item.quantity;
      itemCurrent.amount += amount;
      itemTotals.set(item.menuItemId, itemCurrent);

      const categoryCurrent = categoryTotals.get(item.menuItem.category) ?? {
        label: categoryLabel[item.menuItem.category],
        quantity: 0,
        amount: 0,
      };
      categoryCurrent.quantity += item.quantity;
      categoryCurrent.amount += amount;
      categoryTotals.set(item.menuItem.category, categoryCurrent);
    }

    const customerCurrent = customerTotals.get(order.userId) ?? {
      name: order.user.companyName,
      quantity: 0,
      amount: 0,
      orders: 0,
    };
    customerCurrent.orders += 1;
    customerCurrent.quantity += orderQuantity;
    customerCurrent.amount += Number(order.totalAmount);
    customerTotals.set(order.userId, customerCurrent);

    const key = dayKey(order.deliveryDate);
    const dayCurrent = dayTotals.get(key) ?? {
      date: order.deliveryDate,
      quantity: 0,
      amount: 0,
      orders: 0,
    };
    dayCurrent.orders += 1;
    dayCurrent.quantity += orderQuantity;
    dayCurrent.amount += Number(order.totalAmount);
    dayTotals.set(key, dayCurrent);
  }

  const totalQuantity = [...itemTotals.values()].reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const activeCustomers = customerTotals.size;
  const averageOrder = orders.length ? totalAmount / orders.length : 0;
  const sortedItems = [...itemTotals.values()].sort((a, b) => b.quantity - a.quantity);
  const sortedCustomers = [...customerTotals.values()].sort((a, b) => b.amount - a.amount);
  const sortedDays = [...dayTotals.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
  const orderNotes = orders.filter((order) => order.note || order.user.deliveryTimeRequest);
  const exportHref = (type: string) =>
    `/admin/reports/export/${type}?from=${fromInput}&to=${toInput}&status=${status}`;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader
          title="Tổng quan vận hành"
          description="Chọn thời điểm tổng kết để xem đầy đủ đơn hàng, sản lượng, doanh thu và nhu cầu giao."
          action={<ExportLink href={exportHref("orders")} label="Xuất đơn chi tiết" />}
        />
        <CardContent>
          <form className="grid gap-3 md:grid-cols-[1fr_1fr_220px_auto] md:items-end">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Từ ngày
              <input className={inputClass} type="date" name="from" defaultValue={fromInput} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Đến ngày
              <input className={inputClass} type="date" name="to" defaultValue={toInput} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Trạng thái
              <select className={inputClass} name="status" defaultValue={status}>
                {Object.entries(statusLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <Button className="h-11">Tổng kết</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Đơn hàng" value={orders.length.toString()} tone="slate" />
        <SummaryCard label="Tổng phần" value={totalQuantity.toString()} tone="coral" />
        <SummaryCard label="Doanh thu" value={formatCurrency(totalAmount)} tone="teal" />
        <SummaryCard label="Khách có đơn" value={activeCustomers.toString()} tone="slate" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Giá trị TB/đơn" value={formatCurrency(averageOrder)} tone="teal" />
        <SummaryCard label="Chờ xác nhận" value={(statusTotals.get("PENDING") ?? 0).toString()} tone="amber" />
        <SummaryCard label="Đã xác nhận" value={(statusTotals.get("CONFIRMED") ?? 0).toString()} tone="teal" />
        <SummaryCard label="Đã giao" value={(statusTotals.get("DELIVERED") ?? 0).toString()} tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader
            title="Tổng hợp bếp theo món"
            description="Sắp xếp theo số phần cần chuẩn bị."
            action={<ExportLink href={exportHref("items")} label="Xuất CSV" />}
          />
          <CardContent className="grid gap-3">
            {sortedItems.map((item) => (
              <div key={item.name} className="grid gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div>
                  <div className="font-semibold text-slate-950">{item.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{categoryLabel[item.category]}</div>
                </div>
                <Badge tone="coral">{item.quantity} phần</Badge>
                <div className="text-sm font-semibold text-teal-700">{formatCurrency(item.amount)}</div>
              </div>
            ))}
            {sortedItems.length === 0 ? <p className="text-sm text-slate-500">Chưa có dữ liệu trong khoảng đã chọn.</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Theo danh mục"
            description="Cơ cấu món chính, món nước, món chay."
            action={<ExportLink href={exportHref("categories")} label="Xuất CSV" />}
          />
          <CardContent className="grid gap-3">
            {[...categoryTotals.values()].map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-950">{item.label}</div>
                  <Badge tone="slate">{item.quantity} phần</Badge>
                </div>
                <div className="mt-2 text-sm font-semibold text-teal-700">{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Theo khách hàng"
            description="Số đơn, số phần và doanh thu từng khách."
            action={<ExportLink href={exportHref("customers")} label="Xuất CSV" />}
          />
          <CardContent className="grid gap-3">
            {sortedCustomers.map((customer) => (
              <div key={customer.name} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-950">{customer.name}</div>
                  <Badge tone="teal">{customer.orders} đơn</Badge>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {customer.quantity} phần · {formatCurrency(customer.amount)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Theo ngày giao"
            description="Theo dõi tải bếp trong khoảng tổng kết."
            action={<ExportLink href={exportHref("days")} label="Xuất CSV" />}
          />
          <CardContent className="grid gap-3">
            {sortedDays.map((day) => (
              <div key={dayKey(day.date)} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-950">{formatDate(day.date)}</div>
                  <Badge tone="slate">{day.orders} đơn</Badge>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {day.quantity} phần · {formatCurrency(day.amount)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Ghi chú giao hàng"
          description="Tổng hợp yêu cầu giờ giao và ghi chú toàn đơn."
          action={<ExportLink href={exportHref("notes")} label="Xuất CSV" />}
        />
        <CardContent className="grid gap-3">
          {orderNotes.map((order) => (
            <div key={order.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-slate-950">{order.user.companyName}</div>
                <Badge tone="slate">{formatDate(order.deliveryDate)}</Badge>
                <Badge tone="amber">{statusLabel[order.status]}</Badge>
              </div>
              {order.user.deliveryTimeRequest ? (
                <p className="mt-2 text-sm text-slate-700">Giờ giao: {order.user.deliveryTimeRequest}</p>
              ) : null}
              {order.note ? <p className="mt-1 text-sm text-slate-700">Ghi chú: {order.note}</p> : null}
            </div>
          ))}
          {orderNotes.length === 0 ? <p className="text-sm text-slate-500">Không có ghi chú trong khoảng đã chọn.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function ExportLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-teal-200 bg-white px-3 text-sm font-semibold text-teal-800 hover:bg-teal-50"
    >
      <Download size={16} />
      {label}
    </Link>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "slate" | "coral" | "teal" | "amber" | "green";
}) {
  const toneClass = {
    slate: "text-slate-950",
    coral: "text-coral-dark",
    teal: "text-teal-700",
    amber: "text-amber-700",
    green: "text-green-700",
  }[tone];

  return (
    <Card>
      <CardContent>
        <div className="text-sm text-slate-500">{label}</div>
        <div className={`mt-2 text-3xl font-bold ${toneClass}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
