import type { Metadata } from "next";
import { postsAPI } from "@/lib/api";
import NewsListClient from "./NewsListClient";

export const metadata: Metadata = {
  title: "Tin tức & Ưu đãi xe Ford | Đồng Nai Ford",
  description:
    "Cập nhật tin tức mới nhất về xe Ford, khuyến mãi, ưu đãi đặc biệt, sự kiện lái thử và thông tin ngành ô tô tại Đồng Nai Ford.",
  keywords: [
    "tin tức Ford",
    "khuyến mãi Ford Đồng Nai",
    "ưu đãi xe Ford",
    "Ford Everest khuyến mãi",
    "Ford Ranger giảm giá",
    "sự kiện Ford",
  ],
  alternates: {
    canonical: "/tin-tuc",
  },
  openGraph: {
    title: "Tin tức & Ưu đãi xe Ford | Đồng Nai Ford",
    description:
      "Cập nhật tin tức mới nhất, khuyến mãi đặc biệt và sự kiện Ford tại Đồng Nai Ford.",
    type: "website",
    locale: "vi_VN",
  },
};

/**
 * Tin tức — Server Component (SSR)
 *
 * Initial page of posts + categories + top_posts are fetched server-side
 * so Googlebot sees article titles, descriptions, and images in the HTML.
 */
export default async function NewsListPage() {
  let initialCategories: any[] = [];
  let initialPosts: any[] = [];
  let initialTopPosts: any[] = [];
  let initialTotalPages = 1;

  try {
    const res: any = await postsAPI.getAll({ page: "1" });
    if (res) {
      if (res.categories) {
        initialCategories = res.categories;
      }
      if (res.top_posts) {
        initialTopPosts = res.top_posts;
      }
      if (res.posts) {
        initialPosts = res.posts.data || [];
        initialTotalPages = res.posts.last_page || 1;
      }
    }
  } catch (error) {
    console.error("Error pre-fetching news list for SSR:", error);
  }

  return (
    <NewsListClient
      initialCategories={initialCategories}
      initialPosts={initialPosts}
      initialTopPosts={initialTopPosts}
      initialTotalPages={initialTotalPages}
    />
  );
}
