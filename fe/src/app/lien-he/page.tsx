import type { Metadata } from "next";
import LienHeClient from "./LienHeClient";

export const metadata: Metadata = {
  title: "Liên Hệ | Đồng Nai Ford — Đại Lý Ủy Quyền Chính Thức",
  description:
    "Liên hệ Đồng Nai Ford. Địa chỉ: B04, Khu Thương Mại Amata, Phường Long Bình, TP. Biên Hòa, Tỉnh Đồng Nai. Hotline Bán hàng: 0918 90 90 60 — Cứu hộ 24/7: 1800 55 68 58.",
  keywords: [
    "Liên hệ Đồng Nai Ford",
    "địa chỉ Đồng Nai Ford",
    "hotline Ford Đồng Nai",
    "cứu hộ Ford Đồng Nai",
    "Ford Amata Biên Hòa",
  ],
  alternates: {
    canonical: "/lien-he",
  },
  openGraph: {
    title: "Liên Hệ Đồng Nai Ford | Hotline: 0918 90 90 60",
    description:
      "Đại lý ủy quyền chính thức của Ford Việt Nam tại Đồng Nai. Hỗ trợ tư vấn mua xe, báo giá dịch vụ, đặt hẹn bảo dưỡng, cứu hộ 24/7.",
    url: "https://dongnaiford.com.vn/lien-he",
    type: "website",
  },
};

export default function LienHePage() {
  return <LienHeClient />;
}
