"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, getClientIp, rateLimit, sanitizeText } from "@/lib/security";

const registerSchema = z.object({
  companyName: z.string().trim().min(2).max(120).transform((value) => sanitizeText(value, 120)),
  email: z.string().trim().email().max(160).transform((value) => value.toLowerCase()),
  phone: z.string().trim().regex(/^[0-9+\-\s().]{8,20}$/).transform((value) => sanitizeText(value, 20)),
  address: z.string().trim().max(255).optional().transform((value) => value ? sanitizeText(value, 255) : undefined),
  deliveryTimeRequest: z.string().trim().max(120).optional().transform((value) => value ? sanitizeText(value, 120) : undefined),
  password: z.string().min(8).max(128),
});

export async function registerAction(formData: FormData) {
  assertSameOrigin();

  const ip = getClientIp();
  const emailKey = String(formData.get("email") ?? "").toLowerCase().trim() || "empty";
  const ipLimit = rateLimit(`register:ip:${ip}`, 5, 60 * 60 * 1000);
  const emailLimit = rateLimit(`register:email:${emailKey}`, 3, 60 * 60 * 1000);

  if (!ipLimit.ok || !emailLimit.ok) {
    redirect("/register?error=rate-limit");
  }

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect("/register?error=invalid");
  }

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (exists) {
    redirect("/register?error=exists");
  }

  const password = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      companyName: parsed.data.companyName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address,
      deliveryTimeRequest: parsed.data.deliveryTimeRequest,
      password,
      isApproved: false,
    },
  });

  redirect("/login?registered=1");
}

export async function loginAction(formData: FormData) {
  assertSameOrigin();

  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=credentials");
    }

    throw error;
  }
}

export async function logoutAction() {
  assertSameOrigin();
  await signOut({ redirectTo: "/" });
}
