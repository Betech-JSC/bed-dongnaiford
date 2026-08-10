/**
 * Custom Image Loader for Next.js
 * Optimizes image URLs from CMS or public storage without relying on Vercel's paid Image Optimization quota.
 */
export default function customImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src) return '/images/ford_placeholder.jpg';

  // If external absolute URL (non-CMS), return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    if (!src.includes('cms.dongnaiford.com.vn')) {
      return src;
    }
  }

  // If local static asset or CMS image, append query parameters if CDN/CMS supports it or return optimized path
  const q = quality || 80;

  // If relative path from public or CMS
  if (src.startsWith('/')) {
    return `${src}?w=${width}&q=${q}`;
  }

  return `${src}?w=${width}&q=${q}`;
}
