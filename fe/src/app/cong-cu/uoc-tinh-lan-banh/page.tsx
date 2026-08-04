"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Phone, ArrowRight, CreditCard, Scale } from "lucide-react";
import {
  calculateRollingCost,
  formatVND,
  type RollingCostBreakdown,
} from "@/lib/rolling-cost";
import { getPopularVehicleImage, handleImageError } from "@/lib/site-assets";
import BookingBanner from "@/components/services/BookingBanner";
import { vehiclesAPI, regionsAPI, registrationFeesAPI } from "@/lib/api";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import { vehicles as staticVehicles } from "@/data/vehicles";
import { resolveImageUrl } from "@/components/blocks/Blocks";

// Helper function to group individual dynamic variants into parent model series
function groupVehiclesBySeries(apiVehicles: any[]) {
  if (!Array.isArray(apiVehicles)) return [];
  const groups: { [key: string]: {
    id: string;
    name: string;
    type: string;
    typeName: string;
    image_url: string;
    versions: any[];
  }} = {};

  apiVehicles.forEach((vehicle) => {
    if (!vehicle) return;
    const title = vehicle.title || vehicle.name || "";
    const titleLower = title.toLowerCase();
    let seriesKey = "";
    let seriesName = "";
    let typeName = "";
    
    if (titleLower.includes("territory")) {
      seriesKey = "ford-territory";
      seriesName = "FORD TERRITORY";
      typeName = "SUV 5 Chỗ";
    } else if (titleLower.includes("everest")) {
      seriesKey = "ford-everest";
      seriesName = "FORD EVEREST";
      typeName = "SUV 7 Chỗ";
    } else if (titleLower.includes("ranger") || titleLower.includes("raptor")) {
      seriesKey = "ford-ranger";
      seriesName = "FORD RANGER";
      typeName = "Bán tải 5 Chỗ";
    } else if (titleLower.includes("transit")) {
      seriesKey = "ford-transit-2024";
      seriesName = "FORD TRANSIT";
      typeName = "Thương mại 16 Chỗ";
    } else if (titleLower.includes("tourneo")) {
      seriesKey = "new-tourneo";
      seriesName = "FORD TOURNEO";
      typeName = "MPV 7 Chỗ";
    } else {
      seriesKey = vehicle.slug || `vehicle-${vehicle.id || Math.random()}`;
      seriesName = title || "Xe Ford";
      seriesKey = seriesKey === "ranger-wildtrak" ? "ford-ranger" : seriesKey;
      seriesKey = seriesKey === "everest-titanium-plus" ? "ford-everest" : seriesKey;
      seriesKey = seriesKey === "territory-titanium-x" ? "ford-territory" : seriesKey;
      seriesKey = seriesKey === "transit-premium" ? "ford-transit-2024" : seriesKey;
      typeName = vehicle.type === "suv" ? "SUV" : vehicle.type === "pickup" ? "Bán tải" : "Thương mại";
    }

    if (!groups[seriesKey]) {
      groups[seriesKey] = {
        id: seriesKey,
        name: seriesName,
        type: vehicle.type || "suv",
        typeName: typeName,
        image_url: vehicle.image_thumbnail_url || vehicle.image_url || resolveImageUrl(vehicle.image) || "",
        versions: []
      };
    }

    const vehicleVersions = Array.isArray(vehicle.versions) && vehicle.versions.length > 0
      ? vehicle.versions
      : [{
          id: vehicle.slug || `version-${vehicle.id}`,
          name: title || "Phiên bản chuẩn",
          price: typeof vehicle.base_price === 'string' ? parseFloat(vehicle.base_price) : (vehicle.base_price || 0),
          specs: vehicle.specs || {},
          image_url: vehicle.image_thumbnail_url || vehicle.image_url || resolveImageUrl(vehicle.image) || ""
        }];

    vehicleVersions.forEach((v: any) => {
      if (!v) return;
      groups[seriesKey].versions.push({
        id: String(v.slug || v.id || `v-${v.name || 'default'}`),
        name: v.name || v.title || title || "Phiên bản chuẩn",
        price: typeof v.price === 'string' ? parseFloat(v.price) : (v.price || 0),
        specs: v.specs || {},
        image_url: v.image_url || resolveImageUrl(v.image) || v.image_thumbnail_url || resolveImageUrl(v.image_thumbnail) || ""
      });
    });
  });

  return Object.values(groups);
}

function RollingCostContent() {
  const searchParams = useSearchParams();
  const urlVehicleId = searchParams.get("vehicle");
  const urlVersionId = searchParams.get("version");

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("Đồng Nai");
  const [registrationFees, setRegistrationFees] = useState<any[]>([]);
  const [result, setResult] = useState<RollingCostBreakdown | null>(null);
  const [animateReset, setAnimateReset] = useState(false);

  // Trigger fade/scale transition effect when values change
  useEffect(() => {
    setAnimateReset(true);
    const timer = setTimeout(() => {
      setAnimateReset(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedVehicleId, selectedVersionId, selectedProvince]);

  // Fetch provinces & registration fees from API
  useEffect(() => {
    regionsAPI.getProvinces()
      .then((res) => {
        const provincesList = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (provincesList.length > 0) {
          setProvinces(provincesList);
          const hasDongNai = provincesList.some((p: any) => p?.name?.includes("Đồng Nai"));
          if (hasDongNai) {
            setSelectedProvince("Đồng Nai");
          } else {
            setSelectedProvince(provincesList[0].name || "Đồng Nai");
          }
        } else {
          setProvinces([
            { id: "dongnai", name: "Đồng Nai" },
            { id: "hcm", name: "TP. Hồ Chí Minh" },
            { id: "binhduong", name: "Bình Dương" },
            { id: "vungtau", name: "Bà Rịa - Vũng Tàu" },
            { id: "longan", name: "Long An" },
            { id: "hanoi", name: "Hà Nội" },
          ]);
          setSelectedProvince("Đồng Nai");
        }
      })
      .catch((err) => {
        console.warn("Notice loading provinces:", err);
        setProvinces([
          { id: "dongnai", name: "Đồng Nai" },
          { id: "hcm", name: "TP. Hồ Chí Minh" },
          { id: "binhduong", name: "Bình Dương" },
          { id: "vungtau", name: "Bà Rịa - Vũng Tàu" },
          { id: "longan", name: "Long An" },
          { id: "hanoi", name: "Hà Nội" },
        ]);
        setSelectedProvince("Đồng Nai");
      });

    registrationFeesAPI.getAll()
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setRegistrationFees(res.data);
        }
      })
      .catch((err) => {
        console.warn("Notice loading registration fees:", err);
        setRegistrationFees([]);
      });
  }, []);

  // Fetch dynamic vehicles from API
  useEffect(() => {
    setLoading(true);
    vehiclesAPI
      .getAll({ with_versions: 1 })
      .then((res) => {
        const rawVehicles = res?.data || (Array.isArray(res) ? res : null);
        let grouped: any[] = [];
        if (Array.isArray(rawVehicles) && rawVehicles.length > 0) {
          grouped = groupVehiclesBySeries(rawVehicles);
        }
        if (grouped.length === 0) {
          grouped = groupVehiclesBySeries(staticVehicles);
        }
        
        if (grouped.length > 0) {
          setVehicles(grouped);
          
          const defaultVehicleId = urlVehicleId && grouped.some((v) => v.id === urlVehicleId)
            ? urlVehicleId
            : grouped[0]?.id || "";
          setSelectedVehicleId(defaultVehicleId);

          const vehicle = grouped.find((v) => v.id === defaultVehicleId);
          if (vehicle && Array.isArray(vehicle.versions) && vehicle.versions.length > 0) {
            const matchVersion =
              urlVersionId && vehicle.versions.some((v: any) => String(v.id) === String(urlVersionId))
                ? urlVersionId
                : vehicle.versions[0]?.id || "";
            setSelectedVersionId(String(matchVersion));
          }
        }
      })
      .catch((err) => {
        console.warn("Notice loading vehicles for estimator:", err);
        const grouped = groupVehiclesBySeries(staticVehicles);
        setVehicles(grouped);
        const defaultVehicleId = urlVehicleId && grouped.some((v) => v.id === urlVehicleId)
          ? urlVehicleId
          : grouped[0]?.id || "";
        setSelectedVehicleId(defaultVehicleId);

        const vehicle = grouped.find((v) => v.id === defaultVehicleId);
        if (vehicle && Array.isArray(vehicle.versions) && vehicle.versions.length > 0) {
          const matchVersion =
            urlVersionId && vehicle.versions.some((v: any) => String(v.id) === String(urlVersionId))
              ? urlVersionId
              : vehicle.versions[0]?.id || "";
          setSelectedVersionId(String(matchVersion));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlVehicleId, urlVersionId]);

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle && vehicle.versions.length > 0) {
      setSelectedVersionId(vehicle.versions[0].id);
    } else {
      setSelectedVersionId("");
    }
  };

  // Calculate result whenever selections change
  useEffect(() => {
    if (vehicles.length === 0 || !selectedVehicleId || !selectedVersionId) return;
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
    const version = vehicle?.versions.find((v: any) => String(v.id) === String(selectedVersionId));
    if (vehicle && version) {
      setResult(calculateRollingCost(vehicle, version, selectedProvince, registrationFees));
    }
  }, [selectedVehicleId, selectedVersionId, selectedProvince, vehicles, registrationFees]);

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const currentVersion = currentVehicle?.versions.find(
    (v: any) => String(v.id) === String(selectedVersionId)
  );

  const costBreakdown = result
    ? [
        { label: "Giá xe niêm yết", value: result.basePrice },
        { label: "Thuế trước bạ", value: result.registrationTax },
        { label: "Phí biển số", value: result.plateFee },
        { label: "Phí đăng kiểm", value: result.registryFee },
        { label: "Phí bảo trì đường bộ (12 tháng)", value: result.roadFee },
        { label: "Bảo hiểm TNDS bắt buộc", value: result.insuranceFee },
        ...(result.serviceFee && result.serviceFee > 0 ? [{ label: "Phí dịch vụ đăng ký", value: result.serviceFee }] : []),
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
          {loading ? (
            <div className="py-24 text-center">
              <div className="animate-spin inline-block w-10 h-10 border-4 border-[#0562d2] border-t-transparent rounded-full" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
              <p className="mt-4 text-gray-500 font-medium">Đang tải cấu hình xe & cách tính phí lăn bánh...</p>
            </div>
          ) : (
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
                        onChange={(e) => handleVehicleChange(e.target.value)}
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
                          {currentVehicle.versions.map((ver: any) => (
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
                          setSelectedProvince(e.target.value)
                        }
                        className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#0562d2] focus:border-transparent cursor-pointer"
                      >
                        {provinces.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
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
                          src={
                            resolveImageUrl(
                              currentVersion?.image_url ||
                              currentVehicle.image_url ||
                              getPopularVehicleImage(currentVehicle.id)
                            )
                          }
                          alt={currentVersion?.name || currentVehicle.name}
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
                  <div className={`space-y-6 transition-all duration-300 transform ${
                    animateReset ? "opacity-30 scale-[0.98] translate-y-1 blur-[0.5px]" : "opacity-100 scale-100 translate-y-0 blur-0"
                  }`}>
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
                            <AnimatedNumber value={item.value} formatFn={formatVND} />
                          </span>
                        </div>
                      ))}

                      {/* Total */}
                      <div className="flex items-center justify-between px-6 py-5 bg-[#00095B] text-white">
                        <span className="text-base font-bold">
                          TỔNG GIÁ LĂN BÁNH (Dự kiến)
                        </span>
                        <span className="text-xl font-black">
                          <AnimatedNumber value={result.total} formatFn={formatVND} />
                        </span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/lien-he"
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
                          <CreditCard className="w-5 h-5" />
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
                          <Scale className="w-5 h-5" />
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
          )}
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
