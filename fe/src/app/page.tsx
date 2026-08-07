import type { Metadata } from "next";
import { bannersAPI, vehiclesAPI, servicesAPI, customerHandoversAPI, postsAPI } from "@/lib/api";
import HomeClient from "./HomeClient";

export const revalidate = 120; // ISR: Trang Chủ revalidate 2 phút

export const metadata: Metadata = {
  title: "Đồng Nai Ford | Đại Lý 3S Chính Thức Tại Đồng Nai",
  description:
    "Đại lý 3S chính thức của Ford Việt Nam tại Đồng Nai. Mua xe Ford Everest, Ranger, Territory, Transit giá ưu đãi tốt nhất, bảo dưỡng chính hãng 3S, tư vấn trả góp 80%.",
  keywords: [
    "Đồng Nai Ford",
    "đại lý Ford Đồng Nai",
    "Ford Everest Đồng Nai",
    "Ford Ranger Đồng Nai",
    "Ford Territory Đồng Nai",
    "giá xe Ford Đồng Nai",
    "bảo dưỡng Ford Đồng Nai",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Đồng Nai Ford | Đại Lý 3S Chính Thức Tại Đồng Nai",
    description:
      "Đại lý ủy quyền chính thức 3S của Ford Việt Nam. Phân phối xe Ford chính hãng, dịch vụ bảo hành bảo dưỡng, phụ tùng chính hãng.",
    siteName: "Đồng Nai Ford",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Trang Chủ — Server Component (SSR)
 *
 * Pre-fetches Banners, Categories, Vehicles, Services, Handovers, and Promotion Articles
 * server-side so Googlebot receives 100% complete HTML on initial request.
 */
export default async function HomePage() {
  let initialBanners: any[] = [];
  let initialCategories: any[] = [];
  let initialVehicles: any[] = [];
  let initialServices: any[] = [];
  let initialHandovers: any[] = [];
  let initialArticles: any[] = [];

  try {
    const [bannersRes, categoriesRes, vehiclesRes, servicesRes, handoversRes, postsRes] = await Promise.all([
      bannersAPI.getAll().catch(() => null),
      vehiclesAPI.getCategories().catch(() => null),
      vehiclesAPI.getAll().catch(() => null),
      servicesAPI.getAll().catch(() => null),
      customerHandoversAPI.getAll().catch(() => null),
      postsAPI.getAll({ categories: 3 }).catch(() => null), // Category 3: Khuyến Mãi
    ]);

    const bannersItems = (bannersRes as any)?.data || bannersRes;
    if (Array.isArray(bannersItems)) initialBanners = bannersItems;

    const categoriesItems = (categoriesRes as any)?.data || categoriesRes;
    if (Array.isArray(categoriesItems)) initialCategories = categoriesItems;

    const vehiclesItems = (vehiclesRes as any)?.data || vehiclesRes;
    if (Array.isArray(vehiclesItems)) initialVehicles = vehiclesItems;

    const servicesItems = (servicesRes as any)?.services || (servicesRes as any)?.data || servicesRes;
    if (Array.isArray(servicesItems)) initialServices = servicesItems;

    const handoversItems = (handoversRes as any)?.data || handoversRes;
    if (Array.isArray(handoversItems)) initialHandovers = handoversItems;

    const postsItems = (postsRes as any)?.posts?.data || (postsRes as any)?.data || postsRes;
    if (Array.isArray(postsItems)) initialArticles = postsItems;
  } catch (error) {
    console.error("Error pre-fetching homepage data for SSR:", error);
  }

  // Schema.org AutoDealer structured data for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "Đồng Nai Ford",
    "image": "https://dongnaiford.com.vn/logo.png",
    "@id": "https://dongnaiford.com.vn/#dealer",
    "url": "https://dongnaiford.com.vn",
    "telephone": "0918 90 90 60",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "B04, Khu Phố 3, Phường Hòa Bình",
      "addressLocality": "Biên Hòa",
      "addressRegion": "Đồng Nai",
      "postalCode": "810000",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.957,
      "longitude": 106.843
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "07:30",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "08:00",
        "closes": "12:00"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        initialBanners={initialBanners}
        initialCategories={initialCategories}
        initialVehicles={initialVehicles}
        initialServices={initialServices}
        initialHandovers={initialHandovers}
        initialArticles={initialArticles}
      />
    </>
  );
}
