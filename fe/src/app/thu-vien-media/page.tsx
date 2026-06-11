"use client";

import { useState, useEffect } from "react";
import { Play, X, Video, AlertCircle } from "lucide-react";
import { postsAPI } from "@/lib/api";

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
}

function getYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes("?")) {
    return trimmed;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : trimmed;
}

export default function MediaPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res: any = await postsAPI.getAll({ type: "MEDIA" });
        const items = res?.posts?.data || res?.posts || res?.data || res;

        if (Array.isArray(items) && items.length > 0) {
          const mappedVideos: VideoItem[] = items.map((post: any) => ({
            id: post.slug || String(post.id),
            youtubeId: getYouTubeId(post.author || ""),
            title: post.title,
            description: post.description || "",
            thumbnail: post.image?.url || ""
          }));
          setVideos(mappedVideos.filter(v => v.youtubeId));
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
            Video Hướng dẫn Lái xe An Toàn
          </h1>
          <div className="font-sans text-sm md:text-base leading-relaxed text-gray-600 mt-2 space-y-4 max-w-2xl mx-auto">
            <p>
              Chương trình Hướng dẫn Lái xe An toàn và Thân thiện với Môi trường (DSFL) được thực hiện bởi đội ngũ chuyên gia hàng đầu từ Ford Việt Nam và Đồng Nai Ford.
            </p>
            <p className="text-gray-500 text-xs">
              Xem ngay các chuỗi video bài giảng thực tế để cải thiện kỹ năng xử lý tình huống, nâng cao độ an toàn cho bản thân và gia đình trên mỗi dặm đường.
            </p>
          </div>
        </div>

        {/* Video Grid Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0562d2]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-200/60 shadow-xs hover:shadow-lg transition-all duration-300 group"
              >
                {/* Thumbnail with hover play overlay */}
                <div
                  onClick={() => setActiveVideo(video)}
                  className="aspect-[16/10] relative rounded-xl overflow-hidden w-full cursor-pointer bg-gray-100"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/95 text-[#00095b] group-hover:bg-[#0562d2] group-hover:text-white rounded-full flex items-center justify-center shadow-md transform group-hover:scale-110 transition-all duration-300">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-2 px-1 py-1 text-left">
                  <h3
                    onClick={() => setActiveVideo(video)}
                    className="font-['Ford_Antenna',sans-serif] font-bold text-base text-[#00095b] group-hover:text-[#0562d2] cursor-pointer transition-colors duration-200 line-clamp-2 min-h-[48px]"
                  >
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Playback Modal Popup */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in">
          {/* Modal Container */}
          <div className="relative w-full max-w-[960px] aspect-[16/9] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition cursor-pointer border-0"
              aria-label="Đóng video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Embedded YouTube Iframe */}
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
              title={activeVideo.title}
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
