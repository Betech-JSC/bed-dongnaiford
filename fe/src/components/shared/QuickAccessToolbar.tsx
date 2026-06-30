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

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.145 2 11.242c0 2.91 1.45 5.498 3.71 7.073V22l3.528-1.937A11.758 11.758 0 0012 20.484c5.523 0 10-4.146 10-9.242S17.523 2 12 2zm1.192 11.938l-2.435-2.6-4.75 2.6 5.22-5.542 2.435 2.6 4.75-2.6-5.22 5.542z" />
  </svg>
);

const ZaloIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 5.58 2 10c0 2.5 1.43 4.72 3.69 6.06-.18.88-.65 2.65-.77 3.12-.16.63.22.61.47.45.36-.23 3.01-2.02 3.86-2.58.89.24 1.83.37 2.75.37 5.52 0 10-3.58 10-8s-4.48-8-10-8zm-2.45 10.93H7v-1.12h1.49L7 9.42V9h2.52v1.12H8.03l1.52 2.39v.42zm2.98 0h-1.12V9h1.12v3.93zm2.53-2.73c-.5 0-.89.39-.89.89 0 .5.39.89.89.89.5 0 .89-.39.89-.89 0-.5-.39-.89-.89-.89zm0 2.93c-1.14 0-2.07-.93-2.07-2.07s.93-2.07 2.07-2.07 2.07.93 2.07 2.07-.93 2.07-2.07 2.07zm3.43-2.93c-.5 0-.89.39-.89.89 0 .5.39.89.89.89.5 0 .89-.39.89-.89 0-.5-.39-.89-.89-.89zm0 2.93c-1.14 0-2.07-.93-2.07-2.07s.93-2.07 2.07-2.07 2.07.93 2.07 2.07-.93 2.07-2.07 2.07z" />
  </svg>
);

export default function QuickAccessToolbar() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasCompareItems, setHasCompareItems] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkCompare = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("compare-vehicles");
        if (stored) {
          try {
            const ids = JSON.parse(stored);
            setHasCompareItems(Array.isArray(ids) && ids.length > 0);
            return;
          } catch {}
        }
      }
      setHasCompareItems(false);
    };

    checkCompare();
    window.addEventListener("compare-updated", checkCompare);
    return () => window.removeEventListener("compare-updated", checkCompare);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const desktopMenuItems = [
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

  const mobileMenuItems = [
    {
      label: "Facebook",
      icon: <FacebookIcon />,
      href: "https://www.facebook.com/FordDongNai.Official",
      target: "_blank",
      colorClass: "text-[#1877f2]",
      rippleClass: "animate-quick-ripple-facebook",
      delay: "0s",
    },
    {
      label: "Messenger",
      icon: <MessengerIcon />,
      href: "https://m.me/FordDongNai.Official",
      target: "_blank",
      colorClass: "text-[#a200ff]",
      rippleClass: "animate-quick-ripple-messenger",
      delay: "0.3s",
    },
    {
      label: "Zalo",
      icon: <ZaloIcon />,
      href: "https://zalo.me/0918909060",
      target: "_blank",
      colorClass: "text-[#0068ff]",
      rippleClass: "animate-quick-ripple-zalo",
      delay: "0.6s",
    },
    {
      label: "Hotline",
      icon: <Phone className="w-5 h-5" />,
      href: "tel:0918909060",
      colorClass: "text-[#e11d48]",
      rippleClass: "animate-quick-ripple-phone",
      delay: "0.9s",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes quick-ring-keyframes {
          0% { transform: scale(1); }
          10% { transform: scale(1.1) rotate(0deg); }
          12% { transform: scale(1.1) rotate(-12deg); }
          14% { transform: scale(1.1) rotate(12deg); }
          16% { transform: scale(1.1) rotate(-10deg); }
          18% { transform: scale(1.1) rotate(10deg); }
          20% { transform: scale(1.1) rotate(-8deg); }
          22% { transform: scale(1.1) rotate(8deg); }
          24% { transform: scale(1.1) rotate(0deg); }
          26% { transform: scale(1) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes quick-ripple-phone-keyframes {
          0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(225, 29, 72, 0); }
          100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }
        @keyframes quick-ripple-zalo-keyframes {
          0% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(0, 104, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0); }
        }
        @keyframes quick-ripple-messenger-keyframes {
          0% { box-shadow: 0 0 0 0 rgba(162, 0, 255, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(162, 0, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(162, 0, 255, 0); }
        }
        @keyframes quick-ripple-facebook-keyframes {
          0% { box-shadow: 0 0 0 0 rgba(24, 119, 242, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(24, 119, 242, 0); }
          100% { box-shadow: 0 0 0 0 rgba(24, 119, 242, 0); }
        }
        .animate-quick-ring {
          animation: quick-ring-keyframes 2.5s infinite ease-in-out;
        }
        .animate-quick-ripple-phone {
          animation: quick-ripple-phone-keyframes 2.5s infinite ease-in-out;
        }
        .animate-quick-ripple-zalo {
          animation: quick-ripple-zalo-keyframes 2.5s infinite ease-in-out;
        }
        .animate-quick-ripple-messenger {
          animation: quick-ripple-messenger-keyframes 2.5s infinite ease-in-out;
        }
        .animate-quick-ripple-facebook {
          animation: quick-ripple-facebook-keyframes 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* Desktop Version */}
      <div className={`hidden md:flex fixed right-6 z-50 flex-col items-center gap-3 select-none transition-all duration-300 ${
        hasCompareItems ? "bottom-20 sm:bottom-8" : "bottom-8"
      }`}>
        {/* Action pill container */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-[28px] shadow-[0_12px_40px_-12px_rgba(0,9,91,0.15)] flex flex-col py-2 w-12 transition-all duration-300 hover:shadow-[0_12px_40px_-6px_rgba(5,98,210,0.2)]">
          {desktopMenuItems.map((item, idx) => {
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

      {/* Mobile Version */}
      <div className={`flex md:hidden fixed right-4 z-50 flex-col items-center gap-2.5 select-none transition-all duration-300 ${
        hasCompareItems ? "bottom-20" : "bottom-6"
      }`}>
        {mobileMenuItems.map((item, idx) => {
          const isExternal = item.target === "_blank";
          return (
            <Link
              key={idx}
              href={item.href}
              target={item.target}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={`w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-90 animate-quick-ring ${item.rippleClass}`}
              style={{ animationDelay: item.delay }}
            >
              <div className={`relative z-10 transition-transform duration-300 ${item.colorClass}`}>
                {item.icon}
              </div>
            </Link>
          );
        })}

        {/* Mobile Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-gray-650 transition-all duration-300 active:scale-90"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 relative z-10" />
          </button>
        )}
      </div>
    </>
  );
}
