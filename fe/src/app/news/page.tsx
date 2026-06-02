"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { articles } from "@/data/articles";
import { handleImageError } from "@/lib/site-assets";

const ITEMS_PER_PAGE = 3;

export default function NewsListPage() {
  const [activeTab, setActiveTab] = useState<"Tất cả" | "Xe Ford" | "Khuyến Mãi" | "Tin tức">("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter articles based on activeTab and searchQuery
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (activeTab !== "Tất cả") {
      result = result.filter((art) => art.category === activeTab);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(query) ||
          art.content.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeTab, searchQuery]);

  // Reset page number on tab or query change
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const paginatedArticles = useMemo(() => {
    const page = Math.min(currentPage, totalPages);
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage, totalPages]);

  // Featured articles: we take the first 2 articles from the master list
  const featuredArticles = useMemo(() => {
    return articles.slice(0, 2);
  }, []);

  const handleTabChange = (tab: "Tất cả" | "Xe Ford" | "Khuyến Mãi" | "Tin tức") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen py-12 flex flex-col items-center">
      {/* 1. FEATURED NEWS SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full mb-16">
        <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[36px] leading-[1.32] text-[#1a1a1a] mb-8">
          Tin tức nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredArticles.map((art) => (
            <Link
              key={`featured-${art.id}`}
              href={`/news/${art.id}`}
              className="bg-white rounded-[12px] overflow-hidden border border-[#e5e5e5] shadow-sm hover:shadow-md transition-premium group flex flex-col"
            >
              {/* Image Container */}
              <div className="aspect-[600/380] relative overflow-hidden w-full bg-gray-100">
                <img
                  src={art.image}
                  alt={art.title}
                  className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                  onError={handleImageError}
                />
                <div className="absolute top-4 left-4 bg-[#0562d2] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {art.category}
                </div>
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col flex-1 gap-3">
                <span className="text-sm font-medium text-[#424242]">
                  {art.date}
                </span>
                <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[18px] leading-[1.45] text-[#1a1a1a] group-hover:text-[#0562d2] transition-colors duration-200 line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-sm text-[#424242] leading-relaxed line-clamp-3 mt-1">
                  {art.content}
                </p>
                <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-[#0562d2] group-hover:underline">
                  Xem chi tiết
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. ALL NEWS & FILTER SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
        <div className="flex flex-col gap-8">
          {/* Section Heading & Category Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#e5e2dc] pb-4">
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[28px] leading-[1.2] text-[#1a1a1a] shrink-0">
              Tin tức & Ưu Đãi
            </h2>

            {/* Filter controls wrapper */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto lg:justify-end">
              {/* Category tabs */}
              <div className="flex overflow-x-auto scrollbar-none border-b sm:border-b-0 border-gray-200">
                {(["Tất cả", "Xe Ford", "Khuyến Mãi", "Tin tức"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`px-5 py-2.5 text-base font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                      activeTab === tab
                        ? "text-[#0562d2] border-b-3 border-[#0562d2]"
                        : "text-[#424242] hover:text-[#0562d2]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[200px] sm:w-[240px]">
                <input
                  type="text"
                  placeholder="Tìm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#0562d2] transition shadow-xs"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
              </div>
            </div>
          </div>

          {/* Grid of paginated articles */}
          {paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/news/${art.id}`}
                  className="bg-white rounded-[12px] overflow-hidden border border-[#e5e5e5] shadow-sm hover:shadow-md transition-premium group flex flex-col h-full"
                >
                  <div className="aspect-[600/400] relative overflow-hidden w-full bg-gray-100">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                      onError={handleImageError}
                    />
                    <div className="absolute top-4 left-4 bg-[#0562d2] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {art.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-2.5">
                    <span className="text-xs font-medium text-[#424242]">
                      {art.date}
                    </span>
                    <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[16px] leading-[1.4] text-[#1a1a1a] group-hover:text-[#0562d2] transition-colors duration-200 line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#424242] leading-relaxed line-clamp-3 mt-1">
                      {art.content}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-[#e5e5e5] rounded-[12px]">
              <p className="text-gray-500 text-sm">Không tìm thấy bài viết nào phù hợp.</p>
            </div>
          )}

          {/* Pagination component block */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="bg-white border border-[#e5e5e5] flex gap-2 items-center px-4 py-2 rounded-[400px] shadow-xs">
                {/* Prev button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer ${
                    currentPage === 1
                      ? "text-gray-300 pointer-events-none"
                      : "text-[#424242] hover:bg-gray-100"
                  }`}
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, idx) => {
                  const page = idx + 1;
                  const isActive = currentPage === page;
                  return (
                    <button
                      key={`page-${page}`}
                      onClick={() => handlePageChange(page)}
                      className={`w-11 h-11 flex items-center justify-center font-semibold text-sm rounded-[4px] transition cursor-pointer ${
                        isActive
                          ? "bg-[#044ea7] text-white"
                          : "bg-white text-[#808080] hover:bg-gray-100"
                      }`}
                    >
                      {page < 10 ? `0${page}` : page}
                    </button>
                  );
                })}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer ${
                    currentPage === totalPages
                      ? "text-gray-300 pointer-events-none"
                      : "text-[#424242] hover:bg-gray-100"
                  }`}
                  aria-label="Trang sau"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
