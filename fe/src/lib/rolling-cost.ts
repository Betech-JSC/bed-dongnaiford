import { vehicles, Vehicle, Version } from "@/data/vehicles";

export interface RollingCostBreakdown {
  basePrice: number;
  registrationTax: number;
  plateFee: number;
  registryFee: number;
  roadFee: number;
  insuranceFee: number;
  total: number;
}

export const PROVINCES = [
  "Đồng Nai",
  "TP. Hồ Chí Minh",
  "Bình Dương",
  "Bà Rịa - Vũng Tàu",
  "Long An",
  "Tây Ninh",
  "Bình Phước",
  "Bình Thuận",
  "Lâm Đồng",
  "Hà Nội",
  "Đà Nẵng",
  "Khác",
] as const;

export type Province = (typeof PROVINCES)[number];

/**
 * Tính chi phí lăn bánh cho một phiên bản xe tại một tỉnh/thành phố.
 */
export function calculateRollingCost(
  vehicle: any,
  version: any,
  province: string
): RollingCostBreakdown {
  const basePrice = typeof version.price === 'string' ? parseFloat(version.price) : (version.price || 0);

  const vehicleNameLower = (vehicle.name || vehicle.title || "").toLowerCase();
  const vehicleIdLower = String(vehicle.id || "").toLowerCase();

  // 1. Phân loại xe
  const isPickup =
    vehicle.type === "pickup" ||
    vehicleNameLower.includes("ranger") ||
    vehicleNameLower.includes("raptor") ||
    vehicleIdLower.includes("ranger") ||
    vehicleIdLower.includes("raptor");

  const isTransit =
    vehicleNameLower.includes("transit") ||
    vehicleIdLower.includes("transit");

  // 2. Thuế trước bạ theo khu vực & dòng xe
  const provinces12Percent = ["Hà Nội", "Hải Phòng", "Đà Nẵng", "Cần Thơ", "Quảng Ninh", "Lào Cai", "Cao Bằng", "Lạng Sơn", "Sơn La"];
  const is12PercentProvince = provinces12Percent.some(p => province.toLowerCase().includes(p.toLowerCase()));
  const isHaTinh = province.toLowerCase().includes("hà tĩnh");

  let registrationTaxRate = 0.10; // Mặc định 10% cho xe con ở các tỉnh khác
  if (isPickup) {
    // Thuế xe bán tải = 60% xe con
    if (is12PercentProvince) {
      registrationTaxRate = 0.072; // 12% * 60% = 7.2%
    } else if (isHaTinh) {
      registrationTaxRate = 0.066; // 11% * 60% = 6.6%
    } else {
      registrationTaxRate = 0.06; // 10% * 60% = 6%
    }
  } else if (isTransit) {
    // Xe thương mại chở khách (16 chỗ) chịu thuế trước bạ 2%
    registrationTaxRate = 0.02;
  } else {
    // Xe du lịch / SUV dưới 9 chỗ
    if (is12PercentProvince) {
      registrationTaxRate = 0.12;
    } else if (isHaTinh) {
      registrationTaxRate = 0.11;
    } else {
      registrationTaxRate = 0.10;
    }
  }
  
  // Thuế trước bạ xe điện bằng 50% xe xăng (áp dụng từ 01/03/2025 đến 01/03/2027)
  const isElectric =
    vehicleNameLower.includes("mach-e") ||
    vehicleIdLower.includes("mach-e") ||
    vehicleNameLower.includes("ev ") ||
    vehicleIdLower.includes("ev-");
  if (isElectric) {
    registrationTaxRate = registrationTaxRate * 0.5;
  }

  const registrationTax = basePrice * registrationTaxRate;

  // 3. Lệ phí biển số (Circular 60/2023/TT-BTC)
  let plateFee = 1_000_000;
  const isHanoiOrHCMC = province.toLowerCase().includes("hà nội") || province.toLowerCase().includes("hồ chí minh");

  if (isPickup) {
    // Xe bán tải biển số cố định 500k
    plateFee = 500_000;
  } else if (isTransit) {
    // Xe Transit biển số 500k ở HN/HCM, 150k ở tỉnh khác
    plateFee = isHanoiOrHCMC ? 500_000 : 150_000;
  } else {
    // Xe du lịch dưới 9 chỗ biển số 20 triệu ở HN/HCM, 1 triệu ở tỉnh khác
    plateFee = isHanoiOrHCMC ? 20_000_000 : 1_000_000;
  }

  // 4. Phí đăng kiểm
  const registryFee = 340_000;

  // 5. Phí bảo trì đường bộ (12 tháng)
  let roadFee = 1_560_000; // Mặc định 130k/tháng cho xe con đăng ký cá nhân
  if (isPickup) {
    roadFee = 2_160_000; // Bán tải 180k/tháng
  } else if (isTransit) {
    roadFee = 2_160_000; // Xe khách 10-40 chỗ 180k/tháng
  }

  // 6. Phí bảo hiểm TNDS bắt buộc (đã bao gồm VAT)
  let insuranceFee = 480_700; // Xe dưới 6 chỗ (Territory, Mustang Mach-E, v.v.)
  
  const is7Seater =
    vehicleIdLower.includes("everest") ||
    vehicleNameLower.includes("everest") ||
    vehicleIdLower.includes("tourneo") ||
    vehicleNameLower.includes("tourneo") ||
    String(vehicle.typeName || "").includes("7 Chỗ");

  if (isPickup) {
    insuranceFee = 1_026_300; // Bán tải
  } else if (isTransit) {
    insuranceFee = 1_397_000; // 16 chỗ không kinh doanh vận tải (đã VAT)
  } else if (is7Seater) {
    insuranceFee = 873_400; // Xe 7-9 chỗ (Everest)
  }

  const total =
    basePrice + registrationTax + plateFee + registryFee + roadFee + insuranceFee;

  return {
    basePrice,
    registrationTax,
    plateFee,
    registryFee,
    roadFee,
    insuranceFee,
    total,
  };
}

/**
 * Format giá tiền VNĐ
 */
export function formatVND(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
}

/**
 * Format giá ngắn gọn (cho bảng giá)
 */
export function formatPriceShort(price: number): string {
  return new Intl.NumberFormat("en-US").format(price) + "đ";
}

/**
 * Lấy tất cả vehicles (tiện cho re-export)
 */
export { vehicles };
