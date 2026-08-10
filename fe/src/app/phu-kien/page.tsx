import type { Metadata } from "next";
import PhuKienClient from "./PhuKienClient";

export const metadata: Metadata = {
  title: "Phụ Kiện Chính Hãng Ford | Đồng Nai Ford",
  description:
    "Cung cấp phụ kiện & đồ chơi xe Ford chính hãng: nắp thùng bán tải, phim cách nhiệt 3M, màn hình Android, camera hành trình, phủ ceramic tại Đồng Nai Ford.",
  keywords: [
    "phụ kiện Ford chính hãng",
    "đồ chơi xe Ford Đồng Nai",
    "nắp thùng Ford Ranger",
    "phim cách nhiệt xe Ford",
    "màn hình Android xe Ford",
  ],
  alternates: {
    canonical: "/phu-kien",
  },
  openGraph: {
    title: "Phụ Kiện & Đồ Chơi Xe Ford Chính Hãng | Đồng Nai Ford",
    description:
      "Danh mục phụ kiện xe Ford Ranger, Everest, Territory chính hãng giá tốt, bảo hành chính hãng.",
    url: "https://dongnaiford.com.vn/phu-kien",
    type: "website",
  },
};

export default function PhuKienPage() {
  return <PhuKienClient />;
}
