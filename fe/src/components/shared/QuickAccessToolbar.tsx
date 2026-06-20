"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Calculator, PiggyBank, Wrench, Phone, MessageCircle, ArrowUp } from "lucide-react";

const SteeringWheelIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="2.5" />
    <line x1="12" y1="2" x2="12" y2="9.5" />
    <line x1="12" y1="12" x2="5.5" y2="18.5" />
    <line x1="12" y1="12" x2="18.5" y2="18.5" />
  </svg>
);

export default function QuickAccessToolbar() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const menuItems = [
    {
      label: "Đăng ký lái thử",
      icon: <SteeringWheelIcon />,
      href: "/lien-he?reason=Đăng ký lái thử",
    },
    {
      label: "So sánh xe",
      icon: <ArrowLeftRight className="w-5 h-5" />,
      href: "/cong-cu/so-sanh-xe",
    },
    {
      label: "Ước tính lăn bánh",
      icon: <Calculator className="w-5 h-5" />,
      href: "/cong-cu/uoc-tinh-lan-banh",
    },
    {
      label: "Ước tính vay ngân hàng",
      icon: <PiggyBank className="w-5 h-5" />,
      href: "/cong-cu/uoc-tinh-tra-gop",
    },
    {
      label: "Đặt hẹn dịch vụ",
      icon: <Wrench className="w-5 h-5" />,
      href: "/lien-he?reason=Đặt hẹn dịch vụ",
    },
    {
      label: "Gọi Hotline: 0918 90 90 60",
      icon: <Phone className="w-5 h-5" />,
      href: "tel:0918909060",
    },
    {
      label: "Chat Zalo",
      icon: <MessageCircle className="w-5 h-5" />,
      href: "https://zalo.me/0918909060",
      target: "_blank",
    },
  ];

  return (
    <div className="fixed right-6 bottom-8 z-50 flex flex-col items-center gap-3 select-none">
      {/* Action pill container */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-[28px] shadow-[0_12px_40px_-12px_rgba(0,9,91,0.15)] flex flex-col py-2 w-12 transition-all duration-300 hover:shadow-[0_12px_40px_-6px_rgba(5,98,210,0.2)]">
        {menuItems.map((item, idx) => {
          const isExternal = item.target === "_blank";
          return (
            <Link
              key={idx}
              href={item.href}
              target={item.target}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="w-12 h-12 flex items-center justify-center relative group text-gray-650 hover:text-[#0562D2] transition-all duration-300 rounded-full"
            >
              {/* Hover glow background */}
              <div className="absolute inset-1.5 rounded-full bg-[#0562D2]/0 group-hover:bg-[#0562D2]/8 group-hover:scale-105 transition-all duration-300 ease-out" />
              
              {/* Icon with micro scale */}
              <div className="relative z-10 transition-transform duration-300 ease-out group-hover:scale-115">
                {item.icon}
              </div>

              {/* Hover Tooltip Label with Arrow & Slide Effect */}
              <span className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:right-15 transition-all duration-300 bg-[#00095B] text-white text-[11px] font-bold py-1.5 px-4 rounded-full whitespace-nowrap shadow-md z-50 after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-full after:border-[5px] after:border-transparent after:border-l-[#00095B]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <div className="relative group">
          <button
            onClick={scrollToTop}
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-md border border-gray-200/50 text-gray-650 hover:text-[#0562D2] transition-all hover:-translate-y-1 active:translate-y-0 duration-300 cursor-pointer relative overflow-hidden"
            aria-label="Scroll to top"
          >
            {/* Hover glow background */}
            <div className="absolute inset-0 rounded-full bg-[#0562D2]/0 hover:bg-[#0562D2]/8 transition-all duration-300 ease-out" />
            <ArrowUp className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
          
          {/* Tooltip */}
          <span className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:right-15 transition-all duration-300 bg-[#00095B] text-white text-[11px] font-bold py-1.5 px-4 rounded-full whitespace-nowrap shadow-md z-50 after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-full after:border-[5px] after:border-transparent after:border-l-[#00095B]">
            Cuộn lên đầu trang
          </span>
        </div>
      )}
    </div>
  );
}
