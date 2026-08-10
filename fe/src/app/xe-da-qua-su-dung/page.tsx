import type { Metadata } from "next";
import XeDaQuaSuDungClient from "./XeDaQuaSuDungClient";

export const metadata: Metadata = {
  title: "Dịch Vụ Xe Đã Qua Sử Dụng | Mua Bán Xe Ford Cũ Chính Hãng",
  description:
    "Trung tâm mua bán xe Ford đã qua sử dụng chính hãng tại Đồng Nai Ford. Xe được kiểm tra 167 điểm kỹ thuật, bảo hành chính hãng, nguồn gốc rõ ràng, thu mua xe cũ giá cao.",
  keywords: [
    "xe Ford đã qua sử dụng",
    "mua xe Ford cũ Đồng Nai",
    "Ford Assured Đồng Nai",
    "xe Ford lướt chính hãng",
    "thu mua xe Ford cũ",
  ],
  alternates: {
    canonical: "/xe-da-qua-su-dung",
  },
  openGraph: {
    title: "Dịch Vụ Xe Đã Qua Sử Dụng Chính Hãng | Đồng Nai Ford",
    description:
      "Xe Ford cũ đã qua sử dụng được kiểm định 167 điểm, hỗ trợ trả góp, bảo hành chính hãng.",
    url: "https://dongnaiford.com.vn/xe-da-qua-su-dung",
    type: "website",
  },
};

export default function XeDaQuaSuDungPage() {
  return <XeDaQuaSuDungClient />;
}
