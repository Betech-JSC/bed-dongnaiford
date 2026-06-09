"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Phone, ArrowRight } from "lucide-react";
import {
  vehicles,
  calculateRollingCost,
  formatVND,
  PROVINCES,
  type Province,
  type RollingCostBreakdown,
} from "@/lib/rolling-cost";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import BookingBanner from "@/components/services/BookingBanner";

function RollingCostContent() {
  const searchParams = useSearchParams();
  const urlVehicleId = searchParams.get("vehicle");
  const urlVersionId = searchParams.get("version");

  const [selectedVehicleId, setSelectedVehicleId] = useState(
    urlVehicleId || vehicles[0].id
  );
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<Province>("Đồng Nai");
  const [result, setResult] = useState<RollingCostBreakdown | null>(null);

  // Initialize version when vehicle changes
  useEffect(() => {
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
    if (vehicle) {
      const matchVersion =
        urlVersionId && vehicle.versions.some((v) => v.id === urlVersionId)
          ? urlVersionId
          : vehicle.versions[0]?.id || "";
      setSelectedVersionId(matchVersion);
    }
  }, [selectedVehicleId, urlVersionId]);

  // Calculate result whenever selections change
  useEffect(() => {
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
    const version = vehicle?.versions.find((v) => v.id === selectedVersionId);
    if (vehicle && version) {
      setResult(calculateRollingCost(vehicle, version, selectedProvince));
    }
  }, [selectedVehicleId, selectedVersionId, selectedProvince]);

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const currentVersion = currentVehicle?.versions.find(
    (v) => v.id === selectedVersionId
  );

  const costBreakdown = result
    ? [
        { label: "Giá xe niêm yết", value: result.basePrice },
        { label: "Thuế trước bạ", value: result.registrationTax },
        { label: "Phí biển số", value: result.plateFee },
        { label: "Phí đăng kiểm", value: result.registryFee },
        { label: "Phí bảo trì đường bộ (12 tháng)", value: result.roadFee },
        { label: "Bảo hiểm TNDS bắt buộc", value: result.insuranceFee },
      ]
    : [];

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e5e5e5] py-4">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
          <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#0562d2] transition-colors">
              Trang chủ
            </Link>
            <div className="w-[3px] h-[3px] rounded-full bg-[#333] opacity-60 mx-1" />
            <Link
              href="/san-pham"
              className="hover:text-[#0562d2] transition-colors"
            >
              Sản phẩm
            </Link>
            <div className="w-[3px] h-[3px] rounded-full bg-[#333] opacity-60 mx-1" />
            <span className="text-black font-semibold">
              Ước tính lăn bánh
            </span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#00095B] via-[#02337A] to-[#0562D2] text-white py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.96px] leading-[1.2] mb-3">
            Ước tính chi phí lăn bánh
          </h1>
          <p className="text-white/80 text-base max-w-xl mx-auto">
            Tính toán chi tiết các khoản phí khi mua xe Ford mới — đã bao gồm
            thuế trước bạ, phí biển số, bảo hiểm, và các phí đăng ký.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Selection Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5 sticky top-[140px]">
                <h2 className="text-lg font-bold text-[#1a1a1a]">
                  Chọn xe & khu vực
                </h2>

                {/* Vehicle Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dòng xe
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#0562d2] focus:border-transparent cursor-pointer"
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} — {v.typeName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Version Selector */}
                {currentVehicle && currentVehicle.versions.length > 1 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phiên bản
                    </label>
                    <div className="relative">
                      <select
                        value={selectedVersionId}
                        onChange={(e) => setSelectedVersionId(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#0562d2] focus:border-transparent cursor-pointer"
                      >
                        {currentVehicle.versions.map((ver) => (
                          <option key={ver.id} value={ver.id}>
                            {ver.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Province Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tỉnh / Thành phố đăng ký
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProvince}
                      onChange={(e) =>
                        setSelectedProvince(e.target.value as Province)
                      }
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#0562d2] focus:border-transparent cursor-pointer"
                    >
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Vehicle Preview */}
                {currentVehicle && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="relative w-full h-[120px]">
                      <Image
                        src={getPopularVehicleImage(
                          currentVehicle.id,
                          currentVehicle.images[0]
                        )}
                        alt={currentVehicle.name}
                        fill
                        sizes="300px"
                        className="object-contain"
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-3">
              {result && currentVehicle && currentVersion && (
                <div className="space-y-6">
                  {/* Vehicle Title */}
                  <div>
                    <h3 className="text-xl font-bold text-[#1a1a1a] uppercase">
                      {currentVehicle.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {currentVersion.name} •{" "}
                      <span className="text-[#0562d2]">{selectedProvince}</span>
                    </p>
                  </div>

                  {/* Cost Breakdown Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    {costBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-6 py-4 ${
                          idx < costBreakdown.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <span className="text-sm text-gray-600 font-medium">
                          {item.label}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            idx === 0 ? "text-[#1a1a1a]" : "text-gray-700"
                          }`}
                        >
                          {formatVND(item.value)}
                        </span>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="flex items-center justify-between px-6 py-5 bg-[#00095B] text-white">
                      <span className="text-base font-bold">
                        TỔNG GIÁ LĂN BÁNH (Dự kiến)
                      </span>
                      <span className="text-xl font-black">
                        {formatVND(result.total)}
                      </span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/lien-he?vehicle=${currentVehicle.id}&reason=Nhận báo giá lăn bánh&note=Phiên bản: ${encodeURIComponent(currentVersion.name)}, Tỉnh: ${selectedProvince}, Dự toán: ${formatVND(result.total)}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#0562d2] hover:bg-[#044ea7] text-white text-sm font-semibold py-3 rounded-full transition-colors"
                    >
                      Nhận báo giá chính xác
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="tel:0918909060"
                      className="flex-1 flex items-center justify-center gap-2 border border-[#0562d2] text-[#0562d2] hover:bg-[#0562d2] hover:text-white text-sm font-semibold py-3 rounded-full transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Gọi Hotline: 0918 90 90 60
                    </a>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-gray-400 leading-relaxed">
                    * Bảng dự toán trên mang tính tham khảo. Giá lăn bánh thực
                    tế có thể thay đổi tùy theo chính sách khuyến mãi, lãi suất
                    ngân hàng, và khu vực đăng ký tại thời điểm giao dịch. Vui
                    lòng liên hệ trực tiếp Đồng Nai Ford để nhận báo giá chính
                    xác nhất.
                  </p>

                  {/* Related Tools */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <Link
                      href="/cong-cu/uoc-tinh-tra-gop"
                      className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#0562d2] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0562d2] flex-shrink-0">
                        💳
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 group-hover:text-[#0562d2] transition-colors">
                          Ước tính trả góp
                        </p>
                        <p className="text-xs text-gray-550">
                          Tính lãi suất hàng tháng
                        </p>
                      </div>
                    </Link>
                    <Link
                      href="/cong-cu/so-sanh-xe"
                      className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#0562d2] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0562d2] flex-shrink-0">
                        ⚖️
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 group-hover:text-[#0562d2] transition-colors">
                          So sánh xe
                        </p>
                        <p className="text-xs text-gray-550">
                          So sánh thông số kỹ thuật
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <BookingBanner />
    </div>
  );
}

export default function RollingCostPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0562d2]" />
        </div>
      }
    >
      <RollingCostContent />
    </Suspense>
  );
}
