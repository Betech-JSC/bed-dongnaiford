export const siteAssets = {
  heroSlides: [
    "/images-dynamic/image-hero-1.jpg",
    "/images-dynamic/image-hero-2.webp",
    "/assets/car-mach-e.png",
  ],
  showroomBg: "/showroom_bg.jpg",
  serviceBannerBg: "/images-services/service-maintenance-banner.jpg",
  serviceBannerFg: "/assets/service-banner-fg.png",
  serviceCustomerCare: "/images-services/service-detailing-banner.jpg",
  serviceMaintenance: "/images-services/service-maintenance-banner.jpg",
  serviceDelivery: "/images-services/service-delivery-banner.jpg",
  serviceRescue: "/images-services/service-rescue-banner.jpg",
  serviceUpgrade: "/images-services/service-upgrade-banner.jpg",
  bookingCar: "/assets/booking-car.jpg",
  qualityCareBadge: "/assets/quality-care-circle.jpg",
  expressFlow: "/assets/express-maintenance-flow.jpg",
  carPlaceholder: "/assets/car-mach-e.png",
  ourStoryBanner: "/showroom_bg.jpg",
  testDriveBg: "/assets/test-drive-bg.jpg",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9639.97148545994!2d106.86767807583985!3d10.948647055991795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dfa7287e67b7%3A0xe69044f2892be499!2zxJDhu5NuZyBOYWkgRm9yZA!5e1!3m2!1svi!2s!4v1782375726740!5m2!1svi!2s",
} as const;

export const aboutAssets = {
  hero: "/showroom_bg.jpg",
  ourStory: "/images-dynamic/image-hero-1.jpg",
  history: "/images-dynamic/image-hero-2.jpg",
  facilities: "/service-fixed-car.jpg",
  visionGallery: [
    "/assets/territory-grid-1.png",
    "/assets/territory-grid-2.png",
    "/assets/territory-grid-3.png",
    "/assets/territory-hero.png",
  ],
} as const;

export const popularVehicleImages: Record<string, string> = {
  "ford-territory": "/assets/territory-hero.png",
  "ford-everest": "/assets/car-everest.png",
  "new-mustang-mach-e": "/assets/car-mach-e.png",
  "ford-ranger": "/assets/car-ranger.png",
  "ford-transit-2024": "/assets/car-transit.png",
  "mustang-fastback": "/assets/mustang-hero.png",
};

export function getPopularVehicleImage(slugOrName: string, fallback?: string): string {
  if (!slugOrName) return fallback || popularVehicleImages["ford-territory"];
  const key = slugOrName.toLowerCase();
  for (const [k, v] of Object.entries(popularVehicleImages)) {
    if (key.includes(k.replace("ford-", ""))) return v;
  }
  return fallback || popularVehicleImages["ford-territory"];
}

export const imageFallbackSvg = "/images/ford_placeholder.png";

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (!target.src.includes("car-mach-e.png")) {
    target.src = siteAssets.carPlaceholder;
  }
};

export const resolveImageUrl = (img: any): string => {
  if (!img) return "/images/ford_placeholder.png";
  let path = "";
  if (typeof img === "string") {
    path = img;
  } else if (typeof img === "object") {
    path = img.url || img.path || "";
  }
  if (!path) return "/images/ford_placeholder.png";
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
