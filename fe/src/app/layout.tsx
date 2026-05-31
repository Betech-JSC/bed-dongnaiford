import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Đồng Nai Ford | Đại lý xe Ford chính hãng lớn nhất Đồng Nai",
  description: "Đại lý ủy quyền chính thức của Ford Việt Nam tại Đồng Nai. Cung cấp các dòng xe Ford Everest, Ford Ranger, Ford Territory chính hãng, bảo dưỡng nhanh, hỗ trợ trả góp 80%.",
  keywords: ["Ford Đồng Nai", "Đồng Nai Ford", "đại lý Ford Đồng Nai", "mua xe Ford Đồng Nai", "Ford Everest", "Ford Ranger", "Ford Territory"],
  authors: [{ name: "Đồng Nai Ford" }],
  openGraph: {
    title: "Đồng Nai Ford | Đại lý xe Ford chính hãng lớn nhất Đồng Nai",
    description: "Đại lý ủy quyền chính thức của Ford Việt Nam tại Đồng Nai. Cung cấp các dòng xe Ford Everest, Ranger, Territory, Raptor chính hãng giá ưu đãi.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-light text-dark font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
