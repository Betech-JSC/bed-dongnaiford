import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dongnaiford.com.vn";
  const isProduction = siteUrl.includes("dongnaiford.com.vn");

  if (isProduction) {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/api/",          // Backend API endpoints
            "/test-api/",     // Test API page
            "/ldp/",          // Sales landing pages (ads-only)
            "/khao-sat-*",    // Survey pages
            "/tim-kiem",      // Search results page (thin content)
          ],
        },
        // Block AI training crawlers (keeps search + citation access)
        { userAgent: "GPTBot", disallow: "/" },
        { userAgent: "Google-Extended", disallow: "/" },
        { userAgent: "Bytespider", disallow: "/" },
        { userAgent: "CCBot", disallow: "/" },
      ],
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }

  // Staging/Test: Block all except Screaming Frog
  return {
    rules: [
      {
        userAgent: "Screaming Frog SEO Spider",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
