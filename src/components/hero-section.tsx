import Image from "next/image";
import { ArrowDown, ArrowRight, Check, Clock3, Leaf, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const highlights = ["Nấu mới mỗi ngày", "Giao đúng giờ", "Menu linh hoạt"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8f3e8]">
      <div className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#e9c37b]/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:min-h-[650px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:px-10 lg:py-20">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#315744]/15 bg-white/75 px-4 py-2 text-sm font-semibold text-[#315744]">
            <span className="h-2 w-2 rounded-full bg-[#bb563b]" />
            Bữa trưa chỉn chu cho ngày làm việc
          </div>
          <h1 className="mt-6 max-w-2xl font-serif text-[clamp(2.7rem,4.6vw,4.5rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-[#243c30]">
            Cơm ngon như nhà nấu, <span className="text-[#b95035]">ấm lòng mỗi trưa.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#53645a] sm:text-lg">
            Cơm Văn Phòng Mến chuẩn bị những bữa ăn nóng sốt, đủ đầy và giao tận nơi — để bạn an tâm chăm lo bữa trưa cho cả đội ngũ.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#lien-he" className="h-12 rounded-full bg-[#b95035] px-6 text-white shadow-lg shadow-[#b95035]/15 hover:bg-[#9f402b]">
              Nhận tư vấn thực đơn <ArrowRight size={17} />
            </ButtonLink>
            <ButtonLink href="#thuc-don" variant="secondary" className="h-12 rounded-full border-[#315744]/20 bg-white/70 px-6 text-[#315744] hover:bg-white">
              Xem thực đơn <ArrowDown size={16} />
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#53645a]">
            {highlights.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check size={16} className="text-[#55765d]" /> {item}
              </span>
            ))}
          </div>
          <a href="tel:0337998639" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#315744] underline decoration-[#315744]/30 underline-offset-4 hover:decoration-[#315744]">
            <Phone size={15} /> Cần tư vấn nhanh? 0337 998 639
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
          <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-[#d8bd8b]/35 sm:-inset-4" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.7rem] bg-[#e8dfcd] shadow-[0_28px_70px_rgba(62,54,37,.18)]">
            <Image
              src="/optimized/3.webp"
              alt="Suất cơm trưa tươi ngon được chuẩn bị tại Cơm Văn Phòng Mến"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f3328]/75 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-7">
              <div>
                <div className="text-sm font-medium text-white/80">Bữa trưa được chuẩn bị bằng sự chu đáo</div>
                <div className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Đủ vị ngon, trọn niềm Mến</div>
              </div>
              <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-white/35 bg-white/15 backdrop-blur sm:grid">
                <Leaf size={21} />
              </span>
            </div>
          </div>
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-[#315744]/10 bg-[#fffdf7] px-4 py-3 shadow-xl sm:-left-7 sm:bottom-8 sm:px-5 sm:py-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e8efe5] text-[#426b4d]"><Clock3 size={19} /></span>
            <span><span className="block text-sm font-bold text-[#243c30]">Giao đúng giờ</span><span className="mt-0.5 block text-xs text-[#6a786e]">Bữa trưa sẵn sàng</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
