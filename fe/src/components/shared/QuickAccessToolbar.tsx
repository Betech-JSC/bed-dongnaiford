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
  <svg width="20" height="20" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0 13.318C0 19.9031 5.02036 25.3783 11.5855 26.4881V16.9229H8.10982V13.2441H11.5855V10.3009C11.5855 6.9899 13.8253 5.15046 16.992 5.15046C17.996 5.15046 19.0774 5.29761 20.0814 5.44476V8.82936H18.305C16.6058 8.82936 16.2196 9.63872 16.2196 10.6688V13.2441H19.927L19.3091 16.9229H16.2196V26.4881C22.7848 25.3783 27.8051 19.9031 27.8051 13.318Z" fill="currentColor"/>
  </svg>
);

const MessengerIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 3.22 1.43 6.08 3.86 7.82l-.24 2.45a.5.5 0 00.7.5l2.76-1.51c.9.25 1.86.39 2.92.39 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1.2 12.3l-2.4-2.55-4.65 2.55 5.1-5.4 2.4 2.55 4.65-2.55-5.1 5.4z" />
  </svg>
);

const ZaloIcon = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="quick-access-zalo-mask" x="0" y="0" width="32" height="32">
        <rect x="0" y="0" width="32" height="32" fill="white" />
        <path d="M13.1605 10.88H6.93646V12.2146H11.2556L6.99707 17.4923C6.86363 17.6864 6.7666 17.8684 6.7666 18.2809V18.6206H12.6387C12.9299 18.6206 13.1726 18.378 13.1726 18.0868V17.3709H8.63502L12.6387 12.348C12.6994 12.2753 12.8086 12.1418 12.8572 12.0812L12.8814 12.0447C13.1119 11.705 13.1605 11.4138 13.1605 11.062V10.88ZM21.0826 18.6206H21.9683V10.88H20.6337V18.1717C20.6337 18.4144 20.8279 18.6206 21.0826 18.6206ZM16.521 12.6031C14.8467 12.6031 13.4878 13.962 13.4878 15.6363C13.4878 17.3106 14.8467 18.6694 16.521 18.6694C18.1953 18.6694 19.5541 17.3106 19.5541 15.6363C19.5663 13.962 18.2074 12.6031 16.521 12.6031ZM16.521 17.4198C15.5382 17.4198 14.7375 16.619 14.7375 15.6363C14.7375 14.6536 15.5382 13.8528 16.521 13.8528C17.5037 13.8528 18.3045 14.6536 18.3045 15.6363C18.3045 16.619 17.5158 17.4198 16.521 17.4198ZM25.9115 12.5544C24.225 12.5544 22.8541 13.9254 22.8541 15.6118C22.8541 17.2982 24.225 18.6693 25.9115 18.6693C27.5979 18.6693 28.9689 17.2982 28.9689 15.6118C28.9689 13.9254 27.5979 12.5544 25.9115 12.5544ZM25.9115 17.4196C24.9166 17.4196 24.1158 16.6188 24.1158 15.6239C24.1158 14.6291 24.9166 13.8283 25.9115 13.8283C26.9064 13.8283 27.7071 14.6291 27.7071 15.6239C27.7071 16.6188 26.9064 17.4196 25.9115 17.4196Z" fill="black" />
        <path d="M18.8522 18.6204H19.568V12.7725H18.3184V18.0987C18.3184 18.3778 18.561 18.6204 18.8522 18.6204Z" fill="black" />
      </mask>
    </defs>
    <path fillRule="evenodd" clipRule="evenodd" d="M4.97875 27.8971C6.46541 28.0614 8.3241 27.6375 9.64384 26.9968C15.3746 30.1644 24.3328 30.0131 29.7553 26.5428C29.9656 26.2274 30.1621 25.8993 30.3444 25.5592C31.4282 23.5379 32.0005 21.2608 32.0005 17.3642V14.5392C32.0005 10.6426 31.4282 8.3655 30.3444 6.34415C29.2728 4.32279 27.6777 2.7398 25.6563 1.65605C23.6349 0.572313 21.3579 0 17.4613 0H14.6241C11.3054 0 9.15104 0.417763 7.34093 1.21532C7.24199 1.30392 7.1449 1.39404 7.04986 1.48566C1.73929 6.60499 1.33561 17.702 5.83878 23.73C5.8438 23.7389 5.84937 23.7479 5.85548 23.757C6.54957 24.7798 5.87984 26.5699 4.83263 27.617C4.66215 27.7754 4.72304 27.8728 4.97875 27.8971Z" fill="currentColor" mask="url(#quick-access-zalo-mask)" />
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
      href: "https://zalo.me/4149231651356573695",
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
    },
    {
      label: "Messenger",
      icon: <MessengerIcon />,
      href: "https://m.me/FordDongNai.Official",
      target: "_blank",
      colorClass: "text-[#a200ff]",
    },
    {
      label: "Zalo",
      icon: <ZaloIcon />,
      href: "https://zalo.me/4149231651356573695",
      target: "_blank",
      colorClass: "text-[#0068ff]",
    },
    {
      label: "Hotline",
      icon: <Phone className="w-5 h-5" />,
      href: "tel:0918909060",
      colorClass: "text-[#e11d48]",
    },
  ];

  return (
    <>
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
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-90"
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
