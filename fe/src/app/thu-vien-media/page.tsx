"use client";

import { useState, useEffect } from "react";
import { Video, AlertCircle } from "lucide-react";
import { postsAPI } from "@/lib/api";

interface VideoItem {
  id: string;
  tiktokId: string;
  title: string;
  description: string;
}

function getTikTokId(urlOrId: string): string {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  
  // If it's already just digits, it's the video ID
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  
  // Match standard link: https://www.tiktok.com/@username/video/731234567890
  const standardMatch = trimmed.match(/\/video\/(\d+)/);
  if (standardMatch && standardMatch[1]) {
    return standardMatch[1];
  }
  
  return "";
}

export default function MediaPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res: any = await postsAPI.getAll({ type: "MEDIA" });
        const items = res?.posts?.data || res?.posts || res?.data || res;

        if (Array.isArray(items) && items.length > 0) {
          const mappedVideos: VideoItem[] = items.map((post: any) => ({
            id: post.slug || String(post.id),
            tiktokId: getTikTokId(post.author || ""),
            title: post.title || "",
            description: post.description || ""
          }));
          // Only show videos that have a valid TikTok ID
          setVideos(mappedVideos.filter(v => v.tiktokId));
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("Error fetching media library videos:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="bg-[#fafafa] min-h-screen py-16">
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col gap-12 items-center">

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
            <div className="text-xs text-gray-400 bg-gray-100/60 p-3 rounded-lg border border-gray-200/50 max-w-lg mx-auto leading-relaxed">
              <span className="font-semibold text-gray-500 block mb-1">💡 Hướng dẫn dành cho Admin:</span>
              Để đưa video TikTok lên trang này, khi tạo bài viết ở trang quản trị CMS, vui lòng chọn loại bài viết là <code className="bg-gray-200 px-1 py-0.5 rounded text-[#0562d2]">MEDIA</code> và nhập link video TikTok (ví dụ: <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-600 font-mono">https://www.tiktok.com/@user/video/731234567890</code>) vào trường <strong>Tác giả (Author)</strong>.
            </div>
          </div>
        </div>

        {/* Video Grid Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0562d2]" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex flex-col gap-4 bg-white p-3 rounded-2xl border border-gray-200/60 shadow-xs hover:shadow-md transition-all duration-300 w-full"
              >
                {/* Embed TikTok Player */}
                <div className="aspect-[9/16] relative rounded-xl overflow-hidden w-full bg-black">
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${video.tiktokId}`}
                    title={video.title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Text Info */}
                <div className="flex flex-col gap-1 px-1 py-1 text-left">
                  <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-sm text-[#00095b] line-clamp-2 min-h-[40px]">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
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
