import type { MetadataRoute } from "next";

// Trigger rebuild to clear sitemap cache and load correct URLs
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cms.dongnaiford.com.vn/api";
  const siteUrl = "https://dongnaiford.com.vn";

  // ===== STATIC PAGES (always included) =====
  // Use fixed dates instead of new Date() to avoid false freshness signals
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date("2026-07-31"), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/gioi-thieu`, lastModified: new Date("2026-07-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/lien-he`, lastModified: new Date("2026-07-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/bang-gia`, lastModified: new Date("2026-07-31"), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/dang-ky-lai-thu`, lastModified: new Date("2026-07-15"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/xe-da-qua-su-dung`, lastModified: new Date("2026-07-31"), changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/dich-vu`, lastModified: new Date("2026-07-20"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/dich-vu/bao-duong-nhanh`, lastModified: new Date("2026-07-20"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/dich-vu/bao-duong-dinh-ky`, lastModified: new Date("2026-07-20"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/dich-vu/cham-soc-khach-hang`, lastModified: new Date("2026-07-20"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/dich-vu/giao-nhan-xe-tan-noi`, lastModified: new Date("2026-07-20"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/san-pham`, lastModified: new Date("2026-07-31"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/khuyen-mai`, lastModified: new Date("2026-07-31"), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/tin-tuc`, lastModified: new Date("2026-07-31"), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/thu-vien-media`, lastModified: new Date("2026-07-15"), changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/tuyen-dung`, lastModified: new Date("2026-07-15"), changeFrequency: "weekly", priority: 0.5 },
    { url: `${siteUrl}/cong-cu/uoc-tinh-lan-banh`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/cong-cu/uoc-tinh-tra-gop`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/cong-cu/so-sanh-xe`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/chinh-sach`, lastModified: new Date("2026-01-01"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/chinh-sach-bao-mat`, lastModified: new Date("2026-01-01"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/dieu-khoan-su-dung`, lastModified: new Date("2026-01-01"), changeFrequency: "yearly", priority: 0.3 },
  ];

  // ===== DYNAMIC DATA FROM API =====
  let apiUrls: MetadataRoute.Sitemap = [];
  
  try {
    const res = await fetch(`${apiUrl}/sitemap`, {
      cache: "no-store",
      headers: { "Accept": "application/xml, text/xml, */*" }
    });
    
    if (!res.ok) {
      console.error(`Sitemap fetch failed with status: ${res.status}`);
      return staticPages;
    }
    
    const xml = await res.text();
    const urlMatches = xml.matchAll(/<url>([\s\S]*?)<\/url>/g);
    
    for (const match of urlMatches) {
      const content = match[1];
      const locMatch = content.match(/<loc>(.*?)<\/loc>/);
      const lastmodMatch = content.match(/<lastmod>(.*?)<\/lastmod>/);
      const changefreqMatch = content.match(/<changefreq>(.*?)<\/changefreq>/);
      const priorityMatch = content.match(/<priority>(.*?)<\/priority>/);
      
      if (locMatch) {
        let locUrl = locMatch[1];
        
        try {
          const urlObj = new URL(locUrl);
          locUrl = `${siteUrl}${urlObj.pathname}${urlObj.search}`;
        } catch {
          locUrl = locUrl.replace(/https?:\/\/[^\/]+/, siteUrl);
        }

        // Skip URLs that are already covered by static pages
        const pathname = locUrl.replace(siteUrl, "");
        const isStaticPage = staticPages.some(sp => sp.url === locUrl);
        if (isStaticPage) continue;
        
        // Skip bad URLs: emoji-encoded, numeric-only slugs, overly long, discontinued
        if (pathname.includes('%f0%9f') || pathname.includes('%e2%9c')) continue; // emoji URLs
        if (/^\/\d+$/.test(pathname)) continue; // numeric-only slugs like /3354
        if (pathname.length > 100) continue; // overly long slugs
        if (pathname.includes('ecosport') || pathname.includes('ford-focus')) continue; // discontinued

        apiUrls.push({
          url: locUrl,
          lastModified: lastmodMatch ? new Date(lastmodMatch[1]) : undefined,
          changeFrequency: changefreqMatch ? (changefreqMatch[1] as any) : "daily",
          priority: priorityMatch ? parseFloat(priorityMatch[1]) : 0.7,
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch backend sitemap:", error);
  }

  // ===== MERGE: static pages first (higher priority), then API URLs =====
  // Deduplicate by URL
  const seen = new Set(staticPages.map(p => p.url));
  const dedupedApiUrls = apiUrls.filter(u => {
    if (seen.has(u.url)) return false;
    seen.add(u.url);
    return true;
  });

  return [...staticPages, ...dedupedApiUrls];
}
