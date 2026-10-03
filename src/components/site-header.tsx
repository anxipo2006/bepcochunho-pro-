import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LayoutDashboard } from "lucide-react";
import { auth } from "@/auth";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  ["Câu chuyện", "#gioi-thieu"],
  ["Điều Mến chăm chút", "#dich-vu"],
  ["Thực đơn", "#thuc-don"],
  ["Cách đặt cơm", "#quy-trinh"],
] as const;

export async function SiteHeader() {
  const session = await auth();
  const dashboardHref = session?.user.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-[#315744]/10 bg-[#fffdf8]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3 text-[#243c30]">
          <Image
            src="/men-logo-mark.png"
            alt=""
            width={46}
            height={46}
            priority
            unoptimized
            className="h-11 w-11 rounded-xl object-contain transition-transform group-hover:rotate-[-4deg]"
          />
          <span className="min-w-0">
            <span className="block truncate font-serif text-[15px] font-semibold leading-tight sm:text-xl">Cơm Văn Phòng Mến</span>
            <span className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[.18em] text-[#788478] sm:block">Bữa trưa trao điều lành</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 text-[13px] font-semibold text-[#53645a] xl:flex">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="group relative whitespace-nowrap rounded-lg px-3 py-2 transition-colors duration-200 hover:text-[#a74832]"
            >
              {label}
              {/* Animated underline */}
              <span className="absolute bottom-1 left-3 right-3 h-px origin-left scale-x-0 rounded-full bg-[#b95035] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {session?.user ? (
              <ButtonLink href={dashboardHref} variant="secondary" className="text-[#315744]">
              <LayoutDashboard size={16} />
              Đơn hàng
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" className="hidden text-[#315744] sm:inline-flex">
                Đăng nhập
              </ButtonLink>
              <ButtonLink href="#lien-he" className="shrink-0 whitespace-nowrap rounded-full bg-[#b95035] px-3 text-white hover:bg-[#9f402b] sm:px-4">
                <span className="sm:hidden">Tư vấn</span><span className="hidden sm:inline">Nhận tư vấn</span><ArrowUpRight size={15} className="hidden sm:block" />
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
