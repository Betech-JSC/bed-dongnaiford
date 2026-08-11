import type { Metadata } from "next";
import { jobsAPI, settingsAPI } from "@/lib/api";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "Giới thiệu Đồng Nai Ford | Đại lý ủy quyền chính thức Ford Việt Nam",
  description:
    "Đồng Nai Ford (Công ty TNHH Dịch vụ – Thương mại Tấn Phát Đạt) — Đại lý ủy quyền chính thức đạt tiêu chuẩn 3S toàn cầu của Ford Việt Nam tại Biên Hòa, Đồng Nai. Hơn 18 năm phục vụ khách hàng.",
  keywords: [
    "Đồng Nai Ford",
    "giới thiệu Đồng Nai Ford",
    "đại lý Ford Đồng Nai",
    "Ford Biên Hòa",
    "Tấn Phát Đạt",
    "tuyển dụng Ford Đồng Nai",
  ],
  alternates: {
    canonical: "/gioi-thieu",
  },
  openGraph: {
    title: "Giới thiệu Đồng Nai Ford | Đại lý ủy quyền Ford Việt Nam",
    description:
      "Hơn 18 năm phục vụ — Đồng Nai Ford tự hào là đại lý ủy quyền Ford 3S tại Biên Hòa, Đồng Nai.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Giới thiệu — Server Component (SSR)
 */
export default async function AboutPage() {
  let initialJobs: any[] = [];
  let teamImages: any[] = [];

  try {
    const res = await jobsAPI.getAll() as any;
    const items = res?.jobs || res?.data || res;
    if (Array.isArray(items) && items.length > 0) {
      initialJobs = items;
    }
  } catch (error) {
    console.error("Error pre-fetching jobs for About page SSR:", error);
  }

  try {
    const settingsRes = await settingsAPI.getGeneral() as any;
    if (settingsRes?.data?.about_team_images && Array.isArray(settingsRes.data.about_team_images) && settingsRes.data.about_team_images.length > 0) {
      teamImages = settingsRes.data.about_team_images;
    }
  } catch (error) {
    console.error("Error pre-fetching team images for About page SSR:", error);
  }

  return <AboutClient initialJobs={initialJobs} teamImages={teamImages} />;
}
