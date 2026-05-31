"use client";

import { Phone } from "lucide-react";

const phone = "0337998639";
const facebookUrl = "https://www.facebook.com/profile.php?id=61589792601231";
const zaloUrl = `https://zalo.me/${phone}`;

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 left-4 z-50 flex flex-col items-start gap-3 sm:bottom-8 sm:left-6">
      {/* Zalo Button with pulse */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Nhắn Zalo"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0a8cff] text-sm font-black text-white shadow-lg shadow-[#0a8cff]/30 transition-transform duration-200 hover:scale-110"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 animate-pulse-ring rounded-full border-4 border-[#0a8cff] opacity-60" />
        <span className="relative">Zalo</span>
        {/* Tooltip */}
        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
          Chat Zalo ngay
        </span>
      </a>

      {/* Facebook Button */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Mở Facebook"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-lg shadow-[#1877f2]/25 transition-transform duration-200 hover:scale-110"
      >
        <span className="font-serif text-3xl font-black leading-none">f</span>
        {/* Tooltip */}
        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
          Fanpage Facebook
        </span>
      </a>

      {/* Phone Call Button */}
      <a
        href={`tel:${phone}`}
        className="group relative inline-flex h-14 items-center gap-3 rounded-full bg-gradient-to-r from-coral to-coral-dark px-5 text-sm font-bold text-white shadow-lg shadow-coral/30 transition-all duration-200 hover:scale-105 hover:shadow-coral-glow"
      >
        <Phone size={20} />
        <span className="hidden sm:block">
          Gọi ngay:{" "}
          <strong className="text-base">0337.998.639</strong>
        </span>
        {/* Mobile tooltip */}
        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 sm:hidden">
          0337.998.639
        </span>
      </a>
    </div>
  );
}

