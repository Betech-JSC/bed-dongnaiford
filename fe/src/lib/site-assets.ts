export const siteAssets = {
  heroSlides: [
    "/images-dynamic/image-hero-1.webp",
    "/images-dynamic/image-hero-2.webp",
    "/assets/mach-e-hero.webp",
  ],
  showroomBg: "/showroom_bg.webp",
  serviceBannerBg: "/images-services/service-maintenance-banner.webp",
  serviceBannerFg: "/assets/service-banner-fg.webp",
  serviceCustomerCare: "/images-services/service-detailing-banner.webp",
  serviceMaintenance: "/images-services/service-maintenance-banner.webp",
  serviceDelivery: "/images-services/service-delivery-banner.webp",
  serviceRescue: "/images-services/service-rescue-banner.webp",
  serviceUpgrade: "/images-services/service-upgrade-banner.webp",
  bookingCar: "/assets/booking-car.webp",
  qualityCareBadge: "/assets/quality-care-circle.webp",
  expressFlow: "/assets/express-maintenance-flow.webp",
  carPlaceholder: "/assets/territory-hero.webp",
  ourStoryBanner: "/showroom_bg.webp",
  testDriveBg: "/images-dynamic/image-hero-1.webp",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9639.97148545994!2d106.86767807583985!3d10.948647055991795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dfa7287e67b7%3A0xe69044f2892be499!2zxJDhu5NuZyBOYWkgRm9yZA!5e1!3m2!1svi!2s!4v1782375726740!5m2!1svi!2s",
  googleMapsUrl: "https://maps.google.com/?q=Đồng+Nai+Ford",
} as const;

export const aboutAssets = {
  hero: "/showroom_bg.webp",
  ourStory: "/images-dynamic/image-hero-1.webp",
  history: "/images-dynamic/image-hero-2.webp",
  facilities: "/service-fixed-car.webp",
  visionGallery: [
    "/assets/territory-grid-1.webp",
    "/assets/territory-grid-2.webp",
    "/assets/territory-grid-3.webp",
    "/assets/territory-hero.webp",
  ],
} as const;

export const popularVehicleImages: Record<string, string> = {};

export function getPopularVehicleImage(slugOrName: string, fallback?: string): string {
  if (fallback && (fallback.startsWith("/") || fallback.startsWith("http"))) {
    return fallback;
  }
  return "";
}

export const imageFallbackSvg = "";

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  // Silent handler to allow SafeImage component to render clean Skeleton Pulse Loader
};

export const resolveImageUrl = (img: any): string => {
  if (!img) return "";
  let path = "";
  if (typeof img === "string") {
    path = img;
  } else if (typeof img === "object") {
    path = img.url || img.path || "";
  }
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/") || path.startsWith("//")) {
    return encodeURI(path);
  }
  if (/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}|localhost)(:[0-9]+)?\//.test(path)) {
    return encodeURI(`https://${path}`);
  }
  const cleanPath = path.startsWith("uploads/") ? path.replace("uploads/", "") : path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const baseDomain = apiUrl.replace(/\/api$/, "");
  return encodeURI(`${baseDomain}/static/${cleanPath}`);
};

export const hasImageField = (img: any): boolean => {
  if (!img) return false;
  let path = "";
  if (typeof img === "string") {
    path = img;
  } else if (typeof img === "object") {
    path = img.url || img.path || "";
  }
  return typeof path === "string" && path.trim() !== "";
};
