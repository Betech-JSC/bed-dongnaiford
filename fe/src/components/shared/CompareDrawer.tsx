"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, GitCompare, Trash2, ArrowRight } from "lucide-react";
import { vehicles, type Vehicle } from "@/data/vehicles";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import { formatPriceShort } from "@/lib/rolling-cost";

export default function CompareDrawer() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Sync with localStorage
  const loadCompareList = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("compare-vehicles");
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids)) {
            setSelectedIds(ids);
            // Open drawer if there are items
            setIsOpen(ids.length > 0);
            return;
          }
        } catch (e) {
          console.error("Error parsing compare storage:", e);
        }
      }
      setSelectedIds([]);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    loadCompareList();

    // Listen for global comparison updates
    const handleUpdate = () => {
      loadCompareList();
    };

    window.addEventListener("compare-updated", handleUpdate);
    return () => {
      window.removeEventListener("compare-updated", handleUpdate);
    };
  }, []);

  const handleRemove = (id: string) => {
    const updated = selectedIds.filter((item) => item !== id);
    localStorage.setItem("compare-vehicles", JSON.stringify(updated));
    setSelectedIds(updated);
    
    // Trigger global update event
    window.dispatchEvent(new Event("compare-updated"));
  };

  const handleClearAll = () => {
    localStorage.removeItem("compare-vehicles");
    setSelectedIds([]);
    setIsOpen(false);
    window.dispatchEvent(new Event("compare-updated"));
  };

  if (selectedIds.length === 0) return null;

  // Resolve vehicles details
  const compareVehicles = selectedIds
    .map((id) => vehicles.find((v) => v.id === id))
    .filter(Boolean) as Vehicle[];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-[#00095B]/90 backdrop-blur-md border-t border-white/10 text-white shadow-[0_-8px_30px_rgb(0,0,0,0.3)] transition-all duration-500 ease-out transform ${
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-48px)]"
      }`}
    >
      {/* Header bar / Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 flex items-center justify-between px-6 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-sm font-bold tracking-wide uppercase">
            So sánh xe ({compareVehicles.length}/3)
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-white/70">
          <span>{isOpen ? "Thu nhỏ" : "Mở rộng"}</span>
          <div className="w-4 h-4 flex items-center justify-center">
            <span
              className={`block w-2 h-2 border-r border-b border-white transform transition-transform duration-300 ${
                isOpen ? "rotate-45 -translate-y-0.5" : "-rotate-135 translate-y-0.5"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Content body */}
      <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Vehicles list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
          {compareVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-3 relative transition-all duration-200 group"
            >
              {/* Image Preview */}
              <div className="relative w-16 h-10 flex-shrink-0 bg-black/20 rounded-lg overflow-hidden">
                <Image
                  src={getPopularVehicleImage(vehicle.id, vehicle.images[0])}
                  alt={vehicle.name}
                  fill
                  sizes="64px"
                  className="object-contain"
                  onError={handleImageError}
                />
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold truncate uppercase text-white">
                  {vehicle.name}
                </h4>
                <p className="text-xs text-blue-400 font-medium">
                  {formatPriceShort(vehicle.basePrice)}
                </p>
              </div>

              {/* Individual Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(vehicle.id);
                }}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-white/50 transition-all cursor-pointer absolute -top-1.5 -right-1.5 border-0"
                title="Xóa khỏi danh sách so sánh"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Empty placeholders to reach 3 items */}
          {Array.from({ length: 3 - compareVehicles.length }).map((_, i) => (
            <div
              key={i}
              className="border border-dashed border-white/20 rounded-xl p-3 flex items-center justify-center h-[66px] text-xs text-white/40 font-medium select-none"
            >
              <span>+ Trống</span>
            </div>
          ))}
        </div>

        {/* Action button panel */}
        <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <Link
            href={`/cong-cu/so-sanh-xe?ids=${selectedIds.join(",")}`}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#0562D2] hover:bg-[#044ea7] hover:scale-105 active:scale-95 text-white font-bold uppercase text-xs tracking-wider px-6 py-3 rounded-full transition-all shadow-md cursor-pointer border-0 w-full"
          >
            <span>So sánh ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          
          <button
            onClick={handleClearAll}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white/60 hover:text-red-400 py-2.5 px-4 rounded-full transition-colors cursor-pointer bg-transparent border border-solid border-white/20 hover:border-red-500/30 w-full md:w-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa tất cả</span>
          </button>
        </div>
      </div>
    </div>
  );
}
