import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MainLayoutStructure from "@/components/layout/MainLayoutStructure";
import { settingsAPI, vehiclesAPI, servicesAPI, accessoriesAPI, usedVehiclesAPI } from "@/lib/api";
import { SharedDataProvider, type SharedData } from "@/lib/shared-data";
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
    images: [
      {
        url: "/showroom_bg.jpg",
        width: 1200,
        height: 630,
        alt: "Showroom Đồng Nai Ford — Đại lý ủy quyền Ford Việt Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đồng Nai Ford | Đại lý xe Ford chính hãng lớn nhất Đồng Nai",
    description: "Đại lý ủy quyền chính thức của Ford Việt Nam tại Đồng Nai. Cung cấp các dòng xe Ford Everest, Ranger, Territory, Raptor chính hãng giá ưu đãi.",
    images: ["/showroom_bg.jpg"],
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
  let injectHead = "";
  let injectBodyStart = "";
  let injectBodyEnd = "";

  try {
    const settingsRes = await settingsAPI.getGeneral().catch(() => null);
    if (settingsRes && settingsRes.success && settingsRes.data) {
      injectHead = settingsRes.data.inject_head || "";
      injectBodyStart = settingsRes.data.inject_body_start || "";
      injectBodyEnd = settingsRes.data.inject_body_end || "";
    }
  } catch (error) {
    console.warn("Failed to fetch general layout settings:", error);
  }

  // Pre-fetch shared data cho Navbar + Footer (triệt tiêu 7 API calls trùng lắp phía client)
  let sharedData: SharedData = {
    categories: [],
    vehicles: [],
    services: [],
    accessories: [],
    usedVehicles: [],
    systemNotification: null,
  };

  try {
    const [catsRes, vehsRes, svcsRes, accsRes, usedRes] = await Promise.all([
      vehiclesAPI.getCategories().catch(() => null),
      vehiclesAPI.getAll().catch(() => null),
      servicesAPI.getAll().catch(() => null),
      accessoriesAPI.getAll({ limit: 6 }).catch(() => null),
      usedVehiclesAPI.getAll({ limit: 3 }).catch(() => null),
    ]);

    sharedData = {
      categories: (catsRes as any)?.data || catsRes || [],
      vehicles: (vehsRes as any)?.data || vehsRes || [],
      services: (svcsRes as any)?.services || (svcsRes as any)?.data || svcsRes || [],
      accessories: (accsRes as any)?.data || accsRes || [],
      usedVehicles: (usedRes as any)?.data || usedRes || [],
    };
    // Ensure arrays
    if (!Array.isArray(sharedData.categories)) sharedData.categories = [];
    if (!Array.isArray(sharedData.vehicles)) sharedData.vehicles = [];
    if (!Array.isArray(sharedData.services)) sharedData.services = [];
    if (!Array.isArray(sharedData.accessories)) sharedData.accessories = [];
    if (!Array.isArray(sharedData.usedVehicles)) sharedData.usedVehicles = [];
  } catch (error) {
    console.warn("Failed to pre-fetch shared layout data:", error);
  }

  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/fonts/FordAntenna-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/FordAntenna-Bold.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cms.dongnaiford.com.vn" />
        <link rel="dns-prefetch" href="https://cms.dongnaiford.com.vn" />
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics: Managed via CMS inject_head (Settings > General > Head Scripts).
            DO NOT add GA here — it will cause double-counting of pageviews/events. */}
        {/* Dynamic Head Inject Code from CMS */}
        {injectHead && (
          <script
            id="cms-head-inject"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const runInject = function() {
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
                  };
                  if ('requestIdleCallback' in window) {
                    requestIdleCallback(runInject, { timeout: 3000 });
                  } else {
                    setTimeout(runInject, 1000);
                  }
                })();
              `
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-light text-dark font-sans" suppressHydrationWarning>
        <SharedDataProvider data={sharedData}>
          {/* Dynamic Body Start Inject Code from CMS */}
          {injectBodyStart && (
            <div
              id="cms-body-start-inject"
              style={{ display: 'none' }}
              dangerouslySetInnerHTML={{ __html: injectBodyStart }}
            />
          )}
          <Suspense fallback={null}>
            <PageTransitionLoader />
          </Suspense>
          <MainLayoutStructure>{children}</MainLayoutStructure>
          {/* Dynamic Body End Inject Code from CMS */}
          {injectBodyEnd && (
            <div
              id="cms-body-end-inject"
              style={{ display: 'none' }}
              dangerouslySetInnerHTML={{ __html: injectBodyEnd }}
            />
          )}
        </SharedDataProvider>
      </body>
    </html>
  );
}
