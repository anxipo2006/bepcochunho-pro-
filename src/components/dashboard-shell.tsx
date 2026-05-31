import Link from "next/link";
import {
  ChefHat,
  CreditCard,
  Headphones,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Soup,
  Users,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

const clientNav = [
  { href: "/dashboard", label: "Đặt hàng", icon: Soup },
  { href: "/dashboard/orders", label: "Đơn hàng", icon: ReceiptText },
  { href: "/dashboard/billing", label: "Công nợ", icon: CreditCard },
];

const adminNav = [
  { href: "/admin", label: "Tổng hợp", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Khách hàng", icon: Users },
  { href: "/admin/consultations", label: "Tư vấn", icon: Headphones },
  { href: "/admin/menu", label: "Thực đơn", icon: Soup },
  { href: "/admin/orders", label: "Đơn hàng", icon: ReceiptText },
  { href: "/admin/billing", label: "Công nợ", icon: CreditCard },
];

export async function DashboardShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "client" | "admin";
}) {
  const session = await auth();
  const nav = mode === "admin" ? adminNav : clientNav;

  return (
    <div className="min-h-screen overflow-x-hidden bg-offwhite pb-20 lg:pb-0">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur lg:block">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-coral text-white">
            <ChefHat size={20} />
          </span>
          Bếp Cô Chủ Nhỏ
        </Link>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-coral-soft hover:text-coral-dark"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction} className="absolute inset-x-4 bottom-4">
          <Button variant="ghost" className="w-full justify-start">
            <LogOut size={18} />
            Đăng xuất
          </Button>
        </form>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm shadow-slate-200/40 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-slate-500">
                {mode === "admin" ? "Cổng quản trị" : "Cổng khách hàng"}
              </p>
              <h1 className="truncate font-semibold text-slate-950">{session?.user.companyName}</h1>
            </div>
            <form action={logoutAction} className="lg:hidden">
              <Button variant="ghost" aria-label="Đăng xuất">
                <LogOut size={18} />
              </Button>
            </form>
          </div>
        </header>
        <main className="min-w-0 overflow-x-hidden px-3 py-4 sm:px-5 sm:py-5 lg:px-6">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,.08)] backdrop-blur lg:hidden"
        style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
      >
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-coral-soft hover:text-coral-dark"
            >
              <Icon size={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
