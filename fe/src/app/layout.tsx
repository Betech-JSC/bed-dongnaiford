import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { settingsAPI } from "@/lib/api";
import AIChatWidget from "@/components/shared/AIChatWidget";
import CompareDrawer from "@/components/shared/CompareDrawer";
import QuickAccessToolbar from "@/components/shared/QuickAccessToolbar";
import PageTransitionLoader from "@/components/shared/PageTransitionLoader";
import CookieConsent from "@/components/shared/CookieConsent";
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
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLdp = pathname.startsWith("/ldp/");

  let injectHead = "";
  let injectBodyStart = "";
  let injectBodyEnd = "";

  try {
    const settingsRes = await settingsAPI.getGeneral();
    if (settingsRes && settingsRes.success && settingsRes.data) {
      injectHead = settingsRes.data.inject_head || "";
      injectBodyStart = settingsRes.data.inject_body_start || "";
      injectBodyEnd = settingsRes.data.inject_body_end || "";
    }
  } catch (error) {
    console.error("Failed to fetch general layout settings:", error);
  }

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
        {/* Google Analytics (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QLXYRG7WSJ"
        />
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QLXYRG7WSJ');
            `
          }}
        />
        {/* Dynamic Head Inject Code from CMS */}
        {injectHead && (
          <script
            id="cms-head-inject"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const temp = document.createElement('div');
                  temp.innerHTML = \`${injectHead
                    .replace(/\\/g, '\\\\')
                    .replace(/`/g, '\\`')
                    .replace(/\$/g, '\\$')
                    .replace(/<\/script>/gi, '<\\/script>')}\`;
                  Array.from(temp.childNodes).forEach(node => {
                    if (node.tagName === 'SCRIPT') {
                      const script = document.createElement('script');
                      Array.from(node.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
                      script.innerHTML = node.innerHTML;
                      document.head.appendChild(script);
                    } else {
                      document.head.appendChild(node.cloneNode(true));
                    }
                  });
                })();
              `
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-light text-dark font-sans" suppressHydrationWarning>
        {/* Dynamic Body Start Inject Code from CMS */}
        {injectBodyStart && (
          <div
            id="cms-body-start-inject"
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: injectBodyStart }}
          />
        )}
        {isLdp ? (
          <header className="bg-white border-b border-gray-150 py-3 select-none">
            <div className="max-w-[1152px] mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-[5.2px]">
                <div className="h-[32px] w-[85.3px] relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/ford_logo.svg" 
                    alt="Ford Oval Logo" 
                    className="block size-full object-contain"
                  />
                </div>
                <span className="font-['Ford_Antenna',sans-serif] font-bold text-[#00095b] text-[13px] tracking-tight leading-none uppercase">
                  DONG NAI FORD
                </span>
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">
                Đại lý ủy quyền chính thức
              </span>
            </div>
          </header>
        ) : (
          <Navbar />
        )}
        <Suspense fallback={null}>
          <PageTransitionLoader />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        {isLdp ? (
          <footer className="bg-slate-900 text-gray-400 py-6 border-t border-slate-800 font-sans text-xs select-none">
            <div className="max-w-[1152px] mx-auto px-4 text-center">
              <p className="font-bold text-white mb-2">ĐỒNG NAI FORD - ĐẠI LÝ ỦY QUYỀN CHÍNH THỨC CỦA FORD VIỆT NAM</p>
              <p className="text-gray-500">B04, Khu Thương Mại Amata, Phường Long Bình, TP. Biên Hòa, Tỉnh Đồng Nai</p>
              <p className="mt-4 text-[11px] text-gray-500">© 2026 Dong Nai Ford. Bảo lưu mọi quyền.</p>
            </div>
          </footer>
        ) : (
          <Footer />
        )}
        {!isLdp && <AIChatWidget />}
        {!isLdp && <CompareDrawer />}
        {!isLdp && <QuickAccessToolbar />}
        <CookieConsent />
        {/* Dynamic Body End Inject Code from CMS */}
        {injectBodyEnd && (
          <div
            id="cms-body-end-inject"
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: injectBodyEnd }}
          />
        )}
      </body>
    </html>
  );
}
