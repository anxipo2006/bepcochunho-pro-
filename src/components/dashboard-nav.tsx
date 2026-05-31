"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Headphones,
  LayoutDashboard,
  ReceiptText,
  Soup,
  Users,
} from "lucide-react";

const iconMap = {
  Soup,
  ReceiptText,
  CreditCard,
  LayoutDashboard,
  Users,
  Headphones,
} as const;

type IconKey = keyof typeof iconMap;

type NavItem = {
  href: string;
  label: string;
  icon: IconKey;
};

function DesktopNavItem({
  href,
  label,
  icon: iconKey,
  isActive,
}: {
  href: string;
  label: string;
  icon: IconKey;
  isActive: boolean;
}) {
  const Icon = iconMap[iconKey];
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
        isActive
          ? "bg-coral-soft text-coral-dark shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-coral" />
      )}
      <Icon size={18} className={isActive ? "text-coral" : ""} />
      {label}
    </Link>
  );
}

function MobileNavItem({
  href,
  label,
  icon: iconKey,
  isActive,
}: {
  href: string;
  label: string;
  icon: IconKey;
  isActive: boolean;
}) {
  const Icon = iconMap[iconKey];
  return (
    <Link
      href={href}
      className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-all duration-200 ${
        isActive ? "text-coral" : "text-slate-500 hover:text-coral"
      }`}
    >
      <div className="relative">
        <Icon size={20} />
        {isActive && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-coral shadow-sm" />
        )}
      </div>
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function DashboardNav({
  nav,
  mobile,
}: {
  nav: NavItem[];
  mobile: boolean;
}) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid border-t border-slate-200/80 bg-white/95 px-2 py-2 shadow-[0_-8px_30px_rgba(15,23,42,0.07)] backdrop-blur-xl lg:hidden"
        style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
      >
        {nav.map((item) => (
          <MobileNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    );
  }

  return (
    <nav className="mt-8 grid gap-1">
      {nav.map((item) => (
        <DesktopNavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={pathname === item.href}
        />
      ))}
    </nav>
  );
}
