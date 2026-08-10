import type { Metadata } from "next";
import TuyenDungClient from "./TuyenDungClient";

export const metadata: Metadata = {
  title: "Tuyển Dụng | Cơ Hội Việc Làm Tại Đồng Nai Ford",
  description:
    "Gia nhập đội ngũ Đồng Nai Ford — Đại lý 3S ủy quyền chính thức của Ford Việt Nam. Tìm kiếm cơ hội nghề nghiệp hấp dẫn với thu nhập cạnh tranh và môi trường chuyên nghiệp.",
  keywords: [
    "Tuyển dụng Đồng Nai Ford",
    "việc làm Ford Đồng Nai",
    "tuyển tư vấn bán hàng Ford",
    "tuyển kỹ thuật viên Ford",
    "tuyển dụng Biên Hòa",
  ],
  alternates: {
    canonical: "/tuyen-dung",
  },
  openGraph: {
    title: "Tuyển Dụng Đồng Nai Ford | Cơ Hội Phát Triển Sự Nghiệp",
    description:
      "Tuyển dụng nhân sự các vị trí Bán hàng, Kỹ thuật dịch vụ, Chăm sóc khách hàng tại Đồng Nai Ford.",
    url: "https://dongnaiford.com.vn/tuyen-dung",
    type: "website",
  },
};

export default function TuyenDungPage() {
  return <TuyenDungClient />;
}
