import Link from "next/link";
import { ChefHat, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard-nav";

const clientNav = [
  { href: "/dashboard", label: "Đặt hàng", icon: "Soup" as const },
  { href: "/dashboard/orders", label: "Đơn hàng", icon: "ReceiptText" as const },
  { href: "/dashboard/billing", label: "Công nợ", icon: "CreditCard" as const },
];

const adminNav = [
  { href: "/admin", label: "Tổng hợp", icon: "LayoutDashboard" as const },
  { href: "/admin/clients", label: "Khách hàng", icon: "Users" as const },
  { href: "/admin/consultations", label: "Tư vấn", icon: "Headphones" as const },
  { href: "/admin/menu", label: "Thực đơn", icon: "Soup" as const },
  { href: "/admin/orders", label: "Đơn hàng", icon: "ReceiptText" as const },
  { href: "/admin/billing", label: "Công nợ", icon: "CreditCard" as const },
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
  const companyName = session?.user.companyName ?? "";
  const initials = companyName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen overflow-x-hidden bg-offwhite pb-20 lg:pb-0">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200/80 bg-white p-4 shadow-sm lg:flex lg:flex-col">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-coral to-coral-dark text-white shadow-md shadow-coral/25">
            <ChefHat size={20} />
          </span>
          <div>
            <div className="text-sm font-extrabold leading-none">Bếp Cô Chủ Nhỏ</div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {mode === "admin" ? "Quản trị" : "Khách hàng"}
            </div>
          </div>
        </Link>

        {/* Nav */}
        <DashboardNav nav={nav} mobile={false} />

        {/* User & Logout */}
        <div className="mt-auto space-y-3">
          {/* User info */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-coral to-coral-dark text-xs font-black text-white shadow-sm">
              {initials || "?"}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-900">{companyName}</div>
              <div className="text-[11px] text-slate-400">
                {mode === "admin" ? "Quản trị viên" : "Khách hàng"}
              </div>
            </div>
          </div>
          {/* Logout */}
          <form action={logoutAction}>
            <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-red-600">
              <LogOut size={16} />
              Đăng xuất
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm shadow-slate-200/40 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {mode === "admin" ? "Cổng quản trị" : "Cổng khách hàng"}
              </p>
              <h1 className="mt-0.5 truncate text-lg font-extrabold text-slate-950">
                {session?.user.companyName}
              </h1>
            </div>
            <form action={logoutAction} className="lg:hidden">
              <Button variant="ghost" aria-label="Đăng xuất" className="text-slate-400 hover:text-red-500">
                <LogOut size={18} />
              </Button>
            </form>
          </div>
        </header>

        <main className="min-w-0 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardNav nav={nav} mobile={true} />
    </div>
  );
}
