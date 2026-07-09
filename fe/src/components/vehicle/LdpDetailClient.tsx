"use client";

import { useVehicle, VehicleTabBar } from "./VehicleLayoutClient";
import VehicleLayoutClient from "./VehicleLayoutClient";
import Blocks, { resolveImageUrl } from "@/components/blocks/Blocks";
import { Phone, MessageCircle, Sparkles, ChevronRight } from "lucide-react";

function LdpInnerContent({ salesConsultant, layoutBlocks, promotions, vehicle }: any) {
  const { openQuoteDrawer, openDriveDrawer } = useVehicle();

  // Backwards compatibility dynamic injection for existing LDP pages
  let resolvedBlocks = [...layoutBlocks];
  const hasConsultantBlock = resolvedBlocks.some((b: any) => b.type === "LdpSalesConsultant");
  const hasPromotionsBlock = resolvedBlocks.some((b: any) => b.type === "LdpPromotions");
  
  if (!hasConsultantBlock) {
    const heroIndex = resolvedBlocks.findIndex((b: any) => b.type === "HeroBanner");
    resolvedBlocks.splice(heroIndex !== -1 ? heroIndex + 1 : 0, 0, {
      id: 'default-sales-consultant',
      type: 'LdpSalesConsultant',
      data: {}
    });
  }
  
  if (!hasPromotionsBlock) {
    const consultantIndex = resolvedBlocks.findIndex((b: any) => b.type === "LdpSalesConsultant");
    resolvedBlocks.splice(consultantIndex !== -1 ? consultantIndex + 1 : 1, 0, {
      id: 'default-ldp-promotions',
      type: 'LdpPromotions',
      data: {
        title: "Chương Trình Khuyến Mãi Đặc Biệt",
        description: "Nhận ưu đãi độc quyền từ Cố vấn khi đăng ký mua xe trong tháng này."
      }
    });
  }

  // Tách block Hero và các block khác
  const heroBlock = resolvedBlocks.find((b: any) => b.type === "HeroBanner");
  const otherBlocks = resolvedBlocks.filter((b: any) => b.type !== "HeroBanner");

  return (
    <div className="relative pb-16 md:pb-0">
      {/* 1. HERO BANNER */}
      {heroBlock && (
        <Blocks
          layout={[heroBlock]}
          vehicle={vehicle}
          openQuoteDrawer={openQuoteDrawer}
          openDriveModal={() => openDriveDrawer()}
          startIndex={0}
          salesConsultant={salesConsultant}
          promotions={promotions}
        />
      )}

      {/* TAB BAR DÒNG XE */}
      <VehicleTabBar />

      {/* 2. OTHER LAYOUT BLOCKS (including Consultant & Promotions dynamic blocks) */}
      <Blocks
        layout={otherBlocks}
        vehicle={vehicle}
        openQuoteDrawer={openQuoteDrawer}
        openDriveModal={() => openDriveDrawer()}
        startIndex={heroBlock ? 1 : 0}
        salesConsultant={salesConsultant}
        promotions={promotions}
      />

      {/* FLOATING SALES CONSULTANT WIDGET */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-[99] flex flex-col gap-3 font-sans">
        {/* Zalo Button */}
        {salesConsultant.zalo_url && (
          <a
            href={salesConsultant.zalo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-[#0068ff] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
            title="Chat Zalo"
          >
            <MessageCircle className="w-7 h-7" />
          </a>
        )}
        
        {/* Hotline Button */}
        {salesConsultant.phone && (
          <a
            href={`tel:${salesConsultant.phone}`}
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
            title="Gọi Hotline"
          >
            <Phone className="w-6 h-6 animate-pulse" />
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
  const { vehicle, sales_consultant, layout_blocks, promotions } = initialData;

  return (
    <VehicleLayoutClient
      initialVehicle={vehicle}
      allVehicles={[]}
      salesConsultantId={sales_consultant.id}
    >
      <LdpInnerContent
        salesConsultant={sales_consultant}
        layoutBlocks={layout_blocks}
        promotions={promotions}
        vehicle={vehicle}
      />
    </VehicleLayoutClient>
  );
}
