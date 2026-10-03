import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AUTH_URL || "http://localhost:3000"),
  title: {
    default: "Cơm Văn Phòng Mến | Bữa trưa trao điều lành",
    template: "%s | Cơm Văn Phòng Mến",
  },
  description: "Cơm Văn Phòng Mến chuẩn bị bữa trưa nóng sốt, đủ đầy và giao tận nơi cho văn phòng, doanh nghiệp tại TP.HCM.",
  applicationName: "Cơm Văn Phòng Mến",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Cơm Văn Phòng Mến",
    title: "Cơm Văn Phòng Mến | Bữa trưa trao điều lành",
    description: "Bữa trưa nóng sốt, đủ đầy và giao tận nơi cho văn phòng, doanh nghiệp tại TP.HCM.",
  },
  icons: { icon: "/men-logo-mark.png", apple: "/men-logo-mark.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${notoSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
