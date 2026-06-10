export const siteAssets = {
  heroSlides: [
    "/images-dynamic/image-hero-1.jpg",
    "/images-dynamic/image-hero-2.webp",
    "/assets/car-mach-e.png",
  ],
  showroomBg: "/showroom_bg.png",
  serviceBannerBg: "/assets/service-banner-bg.png",
  serviceBannerFg: "/assets/service-banner-fg.png",
  serviceCustomerCare: "/service-support-customer.jpg",
  serviceMaintenance: "/service-fixed-car.jpg",
  serviceDelivery: "/service-delivery.png",
  bookingCar: "/assets/booking-car.png",
  qualityCareBadge: "/assets/quality-care-circle.png",
  expressFlow: "/assets/express-maintenance-flow.png",
  carPlaceholder: "/assets/car-mach-e.png",
  ourStoryBanner: "/showroom_bg.png",
  testDriveBg: "/assets/test-drive-bg.png",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=10.9511,106.8434&hl=vi&z=16&output=embed",
} as const;

export const aboutAssets = {
  hero: "/showroom_bg.png",
  ourStory: "/images-dynamic/image-hero-1.jpg",
  history: "/images-dynamic/image-hero-2.jpg",
  facilities: "/service-fixed-car.jpg",
  visionGallery: [
    "/assets/img-gradient-1.png",
    "/assets/img-gradient-2.png",
    "/assets/img-gradient-3.png",
    "/assets/img-gradient.png",
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

export function getPopularVehicleImage(vehicleId: string, fallback?: string) {
  return (
    popularVehicleImages[vehicleId] ??
    (fallback && fallback !== "" ? fallback : undefined) ??
    siteAssets.carPlaceholder
  );
}

export const imageFallbackSvg = "/images/ford_placeholder.png";

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.onerror = null;
  e.currentTarget.srcset = "";
  e.currentTarget.src = imageFallbackSvg;
}

