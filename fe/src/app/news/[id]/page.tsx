"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, MessageCircle, Copy, Check, Calendar } from "lucide-react";
import { getArticleById, articles } from "@/data/articles";
import { handleImageError } from "@/lib/site-assets";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const article = useMemo(() => getArticleById(id), [id]);

  const [copied, setCopied] = useState(false);

  // Filter 3 related articles (excluding the current one)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter((art) => art.id !== article.id)
      .slice(0, 3);
  }, [article]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!article) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] py-24 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Không tìm thấy bài viết</h2>
        <p className="text-gray-600 mb-8">Bài viết bạn yêu cầu không tồn tại hoặc đã bị xóa.</p>
        <Link href="/news" className="btn-ford-primary">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa] min-h-screen py-12 flex flex-col items-center">
      {/* Back button container */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full mb-6">
        <Link 
          href="/news" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#424242] hover:text-[#0562d2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Tin tức & Ưu Đãi
        </Link>
      </div>

      {/* Article Detail Card Container */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col items-center mb-16">
        <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-6 md:p-12 w-full max-w-[860px] shadow-xs flex flex-col gap-8">
          
          {/* Header Metadata */}
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-[#0562d2] text-sm font-semibold uppercase tracking-wider">
              {article.category}
            </span>
            <h1 className="font-['Ford_Antenna',sans-serif] font-semibold text-[28px] md:text-[36px] leading-[1.25] text-[#00095b] max-w-[760px]">
              {article.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-[#424242] mt-2">
              <Calendar className="w-4 h-4 text-[#808080]" />
              <span>{article.date}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-[16/9] relative rounded-[12px] overflow-hidden w-full bg-gray-50 border border-gray-100">
            <img 
              src={article.image} 
              alt={article.title} 
              className="absolute inset-0 w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>

          {/* Article Content Body */}
          <div className="font-sans text-[#1a1a1a] leading-relaxed text-[16px] max-w-[760px] mx-auto w-full">
            {article.body.map((block, idx) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p key={`p-${idx}`} className="mb-6 text-[#424242] leading-relaxed whitespace-pre-line">
                      {block.value}
                    </p>
                  );
                case "heading":
                  return (
                    <h3 
                      key={`h-${idx}`} 
                      className="font-['Ford_Antenna',sans-serif] font-semibold text-[22px] leading-snug text-[#00095b] mt-8 mb-4"
                    >
                      {block.value}
                    </h3>
                  );
                case "list":
                  return (
                    <ul key={`list-${idx}`} className="list-disc pl-6 space-y-2.5 mb-6 text-[#424242]">
                      {(block.value as string[]).map((item, lIdx) => (
                        <li key={`li-${idx}-${lIdx}`} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                case "image":
                  return (
                    <div key={`img-${idx}`} className="aspect-[16/9] relative rounded-[12px] overflow-hidden my-8 border border-gray-100 shadow-xs">
                      <img 
                        src={block.value as string} 
                        alt="Hình ảnh bài viết" 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* Call to Action Booking Box */}
          <div className="bg-gray-50 rounded-[12px] p-6 border border-[#e5e5e5] text-center flex flex-col items-center gap-4 mt-4">
            <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-lg text-[#00095b]">
              Bạn đang quan tâm tới dòng xe hoặc dịch vụ của Ford?
            </h4>
            <p className="text-sm text-[#424242] max-w-[500px]">
              Đặt lịch hẹn ngay hôm nay tại đại lý Đồng Nai Ford để được tư vấn giá lăn bánh tốt nhất cùng các chương trình khuyến mãi tháng 5.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full justify-center">
              <Link 
                href={`/contact?reason=Đăng ký lái thử&vehicle=new-everest`} 
                className="w-full sm:w-[200px] py-2.5 bg-[#0562d2] hover:bg-[#00095b] text-white font-semibold text-sm rounded-full text-center transition shadow-xs cursor-pointer"
              >
                Đăng ký lái thử
              </Link>
              <Link 
                href={`/contact?reason=Báo giá&vehicle=new-everest`} 
                className="w-full sm:w-[200px] py-2.5 border border-[#0562d2] hover:bg-[#0562d2]/5 text-[#0562d2] font-semibold text-sm rounded-full text-center transition cursor-pointer"
              >
                Nhận báo giá
              </Link>
            </div>
          </div>

          {/* Social Sharing Drawer */}
          <div className="border-t border-[#e5e5e5] pt-6 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1d2939] flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#808080]" /> Chia sẻ bài viết
            </span>
            <div className="flex gap-4">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#d6d6d6] hover:bg-gray-50 text-[#1d2939] flex items-center justify-center rounded-full transition"
                title="Chia sẻ Facebook"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a 
                href={`https://zalo.me/share?url=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#d6d6d6] hover:bg-gray-50 text-[#1d2939] flex items-center justify-center rounded-full transition"
                title="Chia sẻ Zalo"
              >
                <MessageCircle className="w-4.5 h-4.5" />
              </a>
              <button 
                onClick={handleCopyLink}
                className="w-9 h-9 border border-[#d6d6d6] hover:bg-gray-50 text-[#1d2939] flex items-center justify-center rounded-full transition relative cursor-pointer"
                title="Sao chép liên kết"
              >
                {copied ? <Check className="w-4.5 h-4.5 text-green-600" /> : <Copy className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. RELATED ARTICLES */}
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full bg-[#fafafa] py-12 border-t border-[#e5e5e5]">
        <div className="flex flex-col gap-8">
          <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] leading-[1.32] text-[#1a1a1a] text-center">
            Tin tức & Ưu Đãi liên quan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((art) => (
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
        </div>
      </section>
    </div>
  );
}
