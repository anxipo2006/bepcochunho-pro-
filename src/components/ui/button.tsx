import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-coral text-white hover:bg-coral-dark",
  secondary: "border border-teal-200 bg-white text-teal-800 hover:bg-teal-50",
  ghost: "text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  className,
  variant = "primary",
  children,
}: {
  href: string;
  className?: string;
  variant?: ButtonProps["variant"];
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5",
        variants[variant ?? "primary"],
        className,
      )}
    >
      {children}
    </Link>
  );
}
