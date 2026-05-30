"use server";

import { ConsultationStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, getClientIp, rateLimit, sanitizeText } from "@/lib/security";

const consultationSchema = z.object({
  companyName: z.string().trim().min(2).max(120).transform((value) => sanitizeText(value, 120)),
  expectedQuantity: z.string().trim().min(1).max(80).transform((value) => sanitizeText(value, 80)),
  phone: z.string().trim().regex(/^[0-9+\-\s().]{8,20}$/).transform((value) => sanitizeText(value, 20)),
});

export async function createConsultationAction(formData: FormData) {
  assertSameOrigin();
  const ipLimit = rateLimit(`consultation:ip:${getClientIp()}`, 10, 60 * 60 * 1000);

  if (!ipLimit.ok) {
    redirect("/?consulted=rate-limit#lien-he");
  }

  const parsed = consultationSchema.safeParse({
    companyName: String(formData.get("companyName") ?? "").trim(),
    expectedQuantity: String(formData.get("expectedQuantity") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
  });

  if (!parsed.success) {
    redirect("/?consulted=invalid#lien-he");
  }

  await prisma.consultationLead.create({
    data: parsed.data,
  });

  revalidatePath("/admin/consultations");
  redirect("/?consulted=1#lien-he");
}

export async function updateConsultationStatusAction(formData: FormData) {
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

  const id = z.string().cuid().parse(String(formData.get("id") ?? ""));
  const status = z.nativeEnum(ConsultationStatus).parse(String(formData.get("status")));

  await prisma.consultationLead.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/consultations");
}
