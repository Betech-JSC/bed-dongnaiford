import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIChatWidget from "@/components/shared/AIChatWidget";
import CompareDrawer from "@/components/shared/CompareDrawer";
import PageTransitionLoader from "@/components/shared/PageTransitionLoader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dongnaiford.com.vn"),
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Ford Đồng Nai (Đại lý Tấn Phát Đạt)",
  alternateName: "Đồng Nai Ford",
  description:
    "Đại lý ủy quyền chính thức của Ford Việt Nam tại Đồng Nai. Cung cấp các dòng xe Ford chính hãng, dịch vụ bảo dưỡng, sửa chữa, phụ kiện.",
  url: "https://dongnaiford.com.vn",
  telephone: "+84918909060",
  email: "marketing@dongnaiford.com.vn",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình",
    addressLocality: "Biên Hòa",
    addressRegion: "Đồng Nai",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.9511,
    longitude: 106.8434,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "07:30",
    closes: "17:30",
  },
  brand: {
    "@type": "Brand",
    name: "Ford",
  },
  sameAs: [
    "https://www.facebook.com/FordDongNai.Official",
    "https://www.tiktok.com/@dongnaiford.official",
    "https://youtube.com/@dongnaiford",
  ],
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
      suppressHydrationWarning
    >
      <head>
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-light text-dark font-sans" suppressHydrationWarning>
        <Navbar />
        <Suspense fallback={null}>
          <PageTransitionLoader />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <AIChatWidget />
        <CompareDrawer />
      </body>
    </html>
  );
}
