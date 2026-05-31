"use client";

import { useState } from "react";
import { Play, X, Video } from "lucide-react";

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
}

const dsflVideos: VideoItem[] = [
  {
    id: "dsfl-sitting",
    youtubeId: "NnUj3yK3Bic",
    title: "Tư thế ngồi lái & Cách chỉnh gương chiếu hậu đúng chuẩn",
    description: "Chuyên gia Ford hướng dẫn cách căn chỉnh vị trí ngồi, độ cao ghế và góc gương chiếu hậu để có tầm quan sát tối đa, tránh điểm mù và giảm mệt mỏi.",
    thumbnail: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "dsfl-steering",
    youtubeId: "nJsnHwV3nsw",
    title: "Kỹ thuật cầm vô lăng và kiểm soát hướng lái an toàn",
    description: "Hướng dẫn tư thế cầm vô lăng chuẩn 9:15, kỹ thuật quay vô lăng chéo tay (hand-over-hand) và trả lái mượt mà khi di chuyển qua các góc cua hẹp.",
    thumbnail: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "dsfl-precheck",
    youtubeId: "Vd_Q4lR8rAw",
    title: "Kiểm tra kỹ thuật xe toàn diện trước khi khởi hành",
    description: "Các bước kiểm tra nhanh lốp xe, nước làm mát, dầu động cơ và hệ thống đèn tín hiệu để đảm bảo an toàn tuyệt đối trước mỗi chuyến đi xa.",
    thumbnail: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "dsfl-automatic",
    youtubeId: "Zp9kK8K71lE",
    title: "Kỹ năng lái xe số tự động an toàn & tiết kiệm nhiên liệu",
    description: "Tìm hiểu nguyên lý hoạt động của hộp số tự động và kỹ thuật sử dụng chân phanh/ga đúng cách giúp xe vận hành trơn tru và tối ưu hóa mức tiêu hao.",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "dsfl-braking",
    youtubeId: "Y-i03cpx8L4",
    title: "Kỹ thuật phanh khẩn cấp & Sự hỗ trợ từ hệ thống ABS",
    description: "Cách xử lý phanh khẩn cấp trong các tình huống bất ngờ, hiểu rõ cơ chế hoạt động của hệ thống phanh chống bó cứng ABS để duy trì kiểm soát lái.",
    thumbnail: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "dsfl-night",
    youtubeId: "aFzI25q-P10",
    title: "Kinh nghiệm lái xe ban đêm & Xử lý đèn pha/cốt",
    description: "Các nguyên tắc an toàn khi di chuyển trong bóng tối, cách sử dụng đèn chiếu xa/gần đúng luật để không gây chói mắt xe ngược chiều mà vẫn đảm bảo tầm nhìn.",
    thumbnail: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800"
  }
];

export default function MediaPage() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <div className="bg-[#fafafa] min-h-screen py-12">
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col gap-10 items-center">
        {/* Header Title Section */}
        <div className="flex flex-col gap-4 text-center max-w-[900px] w-full">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0562d2] uppercase tracking-wider justify-center">
            <Video className="w-4.5 h-4.5" /> Media Gallery
          </span>
          <h1 className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] md:text-[48px] leading-[1.2] text-[#00095b] tracking-tight">
            Video Hướng dẫn Lái xe An Toàn
          </h1>
          <div className="font-['Ford_Antenna',sans-serif] text-base leading-relaxed text-[#1a1a1a] text-justify md:text-center mt-2 space-y-4">
            <p>
              Hướng dẫn Lái xe An toàn là chuỗi video nằm trong chương trình Hướng dẫn Lái xe An toàn và Thân thiện với Môi trường (DSFL) của Ford Việt Nam. Series bao gồm các videos ngắn gọn và súc tích được thể hiện bởi chuyên gia lái xe an toàn của Ford Việt Nam, bao trùm nhiều kiến thức thiết thực và cần thiết dành cho người lái xe, giúp họ có những hành trình an toàn và thoải mái.
            </p>
            <p className="text-gray-600 text-sm">
              Hãy cùng Đồng Nai Ford theo dõi các video dưới để được chuyên gia lái xe an toàn Ford hướng dẫn cách cầm vô lăng đúng, kỹ năng lái xe tự động, điều chỉnh vị trí ngồi và kiểm tra xe trước khi khởi hành nhé!
            </p>
          </div>
        </div>

        {/* Video Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 w-full">
          {dsflVideos.map((video) => (
            <div 
              key={video.id} 
              className="flex flex-col gap-4 bg-white p-4 rounded-[16px] border border-[#e5e5e5] shadow-xs group"
            >
              {/* Thumbnail with hover play overlay */}
              <div 
                onClick={() => setActiveVideo(video)}
                className="aspect-[810/489] relative rounded-[12px] overflow-hidden w-full cursor-pointer bg-gray-100"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute inset-0 object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-300" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 text-[#00095b] group-hover:bg-[#0562d2] group-hover:text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2 px-1 py-2">
                <h3 
                  onClick={() => setActiveVideo(video)}
                  className="font-['Ford_Antenna',sans-serif] font-semibold text-lg text-[#00095b] group-hover:text-[#0562d2] cursor-pointer transition-colors duration-200"
                >
                  {video.title}
                </h3>
                <p className="text-sm text-[#424242] leading-relaxed line-clamp-2">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Playback Modal Popup */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in">
          {/* Modal Container */}
          <div className="relative w-full max-w-[960px] aspect-[16/9] bg-black rounded-[12px] overflow-hidden shadow-2xl border border-white/10">
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition cursor-pointer"
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
