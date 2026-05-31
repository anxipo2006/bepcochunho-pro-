import type { Metadata } from "next";
import { Be_Vietnam_Pro, Roboto_Mono } from "next/font/google";
import "./globals.css";

export const preferredRegion = "sin1";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Bếp Cô Chủ Nhỏ",
  description: "Giải pháp suất ăn doanh nghiệp tận tâm và chuyên nghiệp tại TP.HCM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${robotoMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
