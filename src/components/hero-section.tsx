"use client";

import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const headline = "Suáº¥t Äƒn doanh nghiá»‡p chuáº©n vá»‹ cÆ¡m nhÃ  táº¡i TP.HCM";

const words = headline.split(" ");

const proofPoints = [
  "Tá»« 35.000Ä‘/pháº§n",
  "Menu tuáº§n rÃµ rÃ ng",
  "Giao nÃ³ng Ä‘Ãºng giá»",
  "Há»— trá»£ VAT, cÃ´ng ná»£",
];

export function HeroSection() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-white">
        <AuroraBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.16),transparent_34%),linear-gradient(180deg,rgba(15,23,42,.16),rgba(15,23,42,.84))]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
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
            Báº¿p CÃ´ Chá»§ Nhá» phá»¥c vá»¥ cÃ´ng ty 50 - 200 pháº§n/ngÃ y
          </m.div>

          <h1 className="mt-7 flex flex-wrap gap-x-3 gap-y-2 text-4xl font-black leading-tight tracking-normal sm:text-6xl lg:text-7xl">
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
            className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl"
          >
            Trá»n vá»‹ cÆ¡m nhÃ , Ä‘áº­m Ä‘Ã  tÃ¬nh thÃ¢n. Báº¿p lo menu Ä‘a dáº¡ng, giao Ä‘Ãºng giá»,
            Ä‘Ã³ng gÃ³i sáº¡ch sáº½ vÃ  thanh toÃ¡n linh hoáº¡t cho Ä‘á»™i ngÅ© cá»§a báº¡n.
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
              ÄÄƒng kÃ½ nháº­n menu
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink
              href="#lien-he"
              variant="secondary"
              className="h-12 rounded-full border-white/30 bg-white/15 px-6 text-white shadow-xl backdrop-blur-xl hover:bg-white/25"
            >
              TÆ° váº¥n suáº¥t Äƒn
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
              src="/optimized/1.webp"
              alt="Khay cÆ¡m bento Báº¿p CÃ´ Chá»§ Nhá»"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/6 to-white/8 mix-blend-multiply" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[1.5rem] border border-white/20 bg-white/18 p-4 shadow-2xl backdrop-blur-xl">
              <div className="text-sm font-semibold text-white/75">Menu ná»•i báº­t hÃ´m nay</div>
              <div className="mt-1 text-2xl font-black">CÆ¡m gÃ  sá»‘t máº¯m tá»i</div>
              <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-sm font-bold text-coral-dark">
                35.000Ä‘/pháº§n
              </div>
            </div>
          </m.div>

          <m.div
            animate={{ y: [10, -8, 10] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-3 top-8 hidden rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-bold shadow-2xl backdrop-blur-xl sm:block"
          >
            Freeship theo há»£p Ä‘á»“ng
          </m.div>

          <m.div
            animate={{ y: [-8, 10, -8] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-2 bottom-12 hidden rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-bold shadow-2xl backdrop-blur-xl sm:block"
          >
            Chá»‘t sá»‘ lÆ°á»£ng trÆ°á»›c 15h
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

