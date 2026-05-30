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
    <main className="grid min-h-screen place-items-center bg-offwhite px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Link href="/" className="mb-6 flex items-center gap-2 font-bold text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-coral text-white">
            <ChefHat size={20} />
          </span>
          Bếp Cô Chủ Nhỏ
        </Link>
        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-6">{children}</div>
        <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
      </div>
    </main>
  );
}
