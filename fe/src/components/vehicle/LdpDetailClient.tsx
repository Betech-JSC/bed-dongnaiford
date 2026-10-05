"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useVehicle } from "./VehicleLayoutClient";
import VehicleLayoutClient from "./VehicleLayoutClient";
import Blocks, { resolveImageUrl } from "@/components/blocks/Blocks";
import { Phone, Car } from "lucide-react";

const ZaloIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="white" />
    <text x="50" y="63" fontStyle="normal" fontWeight="900" fontSize="32" fill="#0068FF" textAnchor="middle">Zalo</text>
  </svg>
);

const resolveZaloUrl = (zaloUrl?: string, phone?: string): string => {
  const target = (zaloUrl || phone || "").trim();
  if (!target) return "";
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }
  if (target.startsWith("zalo.me/")) {
    return `https://${target}`;
  }
  const cleanPhone = target.replace(/[^0-9]/g, "");
  if (cleanPhone) {
    return `https://zalo.me/${cleanPhone}`;
  }
  return target;
};

function LdpInnerContent({ salesConsultant, layoutBlocks, promotions, vehicle, allVehicles }: any) {
  const { openQuoteDrawer, openDriveDrawer } = useVehicle();
  const finalZaloUrl = resolveZaloUrl(salesConsultant?.zalo_url, salesConsultant?.phone);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#ldp-vehicles-tabs") {
      const el = document.getElementById("ldp-vehicles-tabs");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [vehicle?.slug, vehicle?.id]);

  // Backwards compatibility dynamic injection for existing LDP pages
  // Chuẩn hóa và map các block legacy (nếu có)
  let resolvedBlocks = [...layoutBlocks]
    .filter((b: any) => b && b.type !== "ThreeSixtyViewer")
    .map((b: any) => {
      if (b.type === "HeroBanner") return { ...b, type: "LdpHeroBanner" };
      if (b.type === "AccordionFAQs") return { ...b, type: "LdpFaq" };
      return b;
    });

  // Chỉ nạp block mặc định nếu LDP hoàn toàn chưa có cấu hình layout_blocks nào (fallback)
  const isBlocksEmpty = resolvedBlocks.length === 0;

  if (isBlocksEmpty) {
    resolvedBlocks = [
      {
        id: 'default-hero-banner',
        type: 'LdpHeroBanner',
        data: {}
      },
      {
        id: 'default-sales-consultant',
        type: 'LdpSalesConsultant',
        data: {}
      },
      {
        id: 'default-ldp-vehicles-grid',
        type: 'LdpVehiclesGrid',
        data: {
          title: "Dòng xe Cố vấn phụ trách",
          subtitle: `Danh sách các mẫu xe chính hãng đang được tư vấn bởi ${salesConsultant?.name || "Cố vấn bán hàng"}.`
        }
      },
      {
        id: 'default-ldp-promotions',
        type: 'LdpPromotions',
        data: {
          title: "Chương Trình Khuyến Mãi Đặc Biệt",
          description: "Nhận ưu đãi độc quyền từ Cố vấn khi đăng ký mua xe trong tháng này."
        }
      },
      {
        id: 'default-ldp-technology',
        type: 'LdpTechnology',
        data: {}
      },
      {
        id: 'default-ldp-services',
        type: 'LdpServices',
        data: {}
      },
      {
        id: 'default-ldp-faq',
        type: 'LdpFaq',
        data: {}
      }
    ];
  }

  // Chia danh sách block linh hoạt theo vị trí của HeroBanner (cho phép kéo block lên trước cả Hero)
  const heroIndex = resolvedBlocks.findIndex((b: any) => b.type === "HeroBanner" || b.type === "LdpHeroBanner");
  const topBlocks = heroIndex > 0 ? resolvedBlocks.slice(0, heroIndex) : [];
  const heroBlock = heroIndex !== -1 ? resolvedBlocks[heroIndex] : null;
  const bottomBlocks = heroIndex !== -1 ? resolvedBlocks.slice(heroIndex + 1) : resolvedBlocks;

  const consultantSlug = salesConsultant?.slug || salesConsultant?.name?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="relative pb-16 md:pb-0">
      {/* 0. CÁC BLOCK ĐƯỢC ĐẶT TRƯỚC HERO (nếu admin kéo lên đầu trang) */}
      {topBlocks.length > 0 && (
        <Blocks
          layout={topBlocks}
          vehicle={vehicle}
          openQuoteDrawer={openQuoteDrawer}
          openDriveModal={() => openDriveDrawer()}
          startIndex={0}
          salesConsultant={salesConsultant}
          promotions={promotions}
          allVehicles={allVehicles}
        />
      )}

      {/* 1. HERO BANNER */}
      {heroBlock && (
        <Blocks
          layout={[heroBlock]}
          vehicle={vehicle}
          openQuoteDrawer={openQuoteDrawer}
          openDriveModal={() => openDriveDrawer()}
          startIndex={topBlocks.length}
          salesConsultant={salesConsultant}
          promotions={promotions}
          allVehicles={allVehicles}
        />
      )}

      {/* MULTI-VEHICLE SWITCHER TAB BAR */}
      {allVehicles && allVehicles.length > 1 && (
        <div id="ldp-vehicles-tabs" className="bg-[#0b192e] text-white py-3.5 px-4 border-y border-white/10 sticky top-0 z-[40] shadow-md scroll-mt-2">
          <div className="max-w-[1152px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 shrink-0">
              <Car className="w-4 h-4 text-[#0562D2]" />
              <span>Dòng xe cố vấn phụ trách ({allVehicles.length}):</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {allVehicles.map((v: any) => {
                const isActive = (v.slug || v.id) === (vehicle.slug || vehicle.id);
                const vehicleSlug = v.slug || v.id;
                const href = salesConsultant.custom_domain
                  ? `/${vehicleSlug}`
                  : `/ldp/${consultantSlug}/${vehicleSlug}`;
                const targetHref = `${href}#ldp-vehicles-tabs`;

                return (
                  <Link
                    key={v.id}
                    href={targetHref}
                    scroll={false}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                      isActive
                        ? "bg-[#0562D2] text-white border-[#0562D2] shadow-sm"
                        : "bg-white/10 text-gray-200 border-white/10 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {v.title || v.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. CÁC BLOCK BÊN DƯỚI (theo đúng thứ tự admin kéo thả trong CMS) */}
      <Blocks
        layout={bottomBlocks}
        vehicle={vehicle}
        openQuoteDrawer={openQuoteDrawer}
        openDriveModal={() => openDriveDrawer()}
        startIndex={topBlocks.length + (heroBlock ? 1 : 0)}
        salesConsultant={salesConsultant}
        promotions={promotions}
        allVehicles={allVehicles}
      />

      {/* FLOATING SALES CONSULTANT WIDGET */}
      <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-4 md:right-6 z-[99] flex flex-col items-end gap-2.5 font-sans">
        {/* Zalo Button */}
        {finalZaloUrl && (
          <a
            href={finalZaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 md:px-4 md:py-2.5 bg-[#0068ff] hover:bg-[#0057d6] text-white rounded-full shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-400/30"
            title="Liên hệ Zalo"
          >
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center">
              <ZaloIcon className="w-full h-full" />
            </div>
            <span className="text-xs md:text-sm font-bold tracking-wide pr-1">Liên hệ Zalo</span>
          </a>
        )}
        
        {/* Hotline Button */}
        {salesConsultant.phone && (
          <a
            href={`tel:${salesConsultant.phone}`}
            className="flex items-center gap-2 px-3.5 py-2.5 md:px-4 md:py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-full shadow-lg shadow-green-600/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/30"
            title="Gọi Hotline"
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" />
            <span className="text-xs md:text-sm font-bold tracking-wide pr-1">Hotline: {salesConsultant.phone}</span>
          </a>
        )}
      </div>

      {/* STICKY BOTTOM BAR FOR MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[98] bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
        <div className="flex items-center gap-3">
          {salesConsultant.avatar && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <img
                src={resolveImageUrl(salesConsultant.avatar)}
                alt={salesConsultant.name}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 leading-none">{salesConsultant.name}</span>
            <span className="text-[10px] text-gray-500 mt-1 leading-none">{salesConsultant.job_title || "Cố vấn bán hàng"}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {salesConsultant.phone && (
            <a
              href={`tel:${salesConsultant.phone}`}
              className="bg-green-600 text-white px-3.5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Phone className="w-3.5 h-3.5" /> Gọi điện
            </a>
          )}
          <button
            onClick={() => openQuoteDrawer()}
            className="bg-[#0562D2] hover:bg-[#0052b4] text-white px-3.5 py-2.5 rounded-lg font-bold text-xs active:scale-95 transition-transform border-0"
          >
            Báo giá ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LdpDetailClient({ initialData }: { initialData: any }) {
  const { vehicle, vehicles, sales_consultant, layout_blocks, promotions } = initialData;
  const allVehicles = (vehicles && vehicles.length > 0) ? vehicles : [vehicle];

  return (
    <VehicleLayoutClient
      initialVehicle={vehicle}
      allVehicles={allVehicles}
      salesConsultantId={sales_consultant?.id}
    >
      <LdpInnerContent
        salesConsultant={sales_consultant}
        layoutBlocks={layout_blocks}
        promotions={promotions}
        vehicle={vehicle}
        allVehicles={allVehicles}
      />
    </VehicleLayoutClient>
  );
}
