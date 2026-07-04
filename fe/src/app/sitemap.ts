import type { MetadataRoute } from "next";

// Trigger rebuild to clear sitemap cache and load correct staging URLs
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  
  try {
    const res = await fetch(`${apiUrl}/sitemap`, {
      next: { revalidate: 3600 } // Cache sitemap for 1 hour
    });
    
    if (!res.ok) {
      console.error(`Sitemap fetch failed with status: ${res.status}`);
      return [];
    }
    
    const xml = await res.text();
    const urls: MetadataRoute.Sitemap = [];
    const urlMatches = xml.matchAll(/<url>([\s\S]*?)<\/url>/g);
    
    for (const match of urlMatches) {
      const content = match[1];
      const locMatch = content.match(/<loc>(.*?)<\/loc>/);
      const lastmodMatch = content.match(/<lastmod>(.*?)<\/lastmod>/);
      const changefreqMatch = content.match(/<changefreq>(.*?)<\/changefreq>/);
      const priorityMatch = content.match(/<priority>(.*?)<\/priority>/);
      
      if (locMatch) {
        urls.push({
          url: locMatch[1],
          lastModified: lastmodMatch ? new Date(lastmodMatch[1]) : undefined,
          changeFrequency: changefreqMatch ? (changefreqMatch[1] as any) : "daily",
          priority: priorityMatch ? parseFloat(priorityMatch[1]) : 0.8,
        });
      }
    }
    
    return urls;
  } catch (error) {
    console.error("Failed to fetch backend sitemap:", error);
    return [];
  }
}
