import type { MetadataRoute } from "next";
import { vehicles } from "@/data/vehicles";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dongnaiford.com.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/gioi-thieu`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/san-pham`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/bang-gia`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/lien-he`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tin-tuc`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/thu-vien-media`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/tuyen-dung`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/phu-kien`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Services
    {
      url: `${BASE_URL}/dich-vu/cham-soc-khach-hang`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/dich-vu/bao-duong-nhanh`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/dich-vu/bao-duong-dinh-ky`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/dich-vu/giao-nhan-xe-tan-noi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Tools
    {
      url: `${BASE_URL}/cong-cu/uoc-tinh-lan-banh`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cong-cu/uoc-tinh-tra-gop`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cong-cu/so-sanh-xe`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Legal
    {
      url: `${BASE_URL}/dieu-khoan-su-dung`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/chinh-sach-bao-mat`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic vehicle product pages from static data
  const vehiclePages: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: `${BASE_URL}/san-pham/${vehicle.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Attempt to fetch dynamic posts/news from API
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const res = await fetch(`${apiUrl}/posts`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // revalidate every hour
    });
    if (res.ok) {
      const data = await res.json();
      const posts = data?.data || data?.posts || data;
      if (Array.isArray(posts)) {
        postPages = posts.map((post: any) => ({
          url: `${BASE_URL}/tin-tuc/${post.slug || post.id}`,
          lastModified: post.updated_at || now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }));
      }
    }
  } catch {
    // Silently fail — posts will not be included in sitemap
  }

  // Attempt to fetch job listings
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const res = await fetch(`${apiUrl}/jobs`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const jobs = data?.jobs || data?.data || data;
      if (Array.isArray(jobs)) {
        jobPages = jobs.map((job: any) => ({
          url: `${BASE_URL}/tuyen-dung/${job.slug || job.id}`,
          lastModified: job.updated_at || now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }));
      }
    }
  } catch {
    // Silently fail
  }

  return [...staticPages, ...vehiclePages, ...postPages, ...jobPages];
}
