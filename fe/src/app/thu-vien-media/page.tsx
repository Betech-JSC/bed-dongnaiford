"use client";

import { useState, useEffect, Suspense } from "react";
import { Video, AlertCircle, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { postsAPI } from "@/lib/api";
import { resolveImageUrl } from "@/lib/site-assets";

interface VideoItem {
  id: string;
  tiktokId: string;
  title: string;
  description: string;
  url: string;
  image?: string | null;
}

const SkeletonCard = () => (
  <div className="w-full max-w-[320px] h-[540px] bg-gray-200 rounded-2xl border border-gray-300/60 p-4 flex flex-col justify-between animate-pulse shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-300" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 bg-gray-300 rounded w-2/3" />
        <div className="h-2 bg-gray-300 rounded w-1/3" />
      </div>
    </div>
    <div className="flex-1 bg-gray-300/60 rounded-xl my-4 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-gray-400/50" />
    </div>
    <div className="flex flex-col gap-2">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-1/2" />
    </div>
  </div>
);

function getTikTokId(urlOrId: string): string {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  
  const match = trimmed.match(/\/(video|photo)\/(\d+)/);
  if (match && match[2]) {
    return match[2];
  }
  
  return "";
}

const TikTokCard = ({ video, onSelect }: { video: VideoItem; onSelect: (v: VideoItem) => void }) => {
  return (
    <div
      onClick={() => onSelect(video)}
      className="w-full max-w-[320px] h-[540px] relative rounded-2xl border border-gray-200/80 shadow-lg bg-black overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 group select-none"
    >
      {/* Background Image / Thumbnail */}
      {video.image ? (
        <img
          src={video.image}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#00095B] via-[#0562D2] to-[#00095B] opacity-90" />
      )}

      {/* Dark Backdrop Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
            <Video className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">
            Đồng Nai Ford
          </span>
        </div>

        <span className="bg-[#fe2c55] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          TikTok
        </span>
      </div>

      {/* Center Big Glossy Play Button */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto gap-3">
        <div className="w-16 h-16 rounded-full bg-[#fe2c55] text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#ff0050] transition-all duration-300 ring-4 ring-white/30">
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
        </div>
        <span className="text-xs font-semibold text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10 group-hover:bg-[#0562d2] transition-colors">
          Bấm để xem Video
        </span>
      </div>

      {/* Bottom Title & Action Bar */}
      <div className="relative z-10 p-5 flex flex-col gap-2">
        <h3 className="text-white font-bold text-base line-clamp-2 leading-snug tracking-tight drop-shadow-sm">
          {video.title || "Video ngắn Đồng Nai Ford"}
        </h3>
        {video.description && (
          <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed opacity-90">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

function MediaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) || 1 : 1;

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      }
    }

    const result: (number | string)[] = [];
    let prev: number | null = null;

    for (const page of pages) {
      if (prev !== null) {
        if (page - prev === 2) {
          result.push(prev + 1);
        } else if (page - prev > 2) {
          result.push("...");
        }
      }
      result.push(page);
      prev = page;
    }

    return result;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res: any = await postsAPI.getAll({ type: "MEDIA", page: String(currentPage) });
        const items = res?.posts?.data || res?.posts || res?.data || res;

        if (Array.isArray(items) && items.length > 0) {
          const mappedVideos: VideoItem[] = items.map((post: any) => ({
            id: post.slug || String(post.id),
            tiktokId: getTikTokId(post.author || ""),
            title: post.title || "",
            description: post.description || "",
            url: post.author || "",
            image: post.featured_image ? resolveImageUrl(post.featured_image) : (post.image ? resolveImageUrl(post.image) : null)
          }));
          // Only show videos that have a valid TikTok ID
          setVideos(mappedVideos.filter(v => v.tiktokId));
          setTotalPages(res?.posts?.last_page || 1);
        } else {
          setVideos([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching media library videos:", err);
        setVideos([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [currentPage]);

  // Dynamically load/trigger official TikTok Embed Script inside modal when activeVideo changes
  useEffect(() => {
    if (activeVideo) {
      const renderEmbed = () => {
        if ((window as any).tiktokEmbed?.lib) {
          const el = document.querySelector('blockquote.modal-tiktok-embed');
          if (el) {
            try {
              (window as any).tiktokEmbed.lib.render([el]);
            } catch (e) {
              console.error("Error rendering TikTok modal embed:", e);
            }
          }
        }
      };

      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        script.onload = () => setTimeout(renderEmbed, 200);
        document.body.appendChild(script);
      } else {
        const timer = setTimeout(renderEmbed, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [activeVideo]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`/thu-vien-media?page=${page}`);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen py-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16 w-full flex flex-col gap-12 items-center">

        {/* Header Title Section */}
        <div className="flex flex-col gap-4 text-center max-w-3xl w-full">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0562d2] uppercase tracking-widest justify-center">
            <Video className="w-4 h-4" /> Thư viện Media
          </span>
          <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-3xl md:text-5xl leading-tight text-[#00095b] tracking-tight uppercase">
            Video Ngắn TikTok
          </h1>
          <div className="font-sans text-sm md:text-base leading-relaxed text-gray-600 mt-2 space-y-4 max-w-2xl mx-auto">
            <p>
              Khám phá chuỗi video ngắn chia sẻ kinh nghiệm, lái thử xe và các mẹo sử dụng xe Ford hữu ích từ đội ngũ chuyên gia tại Đồng Nai Ford.
            </p>
          </div>
        </div>

        {/* Video Grid Section */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1000px] mx-auto justify-items-center items-start">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : videos.length > 0 ? (
          <div className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1000px] mx-auto justify-items-center items-start">
              {videos.map((video) => (
                <TikTokCard key={video.id} video={video} onSelect={(v) => setActiveVideo(v)} />
              ))}
            </div>

            {/* Video Lightbox Modal */}
            {activeVideo && (
              <div
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                onClick={() => setActiveVideo(null)}
              >
                <div
                  className="bg-[#121212] border border-white/20 rounded-2xl w-full max-w-[420px] overflow-hidden flex flex-col shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60">
                    <div className="flex items-center gap-2 pr-2">
                      <span className="bg-[#fe2c55] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                        TikTok
                      </span>
                      <h3 className="text-white text-sm font-bold truncate max-w-[260px]">
                        {activeVideo.title || "Xem Video"}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
                      aria-label="Đóng"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body / TikTok Player Container */}
                  <div className="w-full h-[600px] bg-black flex justify-center items-center relative overflow-hidden [&_iframe]:!h-[600px] [&_iframe]:!w-full [&_iframe]:!border-0">
                    <blockquote
                      className="tiktok-embed modal-tiktok-embed"
                      cite={activeVideo.url}
                      data-video-id={activeVideo.tiktokId}
                      style={{ width: "100%", height: "600px", margin: 0 }}
                    >
                      <section />
                    </blockquote>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between gap-3">
                    <a
                      href={activeVideo.url || `https://www.tiktok.com/@dongnaiford.official/video/${activeVideo.tiktokId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#fe2c55] hover:bg-[#ff0050] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition no-underline shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" /> Xem trực tiếp trên ứng dụng TikTok
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
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
                  {getPageNumbers().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="w-11 h-11 flex items-center justify-center text-gray-400 font-semibold text-sm select-none"
                        >
                          ...
                        </span>
                      );
                    }
                    const pageNum = page as number;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={`page-${pageNum}`}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-11 h-11 flex items-center justify-center font-semibold text-sm rounded-[4px] transition cursor-pointer ${
                          isActive
                            ? "bg-[#044ea7] text-white"
                            : "bg-white text-[#808080] hover:bg-gray-100"
                        }`}
                      >
                        {pageNum < 10 ? `0${pageNum}` : pageNum}
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
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-gray-500">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <p className="text-sm">Chưa có video TikTok nào được đăng tải.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MediaPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#fafafa] min-h-screen py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0562d2]" />
      </div>
    }>
      <MediaPageContent />
    </Suspense>
  );
}
