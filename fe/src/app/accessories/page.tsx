"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight, ChevronLeft, Plus, Minus } from "lucide-react";
import { accessoriesData } from "@/data/accessories";

const categories = [
  { id: "interior", name: "Phụ Kiện Nội Thất", image: "https://images.unsplash.com/photo-1606577924048-a13f74040a62?auto=format&fit=crop&w=400&q=80" },
  { id: "exterior", name: "Phụ Kiện Ngoại Thất", image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80" },
  { id: "tech", name: "Công Nghệ & Điện Tử", image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=400&q=80" },
  { id: "wheels", name: "Mâm & Lốp Xe", image: "https://images.unsplash.com/photo-1611245053278-65b1d4d3d2db?auto=format&fit=crop&w=400&q=80" },
  { id: "performance", name: "Phụ Tùng Hiệu Suất", image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80" }
];

const sidebarModels = [
  {
    name: "Ford Everest",
    subModels: ["Ford Ranger", "Ford Territory", "Ford Explorer", "Ford Escape"]
  },
  {
    name: "Ford EcoSport",
    subModels: []
  },
  {
    name: "Ford Focus",
    subModels: []
  },
  {
    name: "Ford Fiesta",
    subModels: []
  },
  {
    name: "Ford Mondeo",
    subModels: []
  }
];

export default function AccessoriesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const vehicleParam = params.get("vehicle");
      if (vehicleParam) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedVehicle(vehicleParam);
      }
    }
  }, []);
  const [expandedSidebar, setExpandedSidebar] = useState<Record<string, boolean>>({
    "Ford Everest": true
  });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const toggleSidebar = (modelName: string) => {
    setExpandedSidebar(prev => ({
      ...prev,
      [modelName]: !prev[modelName]
    }));
  };

  const handleVehicleSelect = (vehicle: string) => {
    if (selectedVehicle === vehicle) {
      setSelectedVehicle(null); // Clear filter
    } else {
      setSelectedVehicle(vehicle);
    }
    setCurrentPage(1);
  };

  const handleCategorySelect = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory("all"); // Toggle to reset
    } else {
      setActiveCategory(categoryId);
    }
    setCurrentPage(1);
  };

  // Filter Logic
  const filteredAccessories = accessoriesData.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesVehicle = !selectedVehicle || 
      item.fitVehicles.some(v => v.toLowerCase().includes(selectedVehicle.toLowerCase()) || 
      selectedVehicle.toLowerCase().includes(v.toLowerCase()));

    return matchesCategory && matchesSearch && matchesVehicle;
  });

  // Paginated Items
  const totalPages = Math.max(1, Math.ceil(filteredAccessories.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccessories = filteredAccessories.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price: number) => {
    return "₫" + new Intl.NumberFormat("vi-VN").format(price);
  };

  const scrollCategoryRight = () => {
    const el = document.getElementById("category-slider-track");
    if (el) {
      el.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans pb-16">
      
      {/* 1. Featured Category Slider Section */}
      <section className="bg-[#fafafa] border-b border-[#d6d6d6] py-[40px]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col gap-[24px]">
          
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] text-[#1a1a1a] leading-[1.2]">
              Sản Phẩm Nổi Bật
            </h1>
            <p className="font-['Ford_Antenna',sans-serif] font-normal text-[18px] text-[#555] leading-[1.5]">
              Khám phá các phụ kiện Ford được yêu thích nhất ngay hôm nay!
            </p>
          </div>

          {/* Slider Container */}
          <div className="relative w-full group">
            {/* Scrollable Track */}
            <div 
              id="category-slider-track"
              className="flex gap-[21px] overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="snap-start flex-shrink-0 w-[240px] text-left focus:outline-none cursor-pointer border-0 bg-transparent"
                  >
                    <div className="flex flex-col gap-[8px] items-center overflow-hidden rounded-[8px] transition-transform duration-300 hover:scale-[1.02]">
                      {/* Image Frame */}
                      <div className={`aspect-[300/200] w-full relative overflow-hidden rounded-[8px] bg-gray-150 transition-all ${isActive ? "border border-[#0562D2] shadow-sm" : ""}`}>
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="240px"
                          className="object-cover"
                        />
                        {/* Overlay */}
                        <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? "bg-black/10" : "bg-black/30 hover:bg-black/20"}`} />
                      </div>
                      
                      {/* Title */}
                      <span className={`font-['Ford_Antenna',sans-serif] font-semibold text-center text-[18px] tracking-[0.18px] transition-colors duration-200
                        ${isActive ? "text-[#0562D2]" : "text-[#1a1a1a] hover:text-[#0562D2]"}`}
                      >
                        {cat.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Scroll Button Overlay */}
            <button
              onClick={scrollCategoryRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white/95 hover:bg-white text-gray-800 shadow-md p-2 rounded-full flex items-center justify-center w-10 h-10 border border-gray-100 cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

        </div>
      </section>

      {/* 2. Main Content Grid & Sidebar */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full py-[72px]">
        <div className="flex flex-col md:flex-row gap-[48px] items-start justify-center">
          
          {/* Left Filter Sidebar - Flat, Clean Accordion List */}
          <div className="w-full md:w-[280px] flex flex-col gap-0 shrink-0">
            {sidebarModels.map((model) => {
              const isExpanded = expandedSidebar[model.name];
              const hasSubModels = model.subModels.length > 0;
              
              return (
                <div key={model.name} className="flex flex-col border-b border-[#e5e5e5] py-[16px] w-[280px]">
                  <button
                    onClick={() => {
                      if (hasSubModels) {
                        toggleSidebar(model.name);
                      } else {
                        handleVehicleSelect(model.name);
                      }
                    }}
                    className="flex items-center justify-between text-left w-full cursor-pointer border-0 bg-transparent transition-colors py-1"
                  >
                    <span className={`font-['Ford_Antenna',sans-serif] font-semibold text-[16px] ${selectedVehicle === model.name || isExpanded ? "text-[#0562d2]" : "text-[#1a1a1a] hover:text-[#0562d2]"}`}>
                      {model.name}
                    </span>
                    {hasSubModels ? (
                      isExpanded ? (
                        <Minus className="w-[20px] h-[20px] text-[#0562d2]" />
                      ) : (
                        <Plus className="w-[20px] h-[20px] text-[#0562d2]" />
                      )
                    ) : null}
                  </button>

                  {hasSubModels && isExpanded && (
                    <div className="flex flex-col gap-[12px] pt-[12px] pb-[4px]">
                      {model.subModels.map((sub) => {
                        const isSelected = selectedVehicle === sub;
                        return (
                          <button
                            key={sub}
                            onClick={() => handleVehicleSelect(sub)}
                            className={`text-left text-[16px] font-['Ford_Antenna',sans-serif] cursor-pointer border-0 bg-transparent transition-colors
                              ${isSelected ? "text-[#0562d2] font-semibold" : "text-[#333] hover:text-[#0562d2]"}`}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Accessories Grid panel */}
          <div className="flex-1 flex flex-col gap-[24px] min-w-0">
            {/* Search Input bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#d6d6d6] pb-4">
              <div className="relative w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder="Tìm kiếm phụ kiện..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white border border-[#d6d6d6] rounded-[800px] py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-[#0562D2]"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              </div>
              <div className="text-xs font-bold text-gray-500">
                Hiển thị {filteredAccessories.length} phụ kiện
              </div>
            </div>

            {/* Catalog Grid - Borderless Cards with Active Hover states */}
            {paginatedAccessories.length === 0 ? (
              <div className="bg-white rounded-[8px] py-20 text-center border border-gray-100 p-8 space-y-4">
                <p className="text-gray-500 font-medium text-sm">
                  Không tìm thấy sản phẩm phụ kiện nào phù hợp.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    setSelectedVehicle(null);
                    setCurrentPage(1);
                  }}
                  className="btn-ford-primary text-xs py-2 px-5 font-bold uppercase cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                {paginatedAccessories.map((item) => (
                  <Link
                    key={item.id}
                    href={`/accessories/${item.id}`}
                    className="group bg-white flex flex-col h-full rounded-[8px] overflow-hidden border border-transparent hover:border-[#0562D2] hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-square relative bg-gray-50 overflow-hidden">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    {/* Content */}
                    <div className="px-[16px] py-[12px] flex flex-col gap-[4px] items-center text-center flex-1 justify-between">
                      <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-[16px] text-[#1a1a1a] group-hover:text-[#0562D2] transition-colors leading-[1.5] line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="font-['Ford_Antenna',sans-serif] font-medium text-[14px] text-[#0562d2] mt-auto leading-[1.4]">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pill-shaped Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="bg-white border border-[#e5e5e5] flex gap-[16px] items-center justify-center px-[12px] py-[8px] rounded-[400px]">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="disabled:opacity-40 p-1 text-[#808080] hover:text-[#1a1a1a] transition-colors cursor-pointer border-0 bg-transparent flex items-center"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-[24px] h-[24px]" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-[44px] h-[44px] flex items-center justify-center font-['Ford_Antenna',sans-serif] font-semibold text-[16px] transition-all cursor-pointer border-0
                          ${isActive ? "bg-[#044ea7] text-white rounded-[4px]" : "bg-transparent text-[#808080] hover:text-[#1a1a1a]"}`}
                      >
                        {pageNum < 10 ? `0${pageNum}` : pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="disabled:opacity-40 p-1 text-[#808080] hover:text-[#1a1a1a] transition-colors cursor-pointer border-0 bg-transparent flex items-center"
                    aria-label="Trang sau"
                  >
                    <ChevronRight className="w-[24px] h-[24px]" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}

