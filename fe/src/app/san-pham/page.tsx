import type { Metadata } from "next";
import { vehiclesAPI } from "@/lib/api";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Các dòng xe Ford | Đồng Nai Ford — SUV, Bán tải, Thương mại",
  description:
    "Khám phá tất cả các dòng xe Ford chính hãng tại Đồng Nai Ford. Ford Everest, Ranger, Territory, Transit, Tourneo — đầy đủ thông số, hình ảnh và giá bán.",
  keywords: [
    "dòng xe Ford",
    "xe Ford Đồng Nai",
    "Ford Everest",
    "Ford Ranger",
    "Ford Territory",
    "Ford Transit",
    "Ford Tourneo",
    "SUV Ford",
    "bán tải Ford",
  ],
  alternates: {
    canonical: "/san-pham",
  },
  openGraph: {
    title: "Các dòng xe Ford | Đồng Nai Ford",
    description:
      "Khám phá tất cả các dòng xe Ford chính hãng tại Đồng Nai Ford — SUV, Bán tải, Thương mại.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Sản phẩm — Server Component (SSR)
 *
 * Vehicle data + categories are fetched server-side so Google sees
 * the full product catalog in the initial HTML (critical for category pages).
 */
export default async function ProductsPage() {
  let initialVehicles: any[] = [];
  let initialCategories: any[] = [];

  try {
    const [vehiclesData, categoriesData] = await Promise.all([
      vehiclesAPI.getAll({ with_versions: true }).catch(() => null),
      vehiclesAPI.getCategories().catch(() => null),
    ]);

    const vItems = (vehiclesData as any)?.data || vehiclesData;
    if (Array.isArray(vItems) && vItems.length > 0) {
      initialVehicles = vItems;
    }

    const cItems = (categoriesData as any)?.data || categoriesData;
    if (Array.isArray(cItems) && cItems.length > 0) {
      initialCategories = cItems;
    }
  } catch (error) {
    console.error("Error pre-fetching products for SSR:", error);
  }

  return (
    <ProductsClient
      initialVehicles={initialVehicles}
      initialCategories={initialCategories}
    />
  );
}
