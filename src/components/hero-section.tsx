"use client";

import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const headline = "Suất ăn doanh nghiệp chuẩn vị cơm nhà tại TP.HCM";

const words = headline.split(" ");

const proofPoints = [
  "Từ 35.000đ/phần",
  "Menu tuần rõ ràng",
  "Giao nóng đúng giờ",
  "Hỗ trợ VAT, công nợ",
];

export function HeroSection() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative isolate overflow-hidden bg-slate-950 text-white lg:min-h-[calc(100vh-4rem)]">
        <AuroraBackground />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.16),transparent_34%),linear-gradient(180deg,rgba(15,23,42,.16),rgba(15,23,42,.84))]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.02fr_.98fr] lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold shadow-2xl backdrop-blur-xl"
            >
              <Sparkles size={16} className="text-coral" />
              Bếp Cô Chủ Nhỏ phục vụ công ty 50 - 200 phần/ngày
            </m.div>

            <h1 className="mt-7 flex flex-wrap gap-x-2 gap-y-1 text-[clamp(2.4rem,6vw,4.9rem)] font-black leading-[1.05] tracking-normal">
              {words.map((word, index) => (
                <m.span
                  key={`${word}-${index}`}
                  initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.16 + index * 0.045,
                    duration: 0.52,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={index >= 5 ? "bg-gradient-to-r from-coral via-amber-200 to-teal-200 bg-clip-text text-transparent" : ""}
                >
                  {word}
                </m.span>
              ))}
            </h1>

            <m.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.5 }}
              className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8"
            >
              Trọn vị cơm nhà, đậm đà tình thân. Bếp lo menu đa dạng, giao đúng giờ,
              đóng gói sạch sẽ và thanh toán linh hoạt cho đội ngũ của bạn.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.76, duration: 0.48 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <ButtonLink
                href="/register"
                className="group relative h-12 overflow-hidden rounded-full px-6 shadow-2xl shadow-coral/25"
              >
                <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,.38),transparent)] transition-transform duration-1000 group-hover:translate-x-full" />
                Đăng ký nhận menu
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink
                href="#lien-he"
                variant="secondary"
                className="h-12 rounded-full border-white/30 bg-white/15 px-6 text-white shadow-xl backdrop-blur-xl hover:bg-white/25"
              >
                Tư vấn suất ăn
              </ButtonLink>
            </m.div>

            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-8 grid gap-3 text-sm font-semibold text-white/82 sm:grid-cols-2"
            >
              {proofPoints.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-teal-200" />
                  {item}
                </div>
              ))}
            </m.div>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <m.div
              animate={{ y: [-12, 12, -12], rotate: [-1.2, 1.2, -1.2] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto aspect-[4/3] max-w-xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-[0_35px_90px_rgba(0,0,0,.38)] backdrop-blur-xl"
            >
              <Image
                src="/optimized/3.webp"
                alt="Khay cơm bento Bếp Cô Chủ Nhỏ"
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/6 to-white/8 mix-blend-multiply" />
              <div className="absolute bottom-4 left-4 right-4 rounded-[1.5rem] border border-white/20 bg-white/18 p-4 shadow-2xl backdrop-blur-xl">
                <div className="text-sm font-semibold text-white/75">Bếp Cô Chủ Nhỏ</div>
                <div className="mt-1 text-2xl font-black">Cơm văn phòng giá rẻ</div>
                <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-sm font-bold text-coral-dark">
                  35.000đ/phần
                </div>
              </div>
            </m.div>

            <m.div
              animate={{ y: [10, -8, 10] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-3 top-8 hidden rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-bold shadow-2xl backdrop-blur-xl sm:block"
            >
              Freeship theo hợp đồng
            </m.div>

            <m.div
              animate={{ y: [-8, 10, -8] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-2 bottom-12 hidden rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-bold shadow-2xl backdrop-blur-xl sm:block"
            >
              Hỗ trợ VAT, công nợ
            </m.div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <m.div
        animate={{
          x: ["-12%", "8%", "-10%"],
          y: ["-8%", "10%", "-6%"],
          rotate: [0, 10, -4],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-28 top-0 h-[34rem] w-[34rem] rounded-full bg-coral/45 blur-3xl"
      />
      <m.div
        animate={{
          x: ["10%", "-8%", "6%"],
          y: ["6%", "-10%", "8%"],
          rotate: [0, -12, 8],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-8rem] top-20 h-[36rem] w-[36rem] rounded-full bg-teal-400/42 blur-3xl"
      />
      <m.div
        animate={{
          x: ["-4%", "6%", "-2%"],
          y: ["12%", "-4%", "10%"],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-amber-300/28 blur-3xl"
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.08),transparent_30%,rgba(255,255,255,.08)_62%,transparent)]" />
    </div>
  );
}

