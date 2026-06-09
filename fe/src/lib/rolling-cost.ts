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
  vehicle: Vehicle,
  version: Version,
  province: string
): RollingCostBreakdown {
  const basePrice = version.price;

  // Thuế trước bạ: 10% cho xe con, 6% cho bán tải
  const registrationTaxRate = vehicle.type === "pickup" ? 0.06 : 0.1;
  const registrationTax = basePrice * registrationTaxRate;

  // Phí biển số: 20 triệu cho 6 Thành phố trực thuộc Trung ương, 1 triệu cho các tỉnh khác
  const bigCities = ["Hà Nội", "Hồ Chí Minh", "Hải Phòng", "Đà Nẵng", "Cần Thơ", "Huế"];
  const isBigCity = bigCities.some(city => province.toLowerCase().includes(city.toLowerCase()));
  const plateFee = isBigCity ? 20_000_000 : 1_000_000;

  // Phí đăng kiểm
  const registryFee = 340_000;

  // Phí bảo trì đường bộ (12 tháng)
  const roadFee = 1_560_000;

  // Phí bảo hiểm TNDS bắt buộc
  const isMultiSeater =
    vehicle.id?.includes("everest") ||
    vehicle.id?.includes("transit") ||
    vehicle.id?.includes("tourneo") ||
    vehicle.typeName?.includes("7 Chỗ") ||
    vehicle.typeName?.includes("16 Chỗ");
  const insuranceFee = isMultiSeater ? 873_400 : 480_700;

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
