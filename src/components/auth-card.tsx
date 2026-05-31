"use client";

import { ChefHat } from "lucide-react";
import Link from "next/link";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 py-10">
      {/* Animated aurora background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-[spin_20s_linear_infinite] rounded-full bg-coral/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 animate-[spin_25s_linear_infinite_reverse] rounded-full bg-teal-400/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/15 blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-3">
            <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-coral via-coral-medium to-coral-dark shadow-coral-glow">
              <ChefHat size={22} className="text-white" />
              <span className="absolute inset-0 rounded-2xl bg-white/10" />
            </span>
            <span className="text-lg font-bold text-white">Bếp Cô Chủ Nhỏ</span>
          </Link>

          <h1 className="text-2xl font-extrabold text-white">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>

          <div className="mt-7">{children}</div>

          <div className="mt-6 text-center text-sm text-white/50">{footer}</div>
        </div>
      </div>
    </main>
  );
}

