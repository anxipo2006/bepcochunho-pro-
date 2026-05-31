"use server";

import { OrderStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, sanitizeText } from "@/lib/security";

const orderSchema = z.object({
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  orderNote: z.string().max(500).optional().transform((value) => value ? sanitizeText(value, 500) : ""),
});

const orderItemSchema = z.object({
  menuItemId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(1000),
  note: z.string().max(180).optional().transform((value) => value ? sanitizeText(value, 180) : ""),
});

function isPastCutoffTime(deliveryDate: Date) {
  const cutoffTime = new Date(deliveryDate);
  // Lùi lại 1 ngày
  cutoffTime.setUTCDate(cutoffTime.getUTCDate() - 1);
  // Set mốc 15:00 giờ Việt Nam (UTC+7) -> 08:00 UTC
  cutoffTime.setUTCHours(8, 0, 0, 0);

  return new Date() > cutoffTime;
}

export async function createOrderAction(formData: FormData) {
  assertSameOrigin();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, isApproved: true },
  });

  if (user?.role !== Role.CLIENT || !user.isApproved) {
    redirect("/dashboard?error=not-approved");
  }

  const parsedOrder = orderSchema.safeParse({
    deliveryDate: String(formData.get("deliveryDate") ?? ""),
    orderNote: String(formData.get("orderNote") ?? ""),
  });

  if (!parsedOrder.success) {
    redirect("/dashboard?error=invalid-order");
  }

  const deliveryDate = new Date(parsedOrder.data.deliveryDate);
  if (isPastCutoffTime(deliveryDate)) {
    redirect("/dashboard?error=past-cutoff");
  }

  const rawItems = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("qty:"))
    .map(([key, value]) => ({
      menuItemId: key.replace("qty:", ""),
      quantity: value,
      note: String(formData.get(`note:${key.replace("qty:", "")}`) ?? ""),
    }))
    .map((item) => orderItemSchema.safeParse(item))
    .filter((item) => item.success)
    .map((item) => item.data);

  const itemMap = new Map<string, { menuItemId: string; quantity: number; note: string }>();
  for (const item of rawItems) {
    const current = itemMap.get(item.menuItemId);
    itemMap.set(item.menuItemId, {
      menuItemId: item.menuItemId,
      quantity: Math.min((current?.quantity ?? 0) + item.quantity, 1000),
      note: item.note || current?.note || "",
    });
  }
  const items = [...itemMap.values()];

  if (items.length === 0) {
    redirect("/dashboard?error=empty-order");
  }

  const menuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: items.map((item) => item.menuItemId) },
      isAvailable: true,
      category: { in: ["MAN", "CHAY", "NUOC"] },
    },
  });

  if (menuItems.length !== items.length) {
    redirect("/dashboard?error=menu-changed");
  }

  const menuItemById = new Map(menuItems.map((item) => [item.id, item]));
  const totalAmount = items.reduce((sum, item) => {
    const menuItem = menuItemById.get(item.menuItemId);
    return sum + Number(menuItem?.price ?? 0) * item.quantity;
  }, 0);

  await prisma.order.create({
    data: {
      userId: session.user.id,
      deliveryDate: new Date(parsedOrder.data.deliveryDate),
      note: parsedOrder.data.orderNote || null,
      totalAmount,
      status: OrderStatus.PENDING,
      orderItems: {
        create: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          note: item.note || null,
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  redirect("/dashboard/orders?created=1");
}

export async function cancelOrderAction(formData: FormData) {
  assertSameOrigin();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) {
    redirect("/dashboard/orders?error=invalid");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { userId: true, status: true, deliveryDate: true },
  });

  if (!order || order.userId !== session.user.id) {
    redirect("/dashboard/orders?error=not-found");
  }

  if (order.status !== OrderStatus.PENDING) {
    redirect("/dashboard/orders?error=cannot-cancel");
  }

  if (isPastCutoffTime(order.deliveryDate)) {
    redirect("/dashboard/orders?error=past-cutoff");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/admin/orders");
  redirect("/dashboard/orders?cancelled=1");
}
