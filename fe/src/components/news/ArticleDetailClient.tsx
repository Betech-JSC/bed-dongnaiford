"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, MessageCircle, Copy, Check, Calendar, ChevronLeft, ChevronRight, List, ChevronDown, ChevronUp } from "lucide-react";
import { handleImageError } from "@/lib/site-assets";
import BlogCtaCard from "./BlogCtaCard";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const parseTocAndInjectIds = (html: string) => {
  const toc: TocItem[] = [];
  let counter = 0;

  // Match <h2> and <h3> tags and collect them
  const parsedHtml = html.replace(/<(h2|h3)([^>]*?)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, content) => {
    counter++;
    const cleanText = content.replace(/<[^>]*>/g, "").trim();
    const id = `toc-heading-${counter}`;
    
    toc.push({
      id,
      text: cleanText,
      level: tag.toLowerCase() === 'h2' ? 2 : 3
    });

    return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
  });

  return { parsedHtml, toc };
};

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

export default function ArticleDetailClient({
  article,
  relatedArticles,
}: {
  article: any;
  relatedArticles: any[];
}) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const [isTocExpanded, setIsTocExpanded] = useState(true);

  // Render Table of Contents Card
  const renderTableOfContents = (toc: TocItem[]) => {
    if (!toc || toc.length === 0) return null;

    return (
      <div className="mb-8 p-5 bg-gray-50 border border-[#e5e5e5] rounded-[10px] max-w-[760px] mx-auto w-full transition-all">
        <button
          onClick={() => setIsTocExpanded(!isTocExpanded)}
          className="flex items-center justify-between w-full font-sans font-semibold text-[#00095b] text-[16px] md:text-[18px] cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-[#0562d2]" />
            <span>Mục lục bài viết</span>
          </div>
          {isTocExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {isTocExpanded && (
          <ul className="mt-4 flex flex-col gap-2.5 pl-1.5 border-l border-gray-200 ml-2">
            {toc.map((item, idx) => (
              <li
                key={idx}
                style={{ paddingLeft: item.level === 3 ? '1.5rem' : '0' }}
                className="list-none"
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(item.id);
                    if (element) {
                      const offset = 85;
                      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                      window.scrollTo({
                        top: elementPosition - offset,
                        behavior: "smooth"
                      });
                    }
                  }}
                  className="font-sans text-[14px] leading-normal text-gray-600 hover:text-[#0562d2] transition-colors hover:underline block"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Helper function to render article content and parse [cta-form] / [[cta-form]] shortcodes
  const renderArticleBody = () => {
    const rawHtml = article.content || "";
    const cleanHtml = rawHtml.replace(/<h1([^>]*?)>/gi, "<h2$1>").replace(/<\/h1>/gi, "</h2>");

    // Parse TOC headings and inject unique IDs
    const { parsedHtml, toc } = parseTocAndInjectIds(cleanHtml);

    // Regular expression to match shortcode wrapped in <p>, <span>, or bare
    const regex = /<p>\s*(?:\[cta-form\]|\[\[cta-form\]\])\s*<\/p>|<span>\s*(?:\[cta-form\]|\[\[cta-form\]\])\s*<\/span>|\[cta-form\]|\[\[cta-form\]\]/i;
    const parts = parsedHtml.split(regex);

    // Render helper for TOC + HTML content parts
    const renderContent = () => {
      if (parts.length <= 1) {
        return (
          <div 
            className="font-sans text-[#1a1a1a] leading-relaxed text-[16px] max-w-[760px] mx-auto w-full prose prose-blue"
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
          />
        );
      }

      return (
        <div className="flex flex-col gap-4">
          {parts.map((part, index) => {
            const isPartEmpty = !part.trim();
            return (
              <React.Fragment key={index}>
                {!isPartEmpty && (
                  <div 
                    className="font-sans text-[#1a1a1a] leading-relaxed text-[16px] max-w-[760px] mx-auto w-full prose prose-blue"
                    dangerouslySetInnerHTML={{ __html: part }}
                  />
                )}
                {index < parts.length - 1 && (
                  <div className="w-full my-4">
                    <BlogCtaCard articleTitle={article.title} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col">
        {renderTableOfContents(toc)}
        {renderContent()}
      </div>
    );
  };

  return (
    <div id="article-detail-page" className="bg-[#fafafa] min-h-screen py-12 flex flex-col items-center w-full">
      {/* Back button container */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full mb-6">
        <Link 
          href="/tin-tuc" 
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
            {article.category && (
              <span className="text-[#0562d2] text-sm font-semibold uppercase tracking-wider">
                {article.category.title}
              </span>
            )}
            <h1 className="font-['Ford_Antenna',sans-serif] font-semibold text-[28px] md:text-[36px] leading-[1.25] text-[#00095b] max-w-[760px]">
              {article.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-[#424242] mt-2">
              <Calendar className="w-4 h-4 text-[#808080]" />
              <span>{formatDate(article.published_at)}</span>
            </div>
          </div>

          {/* Featured Image */}
          {article.image?.url && (
            <div className="aspect-[16/9] relative rounded-[12px] overflow-hidden w-full bg-gray-50 border border-gray-100">
              <img 
                src={article.image.url} 
                alt={article.title} 
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
          )}

          {/* Article Content Body */}
          {renderArticleBody()}


          {/* Related Articles in text form */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-[#e5e5e5] pt-6 flex flex-col gap-3">
              <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-[16px] text-[#00095b] uppercase tracking-wider">
                Tin tức liên quan:
              </h4>
              <ul className="flex flex-col gap-2.5 pl-4 list-disc text-gray-500">
                {relatedArticles.map((art) => (
                  <li key={art.id} className="text-slate-400">
                    <Link
                      href={`/${art.slug}`}
                      className="font-sans text-[16px] font-medium leading-relaxed text-[#00095b] hover:text-[#0562d2] transition-colors hover:underline"
                    >
                      {art.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
