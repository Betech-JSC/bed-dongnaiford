"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X, Plus, ArrowRight, Trash2, GitCompare } from "lucide-react";
import { type Vehicle, type Specs } from "@/data/vehicles";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import { formatPriceShort } from "@/lib/rolling-cost";
import BookingBanner from "@/components/services/BookingBanner";
import { vehiclesAPI } from "@/lib/api";

const mapSpecKey = (key: string, val: string, result: Record<string, string>) => {
  const k = key.trim().toLowerCase();
  const v = val.trim();
  if (!k || !v) return;

  if (k.includes('động cơ') || k.includes('dong co') || k.includes('engine') || k.includes('motor') || k.includes('pin')) {
    if (k.includes('pin') && !result.engine.toLowerCase().includes('pin')) {
      result.engine = result.engine ? `${result.engine} / Pin: ${v}` : `Pin: ${v}`;
    } else {
      result.engine = v;
    }
  } else if (k.includes('công suất') || k.includes('cong suat') || k.includes('power')) {
    result.power = v;
  } else if (k.includes('mô-men xoắn') || k.includes('mô men xoắn') || k.includes('mo-men xoan') || k.includes('torque')) {
    result.torque = v;
  } else if (k.includes('hộp số') || k.includes('hop so') || k.includes('transmission') || k.includes('truyền động') || k.includes('truyen dong')) {
    result.transmission = v;
  } else if (k.includes('dẫn động') || k.includes('dan dong') || k.includes('drivetrain')) {
    result.drivetrain = v;
  } else if (k.includes('kích thước') || k.includes('kich thuoc') || k.includes('dimensions')) {
    result.dimensions = v;
  } else if (k.includes('khoảng sáng gầm') || k.includes('khoang sang gam') || k.includes('clearance')) {
    result.clearance = v;
  } else if (k.includes('tiêu hao nhiên liệu') || k.includes('tieu hao nhien lieu') || k.includes('nhiên liệu') || k.includes('fuel') || k.includes('quãng đường') || k.includes('quang duong') || k.includes('wltp')) {
    result.fuelEconomy = v;
  }
};

const parseSpecsArray = (specsArray: any): Record<string, string> => {
  const result: Record<string, string> = {
    engine: '',
    power: '',
    torque: '',
    transmission: '',
    drivetrain: '',
    dimensions: '',
    clearance: '',
    fuelEconomy: ''
  };

  let actualArray = specsArray;
  
  if (actualArray && typeof actualArray === 'object' && !Array.isArray(actualArray)) {
    if (Array.isArray(actualArray.detailed_specs)) {
      actualArray = actualArray.detailed_specs;
    }
  }

  if (!Array.isArray(actualArray)) {
    return result;
  }

  actualArray.forEach((group: any) => {
    if (Array.isArray(group.items)) {
      group.items.forEach((item: any) => {
        mapSpecKey(item.name || '', item.value || '', result);
      });
    }

    const htmlContent = group.content || '';
    if (htmlContent) {
      const items = htmlContent.split(/<\/li>|<li>|<br\s*\/?>|\n/).map((item: string) => {
        return item.replace(/<[^>]*>/g, '').trim();
      }).filter(Boolean);

      items.forEach((item: string) => {
        const colonIndex = item.indexOf(':');
        if (colonIndex > -1) {
          const key = item.substring(0, colonIndex).trim().toLowerCase();
          const val = item.substring(colonIndex + 1).trim();
          mapSpecKey(key, val, result);
        }
      });
    }
  });

  return result;
};

function parseSpecs(specs: any, vehicleName: string): any[] {
  const parseDetailedItem = (item: any) => {
    if (item.content) {
      return {
        title: item.title ?? item.category ?? item.label ?? '',
        content: item.content
      };
    }
    if (Array.isArray(item.items)) {
      let contentHtml = '<ul class="list-disc pl-4 space-y-1">';
      item.items.forEach((subItem: any) => {
        const name = subItem.name || subItem.title || '';
        const value = subItem.value || subItem.content || '';
        if (name || value) {
          contentHtml += `<li>${name}: <strong>${value}</strong></li>`;
        }
      });
      contentHtml += '</ul>';
      return {
        title: item.title ?? item.category ?? item.label ?? '',
        content: contentHtml
      };
    }
    return {
      title: item.title ?? item.category ?? item.label ?? '',
      content: item.value ?? ''
    };
  };

  if (Array.isArray(specs)) {
    if (specs.length > 0 && (specs[0].items || specs[0].content)) {
      return specs.map(parseDetailedItem);
    }
    return specs.map(item => ({
      title: item.title ?? item.label ?? item.category ?? '',
      content: item.content ?? item.value ?? ''
    }));
  }

  if (specs && typeof specs === "object") {
    if (specs.detailed_specs && Array.isArray(specs.detailed_specs)) {
      return specs.detailed_specs.map(parseDetailedItem);
    }

    const keyLabelMap: Record<string, string> = {
      engine: 'Động cơ',
      power: 'Công suất cực đại',
      torque: 'Mô-men xoắn cực đại',
      transmission: 'Hộp số',
      drivetrain: 'Hệ dẫn động',
      dimensions: 'Kích thước (DxRxC)',
      clearance: 'Khoảng sáng gầm',
      fuelEconomy: 'Tiêu hao nhiên liệu'
    };
    const knownKeys = ['engine', 'power', 'torque', 'transmission', 'drivetrain', 'dimensions', 'clearance', 'fuelEconomy'];

    let contentHtml = '<ul class="list-disc pl-4 space-y-1">';
    let hasContent = false;
    knownKeys.forEach(key => {
      const val = specs[key];
      if (val != null && val !== '') {
        contentHtml += `<li>${keyLabelMap[key]}: <strong>${val}</strong></li>`;
        hasContent = true;
      }
    });
    Object.keys(specs).forEach(key => {
      if (!knownKeys.includes(key) && key !== 'detailed_specs') {
        const val = specs[key];
        if (val != null && val !== '') {
          contentHtml += `<li>${key}: <strong>${val}</strong></li>`;
          hasContent = true;
        }
      }
    });
    contentHtml += '</ul>';

    if (hasContent) {
      return [{ title: 'Thông số chung', content: contentHtml }];
    }
  }

  return [];
}

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
  const [hasClearedAll, setHasClearedAll] = useState(false);

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
              versions: v.versions ? v.versions.map((ver: any) => {
                const parsedSpecs = parseSpecsArray(ver.specs);
                return {
                  id: ver.id,
                  name: ver.name,
                  price: typeof ver.price === 'string' ? parseFloat(ver.price) : (ver.price || 0),
                  rawSpecs: ver.specs,
                  specs: {
                    engine: parsedSpecs.engine || ver.specs?.engine || ver.specs?.engine_type || '',
                    power: parsedSpecs.power || ver.specs?.power || '',
                    torque: parsedSpecs.torque || ver.specs?.torque || '',
                    transmission: parsedSpecs.transmission || ver.specs?.transmission || '',
                    drivetrain: parsedSpecs.drivetrain || ver.specs?.drivetrain || '',
                    dimensions: parsedSpecs.dimensions || ver.specs?.dimensions || '',
                    clearance: parsedSpecs.clearance || ver.specs?.clearance || '',
                    fuelEconomy: parsedSpecs.fuelEconomy || ver.specs?.fuelEconomy || ver.specs?.fuel_guide || ver.specs?.fuel_economy || '',
                  }
                };
              }) : []
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
    if (allVehicles.length > 0 && selectedIds.length === 0 && !hasClearedAll) {
      setSelectedIds([
        allVehicles[0]?.id || "",
        allVehicles[1]?.id || "",
      ].filter(Boolean));
    }
  }, [allVehicles, selectedIds, hasClearedAll]);

  // Sync URL query params with selectedIds
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (selectedIds.length > 0) {
        params.set("ids", selectedIds.join(","));
      } else {
        params.delete("ids");
      }
      const newSearch = params.toString();
      const newPath = newSearch ? `?${newSearch}` : window.location.pathname;
      window.history.replaceState(null, "", newPath);
    }
  }, [selectedIds]);

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
      setHasClearedAll(false);
      return updated;
    });
  };

  const handleRemove = (index: number) => {
    setSelectedIds((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("compare-vehicles", JSON.stringify(updated.filter(Boolean)));
      window.dispatchEvent(new Event("compare-updated"));
      if (updated.length === 0) {
        setHasClearedAll(true);
      }
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
          setHasClearedAll(false);
          return updated;
        });
      }
    }
  };

  const handleClearAll = () => {
    localStorage.removeItem("compare-vehicles");
    setSelectedIds([]);
    setHasClearedAll(true);
    window.dispatchEvent(new Event("compare-updated"));
  };

  const repVersions = selectedVehicles.map(v => 
    v ? (v.versions?.find((ver: any) => 
      Object.values(ver.specs || {}).some(val => typeof val === 'string' && val.trim() !== '')
    ) || v.versions?.[0]) : undefined
  );

  const isAnyElectric = selectedVehicles.some(v => {
    if (!v) return false;
    const name = (v.name || '').toLowerCase();
    const slug = (v.id || v.slug || '').toLowerCase();
    return name.includes("mach-e") || name.includes("mustang") || slug.includes("mach-e") || slug.includes("mustang");
  });

  const dynamicSpecLabels = [
    { key: "engine" as const, label: isAnyElectric ? "Động cơ / Motor" : "Động cơ" },
    { key: "power" as const, label: "Công suất cực đại" },
    { key: "torque" as const, label: "Mô-men xoắn cực đại" },
    { key: "transmission" as const, label: isAnyElectric ? "Hộp số / Truyền động" : "Hộp số" },
    { key: "drivetrain" as const, label: "Hệ dẫn động" },
    { key: "dimensions" as const, label: "Kích thước (DxRxC)" },
    { key: "clearance" as const, label: "Khoảng sáng gầm xe" },
    { key: "fuelEconomy" as const, label: isAnyElectric ? "Tiêu hao / Quãng đường" : "Tiêu hao nhiên liệu" },
  ];

  const detailedSpecsList = repVersions.map((ver, idx) => {
    const v = selectedVehicles[idx];
    if (!ver) return [];
    return parseSpecs(ver.rawSpecs || ver.specs, v?.name || "");
  });

  const allCategoryTitles = Array.from(
    new Set(
      detailedSpecsList.flat().map(item => item.title).filter(Boolean)
    )
  );

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
          {selectedIds.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                <GitCompare className="w-8 h-8 text-[#0562d2]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                Chưa có sản phẩm nào để so sánh
              </h3>
              <p className="text-gray-500 text-sm mb-8">
                Vui lòng chọn từ danh sách xe bên dưới để bắt đầu so sánh thông số kỹ thuật chi tiết.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                {listToSearch.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => {
                      setSelectedIds([vehicle.id]);
                      localStorage.setItem("compare-vehicles", JSON.stringify([vehicle.id]));
                      window.dispatchEvent(new Event("compare-updated"));
                      setHasClearedAll(false);
                    }}
                    className="p-4 rounded-xl border border-gray-100 hover:border-[#0562d2] hover:bg-blue-50/10 transition-all text-left flex flex-col items-center justify-center gap-2 group cursor-pointer bg-white"
                  >
                    <div className="relative w-full h-[60px]">
                      <Image
                        src={
                          vehicle.images?.[0]?.startsWith("http") || vehicle.images?.[0]?.startsWith("/")
                            ? vehicle.images[0]
                            : getPopularVehicleImage(vehicle.id, vehicle.images?.[0] || "")
                        }
                        alt={vehicle.name}
                        fill
                        sizes="120px"
                        className="object-contain group-hover:scale-105 transition-transform"
                        onError={handleImageError}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#1a1a1a] uppercase text-center truncate w-full mt-1">
                      {vehicle.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#0562D2] bg-blue-50 px-2 py-0.5 rounded-full">
                      + Thêm so sánh
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Header with Title & Clear All */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#1a1a1a] tracking-tight">
                  Danh sách so sánh
                </h2>
                <button
                  onClick={handleClearAll}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 px-4 py-2.5 rounded-xl transition-colors cursor-pointer bg-white border border-solid border-gray-200 hover:border-red-200 hover:bg-red-50/50 w-full sm:w-auto shadow-sm animate-fade-in"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa tất cả</span>
                </button>
              </div>

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
                      <button
                        onClick={() => handleRemove(index)}
                        className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-all cursor-pointer shadow-sm z-10 animate-fade-in"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

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
                              className="object-contain animate-fade-in"
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
                {dynamicSpecLabels.map((spec, specIdx) => (
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
                      const representativeVersion = repVersions[index];
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

                {/* Detailed Specs Sections (CMS group specs parsed and aligned) */}
                {allCategoryTitles.map((title) => (
                  <Fragment key={title}>
                    {/* Category Header Row */}
                    <div
                      className="grid border-b border-gray-200 bg-gray-100 text-gray-800 font-bold"
                      style={{
                        gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)`,
                      }}
                    >
                      <div className="px-5 py-3 text-xs md:text-sm uppercase tracking-wider text-[#00095B] col-span-full font-bold">
                        📂 {title}
                      </div>
                    </div>

                    {/* Content Row */}
                    <div
                      className="grid border-b border-gray-150 bg-white items-start"
                      style={{
                        gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)`,
                      }}
                    >
                      <div className="px-5 py-4 text-xs font-semibold text-gray-500 italic bg-gray-50/20">
                        Chi tiết
                      </div>
                      {selectedIds.map((id, index) => {
                        const specs = detailedSpecsList[index];
                        const groupSpec = specs?.find(s => s.title === title);
                        return (
                          <div
                            key={index}
                            className="px-5 py-4 text-xs md:text-sm text-gray-700 text-left border-l border-gray-100 font-normal [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_strong]:text-gray-900"
                          >
                            {groupSpec?.content ? (
                              <div dangerouslySetInnerHTML={{ __html: groupSpec.content }} />
                            ) : (
                              <span className="text-gray-400 italic text-xs">Không có thông tin</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Fragment>
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
            </>
          )}
        </div>
      </section>

      <BookingBanner />
    </div>
  );
}
