import { getPopularVehicleImage } from "@/lib/site-assets";
import { vehicles as staticVehicles } from "@/data/vehicles";

export function getTypeName(vehicle: any): string {
  const titleLower = (vehicle.title || vehicle.name || "").toLowerCase();
  const typeLower = (vehicle.type || "").toLowerCase();
  
  if (typeLower === "suv" || titleLower.includes("territory") || titleLower.includes("everest") || titleLower.includes("explorer")) {
    if (titleLower.includes("territory")) return "SUV 5 Chỗ";
    if (titleLower.includes("everest")) return "SUV 7 Chỗ";
    if (titleLower.includes("explorer")) return "SUV 7 Chỗ Cao Cấp";
    return "SUV";
  }
  if (typeLower === "pickup" || titleLower.includes("ranger") || titleLower.includes("raptor")) {
    return "Bán tải 5 Chỗ";
  }
  if (typeLower === "commercial" || titleLower.includes("transit")) {
    return "Thương mại 16 - 18 Chỗ";
  }
  if (typeLower === "mpv" || titleLower.includes("tourneo")) {
    return "MPV 7 Chỗ";
  }
  if (typeLower === "electric" || titleLower.includes("mach-e") || titleLower.includes("mustang")) {
    return "Xe điện / Thể thao";
  }
  return vehicle.category_name || "Xe Ford";
}

// Process dynamic vehicle models and versions from CMS
export function processVehiclesFromCMS(apiVehicles: any[]) {
  const source = (Array.isArray(apiVehicles) && apiVehicles.length > 0)
    ? apiVehicles
    : staticVehicles;

  if (!Array.isArray(source)) return [];

  const result: any[] = [];

  source.forEach((vehicle: any) => {
    if (!vehicle) return;

    const vehicleSlug = vehicle.slug || vehicle.id || `vehicle-${Math.random()}`;
    const vehicleName = (vehicle.title || vehicle.name || "XE FORD").toUpperCase();
    const typeName = vehicle.typeName || getTypeName(vehicle);
    const imageUrl = vehicle.image_thumbnail_url || vehicle.image_url || (Array.isArray(vehicle.images) && vehicle.images[0]) || getPopularVehicleImage(vehicleSlug);

    // Extract versions
    let rawVersions: any[] = [];
    if (Array.isArray(vehicle.versions) && vehicle.versions.length > 0) {
      rawVersions = vehicle.versions;
    } else if (vehicle.base_price || vehicle.basePrice) {
      const price = vehicle.base_price || vehicle.basePrice;
      if (price && parseFloat(price) > 0) {
        rawVersions = [{
          id: vehicle.slug || `v-${vehicle.id}`,
          name: vehicle.title || vehicle.name || "Phiên bản tiêu chuẩn",
          price: price,
          specs: vehicle.specs || {}
        }];
      }
    }

    const processedVersions = rawVersions.map((ver: any) => {
      const priceNum = typeof ver.price === "number" 
        ? ver.price 
        : typeof ver.price === "string" 
          ? parseFloat(ver.price) 
          : typeof vehicle.base_price === "string"
            ? parseFloat(vehicle.base_price)
            : (vehicle.base_price || vehicle.basePrice || 0);

      return {
        id: ver.slug || ver.id || `version-${ver.name}`,
        name: ver.name || ver.title || vehicle.title || vehicle.name,
        price: isNaN(priceNum) ? 0 : priceNum,
        specs: ver.specs || {},
      };
    });

    // Sort versions by price descending
    processedVersions.sort((a, b) => b.price - a.price);

    if (processedVersions.length > 0) {
      result.push({
        id: vehicleSlug,
        numericId: vehicle.id,
        name: vehicleName,
        type: vehicle.type || "suv",
        typeName: typeName,
        image_url: imageUrl,
        versions: processedVersions,
      });
    }
  });

  return result;
}
