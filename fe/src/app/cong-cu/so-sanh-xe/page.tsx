"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X, Plus, ArrowRight } from "lucide-react";
import { type Vehicle, type Specs } from "@/data/vehicles";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import { formatPriceShort } from "@/lib/rolling-cost";
import BookingBanner from "@/components/services/BookingBanner";
import { vehiclesAPI } from "@/lib/api";

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<(any | null)[]>([]);

  // Fetch API vehicles on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await vehiclesAPI.getAll({ with_versions: true }).catch(() => null);
        const items = res?.data || res;
        if (Array.isArray(items) && items.length > 0) {
          const mapped = items.map((v: any) => {
            const id = v.slug || v.id;
            const name = v.title || v.name;
            const image = v.image_thumbnail_url || v.image_url || v.images?.[0] || "";
            const price = typeof v.base_price === 'string' ? parseFloat(v.base_price) : (v.base_price || v.basePrice || 0);
            return {
              ...v,
              id,
              name,
              basePrice: price,
              images: [image],
              typeName: v.type_name || v.typeName || (v.type === 'suv' ? 'SUV' : v.type === 'pickup' ? 'Bán tải' : 'Thương mại'),
              versions: v.versions ? v.versions.map((ver: any) => ({
                id: ver.id,
                name: ver.name,
                price: typeof ver.price === 'string' ? parseFloat(ver.price) : (ver.price || 0),
                specs: {
                  engine: ver.specs?.engine || ver.specs?.engine_type || '',
                  power: ver.specs?.power || '',
                  torque: ver.specs?.torque || '',
                  transmission: ver.specs?.transmission || '',
                  drivetrain: ver.specs?.drivetrain || '',
                  dimensions: ver.specs?.dimensions || '',
                  clearance: ver.specs?.clearance || '',
                  fuelEconomy: ver.specs?.fuelEconomy || ver.specs?.fuel_guide || ver.specs?.fuel_economy || '',
                }
              })) : []
            };
          });
          setAllVehicles(mapped);
        }
      } catch (err) {
        console.error("Error loading vehicles in ComparePage:", err);
      }
    };
    fetchAll();
  }, []);

  // Read URL params or localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idsParam = params.get("ids");
      if (idsParam) {
        const ids = idsParam.split(",").filter(Boolean);
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
            setSelectedIds(ids.filter(Boolean));
            return;
          }
        } catch (e) {
          console.error("Error reading compare local storage:", e);
        }
      }
    }
  }, []);

  // Default fallback when allVehicles are loaded and selectedIds is still empty
  useEffect(() => {
    if (allVehicles.length > 0 && selectedIds.length === 0) {
      setSelectedIds([
        allVehicles[0]?.id || "",
        allVehicles[1]?.id || "",
      ].filter(Boolean));
    }
  }, [allVehicles, selectedIds]);

  const listToSearch = allVehicles;

  useEffect(() => {
    if (selectedIds.length === 0 || allVehicles.length === 0) {
      setSelectedVehicles([]);
      return;
    }

    const details = selectedIds.map((id) => {
      return allVehicles.find((v) => v.id === id) || null;
    });
    setSelectedVehicles(details);
  }, [selectedIds, allVehicles]);

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
      const available = listToSearch.find((v) => !selectedIds.includes(v.id));
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
                      className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-all cursor-pointer shadow-sm z-10"
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
                      {listToSearch.map((v) => (
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
                          src={
                            vehicle.images?.[0]?.startsWith("http") || vehicle.images?.[0]?.startsWith("/")
                              ? vehicle.images[0]
                              : getPopularVehicleImage(vehicle.id, vehicle.images?.[0] || "")
                          }
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
              {selectedIds.map((id, index) => {
                const v = selectedVehicles[index];
                return (
                  <div key={index} className="px-5 py-4 text-sm font-bold text-center">
                    {v?.name || "Đang tải..."}
                  </div>
                );
              })}
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
              {selectedIds.map((id, index) => {
                const v = selectedVehicles[index];
                return (
                  <div
                    key={index}
                    className="px-5 py-4 text-sm font-bold text-[#0562D2] text-center"
                  >
                    {v ? formatPriceShort(v.basePrice) : "—"}
                  </div>
                );
              })}
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
                {selectedIds.map((id, index) => {
                  const v = selectedVehicles[index];
                  // Find the first version that has any non-empty specs, fallback to the first version
                  const representativeVersion = v?.versions?.find((ver: any) => 
                    Object.values(ver.specs || {}).some(val => typeof val === 'string' && val.trim() !== '')
                  ) || v?.versions?.[0];

                  const specValue = representativeVersion?.specs?.[spec.key] || "—";
                  return (
                    <div
                      key={index}
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
              {selectedIds.map((id, index) => {
                const v = selectedVehicles[index];
                return v ? (
                  <div
                    key={index}
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
                  <div key={index} className="px-5 py-5" />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <BookingBanner />
    </div>
  );
}
