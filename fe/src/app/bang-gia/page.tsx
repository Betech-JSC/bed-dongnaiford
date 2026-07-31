import type { Metadata } from "next";
import { vehiclesAPI } from "@/lib/api";
import PriceListClient from "./PriceListClient";

export const metadata: Metadata = {
  title: "Bảng giá xe Ford 2026 | Đồng Nai Ford — Giá niêm yết chính hãng",
  description:
    "Bảng giá xe Ford 2026 mới nhất tại Đồng Nai Ford. Giá niêm yết chính hãng Ford Everest, Ranger, Territory, Transit, Tourneo. Liên hệ Hotline 0918 90 90 60 để nhận ưu đãi tốt nhất.",
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
  let initialVehicles: any[] = [];

  try {
    const res = await vehiclesAPI.getAll({ with_versions: 1 });
    if (res && (res as any).success && Array.isArray((res as any).data)) {
      initialVehicles = (res as any).data;
    }
  } catch (error) {
    console.error("Error pre-fetching vehicles for price list SSR:", error);
  }

  return <PriceListClient initialVehicles={initialVehicles} />;
}
