import type { Metadata } from "next";
import { vehiclesAPI } from "@/lib/api";
import { vehicles as staticVehicles } from "@/data/vehicles";
import { processVehiclesFromCMS } from "@/lib/vehicle-helpers";
import PriceListClient from "./PriceListClient";

export const revalidate = 60; // Revalidate every 60 seconds (ISG / SSR)

export const metadata: Metadata = {
  title: "Bảng giá xe Ford 2026 | Đồng Nai Ford — Giá niêm yết chính hãng",
  description:
    "Bảng giá xe Ford 2026 mới nhất tại Đồng Nai Ford. Giá niêm yết chính hãng Ford Everest, Ranger, Territory, Transit, Tourneo, Mustang Mach-E. Liên hệ Hotline 0918 90 90 60 để nhận ưu đãi tốt nhất.",
  keywords: [
    "bảng giá xe Ford 2026",
    "giá xe Ford Đồng Nai",
    "giá Ford Everest",
    "giá Ford Ranger",
    "giá Ford Territory",
    "giá Ford Transit",
    "giá Ford Tourneo",
  ],
  alternates: {
    canonical: "/bang-gia",
  },
  openGraph: {
    title: "Bảng giá xe Ford 2026 | Đồng Nai Ford",
    description:
      "Giá niêm yết chính hãng Ford Everest, Ranger, Territory, Transit, Tourneo tại Đồng Nai Ford. Cập nhật mới nhất 2026.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Bảng giá xe Ford — Server Component (SSR)
 *
 * Vehicle data is fetched server-side so Google sees the full price table
 * in the initial HTML response (critical for "bảng giá Ford" keywords).
 */
export default async function PriceListPage() {
  let rawVehicles: any[] = [];

  try {
    const res = await vehiclesAPI.getAll({ with_versions: 1 });
    if (res && (res as any).success && Array.isArray((res as any).data) && (res as any).data.length > 0) {
      rawVehicles = (res as any).data;
    }
  } catch (error) {
    console.error("Error pre-fetching vehicles for price list SSR:", error);
  }

  // Fallback to static vehicles if API is empty or unreachable on server
  if (!rawVehicles || rawVehicles.length === 0) {
    rawVehicles = staticVehicles;
  }

  const processedVehicles = processVehiclesFromCMS(rawVehicles);

  // Schema.org ItemList + Product + Offer JSON-LD for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Bảng giá xe Ford 2026 chính hãng - Đồng Nai Ford",
    "description": "Bảng giá niêm yết các dòng xe Ford Everest, Ranger, Territory, Transit, Mustang Mach-E mới nhất 2026 tại Đồng Nai Ford.",
    "itemListElement": processedVehicles.flatMap((vehicle, vIdx) =>
      vehicle.versions.map((ver: any, verIdx: number) => ({
        "@type": "ListItem",
        "position": vIdx * 10 + verIdx + 1,
        "item": {
          "@type": "Product",
          "name": `${vehicle.name} ${ver.name}`,
          "image": vehicle.image_url,
          "offers": {
            "@type": "Offer",
            "price": ver.price,
            "priceCurrency": "VND",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "AutoDealer",
              "name": "Đồng Nai Ford"
            }
          }
        }
      }))
    )
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PriceListClient initialVehicles={processedVehicles} />
    </>
  );
}
