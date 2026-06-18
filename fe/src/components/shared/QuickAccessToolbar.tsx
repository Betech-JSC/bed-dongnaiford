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
      label: "Ướn tính vay ngân hàng",
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
      <div className="bg-white/95 backdrop-blur-xs border border-gray-200 rounded-[28px] shadow-lg flex flex-col py-2.5 w-12">
        {menuItems.map((item, idx) => {
          const isExternal = item.target === "_blank";
          return (
            <Link
              key={idx}
              href={item.href}
              target={item.target}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="w-12 h-12 flex items-center justify-center relative group text-gray-650 hover:text-[#001c7f] hover:bg-gray-50/50 transition-all duration-200"
            >
              {/* Icon */}
              {item.icon}

              {/* Hover Tooltip Label */}
              <span className="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-[#001c7f] text-white text-[11px] font-bold py-1.5 px-3.5 rounded-full whitespace-nowrap shadow-md z-50">
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
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-gray-650 hover:text-[#001c7f] hover:bg-gray-50 transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          
          {/* Tooltip */}
          <span className="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-[#001c7f] text-white text-[11px] font-bold py-1.5 px-3.5 rounded-full whitespace-nowrap shadow-md z-50">
            Cuộn lên đầu trang
          </span>
        </div>
      )}
    </div>
  );
}
