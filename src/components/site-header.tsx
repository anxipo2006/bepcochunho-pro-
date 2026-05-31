import Image from "next/image";
import { LayoutDashboard } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/85 shadow-sm shadow-slate-200/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="group flex min-w-0 items-center gap-2.5 font-bold text-slate-950">
          <span className="relative overflow-hidden rounded-xl shadow-md shadow-coral/20 transition-shadow duration-300 group-hover:shadow-coral-glow">
            <Image
              src="/optimized/logo.webp"
              alt="Bếp Cô Chủ Nhỏ"
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
            />
          </span>
          <span className="truncate text-base">Bếp Cô Chủ Nhỏ</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 text-sm font-semibold text-slate-600 lg:flex">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="group relative rounded-lg px-3 py-2 transition-colors duration-200 hover:text-coral-dark"
            >
              {label}
              {/* Animated underline */}
              <span className="absolute bottom-1 left-3 right-3 h-0.5 origin-left scale-x-0 rounded-full bg-coral transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {/* Actions */}
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
        </div>
      </div>
    </header>
  );
}

