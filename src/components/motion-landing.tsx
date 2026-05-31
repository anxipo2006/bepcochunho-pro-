import Image from "next/image";
import {
  Bike,
  Building2,
  Clock3,
  Leaf,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShieldCheck,
  Utensils,
  TrendingUp,
  Star,
  Users,
} from "lucide-react";
import { createConsultationAction } from "@/actions/consultation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";

const values = [
  {
    icon: Utensils,
    title: "Thực đơn đa dạng, xoay vòng liên tục",
    text: "Menu thay đổi mỗi ngày với đủ món mặn, món chay, món nước, đồ uống và tráng miệng để hạn chế cảm giác ngán cơm.",
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    icon: Leaf,
    title: "Nguyên liệu tươi sạch",
    text: "Nguyên liệu nhập mới hằng ngày, nguồn gốc rõ ràng, ưu tiên quy trình chế biến gọn gàng và an toàn vệ sinh thực phẩm.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    icon: Bike,
    title: "Giao hàng tận nơi, freeship 100%",
    text: "Giao đúng giờ, đủ số lượng, giữ nóng trong thùng chuyên dụng đến tận cổng công ty hoặc khu vực nhận hàng.",
    color: "bg-sky-50 text-sky-600 border-sky-200",
  },
  {
    icon: PackageCheck,
    title: "Đóng gói linh hoạt",
    text: "Hỗ trợ khay bento chia ngăn, nắp kín sạch sẽ hoặc khay inox truyền thống tùy quy trình vận hành của doanh nghiệp.",
    color: "bg-violet-50 text-violet-600 border-violet-200",
  },
  {
    icon: ReceiptText,
    title: "Hóa đơn VAT và công nợ",
    text: "Pháp nhân Công ty TNHH minh bạch, hỗ trợ xuất hóa đơn VAT và chốt công nợ theo tuần hoặc theo tháng.",
    color: "bg-coral-soft text-coral-dark border-coral/20",
  },
];

const menuHighlights = [
  {
    title: "Cơm mặn đưa cơm",
    image: "/optimized/3.webp",
    text: "Sườn nướng mật ong, đùi gà sốt mắm tỏi, thịt kho trứng cút, cá chiên giòn, xíu mại sốt cà.",
    tag: "Phổ biến nhất",
    tagTone: "coral" as const,
  },
  {
    title: "Ngày đổi vị",
    image: "/optimized/14.webp",
    text: "Bún bò, hủ tiếu tôm thịt, mì Quảng, phở gà với nước lèo hầm xương thanh ngọt.",
    tag: "Yêu thích",
    tagTone: "teal" as const,
  },
  {
    title: "Menu chay thanh tịnh",
    image: "/optimized/6.webp",
    text: "Đậu hũ kho sả, nấm đùi gà kho tiêu, sườn non chay rim và rau củ xào đủ dinh dưỡng.",
    tag: "Healthy",
    tagTone: "green" as const,
  },
  {
    title: "Đồ uống và tráng miệng",
    image: "/optimized/tm.webp",
    text: "Nước sâm, hạt chia, sữa chua nhà làm và trái cây tươi theo mùa.",
    tag: "Tươi mát",
    tagTone: "amber" as const,
  },
];

const steps = [
  {
    title: "Tư vấn và chọn khẩu phần",
    text: "Tiếp nhận số lượng 50-200 phần, ngân sách từ 35.000đ và đặc thù ngành nghề để tư vấn thực đơn phù hợp.",
    icon: "💬",
  },
  {
    title: "Gửi menu trải nghiệm và ký hợp đồng",
    text: "Hỗ trợ suất ăn mẫu, thống nhất menu tuần/tháng, chính sách giao hàng và điều khoản thanh toán.",
    icon: "📋",
  },
  {
    title: "Cấp tài khoản và phục vụ hằng ngày",
    text: "HR/Admin chốt số lượng trên hệ thống trước 15h00 hôm trước. Bếp tiến hành nấu và giao nóng đúng giờ.",
    icon: "🍱",
  },
  {
    title: "Đối soát và chốt công nợ",
    text: "Hệ thống xuất bảng kê chi tiết. Khách hàng kiểm tra, Bếp xuất hóa đơn VAT và thanh toán công nợ nhanh gọn.",
    icon: "✅",
  },
];

const stats = [
  { value: "3+", label: "Năm kinh nghiệm", icon: TrendingUp },
  { value: "50+", label: "Doanh nghiệp tin dùng", icon: Users },
  { value: "35K", label: "Đồng mỗi phần", icon: Star },
  { value: "200", label: "Phần tối đa/ngày", icon: Utensils },
];

export function MotionLanding({ consulted }: { consulted?: string }) {
  return (
    <main className="bg-offwhite text-slate-900">
      <HeroSection />

      {/* ── Stats strip ── */}
      <section className="border-y border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="group flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-coral-soft text-coral transition-all duration-300 group-hover:bg-coral group-hover:text-white group-hover:shadow-coral-glow">
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-950">{stat.value}</div>
                    <div className="text-xs font-semibold text-slate-500">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Giới thiệu ── */}
      <section id="gioi-thieu" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Badge tone="coral" dot>Hồ sơ năng lực</Badge>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Về{" "}
              <span className="bg-gradient-to-r from-coral to-coral-dark bg-clip-text text-transparent">
                Bếp Cô Chủ Nhỏ
              </span>
              {" "}— nơi khởi nguồn năng lượng cho ngày dài
            </h2>
            <p className="mt-4 leading-relaxed text-slate-500">
              Chúng tôi thấu hiểu rằng một bữa trưa ngon miệng là chìa khóa tái tạo năng lượng và nâng cao hiệu suất của cả đội ngũ.
            </p>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-card-md">
            <p className="leading-8 text-slate-700">
              Chúng tôi thấu hiểu rằng một bữa trưa ngon miệng, nóng hổi và đầy đủ dinh dưỡng là chìa khóa để tái tạo
              năng lượng và nâng cao hiệu suất làm việc của cán bộ nhân viên.
            </p>
            <p className="leading-8 text-slate-700">
              Công ty TNHH Bếp Cô Chủ Nhỏ là đối tác cung cấp suất ăn cho xí nghiệp, nhà máy và khối văn phòng tại
              TP.HCM. Không chỉ bán một suất cơm, chúng tôi gửi vào đó sự chăm chút từ khâu chọn nguyên liệu đến khi
              trao tận tay khách hàng.
            </p>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="h-1 w-10 rounded-full bg-gradient-to-r from-coral to-coral-dark" />
              <p className="text-sm font-semibold text-coral-dark">Tận tâm · Sạch sẽ · Đúng giờ</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dịch vụ / Values ── */}
      <section id="dich-vu" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge tone="teal" dot>Vì sao chọn chúng tôi?</Badge>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Năng lực phục vụ và giá trị cốt lõi
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              5 cam kết làm nên sự khác biệt của Bếp Cô Chủ Nhỏ với các nhà cung cấp khác.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-offwhite p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Thực đơn highlights ── */}
      <section id="thuc-don" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="coral" dot>Thực đơn nổi bật</Badge>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Bữa trưa phong phú, dễ ăn, dễ triển khai
            </h2>
          </div>
          <ButtonLink href="#menu-tuan" variant="secondary">
            Xem menu tuần →
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {menuHighlights.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute left-3 top-3">
                  <Badge tone={item.tagTone} dot>{item.tag}</Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quy trình ── */}
      <section id="quy-trinh" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge tone="teal" dot>Quy trình đặt cơm</Badge>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              4 bước đơn giản để bắt đầu cùng Bếp
            </h2>
          </div>
          <div className="relative mt-12 grid gap-0 md:grid-cols-4">
            <div
              className="absolute hidden h-0.5 bg-gradient-to-r from-coral/20 via-coral/60 to-coral/20 md:block"
              style={{ top: "2.5rem", left: "calc(12.5% + 1.5rem)", right: "calc(12.5% + 1.5rem)" }}
            />
            {steps.map((step, index) => (
              <div key={step.title} className="group relative flex flex-col items-center px-4 pb-8 text-center md:pb-0">
                <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-coral to-coral-dark text-2xl shadow-lg shadow-coral/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-coral-glow">
                  {step.icon}
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-slate-950 text-[10px] font-black text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Liên hệ ── */}
      <section id="lien-he" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-2xl lg:grid lg:grid-cols-[1fr_400px] lg:p-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-coral/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-40 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" />

          {/* Left: Contact info */}
          <div className="relative">
            <Badge tone="coral" dot>Liên hệ tư vấn</Badge>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
              Đừng để nhân viên phải lo lắng bữa trưa.
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Hãy để Bếp Cô Chủ Nhỏ lo. Liên hệ Zalo/Hotline để nhận báo giá chi tiết và thực đơn tuần mới nhất.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-slate-300">
              {(
                [
                  [MapPin, "14/9/5 Lê Thúc Hoạch, Phường Phú Thọ Hòa, Quận Tân Phú, TP.HCM"],
                  [Phone, "Hotline/Zalo: 0337 998 639"],
                  [Building2, "Công ty TNHH Bếp Cô Chủ Nhỏ"],
                  [Clock3, "Tiếp nhận đơn: 08:00 - 18:00, từ Thứ 2 đến Thứ 7"],
                  [ShieldCheck, "Pháp nhân rõ ràng, hỗ trợ hợp đồng, VAT và công nợ."],
                ] as [React.ElementType, string][]
              ).map(([IconComp, text], i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <IconComp size={13} className="text-coral" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="relative mt-8 lg:mt-0">
            <form
              action={createConsultationAction}
              className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
            >
              <div className="mb-1">
                <p className="text-lg font-bold">Nhận báo giá miễn phí</p>
                <p className="text-sm text-white/50">Điền thông tin, Bếp phản hồi trong 2 giờ</p>
              </div>
              {consulted === "1" ? (
                <div className="rounded-xl border border-teal-400/30 bg-teal-500/15 px-4 py-3 text-sm font-medium text-teal-200">
                  ✓ Đã gửi thông tin. Bếp sẽ gọi/Zalo lại cho bạn sớm nhất!
                </div>
              ) : null}
              {consulted === "invalid" ? (
                <div className="rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200">
                  ✗ Vui lòng nhập đủ tên công ty, số lượng và số điện thoại.
                </div>
              ) : null}
              <label className="grid gap-2 text-sm font-semibold text-white/70">
                Tên công ty
                <input
                  name="companyName"
                  className="h-11 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-coral/60 focus:ring-4 focus:ring-coral/20 hover:border-white/25"
                  placeholder="Công ty ABC"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white/70">
                Số lượng dự kiến
                <input
                  name="expectedQuantity"
                  className="h-11 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-coral/60 focus:ring-4 focus:ring-coral/20 hover:border-white/25"
                  placeholder="80 phần/ngày"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white/70">
                Số điện thoại
                <input
                  name="phone"
                  className="h-11 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-coral/60 focus:ring-4 focus:ring-coral/20 hover:border-white/25"
                  placeholder="0337 998 639"
                  required
                />
              </label>
              <button
                type="submit"
                className="group relative mt-2 h-12 overflow-hidden rounded-xl bg-gradient-to-r from-coral via-coral-medium to-coral-dark text-sm font-bold text-white shadow-lg shadow-coral/30 transition-all hover:shadow-coral-glow active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
                Nhận tư vấn ngay →
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
