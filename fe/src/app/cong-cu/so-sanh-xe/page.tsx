"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X, Plus, ArrowRight } from "lucide-react";
import { vehicles, type Vehicle, type Specs } from "@/data/vehicles";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import { formatPriceShort } from "@/lib/rolling-cost";
import BookingBanner from "@/components/services/BookingBanner";

const SPEC_LABELS: { key: keyof Specs; label: string }[] = [
  { key: "engine", label: "Động cơ" },
  { key: "power", label: "Công suất cực đại" },
  { key: "torque", label: "Mô-men xoắn cực đại" },
  { key: "transmission", label: "Hộp số" },
  { key: "drivetrain", label: "Hệ dẫn động" },
  { key: "dimensions", label: "Kích thước (DxRxC)" },
  { key: "clearance", label: "Khoảng sáng gầm xe" },
  { key: "fuelEconomy", label: "Tiêu hao nhiên liệu" },
];

const MAX_COMPARE = 3;

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    vehicles[0]?.id || "",
    vehicles[1]?.id || "",
  ]);

  // Read URL params or localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idsParam = params.get("ids");
      if (idsParam) {
        const ids = idsParam.split(",").filter((id) => vehicles.some((v) => v.id === id));
        if (ids.length >= 1) {
          setSelectedIds(ids);
          return;
        }
      }
      
      // Fallback to localStorage
      const stored = localStorage.getItem("compare-vehicles");
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids) && ids.length >= 1) {
            const validIds = ids.filter((id) => vehicles.some((v) => v.id === id));
            if (validIds.length >= 1) {
              setSelectedIds(validIds);
            }
          }
        } catch (e) {
          console.error("Error reading compare local storage:", e);
        }
      }
    }
  }, []);

  const selectedVehicles: (Vehicle | null)[] = selectedIds.map(
    (id) => vehicles.find((v) => v.id === id) || null
  );

  const handleSelect = (index: number, vehicleId: string) => {
    setSelectedIds((prev) => {
      const updated = [...prev];
      updated[index] = vehicleId;
      localStorage.setItem("compare-vehicles", JSON.stringify(updated.filter(Boolean)));
      window.dispatchEvent(new Event("compare-updated"));
      return updated;
    });
  };

  const handleRemove = (index: number) => {
    setSelectedIds((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("compare-vehicles", JSON.stringify(updated.filter(Boolean)));
      window.dispatchEvent(new Event("compare-updated"));
      return updated;
    });
  };

  const handleAdd = () => {
    if (selectedIds.length < MAX_COMPARE) {
      // Find a vehicle not already selected
      const available = vehicles.find((v) => !selectedIds.includes(v.id));
      if (available) {
        setSelectedIds((prev) => {
          const updated = [...prev, available.id];
          localStorage.setItem("compare-vehicles", JSON.stringify(updated));
          window.dispatchEvent(new Event("compare-updated"));
          return updated;
        });
      }
    }
  };

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
            <span className="text-black font-semibold">So sánh xe</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#00095B] via-[#02337A] to-[#0562D2] text-white py-12 md:py-14">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.96px] leading-[1.2] mb-3">
            So sánh xe Ford
          </h1>
          <p className="text-white/80 text-base max-w-xl mx-auto">
            Chọn tối đa {MAX_COMPARE} dòng xe để so sánh thông số kỹ thuật chi
            tiết, giúp bạn dễ dàng đưa ra quyết định.
          </p>
        </div>
      </section>

      {/* Compare Content */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
          {/* Vehicle Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {selectedIds.map((id, index) => {
              const vehicle = selectedVehicles[index];
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative"
                >
                  {/* Remove button */}
                  {selectedIds.length > 2 && (
                    <button
                      onClick={() => handleRemove(index)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Vehicle Dropdown */}
                  <div className="relative mb-4">
                    <select
                      value={id}
                      onChange={(e) => handleSelect(index, e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[#1a1a1a] uppercase focus:outline-none focus:ring-2 focus:ring-[#0562d2] focus:border-transparent cursor-pointer"
                    >
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Vehicle Preview */}
                  {vehicle && (
                    <>
                      <div className="relative w-full h-[130px] mb-3">
                        <Image
                          src={getPopularVehicleImage(
                            vehicle.id,
                            vehicle.images[0]
                          )}
                          alt={vehicle.name}
                          fill
                          sizes="300px"
                          className="object-contain"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-semibold text-[#0562D2] bg-blue-50 px-2.5 py-1 rounded-full">
                          {vehicle.typeName}
                        </span>
                        <p className="mt-2 text-sm text-gray-500">
                          Giá từ:{" "}
                          <span className="font-bold text-[#0562D2]">
                            {formatPriceShort(vehicle.basePrice)}
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Add Vehicle Button */}
            {selectedIds.length < MAX_COMPARE && (
              <button
                onClick={handleAdd}
                className="bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#0562d2] p-5 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-[#0562d2] transition-all cursor-pointer min-h-[280px]"
              >
                <Plus className="w-8 h-8" />
                <span className="text-sm font-semibold">Thêm xe so sánh</span>
              </button>
            )}
          </div>

          {/* Specs Comparison Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Header Row */}
            <div
              className="grid border-b-2 border-gray-200 bg-[#00095B] text-white"
              style={{
                gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)`,
              }}
            >
              <div className="px-5 py-4 text-sm font-bold">Thông số</div>
              {selectedVehicles.map((v, i) => (
                <div key={i} className="px-5 py-4 text-sm font-bold text-center">
                  {v?.name || "—"}
                </div>
              ))}
            </div>

            {/* Price Row */}
            <div
              className="grid border-b border-gray-100 bg-blue-50/50"
              style={{
                gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)`,
              }}
            >
              <div className="px-5 py-4 text-sm font-bold text-gray-700">
                Giá khởi điểm
              </div>
              {selectedVehicles.map((v, i) => (
                <div
                  key={i}
                  className="px-5 py-4 text-sm font-bold text-[#0562D2] text-center"
                >
                  {v ? formatPriceShort(v.basePrice) : "—"}
                </div>
              ))}
            </div>

            {/* Spec Rows */}
            {SPEC_LABELS.map((spec, specIdx) => (
              <div
                key={spec.key}
                className={`grid border-b border-gray-50 ${
                  specIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
                style={{
                  gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)`,
                }}
              >
                <div className="px-5 py-4 text-sm font-semibold text-gray-600">
                  {spec.label}
                </div>
                {selectedVehicles.map((v, i) => {
                  const specValue = v?.versions[0]?.specs[spec.key] || "—";
                  return (
                    <div
                      key={i}
                      className="px-5 py-4 text-sm text-gray-700 text-center font-medium"
                    >
                      {specValue}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* CTA Row */}
            <div
              className="grid bg-gray-50"
              style={{
                gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)`,
              }}
            >
              <div className="px-5 py-5" />
              {selectedVehicles.map((v, i) =>
                v ? (
                  <div
                    key={i}
                    className="px-5 py-5 flex flex-col items-center gap-2"
                  >
                    <Link
                      href={`/san-pham/${v.id}`}
                      className="text-xs font-semibold text-[#0562d2] hover:text-[#044ea7] transition-colors flex items-center gap-1"
                    >
                      Xem chi tiết
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href={`/lien-he?vehicle=${v.id}&reason=Nhận báo giá`}
                      className="text-xs font-semibold text-white bg-[#0562d2] hover:bg-[#044ea7] px-4 py-2 rounded-full transition-colors"
                    >
                      Nhận báo giá
                    </Link>
                  </div>
                ) : (
                  <div key={i} className="px-5 py-5" />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <BookingBanner />
    </div>
  );
}
