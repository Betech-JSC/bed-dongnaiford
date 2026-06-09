"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus, ChevronDown, Phone, Bookmark } from "lucide-react";
import { mediaAPI } from "@/lib/api";

const formatUploadError = (err: any): string => {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    if (err.data && typeof err.data === "object" && err.data.message) {
      return err.data.message;
    }
    if (err.message) return err.message;
    if (err.statusText) return `${err.statusText} (${err.status})`;
  }
  return "Đã xảy ra lỗi không xác định";
};

interface BlocksProps {
  layout?: any[];
  vehicle: any;
  openQuoteDrawer: (vehicleId?: string, versionId?: string) => void;
  openDriveModal: () => void;
  isEditMode?: boolean;
  onChangeBlock?: (index: number, updatedData: any) => void;
  onMoveBlock?: (index: number, direction: 'up' | 'down') => void;
  onDeleteBlock?: (index: number) => void;
  threeSixtyProps?: any;
  startIndex?: number;
  totalBlocks?: number;
  activeIndex?: number | null;
  onSelectBlock?: (index: number) => void;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: () => void;
  draggedIndex?: number | null;
  draggedOverIndex?: number | null;
}

export default function Blocks({ 
  layout, 
  vehicle, 
  openQuoteDrawer, 
  openDriveModal,
  isEditMode = false,
  onChangeBlock = () => {},
  onMoveBlock = () => {},
  onDeleteBlock = () => {},
  threeSixtyProps,
  startIndex = 0,
  totalBlocks,
  activeIndex = null,
  onSelectBlock,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedIndex = null,
  draggedOverIndex = null
}: BlocksProps) {
  if (!layout || !Array.isArray(layout) || layout.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {layout.map((block, index) => {
        let blockComponent = null;

        switch (block.type) {
          case "HeroBanner":
            blockComponent = (
              <HeroBannerBlock
                data={block.data}
                vehicle={vehicle}
                openQuoteDrawer={openQuoteDrawer}
                openDriveModal={openDriveModal}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "Promotions":
            blockComponent = (
              <PromotionsBlock
                data={block.data}
                vehicle={vehicle}
                openQuoteDrawer={openQuoteDrawer}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "ThreeSixtyViewer":
            blockComponent = (
              <ThreeSixtyViewerBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                threeSixtyProps={threeSixtyProps}
                anchorId={block.anchorId}
              />
            );
            break;
          case "FeaturesGrid":
            blockComponent = (
              <FeaturesGridBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "VersionsGrid":
            blockComponent = (
              <VersionsGridBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                openQuoteDrawer={openQuoteDrawer}
                anchorId={block.anchorId}
              />
            );
            break;
          case "SpecsGrid":
            blockComponent = (
              <SpecsGridBlock
                vehicle={vehicle}
                openQuoteDrawer={openQuoteDrawer}
                anchorId={block.anchorId}
              />
            );
            break;
          case "FeaturesList":
            blockComponent = (
              <FeaturesListBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "AccordionFAQs":
            blockComponent = (
              <AccordionFAQsBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          case "BookingBanner":
            blockComponent = (
              <BookingBannerBlock
                data={block.data}
                vehicle={vehicle}
                isEditMode={isEditMode}
                onChangeData={(updatedData: any) => onChangeBlock(index, updatedData)}
                anchorId={block.anchorId}
              />
            );
            break;
          default:
            blockComponent = null;
        }

        if (!blockComponent) return null;

        if (isEditMode) {
          const getBlockLabel = (type: string) => {
            switch (type) {
              case "HeroBanner": return "Banner lớn";
              case "Promotions": return "Khuyến mãi";
              case "ThreeSixtyViewer": return "Xoay 360°";
              case "FeaturesGrid": return "Lưới tính năng";
              case "VersionsGrid": return "Danh sách phiên bản";
              case "SpecsGrid": return "Thông số kỹ thuật";
              case "FeaturesList": return "Danh sách tính năng dọc";
              case "AccordionFAQs": return "Hỏi đáp (FAQs)";
              case "BookingBanner": return "Tư vấn & Đặt lịch";
              default: return type;
            }
          };

          return (
            <div 
              key={`edit-wrapper-${index}`}
              draggable
              onDragStart={(e) => onDragStart && onDragStart(e, startIndex + index)}
              onDragOver={(e) => onDragOver && onDragOver(e, startIndex + index)}
              onDrop={(e) => onDrop && onDrop(e, startIndex + index)}
              onDragEnd={onDragEnd}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('textarea')) {
                  return;
                }
                onSelectBlock && onSelectBlock(startIndex + index);
              }}
              className={`relative border-4 border-dashed transition-all my-2 rounded-xl overflow-hidden group/block cursor-pointer
                ${activeIndex === startIndex + index ? "border-[#0562d2] ring-4 ring-[#0562d2]/15 bg-[#0562d2]/5" : "border-[#0562d2]/40 hover:border-[#0562d2]"}
                ${draggedIndex === startIndex + index ? "opacity-35 scale-[0.98] border-dashed border-gray-400" : ""}
                ${draggedOverIndex === startIndex + index ? "border-amber-400 bg-amber-500/5" : ""}
              `}
            >
              {/* Block Action Controls Overlay */}
              <div className="absolute top-3 right-3 z-45 bg-white/95 backdrop-blur-xs shadow-md border border-gray-200 rounded-full px-4 py-1.5 flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 uppercase mr-2 select-none">
                  #{startIndex + index + 1} {getBlockLabel(block.type)}
                </span>
                
                {/* Move Up */}
                <button
                  type="button"
                  disabled={startIndex + index === 0}
                  onClick={() => onMoveBlock(index, 'up')}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:text-gray-300 disabled:hover:bg-transparent cursor-pointer border-0 bg-transparent text-sm font-semibold"
                  title="Di chuyển lên"
                >
                  ↑
                </button>
                
                {/* Move Down */}
                <button
                  type="button"
                  disabled={startIndex + index === (totalBlocks !== undefined ? totalBlocks : layout.length) - 1}
                  onClick={() => onMoveBlock(index, 'down')}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:text-gray-300 disabled:hover:bg-transparent cursor-pointer border-0 bg-transparent text-sm font-semibold"
                  title="Di chuyển xuống"
                >
                  ↓
                </button>

                <div className="w-[1px] h-4 bg-gray-200" />
                
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteBlock(index)}
                  className="p-1 hover:bg-red-50 text-red-500 hover:text-red-700 rounded cursor-pointer border-0 bg-transparent text-sm font-semibold"
                  title="Xóa block"
                >
                  🗑️
                </button>
              </div>

              {blockComponent}
            </div>
          );
        }

        return (
          <div key={`wrapper-${index}`}>
            {blockComponent}
          </div>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   1. HERO BANNER BLOCK
   ========================================================================== */
function HeroBannerBlock({ data, vehicle, openQuoteDrawer, openDriveModal, isEditMode, onChangeData, anchorId }: any) {
  const title = data.title || vehicle.name;
  const tagline = data.tagline || vehicle.tagline;
  const btnText = data.button_text || "Book Lái thử";
  const btnLink = data.button_link || "#drive";
  const bgImg = data.background_image || vehicle.images?.[0] || "/assets/territory-hero.png";

  // Alignment classes
  const alignClass = data.align === 'left' ? 'items-start text-left' 
                   : data.align === 'right' ? 'items-end text-right ml-auto'
                   : 'items-center text-center mx-auto';

  const btnAlignClass = data.align === 'center' ? 'justify-center'
                      : data.align === 'right' ? 'justify-end'
                      : 'justify-start';

  // Title Size Classes
  let titleSizeClass = "text-[36px] sm:text-[48px] md:text-[56px]";
  if (data.title_size === 'small') {
    titleSizeClass = "text-[28px] sm:text-[36px] md:text-[42px]";
  } else if (data.title_size === 'large') {
    titleSizeClass = "text-[44px] sm:text-[58px] md:text-[68px]";
  }

  // Styles for colors
  const titleStyle = data.title_color ? { color: data.title_color } : {};
  const taglineStyle = data.tagline_color ? { color: data.tagline_color } : {};

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await mediaAPI.upload(file);
      if (res && res.url) {
        onChangeData({ ...data, background_image: res.url });
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên: " + formatUploadError(err));
    }
  };

  const handleBtnClick = (e: React.MouseEvent) => {
    if (btnLink === "#drive" || btnText.toLowerCase().includes("lái thử")) {
      e.preventDefault();
      openDriveModal();
    } else if (btnLink === "#quote" || btnText.toLowerCase().includes("báo giá") || btnText.toLowerCase().includes("nhận báo giá")) {
      e.preventDefault();
      openQuoteDrawer();
    }
  };

  return (
    <section id={anchorId || undefined} className="relative h-[550px] sm:h-[650px] flex items-end overflow-hidden bg-black text-white pb-[68px] w-full">
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImg} 
          alt={title}
          fill
          sizes="100vw"
          className="object-cover object-center pointer-events-none"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent h-[250px] z-10" />
        
        {isEditMode && (
          <div className="absolute top-24 left-4 z-30 bg-black/75 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white">
            <span className="block mb-2 font-semibold">Ảnh nền Banner:</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUploadImage}
              className="block w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full relative z-20">
        <div className={`flex flex-col gap-[16px] sm:gap-[24px] py-[24px] w-full ${alignClass}`}>
          {isEditMode ? (
            <div className="space-y-3 w-full bg-black/55 p-4 rounded-xl border border-white/20 backdrop-blur-xs text-left">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">Slogan / Tagline</label>
              <input 
                type="text"
                value={tagline || ""}
                onChange={(e) => onChangeData({ ...data, tagline: e.target.value })}
                className="bg-transparent text-[#0562d2] font-semibold text-sm border border-dashed border-white/30 px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-blue-500"
                placeholder="Nhập Slogan"
              />
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề Banner</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => onChangeData({ ...data, title: e.target.value })}
                className="bg-transparent text-white font-['Ford_Antenna',sans-serif] font-semibold text-[32px] sm:text-[40px] tracking-[-0.96px] leading-[1.15] uppercase border border-dashed border-white/30 px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-blue-500"
                placeholder="Nhập Tiêu đề Banner"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Nút bấm</label>
                  <input 
                    type="text"
                    value={btnText}
                    onChange={(e) => onChangeData({ ...data, button_text: e.target.value })}
                    className="bg-transparent text-xs text-white border border-dashed border-white/30 px-3 py-1.5 rounded-lg w-full focus:outline-none"
                    placeholder="Nhãn nút"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Liên kết</label>
                  <input 
                    type="text"
                    value={btnLink}
                    onChange={(e) => onChangeData({ ...data, button_link: e.target.value })}
                    className="bg-transparent text-xs text-white border border-dashed border-white/30 px-3 py-1.5 rounded-lg w-full focus:outline-none"
                    placeholder="#drive hoặc link"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {tagline && (
                <span 
                  className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0562d2] bg-blue-50/10 px-3 py-1 rounded-full backdrop-blur-xs"
                  style={taglineStyle}
                >
                  {tagline}
                </span>
              )}
              <h1 
                className={`font-['Ford_Antenna',sans-serif] font-semibold text-white tracking-[-0.96px] leading-[1.15] uppercase ${titleSizeClass}`}
                style={titleStyle}
              >
                {title}
              </h1>
              
              <div className={`flex flex-wrap gap-[12px] items-start mt-2 w-full ${btnAlignClass}`}>
                <a 
                  href={btnLink}
                  onClick={handleBtnClick}
                  className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center overflow-clip px-[28px] py-[12px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer shadow-lg hover:shadow-blue-500/20"
                >
                  {btnText}
                </a>
                <button 
                  onClick={() => openQuoteDrawer()}
                  className="bg-transparent hover:bg-white/10 border border-solid border-white flex gap-[8px] items-center justify-center overflow-clip px-[28px] py-[12px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer"
                >
                  Nhận Báo Giá
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   2. SPECS COMPARISON BLOCK
   ========================================================================== */
function SpecsGridBlock({ vehicle, openQuoteDrawer, anchorId }: any) {
  const versions = vehicle.versions || [];
  
  if (versions.length === 0) return null;

  const compareItems = versions.map((ver: any, idx: number) => ({
    id: ver.id,
    name: ver.name,
    price: ver.price,
    image: vehicle.images?.[idx] || vehicle.images?.[0] || (idx === 0 
      ? "/assets/territory-hero.png" 
      : idx === 1 
        ? "/assets/territory-tech-split.png" 
        : "/assets/territory-promo.png"), 
    specs: ver.specs || {},
    isExternal: false
  }));

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-16 pb-12">
      <div className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0562d2] block">So sánh trực quan</span>
          <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[32px] sm:text-[40px] uppercase tracking-[-0.96px] leading-[1.2]">
            So sánh các phiên bản {vehicle.name.replace("NEW ", "")}
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Bảng đối chiếu thông số kỹ thuật và trang bị trực quan giữa các phiên bản xe
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full overflow-x-auto pb-4 scrollbar-none">
          {compareItems.map((item: any) => (
            <div 
              key={item.id}
              className="bg-white border border-gray-200/60 drop-shadow-[0px_4px_4px_rgba(16,24,40,0.06)] flex flex-col items-stretch relative w-full md:w-[368px] min-w-[280px] md:min-w-[320px] rounded-[12px] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
            >
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="aspect-[800/550] relative shrink-0 w-full bg-gray-50 overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 368px"
                    className="object-cover transition-transform duration-500 hover:scale-105 pointer-events-none"
                  />
                </div>
                <div className="content-stretch flex items-center justify-between p-[16px] relative shrink-0 w-full border-b border-gray-100 bg-white">
                  <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Ford_Antenna',sans-serif] font-semibold justify-center leading-[1.3] text-[#0562d2] text-[18px] tracking-[0.18px]">
                    <p>{item.name}</p>
                  </div>
                </div>
              </div>
              
              {/* specs */}
              <div className="p-[16px] flex flex-col gap-[12px] items-start relative bg-white border-b border-gray-100/50">
                <div className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[14px]">
                  <p>Động cơ & Hộp số</p>
                </div>
                <div className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[12px]">
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    <li>Động cơ: <strong className="text-black font-semibold">{item.specs.engine || "Đang cập nhật"}</strong></li>
                    <li>Công suất: <strong className="text-black font-semibold">{item.specs.power || "Đang cập nhật"}</strong></li>
                    <li>Mô-men xoắn: <strong className="text-black font-semibold">{item.specs.torque || "Đang cập nhật"}</strong></li>
                    <li>Hộp số: <strong className="text-black font-semibold">{item.specs.transmission || "Đang cập nhật"}</strong></li>
                  </ul>
                </div>
              </div>

              <div className="p-[16px] flex flex-col gap-[12px] items-start relative bg-[#f0f0f0]/50 border-b border-gray-100/50">
                <div className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[14px]">
                  <p>Kích thước & Trọng lượng</p>
                </div>
                <div className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[12px]">
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    <li>Kích thước: <strong className="text-black font-semibold">{item.specs.dimensions || "Đang cập nhật"}</strong></li>
                    <li>Gầm xe: <strong className="text-black font-semibold">{item.specs.clearance || "Đang cập nhật"}</strong></li>
                  </ul>
                </div>
              </div>

              <div className="p-[16px] flex flex-col gap-[12px] items-start relative bg-white border-b border-gray-100/50">
                <div className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[14px]">
                  <p>Hệ thống dẫn động</p>
                </div>
                <div className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[12px]">
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    <li>Hệ dẫn động: <strong className="text-black font-semibold">{item.specs.drivetrain || "Đang cập nhật"}</strong></li>
                  </ul>
                </div>
              </div>

              <div className="p-[16px] flex flex-col gap-[12px] items-start relative bg-[#f0f0f0]/50 border-b border-gray-100/50 flex-grow">
                <div className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[14px]">
                  <p>Tiêu thụ nhiên liệu</p>
                </div>
                <div className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[12px]">
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    <li>Kết hợp: <strong className="text-black font-semibold">{item.specs.fuelEconomy || "Đang cập nhật"}</strong></li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-white flex flex-col items-center justify-center shrink-0 w-full border-t border-gray-100/50">
                <button 
                  onClick={() => openQuoteDrawer(vehicle.id, item.id)}
                  className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer shadow-xs w-full"
                >
                  Báo giá
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   3. FEATURES LIST BLOCK
   ========================================================================== */
function FeaturesListBlock({ data, vehicle, isEditMode, onChangeData, anchorId }: any) {
  const features = data.features || [];

  const handleFeatureTextChange = (idx: number, key: string, val: string) => {
    const newFeatures = [...features];
    newFeatures[idx] = { ...newFeatures[idx], [key]: val };
    onChangeData({ ...data, features: newFeatures });
  };

  const handleUploadFeatureImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await mediaAPI.upload(file);
      if (res && res.url) {
        const newFeatures = [...features];
        newFeatures[idx] = { ...newFeatures[idx], image: res.url };
        onChangeData({ ...data, features: newFeatures });
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên: " + formatUploadError(err));
    }
  };

  const handleAddFeature = () => {
    const newFeatures = [...features, { 
      title: "TÍNH NĂNG MỚI", 
      description: "Nhập mô tả tính năng ở đây để thu hút khách hàng.", 
      image: vehicle?.images?.[0] || "/assets/territory-hero.png" 
    }];
    onChangeData({ ...data, features: newFeatures });
  };

  const handleRemoveFeature = (idx: number) => {
    const newFeatures = features.filter((_: any, i: number) => i !== idx);
    onChangeData({ ...data, features: newFeatures });
  };

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full py-16">
      <div className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0562d2] block">Tính năng vượt trội</span>
          <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[32px] sm:text-[40px] uppercase tracking-[-0.96px] leading-[1.2]">
            Trang Bị & Tiện Nghi
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Khám phá các trang bị công nghệ hiện đại và tiện ích đỉnh cao trên xe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat: any, idx: number) => {
            const featImg = feat.image || vehicle?.images?.[0] || "/assets/territory-hero.png";
            return (
              <div 
                key={idx}
                className="bg-white border border-[#EAECF0] rounded-2xl p-5 flex flex-col hover:shadow-lg hover:border-[#0562d2]/40 transition-all duration-300 group relative"
              >
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="absolute top-2 right-2 z-25 bg-red-100 hover:bg-red-200 text-red-700 text-xs px-2.5 py-1 rounded-full border-0 cursor-pointer font-semibold shadow-xs"
                  >
                    ✕ Xóa
                  </button>
                )}

                <div className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden mb-5 rounded-xl">
                  <Image
                    src={featImg}
                    alt={feat.title || `Tính năng ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  />
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center p-3 z-20">
                      <span className="text-[10px] font-bold text-white mb-2">Đổi ảnh:</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleUploadFeatureImage(idx, e)}
                        className="block w-full text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                <span className="inline-block text-xs font-bold text-[#0562D2] bg-blue-50 px-3 py-1 rounded-full mb-3 w-fit">
                  Nổi bật
                </span>

                {isEditMode ? (
                  <div className="space-y-2 flex-grow flex flex-col justify-start">
                    <input 
                      type="text" 
                      value={feat.title || ""} 
                      onChange={(e) => handleFeatureTextChange(idx, "title", e.target.value)}
                      className="text-base font-bold tracking-tight text-[#1A1A1A] border border-dashed border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-500 font-display uppercase bg-transparent"
                      placeholder="Tiêu đề tính năng"
                    />
                    <textarea 
                      value={feat.description || ""} 
                      onChange={(e) => handleFeatureTextChange(idx, "description", e.target.value)}
                      className="text-xs text-gray-600 border border-dashed border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-500 flex-grow min-h-[60px] bg-transparent resize-none"
                      placeholder="Mô tả tính năng"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold tracking-tight text-[#1A1A1A] mb-2 font-display uppercase group-hover:text-[#0562d2] transition-colors">
                      {feat.title || "Tính năng mới"}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feat.description || "Mô tả tính năng vượt trội."}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {isEditMode && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleAddFeature}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full cursor-pointer transition-colors shadow-md border-0"
            >
              + Thêm Tính năng mới
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
   4. ACCORDION FAQS BLOCK
   ========================================================================== */
function AccordionFAQsBlock({ data, vehicle, isEditMode, onChangeData, anchorId }: any) {
  const colorListStr = vehicle?.colors?.map((c: any) => c.name).join(", ");
  const faqs = data.faqs || [
    {
      q: `Xe ${vehicle?.name || "Ford"} có những màu ngoại thất nào?`,
      a: `Dòng xe ${vehicle?.name || "Ford"} hiện đang phân phối tại Đồng Nai Ford với các lựa chọn màu sắc ngoại thất: ${colorListStr || 'các phiên bản màu tiêu chuẩn'}.`
    },
    {
      q: `Chính sách bảo hành xe mới như thế nào?`,
      a: `Bảo hành chính hãng 3 năm hoặc 100.000 km tùy điều kiện nào đến trước.`
    }
  ];
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  const handleFaqTextChange = (idx: number, key: string, val: string) => {
    const newFaqs = [...faqs];
    newFaqs[idx] = { ...newFaqs[idx], [key]: val };
    onChangeData({ ...data, faqs: newFaqs });
  };

  const handleAddFaq = () => {
    const newFaqs = [...faqs, { q: "Câu hỏi thường gặp mới?", a: "Nhập câu trả lời ở đây." }];
    onChangeData({ ...data, faqs: newFaqs });
  };

  const handleRemoveFaq = (idx: number) => {
    const newFaqs = faqs.filter((_: any, i: number) => i !== idx);
    onChangeData({ ...data, faqs: newFaqs });
  };

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full py-16 border-t border-[#e5e5e5]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] lg:gap-[80px] items-start justify-center">
        
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0562d2] block">Giải đáp thắc mắc</span>
          <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2] uppercase">
            Hỏi đáp thường gặp
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Một số thắc mắc phổ biến của khách hàng khi tìm hiểu về dòng xe này.
          </p>
        </div>

        <div className="lg:col-span-8 flex flex-col items-start overflow-hidden rounded-[12px] border border-gray-200/50 w-full bg-white shadow-xs">
          {faqs.map((faq: any, idx: number) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div 
                key={idx}
                className={`w-full transition-all duration-300 px-[24px] py-[20px] bg-white relative
                  ${isExpanded ? "border-b-3 border-[#0562d2]" : "border-b border-[#f0f0f0] last:border-b-0"}`}
              >
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="absolute top-2 right-2 z-25 bg-red-100 hover:bg-red-200 text-red-700 text-xs px-2.5 py-1 rounded-full border-0 cursor-pointer font-semibold"
                  >
                    ✕ Xóa
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex items-center justify-between text-left w-full cursor-pointer border-0 bg-transparent py-1 transition-colors group"
                >
                  {isEditMode ? (
                    <input 
                      type="text" 
                      value={faq.q || ""} 
                      onClick={(e) => e.stopPropagation()} // Prevent expand toggle when clicking input
                      onChange={(e) => handleFaqTextChange(idx, "q", e.target.value)}
                      className={`font-['Ford_Antenna',sans-serif] font-semibold text-[16px] leading-[1.5] border border-dashed border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-500 bg-transparent
                        ${isExpanded ? "text-[#0562d2]" : "text-[#1a1a1a] group-hover:text-[#0562d2]"}`}
                      placeholder="Câu hỏi"
                    />
                  ) : (
                    <span className={`font-['Ford_Antenna',sans-serif] font-semibold text-[16px] leading-[1.5]
                      ${isExpanded ? "text-[#0562d2]" : "text-[#1a1a1a] group-hover:text-[#0562d2]"}`}
                    >
                      {faq.q || "Câu hỏi thường gặp?"}
                    </span>
                  )}
                  {isExpanded ? (
                    <Minus className="w-[20px] h-[20px] text-[#0562d2] shrink-0 ml-4" />
                  ) : (
                    <Plus className="w-[20px] h-[20px] text-gray-500 group-hover:text-[#0562d2] shrink-0 ml-4" />
                  )}
                </button>
                {isExpanded && (
                  <div className="pt-4 pb-2 text-sm text-[#424242] leading-relaxed transition-all duration-200 w-full">
                    {isEditMode ? (
                      <textarea 
                        value={faq.a || ""} 
                        onChange={(e) => handleFaqTextChange(idx, "a", e.target.value)}
                        className="font-['Ford_Antenna',sans-serif] font-normal border border-dashed border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-500 min-h-[80px] bg-transparent resize-none"
                        placeholder="Câu trả lời"
                      />
                    ) : (
                      <p className="font-['Ford_Antenna',sans-serif] font-normal whitespace-pre-line">
                        {faq.a || "Câu trả lời."}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isEditMode && (
          <div className="flex justify-end mt-4 lg:col-span-12">
            <button
              type="button"
              onClick={handleAddFaq}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full cursor-pointer transition-colors shadow-md border-0"
            >
              + Thêm Câu hỏi mới
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

/* ==========================================================================
   5. PROMOTIONS BLOCK
   ========================================================================== */
function PromotionsBlock({ data, isEditMode, onChangeData, openQuoteDrawer, vehicle, anchorId }: any) {
  const title = data.title || "Ưu Đãi Đặc Biệt";
  const desc = data.description || "Nhập chương trình khuyến mãi tháng...";
  const bgImg = data.image || "/assets/img-gradient-2.png";
  const btnText = data.button_text || "Báo giá";

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await mediaAPI.upload(file);
      if (res && res.url) {
        onChangeData({ ...data, image: res.url });
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên: " + formatUploadError(err));
    }
  };

  // Alignment classes
  const alignClass = data.align === 'center' ? 'items-center text-center mx-auto' 
                   : data.align === 'right' ? 'items-end text-right ml-auto'
                   : 'items-start text-left';

  // Title Size Classes
  let titleSizeClass = "text-[36px] sm:text-[48px]";
  if (data.title_size === 'small') {
    titleSizeClass = "text-xl sm:text-2xl md:text-3xl";
  } else if (data.title_size === 'large') {
    titleSizeClass = "text-[40px] sm:text-[52px] md:text-[58px]";
  }

  // Desc Size Classes
  let descSizeClass = "text-[18px]";
  if (data.desc_size === 'small') {
    descSizeClass = "text-[14px] sm:text-[16px]";
  } else if (data.desc_size === 'large') {
    descSizeClass = "text-[20px] sm:text-[22px]";
  }

  // Styles for colors
  const titleStyle = data.title_color ? { color: data.title_color } : {};
  const descStyle = data.desc_color ? { color: data.desc_color } : {};

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full py-16">
      <div className="flex flex-col gap-[32px] w-full">
        <div className={`flex flex-col gap-[24px] pt-[32px] w-full max-w-[1152px] mx-auto ${alignClass}`}>
          {isEditMode ? (
            <div className="space-y-3 w-full bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-black text-left">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề khuyến mãi</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => onChangeData({ ...data, title: e.target.value })}
                className="text-base font-bold text-[#0562d2] border border-dashed border-gray-300 px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-blue-500 bg-transparent"
                placeholder="Tiêu đề khuyến mãi"
              />
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Mô tả chương trình</label>
              <textarea 
                value={desc} 
                onChange={(e) => onChangeData({ ...data, description: e.target.value })}
                className="text-sm text-gray-700 border border-dashed border-gray-300 px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-blue-500 bg-transparent resize-none h-20"
                placeholder="Mô tả chương trình"
              />
            </div>
          ) : (
            <div className={`flex flex-col gap-[12px] ${data.align === 'center' ? 'items-center' : data.align === 'right' ? 'items-end' : 'items-start'}`}>
              <h2 
                className={`font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] tracking-[-0.96px] leading-[1.2] ${titleSizeClass}`}
                style={titleStyle}
              >
                {title}
              </h2>
              <p 
                className={`font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] leading-[1.5] ${descSizeClass}`}
                style={descStyle}
              >
                {desc}
              </p>
            </div>
          )}
          
          <button 
            onClick={() => openQuoteDrawer(vehicle?.id)}
            className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer shadow-md hover:shadow-blue-500/20"
          >
            {btnText}
          </button>
        </div>

        <div className="w-full mt-4 relative">
          <img 
            src={bgImg} 
            alt="Promotion Banner"
            className="object-cover rounded-[12px] w-full h-auto shadow-xs max-h-[500px]"
          />
          {isEditMode && (
            <div className="absolute top-4 left-4 z-20 bg-black/75 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white">
              <span className="block mb-2 font-semibold">Ảnh khuyến mãi:</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleUploadImage}
                className="block w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   6. 360 VIEWER BLOCK
   ========================================================================== */
function ThreeSixtyViewerBlock({ data, vehicle, isEditMode, onChangeData, threeSixtyProps, anchorId }: any) {
  const title = data.title || (vehicle?.id === "mustang-fastback" ? "360° Colorizer & Viewer" : "Khám phá không gian đa chiều");
  const desc = data.description || (vehicle?.id === "mustang-fastback" 
    ? "Tùy biến ngoại thất và nội thất theo phong cách riêng của bạn. Kéo để xoay 360 độ hoặc chọn màu sơn và mâm xe."
    : "Diện mạo mới đầy cuốn hút! Trải nghiệm góc nhìn đa chiều và chọn màu sắc ngoại thất yêu thích.");

  // Alignment classes
  const alignClass = data.align === 'center' ? 'items-center text-center mx-auto' 
                   : data.align === 'right' ? 'items-end text-right ml-auto'
                   : 'items-start text-left';

  // Title Size Classes
  let titleSizeClass = "text-[36px] sm:text-[48px]";
  if (data.title_size === 'small') {
    titleSizeClass = "text-xl sm:text-2xl md:text-3xl";
  } else if (data.title_size === 'large') {
    titleSizeClass = "text-[40px] sm:text-[52px] md:text-[58px]";
  }

  // Desc Size Classes
  let descSizeClass = "text-[18px]";
  if (data.desc_size === 'small') {
    descSizeClass = "text-[14px] sm:text-[16px]";
  } else if (data.desc_size === 'large') {
    descSizeClass = "text-[20px] sm:text-[22px]";
  }

  // Styles for colors
  const titleStyle = data.title_color ? { color: data.title_color } : {};
  const descStyle = data.desc_color ? { color: data.desc_color } : {};

  if (!threeSixtyProps) {
    return (
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full py-16 border-t border-[#e5e5e5] text-center text-gray-400">
        360 Viewer đang tải...
      </section>
    );
  }

  const {
    selectedColorIndex, setSelectedColorIndex,
    activeVersionIndex, setActiveVersionIndex,
    viewType, setViewType,
    is360Active, setIs360Active,
    rotation, setRotation,
    tilt, setTilt,
    pan, setPan,
    isDragging, setIsDragging,
    isTrimDropdownOpen, setIsTrimDropdownOpen,
    isMobileColorOpen, setIsMobileColorOpen,
    isMobileInteriorColorOpen, setIsMobileInteriorColorOpen,
    isMobileWheelOpen, setIsMobileWheelOpen,
    selectedInteriorColorIndex, setSelectedInteriorColorIndex,
    failedImages, setFailedImages,
    selectedWheel, setSelectedWheel,
    renderCarPicture,
    handleMouseDown, handleMouseMove, handleMouseUpOrLeave, handleTouchStart, handleTouchMove,
    media
  } = threeSixtyProps;

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full py-16 border-t border-[#e5e5e5]">
      <div className="flex flex-col gap-[32px] items-start w-full">
        <div className={`flex flex-col pt-[32px] w-full max-w-[1152px] gap-[12px] ${alignClass}`}>
          {isEditMode ? (
            <div className="space-y-3 w-full bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-xs text-black text-left">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề xoay 360</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => onChangeData({ ...data, title: e.target.value })}
                className="text-base font-bold text-[#0562d2] border border-dashed border-gray-300 px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-blue-500 bg-transparent font-display"
                placeholder="Tiêu đề 360"
              />
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Mô tả 360</label>
              <textarea 
                value={desc} 
                onChange={(e) => onChangeData({ ...data, description: e.target.value })}
                className="text-sm text-gray-700 border border-dashed border-gray-300 px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-blue-500 bg-transparent resize-none h-20"
                placeholder="Mô tả 360"
              />
            </div>
          ) : (
            <>
              <h2 
                className={`font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] tracking-[-0.96px] leading-[1.2] uppercase ${titleSizeClass}`}
                style={titleStyle}
              >
                {title}
              </h2>
              <p 
                className={`font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] leading-[1.5] ${descSizeClass}`}
                style={descStyle}
              >
                {desc}
              </p>
            </>
          )}
        </div>

        <div className="cmp-360-colorizer-wrapper w-full">
          <div id="360Colorizer" aria-label="360 Viewer" className="cmp-360-colorizer">
            <div className={`model-wrapper ${viewType}`}>
              
              <div className="cmp-360-colorizer__vehicle-variation-container">
                <div 
                  className="dropdown trimAware__dropdown dropdown-trim dropdownWrapper" 
                  aria-expanded={isTrimDropdownOpen}
                >
                  <div 
                    className="dropdown-trigger" 
                    role="combobox" 
                    tabIndex={0} 
                    aria-expanded={isTrimDropdownOpen}
                    onClick={() => setIsTrimDropdownOpen(!isTrimDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsTrimDropdownOpen(false), 200)}
                  >
                    <div className="dropdown-activeTrim">{vehicle.versions[activeVersionIndex]?.name || vehicle.name}</div>
                    <div className="dropdown-active__icon">
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="dropdown-menu-wrapper" role="listbox" tabIndex={-1}>
                    {vehicle.versions.map((ver: any, idx: number) => (
                      <div 
                        key={ver.id}
                        className={`dropdown-item trimAware__item trimAware__item--enable ${activeVersionIndex === idx ? "active-option" : ""}`}
                        role="option" 
                        aria-selected={activeVersionIndex === idx}
                        onClick={() => {
                          setActiveVersionIndex(idx);
                          setIsTrimDropdownOpen(false);
                        }}
                      >
                        {ver.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="toggle-wrapper">
                <div className="model-view toggle-container">
                  <div className="toggle" role="tablist">
                    <button 
                      type="button"
                      className={`toggle-option border-0 cursor-pointer ${viewType === "exterior" ? "active" : "bg-transparent"}`} 
                      onClick={() => setViewType("exterior")}
                    >
                      Exterior
                    </button>
                    <button 
                      type="button"
                      className={`toggle-option border-0 cursor-pointer ${viewType === "interior" ? "active" : "bg-transparent"}`} 
                      onClick={() => {
                        setViewType("interior");
                        setIs360Active(true);
                      }}
                    >
                      Interior
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className={`view-wrapper ${viewType === "exterior" ? "show" : ""}`}>
                  <div className="exteriorPaint">
                    <div className="color-selector-container">
                      <div className="color-selector" role="radiogroup">
                        {vehicle.colors.map((color: any, idx: number) => (
                          <div 
                            key={color.name}
                            className={`color-container ${selectedColorIndex === idx ? "selected" : ""}`}
                            onClick={() => setSelectedColorIndex(idx)}
                            title={color.name}
                          >
                            <div className="color" style={{ backgroundColor: color.hex }}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="paint-color">
                      Paint Color: <span className="uppercase text-[#0562D2]">{vehicle.colors[selectedColorIndex]?.name}</span>
                    </div>
                  </div>
                </div>

                <div className={`view-wrapper ${viewType === "interior" ? "show" : ""}`}>
                  <div className="interiorColors">
                    <div className="color-selector-container">
                      <div className="color-selector interior" role="radiogroup">
                        <div 
                          className={`color-container ${selectedInteriorColorIndex === 0 ? "selected" : ""}`} 
                          onClick={() => setSelectedInteriorColorIndex(0)}
                          title="Black Onyx"
                        >
                          <div className="color" style={{ backgroundColor: "#1b1a1a" }}></div>
                        </div>
                        <div 
                          className={`color-container ${selectedInteriorColorIndex === 1 ? "selected" : ""}`} 
                          onClick={() => setSelectedInteriorColorIndex(1)}
                          title="Space Gray"
                        >
                          <div className="color" style={{ backgroundColor: "#c8c6c4" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="paint-color interior">
                      Interior: <span className="uppercase text-[#0562D2]">{selectedInteriorColorIndex === 0 ? "Black Onyx" : "Space Gray"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="car-image-container select-none cursor-grab active:cursor-grabbing w-full h-[400px] md:h-[580px] relative overflow-hidden"
                onMouseDown={is360Active && viewType === "exterior" ? handleMouseDown : undefined}
                onMouseMove={is360Active && viewType === "exterior" ? handleMouseMove : undefined}
                onMouseUp={is360Active && viewType === "exterior" ? handleMouseUpOrLeave : undefined}
                onMouseLeave={is360Active && viewType === "exterior" ? handleMouseUpOrLeave : undefined}
                onTouchStart={is360Active && viewType === "exterior" ? handleTouchStart : undefined}
                onTouchMove={is360Active && viewType === "exterior" ? handleTouchMove : undefined}
                onTouchEnd={is360Active && viewType === "exterior" ? handleMouseUpOrLeave : undefined}
              >
                {is360Active ? (
                  viewType === "exterior" ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-50/50">
                      <div 
                        className="absolute bottom-8 w-[60%] h-6 bg-black/15 blur-md rounded-[100%] transition-transform duration-100 pointer-events-none"
                        style={{
                          transform: `scaleX(${1 - Math.abs(tilt) / 40}) scaleY(${1 - Math.abs(rotation % 180 - 90) / 180}) rotateZ(${rotation * 0.05}deg)`,
                        }}
                      />
                      {renderCarPicture()}
                    </div>
                  ) : (
                    vehicle.image_360_internal_url ? (
                      <div className="w-full h-full relative overflow-hidden bg-black">
                        <iframe 
                          src={vehicle.image_360_internal_url}
                          className="w-full h-full border-0 absolute inset-0"
                          allowFullScreen
                          allow="gyroscope; accelerometer"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                        <img 
                          src={media?.bannerLarge || (vehicle.images && vehicle.images.length > 1 ? vehicle.images[1] : null) || "/assets/territory-interior.png"}
                          alt="Interior panorama fallback"
                          className="w-full h-full object-cover select-none pointer-events-none"
                        />
                      </div>
                    )
                  )
                ) : (
                  <>
                    <img 
                      src={vehicle.id === "mustang-fastback"
                        ? `/images/360/mustang/ecoboostfastback/exterior/desktop/adriatic-blue-green/64f/001-adriatic-blue-green-64f.jpeg`
                        : vehicle.id === "new-territory"
                          ? (viewType === "exterior" ? "/assets/territory-3d.png" : "/assets/territory-interior.png")
                          : (viewType === "exterior"
                              ? (() => {
                                  const colorImg = (vehicle.colors?.[selectedColorIndex] || vehicle.colors?.[0])?.image;
                                  if (colorImg && (colorImg.startsWith('/') || colorImg.startsWith('http'))) {
                                    return colorImg;
                                  }
                                  return vehicle.images?.[0] || vehicle.image_url || "/assets/car-everest.png";
                                })()
                              : media.splitLeft)}
                      alt="3D vehicle preview"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <button 
                      type="button"
                      onClick={() => setIs360Active(true)}
                      className="absolute bg-black/40 hover:bg-black/60 hover:scale-105 active:scale-95 transition-all p-[12px] rounded-[800px] border-0 cursor-pointer flex flex-col items-center justify-center size-[96px] z-10 text-white gap-1 group left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider group-hover:underline">Bật 360°</span>
                    </button>
                  </>
                )}

                {is360Active && (
                  <button
                    type="button"
                    onClick={() => {
                      setIs360Active(false);
                      setRotation(0);
                      setTilt(0);
                      setPan({ x: 0, y: 0 });
                    }}
                    className="absolute top-[80px] right-4 md:top-[28px] md:left-[368px] md:right-auto bg-black/75 hover:bg-black text-white px-4 py-2 rounded-full border-0 cursor-pointer text-xs font-bold transition-all shadow-md z-40 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Tắt 360°</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ==========================================================================
   7. FEATURES GRID BLOCK
   ========================================================================== */
function FeaturesGridBlock({ data, vehicle, isEditMode, onChangeData, anchorId }: any) {
  const title_1 = data.title_1 || "Thiết kế hiện đại, sắc sảo, đầy cuốn hút";
  const image_1 = data.image_1 || vehicle?.images?.[2] || vehicle?.images?.[0] || "/assets/territory-hero.png";
  const image_2 = data.image_2 || vehicle?.images?.[3] || vehicle?.images?.[1] || "/assets/territory-tech-split.png";
  const image_3 = data.image_3 || vehicle?.images?.[4] || vehicle?.images?.[2] || "/assets/territory-promo.png";
  
  const title_2 = data.title_2 || "Không gian nội thất rộng rãi, tiện nghi";
  const image_large = data.image_large || vehicle?.images?.[5] || vehicle?.images?.[1] || "/assets/territory-interior.png";
  const image_large_2 = data.image_large_2 || vehicle?.images?.[6] || vehicle?.images?.[2] || "/assets/territory-interior.png";
  const image_large_3 = data.image_large_3 || vehicle?.images?.[7] || vehicle?.images?.[3] || "/assets/territory-interior.png";
  
  const title_3 = data.title_3 || "Nâng tầm công nghệ và tiện nghi Tận hưởng trên mọi hành trình";
  const split_image = data.split_image || vehicle?.images?.[6] || vehicle?.images?.[0] || "/assets/territory-tech-split.png";
  const split_title = data.split_title || "Tiện nghi thông minh";
  const split_features = data.split_features || [];

  const handleUploadImage = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await mediaAPI.upload(file);
      if (res && res.url) {
        onChangeData({ ...data, [key]: res.url });
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên: " + formatUploadError(err));
    }
  };

  const handleFeatureChange = (idx: number, key: string, val: string) => {
    const newFeatures = [...split_features];
    newFeatures[idx] = { ...newFeatures[idx], [key]: val };
    onChangeData({ ...data, split_features: newFeatures });
  };

  const handleAddFeature = () => {
    const newFeatures = [...split_features, { value: "Giá trị", label: "Mô tả nhãn" }];
    onChangeData({ ...data, split_features: newFeatures });
  };

  const handleRemoveFeature = (idx: number) => {
    const newFeatures = split_features.filter((_: any, i: number) => i !== idx);
    onChangeData({ ...data, split_features: newFeatures });
  };

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full py-16 border-t border-[#e5e5e5]">
      <div className="flex flex-col gap-[48px] items-center">
        
        <div className="flex flex-col items-center pt-[32px] px-[48px] w-full max-w-[1152px] text-center text-black">
          {isEditMode ? (
            <input 
              type="text" 
              value={title_1} 
              onChange={(e) => onChangeData({ ...data, title_1: e.target.value })}
              className="text-center font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] border border-dashed border-gray-300 rounded px-2 w-full focus:outline-none focus:border-blue-500 bg-transparent uppercase"
            />
          ) : (
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
              {title_1}
            </h2>
          )}
        </div>

        <div className="flex flex-col gap-[24px] items-start w-full">
          <div className="aspect-[1100/600] relative rounded-[12px] overflow-hidden w-full bg-gray-150 shadow-xs">
            <img src={image_1} alt="Grid 1" className="w-full h-full object-cover" />
            {isEditMode && (
              <div className="absolute top-4 left-4 z-20 bg-black/75 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white">
                <span className="block mb-2 font-semibold">Thay thế ảnh 1:</span>
                <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_1", e)} className="block w-full text-xs text-gray-400 cursor-pointer" />
              </div>
            )}
          </div>
          <div className="flex gap-[24px] items-start w-full flex-col sm:flex-row">
            <div className="aspect-[1100/600] flex-1 relative rounded-[12px] overflow-hidden bg-gray-150 shadow-xs w-full">
              <img src={image_2} alt="Grid 2" className="w-full h-full object-cover" />
              {isEditMode && (
                <div className="absolute top-4 left-4 z-20 bg-black/75 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white">
                  <span className="block mb-2 font-semibold">Thay thế ảnh 2:</span>
                  <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_2", e)} className="block w-full text-xs text-gray-400 cursor-pointer" />
                </div>
              )}
            </div>
            <div className="aspect-[1100/600] flex-1 relative rounded-[12px] overflow-hidden bg-gray-150 shadow-xs w-full">
              <img src={image_3} alt="Grid 3" className="w-full h-full object-cover" />
              {isEditMode && (
                <div className="absolute top-4 left-4 z-20 bg-black/75 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white">
                  <span className="block mb-2 font-semibold">Thay thế ảnh 3:</span>
                  <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_3", e)} className="block w-full text-xs text-gray-400 cursor-pointer" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center pt-[32px] px-[48px] w-full max-w-[1152px] text-center mt-8 text-black">
          {isEditMode ? (
            <input 
              type="text" 
              value={title_2} 
              onChange={(e) => onChangeData({ ...data, title_2: e.target.value })}
              className="text-center font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] border border-dashed border-gray-300 rounded px-2 w-full focus:outline-none focus:border-blue-500 bg-transparent uppercase"
            />
          ) : (
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
              {title_2}
            </h2>
          )}
        </div>

        <div className="flex gap-0 items-stretch w-full flex-col lg:flex-row min-h-[400px] lg:h-[600px] rounded-[12px] overflow-hidden shadow-xs">
          {/* Left large image */}
          <div className="flex-1 lg:flex-[2] aspect-[16/10] sm:aspect-auto relative bg-gray-150 w-full min-h-[300px]">
            <img src={image_large} alt="Interior Large" className="w-full h-full object-cover" />
            {isEditMode && (
              <div className="absolute top-4 left-4 z-20 bg-black/75 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white">
                <span className="block mb-2 font-semibold">Thay thế ảnh lớn (Trái):</span>
                <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_large", e)} className="block w-full text-xs text-gray-400 cursor-pointer" />
              </div>
            )}
          </div>
          {/* Right stacked images */}
          <div className="flex-1 flex flex-col gap-0 w-full min-h-[300px]">
            <div className="flex-1 aspect-[16/10] sm:aspect-auto relative bg-gray-150 w-full min-h-[140px]">
              <img src={image_large_2} alt="Interior Small 1" className="w-full h-full object-cover" />
              {isEditMode && (
                <div className="absolute top-4 left-4 z-20 bg-black/75 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white">
                  <span className="block mb-2 font-semibold">Thay thế ảnh phụ 1 (Phải trên):</span>
                  <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_large_2", e)} className="block w-full text-xs text-gray-400 cursor-pointer" />
                </div>
              )}
            </div>
            <div className="flex-1 aspect-[16/10] sm:aspect-auto relative bg-gray-150 w-full min-h-[140px]">
              <img src={image_large_3} alt="Interior Small 2" className="w-full h-full object-cover" />
              {isEditMode && (
                <div className="absolute top-4 left-4 z-20 bg-black/75 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white">
                  <span className="block mb-2 font-semibold">Thay thế ảnh phụ 2 (Phải dưới):</span>
                  <input type="file" accept="image/*" onChange={(e) => handleUploadImage("image_large_3", e)} className="block w-full text-xs text-gray-400 cursor-pointer" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center pt-[32px] px-[48px] w-full max-w-[1152px] text-center mt-8 text-black">
          {isEditMode ? (
            <input 
              type="text" 
              value={title_3} 
              onChange={(e) => onChangeData({ ...data, title_3: e.target.value })}
              className="text-center font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] border border-dashed border-gray-300 rounded px-2 w-full focus:outline-none focus:border-blue-500 bg-transparent uppercase"
            />
          ) : (
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
              {title_3}
            </h2>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-[4px] h-auto lg:h-[660px] items-stretch justify-center w-full">
          <div className="flex-1 min-h-[350px] relative rounded-t-[12px] lg:rounded-t-none lg:rounded-l-[12px] overflow-hidden bg-gray-150 shadow-xs">
            <img src={split_image} alt="Split Detail" className="w-full h-full object-cover" />
            {isEditMode && (
              <div className="absolute top-4 left-4 z-20 bg-black/75 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white">
                <span className="block mb-2 font-semibold">Thay thế ảnh trái:</span>
                <input type="file" accept="image/*" onChange={(e) => handleUploadImage("split_image", e)} className="block w-full text-xs text-gray-400 cursor-pointer" />
              </div>
            )}
          </div>
          
          <div className="bg-[#0562d2] flex flex-col h-full items-start px-[24px] py-[32px] rounded-b-[12px] lg:rounded-b-none lg:rounded-r-[12px] shrink-0 w-full lg:w-[480px] text-white">
            <div className="flex flex-col justify-between h-full w-full min-h-[400px]">
              {isEditMode ? (
                <input 
                  type="text" 
                  value={split_title} 
                  onChange={(e) => onChangeData({ ...data, split_title: e.target.value })}
                  className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] sm:text-[36px] leading-[1.32] pb-6 border-b border-white/20 bg-transparent text-white w-full focus:outline-none"
                />
              ) : (
                <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] sm:text-[36px] leading-[1.32] pb-6 border-b border-white/20">
                  {split_title}
                </h3>
              )}
              
              <div className="flex flex-col gap-[28px] pt-8 flex-grow">
                {split_features.map((feat: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-[4px] items-start w-full relative group">
                    {isEditMode && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFeature(idx)}
                        className="absolute -top-1 -right-2 text-white/50 hover:text-white text-xs border-0 bg-transparent cursor-pointer font-bold"
                      >
                        ✕ Xóa
                      </button>
                    )}
                    {isEditMode ? (
                      <div className="space-y-1 w-full text-black">
                        <input 
                          type="text" 
                          value={feat.value || ""} 
                          onChange={(e) => handleFeatureChange(idx, "value", e.target.value)}
                          className="font-['Ford_Antenna',sans-serif] font-semibold text-[24px] leading-[1.2] bg-transparent text-white w-full border border-dashed border-white/30 px-2 rounded-sm focus:outline-none"
                          placeholder="Giá trị"
                        />
                        <input 
                          type="text" 
                          value={feat.label || ""} 
                          onChange={(e) => handleFeatureChange(idx, "label", e.target.value)}
                          className="font-['Ford_Antenna',sans-serif] font-normal text-[14px] leading-[1.5] bg-transparent text-white/95 w-full border border-dashed border-white/30 px-2 rounded-sm focus:outline-none"
                          placeholder="Mô tả nhãn"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] leading-[1.2]">
                          {feat.value}
                        </p>
                        <p className="font-['Ford_Antenna',sans-serif] font-normal text-[16px] leading-[1.5] text-white/90">
                          {feat.label}
                        </p>
                      </>
                    )}
                  </div>
                ))}
                
                {isEditMode && (
                  <button 
                    type="button" 
                    onClick={handleAddFeature}
                    className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full border-0 cursor-pointer w-fit"
                  >
                    + Thêm chỉ số
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ==========================================================================
   8. VERSIONS GRID BLOCK
   ========================================================================== */
function VersionsGridBlock({ data, vehicle, isEditMode, onChangeData, anchorId, openQuoteDrawer }: any) {
  const vehicleName = vehicle?.name || "";
  const cleanName = vehicleName.toLowerCase().startsWith("ford") 
    ? vehicleName.slice(4).trim() 
    : vehicleName;
  const title = data.title || `Các mẫu xe Ford ${cleanName.replace("NEW ", "") || ""}`;
  const descriptions = data.descriptions || [];
  const versions = vehicle?.versions || [];

  const versionGradients = [
    "/assets/img-gradient-1.png",
    "/assets/img-gradient-2.png",
    "/assets/img-gradient-3.png"
  ];

  const handleDescChange = (idx: number, val: string) => {
    const newDescs = [...descriptions];
    newDescs[idx] = val;
    onChangeData({ ...data, descriptions: newDescs });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  return (
    <section id={anchorId || undefined} className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full py-16 border-t border-[#e5e5e5]">
      <div className="flex flex-col gap-[32px] items-center">
        
        <div className="flex flex-col items-center pt-[32px] w-full max-w-[1152px] text-center text-black">
          {isEditMode ? (
            <input 
              type="text" 
              value={title} 
              onChange={(e) => onChangeData({ ...data, title: e.target.value })}
              className="text-center font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[36px] sm:text-[48px] border border-dashed border-gray-300 rounded px-2 w-full focus:outline-none focus:border-blue-500 bg-transparent uppercase"
            />
          ) : (
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
              {title}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] w-full">
          {versions.map((ver: any, idx: number) => {
            const defaultDesc = idx === 0 
              ? `Ford Territory ${ver.name.replace("Territory ", "")} 2026 xe SUV 5 chỗ cao cấp của Ford gây ấn tượng mạnh với thiết kế đặc biệt sắc sảo và công nghệ tối tân.`
              : idx === 1 
                ? `Ford Territory ${ver.name.replace("Territory ", "")} 2026 vượt trội cùng nhiều nét độc đáo về thiết kế, công nghệ. Một lựa chọn xe SUV 5 chỗ lý tưởng.`
                : `Ford Territory ${ver.name.replace("Territory ", "")} 2026 với những cải tiến rõ rệt.`;

            const desc = descriptions[idx] || defaultDesc;

            return (
              <div
                key={ver.id}
                onClick={isEditMode ? undefined : () => openQuoteDrawer?.(vehicle?.id, ver.id)}
                className={`bg-[#fafafa] flex flex-col items-center overflow-hidden rounded-[8px] text-left border border-gray-200/50 p-4 transition-all duration-300 shadow-xs h-full justify-between ${
                  isEditMode ? "" : "hover:scale-[1.02] hover:shadow-md cursor-pointer group"
                }`}
              >
                <div className="aspect-[272/272] relative rounded-[12px] overflow-hidden w-full bg-gray-150 shrink-0">
                  <img 
                    src={versionGradients[idx] || "/assets/img-gradient-1.png"} 
                    alt={ver.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-col items-start pt-[24px] pb-[8px] w-full flex-grow justify-between">
                  <div className="flex flex-col gap-[12px] items-start w-full">
                    <p className="font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[20px] leading-[1.25]">
                      {ver.name}
                    </p>
                    <p className="font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] text-[16px]">
                      {formatPrice(ver.price)}
                    </p>
                    
                    {isEditMode ? (
                      <textarea
                        value={desc}
                        onChange={(e) => handleDescChange(idx, e.target.value)}
                        className="text-xs text-gray-600 border border-dashed border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-500 bg-transparent resize-none h-24 text-black"
                        placeholder="Mô tả phiên bản"
                      />
                    ) : (
                      <p className="font-['Ford_Antenna',sans-serif] font-normal text-[#424242] text-[14px] leading-[1.5]">
                        {desc}
                      </p>
                    )}
                  </div>

                  {!isEditMode && (
                    <div className="mt-6 font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] text-[14px] flex items-center gap-1 group-hover:text-[#044ea7] transition-colors">
                      <span>Xem chi tiết &amp; Ước tính lăn bánh</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ==========================================================================
   9. BOOKING BANNER BLOCK
   ========================================================================== */
function BookingBannerBlock({ data, vehicle, isEditMode, onChangeData, anchorId }: any) {
  const title = data.title || "Kết nối ngay với chuyên viên Đồng Nai Ford";
  const phone = data.phone || "1800 55 68 58";
  const btnText = data.btn_text || "Đặt lịch hẹn";
  const btnLink = data.btn_link || "/lien-he?reason=Đặt hẹn dịch vụ";
  const carImage = data.car_image || vehicle.image_url || "/assets/booking-car.png";

  const handleUploadCarImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await mediaAPI.upload(file);
      if (res && res.url) {
        onChangeData({ ...data, car_image: res.url });
      }
    } catch (err) {
      alert("Lỗi tải ảnh lên: " + formatUploadError(err));
    }
  };

  // Title Size Classes
  let titleSizeClass = "text-3xl lg:text-[36px]";
  if (data.title_size === 'small') {
    titleSizeClass = "text-xl lg:text-2xl";
  } else if (data.title_size === 'large') {
    titleSizeClass = "text-[36px] lg:text-[44px]";
  }

  // Styles for colors
  const titleStyle = data.title_color ? { color: data.title_color } : {};

  return (
    <section id={anchorId || undefined} className="w-full bg-[#00095b] py-[32px] px-4 md:px-[144px] flex justify-center overflow-visible">
      <div className="max-w-[1152px] w-full relative flex flex-col lg:flex-row items-center overflow-visible">
        {/* Inner Rounded Banner */}
        <div className="w-full lg:w-[913px] bg-gradient-to-r from-[#00095B] via-[#02337A] to-[#0562D2] rounded-[12px] p-8 lg:p-[32px] h-auto lg:h-[320px] flex items-center relative overflow-hidden lg:overflow-visible shadow-xl">
          {/* Content */}
          <div className="flex flex-col gap-6 max-w-full lg:max-w-[505px] relative z-10 text-white w-full">
            {isEditMode ? (
              <div className="space-y-3 bg-black/45 p-4 rounded-xl border border-white/20 backdrop-blur-xs text-white text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Tiêu đề Banner</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => onChangeData({ ...data, title: e.target.value })}
                    className="bg-transparent text-white font-['Ford_Antenna',sans-serif] font-semibold text-lg border border-dashed border-white/30 px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-blue-500"
                    placeholder="Nhập tiêu đề"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => onChangeData({ ...data, phone: e.target.value })}
                      className="bg-transparent text-white text-xs border border-dashed border-white/30 px-3 py-1.5 rounded-lg w-full focus:outline-none"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Nhãn nút đặt lịch</label>
                    <input
                      type="text"
                      value={btnText}
                      onChange={(e) => onChangeData({ ...data, btn_text: e.target.value })}
                      className="bg-transparent text-white text-xs border border-dashed border-white/30 px-3 py-1.5 rounded-lg w-full focus:outline-none"
                      placeholder="Nhãn nút"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Liên kết nút đặt lịch</label>
                  <input
                    type="text"
                    value={btnLink}
                    onChange={(e) => onChangeData({ ...data, btn_link: e.target.value })}
                    className="bg-transparent text-white text-xs border border-dashed border-white/30 px-3 py-1.5 rounded-lg w-full focus:outline-none"
                    placeholder="Đường dẫn liên kết"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 
                  className={`font-bold font-display leading-[1.32] ${titleSizeClass}`}
                  style={titleStyle}
                >
                  {title}
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="flex items-center justify-center gap-2 bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] transition-colors text-white font-bold px-6 py-3 rounded-full text-base"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{phone}</span>
                  </a>
                  <a
                    href={btnLink}
                    className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 border border-white transition-colors text-white font-bold px-6 py-3 rounded-full text-base"
                  >
                    <Bookmark className="w-5 h-5" />
                    <span>{btnText}</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Overlapping Car Image */}
        <div className="relative lg:absolute h-[250px] lg:h-[420px] w-full lg:w-[587px] lg:left-[576px] lg:top-[-50px] pointer-events-none z-20 mt-6 lg:mt-0 flex justify-center">
          <img
            src={carImage}
            alt="Ford Booking Vehicle"
            className="object-contain max-h-full lg:max-h-none"
          />
          {isEditMode && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/85 p-3 rounded-lg border border-dashed border-white/40 text-xs text-white pointer-events-auto">
              <span className="block mb-2 font-semibold text-center">Ảnh xe đè:</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadCarImage}
                className="block w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
