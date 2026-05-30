import { MenuCategory, OrderStatus, Prisma, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusLabel = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
} as const;

const categoryLabel = {
  MAN: "Món chính",
  CHAY: "Món chay",
  NUOC: "Món nước",
  THEM: "Món thêm",
} as const;

const exportNames = {
  items: "tong-hop-mon",
  categories: "theo-danh-muc",
  customers: "theo-khach-hang",
  days: "theo-ngay-giao",
  notes: "ghi-chu-giao-hang",
  orders: "don-chi-tiet",
} as const;

function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultRange() {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 6);
  return { from: toDateInput(from), to: toDateInput(today) };
}

export async function GET(request: Request, { params }: { params: { type: keyof typeof exportNames } }) {
  const session = await auth();

  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    : null;

  if (user?.role !== Role.ADMIN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!exportNames[params.type]) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const defaults = defaultRange();
  const fromInput = url.searchParams.get("from") || defaults.from;
  const toInput = url.searchParams.get("to") || defaults.to;
  const status = url.searchParams.get("status") || "ALL";
  const orderStatus = Object.values(OrderStatus).includes(status as OrderStatus)
    ? (status as OrderStatus)
    : undefined;
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

  const rows = makeRows(params.type, orders);
  const csv = serializeCsv(rows);
  const filename = `${exportNames[params.type]}-${fromInput}-${toInput}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    user: true;
    orderItems: { include: { menuItem: true } };
  };
}>;

function makeRows(type: keyof typeof exportNames, orders: OrderWithDetails[]) {
  if (type === "orders") {
    return [
      ["Ngày giao", "Khách hàng", "Trạng thái", "Món", "Danh mục", "Số lượng", "Đơn giá", "Thành tiền", "Ghi chú món", "Ghi chú đơn", "Giờ giao yêu cầu"],
      ...orders.flatMap((order) =>
        order.orderItems.map((item) => [
          formatDate(order.deliveryDate),
          order.user.companyName,
          statusLabel[order.status],
          item.menuItem.name,
          categoryLabel[item.menuItem.category],
          item.quantity,
          formatCurrency(item.menuItem.price.toString()),
          formatCurrency(item.quantity * Number(item.menuItem.price)),
          item.note ?? "",
          order.note ?? "",
          order.user.deliveryTimeRequest ?? "",
        ]),
      ),
    ];
  }

  if (type === "notes") {
    return [
      ["Ngày giao", "Khách hàng", "Trạng thái", "Ghi chú đơn", "Giờ giao yêu cầu"],
      ...orders
        .filter((order) => order.note || order.user.deliveryTimeRequest)
        .map((order) => [
          formatDate(order.deliveryDate),
          order.user.companyName,
          statusLabel[order.status],
          order.note ?? "",
          order.user.deliveryTimeRequest ?? "",
        ]),
    ];
  }

  const itemTotals = new Map<string, { name: string; category: MenuCategory; quantity: number; amount: number }>();
  const categoryTotals = new Map<MenuCategory, { label: string; quantity: number; amount: number }>();
  const customerTotals = new Map<string, { name: string; orders: number; quantity: number; amount: number }>();
  const dayTotals = new Map<string, { date: Date; orders: number; quantity: number; amount: number }>();

  for (const order of orders) {
    let orderQuantity = 0;

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
      orders: 0,
      quantity: 0,
      amount: 0,
    };
    customerCurrent.orders += 1;
    customerCurrent.quantity += orderQuantity;
    customerCurrent.amount += Number(order.totalAmount);
    customerTotals.set(order.userId, customerCurrent);

    const key = toDateInput(order.deliveryDate);
    const dayCurrent = dayTotals.get(key) ?? {
      date: order.deliveryDate,
      orders: 0,
      quantity: 0,
      amount: 0,
    };
    dayCurrent.orders += 1;
    dayCurrent.quantity += orderQuantity;
    dayCurrent.amount += Number(order.totalAmount);
    dayTotals.set(key, dayCurrent);
  }

  if (type === "items") {
    return [
      ["Món", "Danh mục", "Số phần", "Doanh thu"],
      ...[...itemTotals.values()]
        .sort((a, b) => b.quantity - a.quantity)
        .map((item) => [item.name, categoryLabel[item.category], item.quantity, formatCurrency(item.amount)]),
    ];
  }

  if (type === "categories") {
    return [
      ["Danh mục", "Số phần", "Doanh thu"],
      ...[...categoryTotals.values()].map((item) => [item.label, item.quantity, formatCurrency(item.amount)]),
    ];
  }

  if (type === "customers") {
    return [
      ["Khách hàng", "Số đơn", "Số phần", "Doanh thu"],
      ...[...customerTotals.values()]
        .sort((a, b) => b.amount - a.amount)
        .map((item) => [item.name, item.orders, item.quantity, formatCurrency(item.amount)]),
    ];
  }

  return [
    ["Ngày giao", "Số đơn", "Số phần", "Doanh thu"],
    ...[...dayTotals.values()]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((item) => [formatDate(item.date), item.orders, item.quantity, formatCurrency(item.amount)]),
  ];
}

function serializeCsv(rows: Array<Array<string | number>>) {
  return `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}`;
}

function escapeCsv(value: string | number) {
  const raw = String(value);
  const text = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}
