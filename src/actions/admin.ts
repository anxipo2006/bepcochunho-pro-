"use server";

import { InvoiceStatus, MenuCategory, OrderStatus, Role } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { WEEKLY_MENU_CACHE_TAG } from "@/lib/home-data";
import { billingMonthFromDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, sanitizeText } from "@/lib/security";
import {
  emptyWeeklyCells,
  makeWeeklyTitle,
  normalizeWeekStart,
  parseDateInput,
  parseWeeklyMenuCsv,
  weekEndDate,
} from "@/lib/weekly-menu";

const cuidSchema = z.string().cuid();
const billingMonthSchema = z.string().regex(/^(0[1-9]|1[0-2])-\d{4}$/);

async function requireAdmin() {
  assertSameOrigin();
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return session;
}

function categoryFromWeeklyGroup(group: string) {
  if (group.includes("CHAY")) return MenuCategory.CHAY;
  if (group.includes("NUOC")) return MenuCategory.NUOC;
  if (group.includes("MAN_PHU") || group.includes("TRANG_MIENG") || group.includes("THEM")) return MenuCategory.THEM;
  return MenuCategory.MAN;
}

async function syncMenuItemsFromWeeklyCells(cells: Array<{ group: string; dishName: string }>) {
  const cleanCells = cells
    .map((cell) => ({ ...cell, dishName: cell.dishName.trim() }))
    .filter((cell) => cell.dishName && cell.dishName !== "-");
  const uniqueNames = new Set<string>();

  for (const cell of cleanCells) {
    if (uniqueNames.has(cell.dishName)) continue;
    uniqueNames.add(cell.dishName);

    await prisma.menuItem.upsert({
      where: { name: cell.dishName },
      update: {
        category: categoryFromWeeklyGroup(cell.group),
        isAvailable: true,
      },
      create: {
        name: cell.dishName,
        category: categoryFromWeeklyGroup(cell.group),
        price: categoryFromWeeklyGroup(cell.group) === MenuCategory.THEM ? 12000 : 35000,
      },
    });
  }
}

export async function approveUserAction(formData: FormData) {
  await requireAdmin();
  const userId = cuidSchema.parse(String(formData.get("userId") ?? ""));
  const isApproved = formData.get("isApproved") === "true";

  await prisma.user.update({
    where: { id: userId },
    data: { isApproved },
  });

  revalidatePath("/admin/clients");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const orderId = cuidSchema.parse(String(formData.get("orderId") ?? ""));
  const newStatus = z.nativeEnum(OrderStatus).parse(String(formData.get("status")));

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, totalAmount: true, userId: true },
  });

  if (!order) return;
  if (order.status === newStatus) return;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // Nếu chuyển sang DELIVERED -> Cộng công nợ
    if (newStatus === OrderStatus.DELIVERED) {
      await tx.user.update({
        where: { id: order.userId },
        data: { debtBalance: { increment: order.totalAmount } },
      });
    }
    // Nếu chuyển từ DELIVERED sang trạng thái khác (Undo) -> Trừ công nợ
    else if (order.status === OrderStatus.DELIVERED) {
      await tx.user.update({
        where: { id: order.userId },
        data: { debtBalance: { decrement: order.totalAmount } },
      });
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/clients");
}

export async function closeInvoicesAction(formData: FormData) {
  await requireAdmin();
  const billingMonth = billingMonthSchema.parse(String(formData.get("billingMonth") || billingMonthFromDate()));
  const [month, year] = billingMonth.split("-").map(Number);
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 1);

  const users = await prisma.user.findMany({
    where: { role: Role.CLIENT },
    include: {
      orders: {
        where: {
          invoiceId: null,
          deliveryDate: { gte: from, lt: to },
          status: { in: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED] },
        },
      },
    },
  });

  for (const user of users) {
    const totalAmount = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    if (totalAmount <= 0) {
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.upsert({
        where: { userId_billingMonth: { userId: user.id, billingMonth } },
        create: {
          userId: user.id,
          billingMonth,
          totalAmount,
          status: InvoiceStatus.UNPAID,
        },
        update: {
          totalAmount: { increment: totalAmount },
        },
      });

      await tx.order.updateMany({
        where: { id: { in: user.orders.map((order) => order.id) } },
        data: { invoiceId: invoice.id },
      });
      // Không cộng dồn công nợ ở đây nữa vì đã cộng ngay lúc giao hàng (DELIVERED)
    });
  }

  revalidatePath("/admin/billing");
  redirect(`/admin/billing?closed=${billingMonth}`);
}

export async function markInvoicePaidAction(formData: FormData) {
  await requireAdmin();
  const invoiceId = cuidSchema.parse(String(formData.get("invoiceId") ?? ""));

  const invoice = await prisma.invoice.findUniqueOrThrow({
    where: { id: invoiceId },
  });

  if (invoice.status === InvoiceStatus.UNPAID) {
    await prisma.$transaction(async (tx) => {
      const result = await tx.invoice.updateMany({
        where: { id: invoiceId, status: InvoiceStatus.UNPAID },
        data: { status: InvoiceStatus.PAID, paidAt: new Date() },
      });

      if (result.count === 1) {
        await tx.user.update({
          where: { id: invoice.userId },
          data: { debtBalance: { decrement: invoice.totalAmount } },
        });
      }
    });
  }

  revalidatePath("/admin/billing");
}

export async function createMenuItemAction(formData: FormData) {
  await requireAdmin();

  try {
    await prisma.menuItem.create({
      data: {
        name: sanitizeText(String(formData.get("name") ?? ""), 120),
        category: z.enum(["MAN", "CHAY", "NUOC", "THEM"]).parse(String(formData.get("category"))),
        price: z.coerce.number().int().min(0).max(500000).parse(formData.get("price") || 35000),
        imageUrl: sanitizeText(String(formData.get("imageUrl") || ""), 500),
      },
    });
  } catch {
    redirect("/admin/menu?error=create-item");
  }

  revalidatePath("/admin/menu");
  redirect("/admin/menu?created=1");
}

export async function createDailyMenuAction(formData: FormData) {
  await requireAdmin();
  const date = new Date(String(formData.get("date") ?? ""));
  const menuItemIds = formData.getAll("menuItemIds").map(String).map((id) => cuidSchema.parse(id));

  if (!date || menuItemIds.length === 0) {
    redirect("/admin/menu?error=missing");
  }

  await prisma.dailyMenu.upsert({
    where: { date },
    create: {
      date,
      items: {
        create: menuItemIds.map((menuItemId) => ({ menuItemId })),
      },
    },
    update: {
      items: {
        deleteMany: {},
        create: menuItemIds.map((menuItemId) => ({ menuItemId })),
      },
    },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidateTag(WEEKLY_MENU_CACHE_TAG);
}

export async function upsertWeeklyMenuAction(formData: FormData) {
  await requireAdmin();
  const rawId = String(formData.get("id") ?? "");
  const id = rawId ? cuidSchema.parse(rawId) : "";
  const startDate = normalizeWeekStart(parseDateInput(String(formData.get("startDate") ?? "")));

  if (Number.isNaN(startDate.getTime())) {
    redirect("/admin/menu?error=week-date");
  }

  const endDate = weekEndDate(startDate);
  const title = sanitizeText(String(formData.get("title") || makeWeeklyTitle(startDate, endDate)), 160);
  const baseCells = emptyWeeklyCells();
  const cells = baseCells.map((cell) => ({
    ...cell,
    dishName: sanitizeText(String(formData.get(`cell:${cell.group}:${cell.slot}:${cell.dayIndex}`) ?? ""), 255),
  }));
  const existingMenu = await prisma.weeklyMenu.findUnique({ where: { startDate } });

  if (id && existingMenu && existingMenu.id !== id) {
    redirect(`/admin/menu?weekId=${existingMenu.id}&error=week-exists`);
  }

  const weeklyMenuId = id || existingMenu?.id;

  try {
    await prisma.$transaction(async (tx) => {
      const weeklyMenu = weeklyMenuId
        ? await tx.weeklyMenu.update({
            where: { id: weeklyMenuId },
            data: { title, startDate, endDate },
          })
        : await tx.weeklyMenu.create({
            data: { title, startDate, endDate },
          });

      await tx.weeklyMenuCell.deleteMany({ where: { weeklyMenuId: weeklyMenu.id } });
      await tx.weeklyMenuCell.createMany({
        data: cells.map((cell) => ({ ...cell, weeklyMenuId: weeklyMenu.id })),
      });
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      redirect("/admin/menu?error=week-exists");
    }

    throw error;
  }

  await syncMenuItemsFromWeeklyCells(cells);

  revalidatePath("/admin/menu");
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidateTag(WEEKLY_MENU_CACHE_TAG);
}

export async function importWeeklyMenuAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  const startDate = normalizeWeekStart(parseDateInput(String(formData.get("startDate") ?? "")));
  const endDate = weekEndDate(startDate);

  if (Number.isNaN(startDate.getTime())) {
    redirect("/admin/menu?error=week-date");
  }

  if (!(file instanceof File) || file.size <= 0) {
    redirect("/admin/menu?error=import-file");
  }

  let importedCells;

  try {
    importedCells = parseWeeklyMenuCsv(await file.text());
  } catch {
    redirect("/admin/menu?error=import-parse");
  }

  if (!importedCells.some((cell) => cell.dishName.trim())) {
    redirect("/admin/menu?error=import-empty");
  }

  const baseCells = emptyWeeklyCells();
  const importedMap = new Map(
    importedCells.map((cell) => [`${cell.group}:${cell.slot}:${cell.dayIndex}`, sanitizeText(cell.dishName, 255)]),
  );
  const cells = baseCells.map((cell) => ({
    ...cell,
    dishName: importedMap.get(`${cell.group}:${cell.slot}:${cell.dayIndex}`) ?? "",
  }));
  let weeklyMenuId = "";
  const existingMenu = await prisma.weeklyMenu.findUnique({ where: { startDate } });

  await prisma.$transaction(async (tx) => {
    const weeklyMenu = existingMenu
      ? await tx.weeklyMenu.update({
          where: { id: existingMenu.id },
          data: { title: makeWeeklyTitle(startDate, endDate), endDate },
        })
      : await tx.weeklyMenu.create({
          data: { title: makeWeeklyTitle(startDate, endDate), startDate, endDate },
        });

    weeklyMenuId = weeklyMenu.id;

    await tx.weeklyMenuCell.deleteMany({ where: { weeklyMenuId: weeklyMenu.id } });
    await tx.weeklyMenuCell.createMany({
      data: cells.map((cell) => ({ ...cell, weeklyMenuId: weeklyMenu.id })),
    });
  });

  await syncMenuItemsFromWeeklyCells(cells);

  revalidatePath("/admin/menu");
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidateTag(WEEKLY_MENU_CACHE_TAG);
  redirect(`/admin/menu?weekId=${weeklyMenuId}&imported=1`);
}

export async function deleteWeeklyMenuAction(formData: FormData) {
  await requireAdmin();
  const id = cuidSchema.parse(String(formData.get("id") ?? ""));

  await prisma.weeklyMenu.delete({ where: { id } });

  revalidatePath("/admin/menu");
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidateTag(WEEKLY_MENU_CACHE_TAG);
}
