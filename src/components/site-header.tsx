import Image from "next/image";
import { LayoutDashboard, Menu } from "lucide-react";
import { auth } from "@/auth";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  ["Giới thiệu", "#gioi-thieu"],
  ["Dịch vụ", "#dich-vu"],
  ["Thực đơn", "#thuc-don"],
  ["Quy trình", "#quy-trinh"],
  ["Liên hệ", "#lien-he"],
] as const;

export async function SiteHeader() {
  const session = await auth();
  const dashboardHref = session?.user.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <Image
            src="/optimized/logo.webp"
            alt="Bếp Cô Chủ Nhỏ"
            width={40}
            height={40}
            className="h-10 w-10 rounded-md object-cover"
          />
          <span>Bếp Cô Chủ Nhỏ</span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-coral-dark">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <ButtonLink href={dashboardHref} variant="secondary">
              <LayoutDashboard size={16} />
              Dashboard
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" className="hidden sm:inline-flex">
                Đăng nhập
              </ButtonLink>
              <ButtonLink href="/register">Đăng ký</ButtonLink>
            </>
          )}
          <Menu className="text-slate-400 lg:hidden" size={20} />
        </div>
      </div>
    </header>
  );
}
