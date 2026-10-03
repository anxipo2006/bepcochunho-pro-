import { Phone } from "lucide-react";

const phone = "0337998639";

export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 sm:bottom-6 sm:right-6">
      <a
        href="https://www.facebook.com/profile.php?id=61589792601231"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook Cơm Văn Phòng Mến"
        className="grid h-11 w-11 place-items-center rounded-full bg-[#1877f2] font-serif text-2xl font-bold text-white shadow-lg transition-transform hover:-translate-y-1"
      >
        f
      </a>
      <a
        href={`https://zalo.me/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn Zalo cho Cơm Văn Phòng Mến"
        className="grid h-11 w-11 place-items-center rounded-full bg-[#0a8cff] text-xs font-bold text-white shadow-lg transition-transform hover:-translate-y-1"
      >
        Zalo
      </a>
      <a
        href={`tel:${phone}`}
        aria-label="Gọi 0337 998 639"
        className="inline-flex h-11 items-center gap-2 rounded-full bg-[#b95035] px-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-1 sm:px-4"
      >
        <Phone size={18} />
        <span className="hidden sm:inline">0337 998 639</span>
      </a>
    </div>
  );
}
