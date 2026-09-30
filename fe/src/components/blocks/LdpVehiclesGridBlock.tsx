"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SafeImage from "@/components/shared/SafeImage";
import { getPopularVehicleImage, resolveImageUrl } from "@/lib/site-assets";
import { Car, Check } from "lucide-react";

interface LdpVehiclesGridBlockProps {
  data?: {
    title?: string;
    subtitle?: string;
  };
  salesConsultant?: any;
  allVehicles?: any[];
  currentVehicle?: any;
  anchorId?: string;
}

// Phân nhóm danh mục dựa trên loại xe hoặc tên xe
function resolveCategory(vehicle: any): string {
  const type = (vehicle.type || "").toLowerCase();
  const title = (vehicle.title || vehicle.name || "").toLowerCase();

  if (type === "ev" || title.includes("mach-e") || title.includes("điện")) return "ev";
  if (type === "pickup" || title.includes("ranger")) return "pickup";
  if (type === "commercial" || title.includes("transit") || title.includes("tourneo")) return "commercial";
  if (type === "suv" || title.includes("everest") || title.includes("territory") || title.includes("explorer")) return "suv";
  return "other";
}

const CATEGORY_LABELS: Record<string, string> = {
  suv: "SUV",
  pickup: "Bán tải",
  commercial: "Thương mại",
  ev: "Xe Điện",
  other: "Khác",
};

export default function LdpVehiclesGridBlock({
  data,
  salesConsultant,
  allVehicles = [],
  currentVehicle,
  anchorId,
}: LdpVehiclesGridBlockProps) {
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const consultantSlug =
    salesConsultant?.slug ||
    salesConsultant?.name?.toLowerCase().trim().replace(/\s+/g, "-") ||
    "tu-van";

  // Định dạng tiền tệ VND chuẩn
  const formatPrice = (price: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    if (!num || isNaN(num)) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(num) + "đ";
  };

  // Xác định các danh mục thực tế đang có trong danh sách xe của cố vấn
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    allVehicles.forEach((v) => {
      const cat = resolveCategory(v);
      if (cat !== "other") set.add(cat);
    });
    return Array.from(set);
  }, [allVehicles]);

  // Lọc xe theo tab đang chọn
  const filteredVehicles = useMemo(() => {
    if (selectedCat === "all") return allVehicles;
    return allVehicles.filter((v) => resolveCategory(v) === selectedCat);
  }, [allVehicles, selectedCat]);

  if (!allVehicles || allVehicles.length === 0) return null;

  const title = data?.title || "Dòng xe Cố vấn phụ trách";
  const subtitle =
    data?.subtitle ||
    `Chọn dòng xe quý khách quan tâm để xem bảng giá, thông số và ưu đãi độc quyền từ ${
      salesConsultant?.name || "Cố vấn bán hàng"
    }.`;

  return (
    <section
      id={anchorId || "ldp-vehicles-grid"}
      className="w-full bg-[#f8f9fa] py-10 md:py-14 border-b border-gray-200"
    >
      <div className="max-w-[1152px] mx-auto px-4">
        {/* Tiêu đề & mô tả */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0562D2] text-xs font-bold border border-blue-100">
            <Car className="w-3.5 h-3.5" />
            <span>Showroom Cố vấn ({allVehicles.length} dòng xe)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#00095B] tracking-tight">
            {title}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Tab phân loại (Tất cả, SUV, Bán tải, Thương mại, Xe Điện) */}
        {availableCategories.length > 0 && (
          <div className="flex justify-center mb-8 border-b border-gray-200 w-full overflow-x-auto scrollbar-none">
            <div className="flex gap-6 md:gap-10">
              <button
                type="button"
                onClick={() => setSelectedCat("all")}
                className={`pb-3 text-xs md:text-sm font-bold transition-all duration-200 relative cursor-pointer border-0 bg-transparent ${
                  selectedCat === "all"
                    ? "text-[#0562D2] border-b-2 border-solid border-[#0562D2] -mb-[2px]"
                    : "text-gray-500 hover:text-[#0562D2]"
                }`}
              >
                Tất cả ({allVehicles.length})
              </button>
              {availableCategories.map((catKey) => {
                const count = allVehicles.filter((v) => resolveCategory(v) === catKey).length;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCat(catKey)}
                    className={`pb-3 text-xs md:text-sm font-bold transition-all duration-200 relative cursor-pointer border-0 bg-transparent ${
                      selectedCat === catKey
                        ? "text-[#0562D2] border-b-2 border-solid border-[#0562D2] -mb-[2px]"
                        : "text-gray-500 hover:text-[#0562D2]"
                    }`}
                  >
                    {CATEGORY_LABELS[catKey] || catKey} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Lưới thẻ xe - 3 cột chuẩn phong cách Ford Đồng Nai */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const vehicleSlug = vehicle.slug || vehicle.id;
            const vehicleName = vehicle.title || vehicle.name;
            const vehiclePrice = vehicle.base_price || vehicle.basePrice || 0;
            const isCurrent =
              currentVehicle && (currentVehicle.slug || currentVehicle.id) === vehicleSlug;

            const vehicleCardImage =
              resolveImageUrl(vehicle.image_thumbnail_url || vehicle.image_url || vehicle.image) ||
              getPopularVehicleImage(vehicleSlug, vehicle.images?.[0] || "");

            const href = salesConsultant?.custom_domain
              ? `/${vehicleSlug}`
              : `/ldp/${consultantSlug}/${vehicleSlug}`;

            return (
              <Link
                key={vehicle.id || vehicleSlug}
                href={href}
                className={`bg-white border rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative group cursor-pointer h-full ${
                  isCurrent
                    ? "border-[#0562D2] ring-2 ring-[#0562D2]/20 shadow-md"
                    : "border-[#EAECF0] hover:border-blue-300"
                }`}
              >
                {/* Badge xe đang xem - z-30 nổi hoàn toàn phía trên ảnh và skeleton */}
                {isCurrent && (
                  <div className="absolute top-3 right-3 z-30 bg-[#0562D2] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md pointer-events-none">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    <span>Đang xem</span>
                  </div>
                )}

                {/* Khung ảnh xe */}
                <div className="relative h-44 w-full bg-white overflow-hidden mb-4 flex items-center justify-center z-0">
                  <SafeImage
                    src={vehicleCardImage}
                    alt={vehicleName}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain object-center group-hover:scale-105 transition-transform duration-500 p-2"
                  />
                </div>

                {/* Tên xe & Giá khởi điểm */}
                <div className="space-y-1.5 mt-auto pt-3 border-t border-gray-100">
                  <h3 className="text-sm md:text-base font-extrabold tracking-tight uppercase text-[#1A1A1A] group-hover:text-[#0562D2] transition-colors">
                    {vehicleName}
                  </h3>
                  <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
                    <span>Giá khởi điểm:</span>
                    <span className="text-sm font-extrabold text-[#0562D2]">
                      {formatPrice(vehiclePrice)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
