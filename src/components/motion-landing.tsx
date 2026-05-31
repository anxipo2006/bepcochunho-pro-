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
  },
  {
    icon: Leaf,
    title: "Nguyên liệu tươi sạch",
    text: "Nguyên liệu nhập mới hằng ngày, nguồn gốc rõ ràng, ưu tiên quy trình chế biến gọn gàng và an toàn vệ sinh thực phẩm.",
  },
  {
    icon: Bike,
    title: "Giao hàng tận nơi, freeship 100%",
    text: "Giao đúng giờ, đủ số lượng, giữ nóng trong thùng chuyên dụng đến tận cổng công ty hoặc khu vực nhận hàng.",
  },
  {
    icon: PackageCheck,
    title: "Đóng gói linh hoạt",
    text: "Hỗ trợ khay bento chia ngăn, nắp kín sạch sẽ hoặc khay inox truyền thống tùy quy trình vận hành của doanh nghiệp.",
  },
  {
    icon: ReceiptText,
    title: "Hóa đơn VAT và công nợ",
    text: "Pháp nhân Công ty TNHH minh bạch, hỗ trợ xuất hóa đơn VAT và chốt công nợ theo tuần hoặc theo tháng.",
  },
];

const menuHighlights = [
  {
    title: "Cơm mặn đưa cơm",
    image: "/optimized/3.webp",
    text: "Sườn nướng mật ong, đùi gà sốt mắm tỏi, thịt kho trứng cút, cá chiên giòn, xíu mại sốt cà.",
  },
  {
    title: "Ngày đổi vị",
    image: "/optimized/14.webp",
    text: "Bún bò, hủ tiếu tôm thịt, mì Quảng, phở gà với nước lèo hầm xương thanh ngọt.",
  },
  {
    title: "Menu chay thanh tịnh",
    image: "/optimized/6.webp",
    text: "Đậu hũ kho sả, nấm đùi gà kho tiêu, sườn non chay rim và rau củ xào đủ dinh dưỡng.",
  },
  {
    title: "Đồ uống và tráng miệng",
    image: "/optimized/tm.webp",
    text: "Nước sâm, hạt chia, sữa chua nhà làm và trái cây tươi theo mùa.",
  },
];

const steps = [
  [
    "Tư vấn và chọn khẩu phần",
    "Tiếp nhận số lượng 50-200 phần, ngân sách từ 35.000đ và đặc thù ngành nghề để tư vấn thực đơn phù hợp.",
  ],
  [
    "Gửi menu trải nghiệm và ký hợp đồng",
    "Hỗ trợ suất ăn mẫu, thống nhất menu tuần/tháng, chính sách giao hàng và điều khoản thanh toán.",
  ],
  [
    "Cấp tài khoản và phục vụ hằng ngày",
    "HR/Admin chốt số lượng trên hệ thống trước 15h00 hôm trước. Bếp tiến hành nấu và giao nóng đúng giờ.",
  ],
  [
    "Đối soát và chốt công nợ",
    "Hệ thống xuất bảng kê chi tiết. Khách hàng kiểm tra, Bếp xuất hóa đơn VAT và thanh toán công nợ nhanh gọn.",
  ],
];

const proofPoints = [
  "Freeship theo hợp đồng",
  "Giá từ 35.000đ/phần",
  "Menu tuần rõ ràng",
  "Chốt số lượng trước 15h",
  "Xuất hóa đơn VAT",
  "Theo dõi công nợ online",
];

void proofPoints;

export function MotionLanding({ consulted }: { consulted?: string }) {
  return (
    <main className="bg-offwhite text-slate-900">
      <HeroSection />

      <section id="gioi-thieu" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <Badge tone="coral">Hồ sơ năng lực</Badge>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
              Về Bếp Cô Chủ Nhỏ - nơi khởi nguồn năng lượng cho ngày dài làm việc
            </h2>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-base leading-8 text-slate-600 shadow-sm">
            <p>
              Chúng tôi thấu hiểu rằng một bữa trưa ngon miệng, nóng hổi và đầy đủ dinh dưỡng là chìa khóa để tái tạo năng lượng
              và nâng cao hiệu suất làm việc của cán bộ nhân viên.
            </p>
            <p className="mt-4">
              Công ty TNHH Bếp Cô Chủ Nhỏ là đối tác cung cấp suất ăn cho xí nghiệp, nhà máy và khối văn phòng tại TP.HCM.
              Không chỉ bán một suất cơm, chúng tôi gửi vào đó sự chăm chút từ khâu chọn nguyên liệu đến khi trao tận tay khách hàng.
            </p>
          </div>
        </div>
      </section>

      <section id="dich-vu" className="bg-white py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge tone="teal">Vì sao chọn chúng tôi?</Badge>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">Năng lực phục vụ và giá trị cốt lõi</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-slate-200 bg-offwhite p-5">
                  <Icon className="text-coral" size={26} />
                  <h3 className="mt-4 font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="thuc-don" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="coral">Thực đơn nổi bật</Badge>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">Bữa trưa phong phú, dễ ăn, dễ triển khai</h2>
          </div>
          <ButtonLink href="#menu-tuan" variant="secondary">Xem menu tuần</ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {menuHighlights.map((item) => (
            <div key={item.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="quy-trinh" className="bg-white py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge tone="teal">Quy trình đặt cơm</Badge>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">4 bước đơn giản để bắt đầu cùng Bếp</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(([title, text], index) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-offwhite p-5">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-coral text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lien-he" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 rounded-lg bg-slate-950 p-6 text-white shadow-xl lg:grid-cols-[1fr_420px] lg:p-10">
          <div>
            <Badge tone="coral">Liên hệ tư vấn</Badge>
            <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">Đừng để nhân viên phải lo lắng bữa trưa.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Hãy để Bếp Cô Chủ Nhỏ lo. Liên hệ Zalo/Hotline để nhận báo giá chi tiết và thực đơn tuần mới nhất.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-200">
              <div className="flex gap-2"><MapPin className="shrink-0" size={18} />14/9/5 Lê Thúc Hoạch, Phường Phú Thọ Hòa, Quận Tân Phú, TP.HCM</div>
              <div className="flex gap-2"><Phone className="shrink-0" size={18} />Hotline/Zalo: 0337 998 639</div>
              <div className="flex gap-2"><Building2 className="shrink-0" size={18} />Công ty TNHH Bếp Cô Chủ Nhỏ</div>
              <div className="flex gap-2"><Clock3 className="shrink-0" size={18} />Tiếp nhận đơn: 08:00 - 18:00, từ Thứ 2 đến Thứ 7</div>
              <div className="flex gap-2"><ShieldCheck className="shrink-0" size={18} />Pháp nhân rõ ràng, hỗ trợ hợp đồng, VAT và công nợ.</div>
            </div>
          </div>

          <form action={createConsultationAction} className="grid gap-3 rounded-lg bg-white p-5 text-slate-950">
            {consulted === "1" ? (
              <div className="rounded-md bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700">
                Đã gửi thông tin. Bếp sẽ gọi/Zalo lại cho bạn trong thời gian sớm nhất.
              </div>
            ) : null}
            {consulted === "invalid" ? (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                Vui lòng nhập đủ tên công ty, số lượng dự kiến và số điện thoại.
              </div>
            ) : null}
            <label className="grid gap-2 text-sm font-semibold">
              Tên công ty
              <input name="companyName" className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-teal-400" placeholder="Công ty ABC" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Số lượng dự kiến
              <input name="expectedQuantity" className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-teal-400" placeholder="80 phần/ngày" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Số điện thoại
              <input name="phone" className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-teal-400" placeholder="0337 998 639" required />
            </label>
            <button
              type="submit"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-coral px-4 text-sm font-bold text-white hover:bg-coral-dark"
            >
              Nhận tư vấn ngay
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
