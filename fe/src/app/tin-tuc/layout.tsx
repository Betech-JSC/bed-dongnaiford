import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức & Ưu đãi | Đồng Nai Ford — Cập nhật mới nhất",
  description:
    "Cập nhật tin tức mới nhất về xe Ford, chương trình khuyến mãi, ưu đãi trả góp, sự kiện và hoạt động tại Đồng Nai Ford.",
  alternates: {
    canonical: "/tin-tuc",
  },
  openGraph: {
    title: "Tin tức & Ưu đãi | Đồng Nai Ford",
    description:
      "Cập nhật tin tức mới nhất về xe Ford, chương trình khuyến mãi, ưu đãi trả góp tại Đồng Nai Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function TinTucLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
