import { Phone } from "lucide-react";

const phone = "0337998639";
const facebookUrl = "https://www.facebook.com/profile.php?id=61589792601231";
const zaloUrl = `https://zalo.me/${phone}`;

export function FloatingContact() {
  return (
    <div className="fixed bottom-5 left-4 z-50 flex flex-col items-start gap-3 sm:bottom-6 sm:left-6">
      <a
        href={zaloUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Nhắn Zalo"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#0a8cff] text-sm font-black text-white shadow-lg ring-8 ring-[#0a8cff]/20 transition hover:scale-105"
      >
        Zalo
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Mở Facebook"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#1877f2] text-white shadow-lg ring-8 ring-[#1877f2]/15 transition hover:scale-105"
      >
        <span className="font-serif text-3xl font-black leading-none">f</span>
      </a>
      <a
        href={`tel:${phone}`}
        className="inline-flex h-14 items-center gap-3 rounded-full bg-red-600 px-5 text-sm font-bold text-white shadow-lg ring-8 ring-red-600/15 transition hover:scale-105 hover:bg-red-700"
      >
        <Phone size={22} />
        <span className="hidden sm:block">
          Gọi điện:
          <strong className="ml-2 text-lg">0337.998.639</strong>
        </span>
      </a>
    </div>
  );
}
