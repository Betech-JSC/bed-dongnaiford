"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Gift, PhoneCall } from "lucide-react";
import { handleCtaFormClick } from "@/lib/scroll-helper";

const ZaloIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#0068FF" />
    <path d="M50 15C30.7 15 15 30.7 15 50C15 57.8 17.6 65.1 22 71L17.2 85L31.7 80.4C37.2 84.2 43.8 86.5 50.8 86.5C70.1 86.5 85.8 70.8 85.8 51.5C85.8 32.2 70.1 15 50 15Z" fill="#0068FF" />
    <text x="50" y="62" fontStyle="normal" fontWeight="900" fontSize="32" fill="#FFFFFF" textAnchor="middle">Zalo</text>
  </svg>
);

export default function LeftFloatingBar() {
  const pathname = usePathname();
  const isLdp = pathname?.startsWith("/ldp/");

  if (isLdp) {
    return null;
  }

  const handleRegisterClick = (e: React.MouseEvent) => {
    handleCtaFormClick(e, "registration", () => {
      if (typeof window !== "undefined") {
        window.location.href = "/lien-he";
      }
    });
  };

  return (
    <div className="fixed left-3 md:left-5 bottom-20 md:bottom-6 z-50 hidden md:flex flex-col items-start gap-3 select-none font-sans">
      <style>{`
        @keyframes left-ripple-zalo {
          0% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0.6); }
          70% { box-shadow: 0 0 0 14px rgba(0, 104, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 104, 255, 0); }
        }
        @keyframes left-ripple-phone {
          0% { box-shadow: 0 0 0 0 rgba(6, 111, 239, 0.6); }
          70% { box-shadow: 0 0 0 14px rgba(6, 111, 239, 0); }
          100% { box-shadow: 0 0 0 0 rgba(6, 111, 239, 0); }
        }
        .animate-left-ripple-zalo {
          animation: left-ripple-zalo 2.5s infinite ease-in-out;
        }
        .animate-left-ripple-phone {
          animation: left-ripple-phone 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* 1. Zalo Button */}
      <Link
        href="https://zalo.me/4149231651356573695"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 md:w-13 md:h-13 rounded-full bg-[#0068FF] text-white shadow-[0_6px_20px_rgba(0,104,255,0.4)] hover:scale-108 active:scale-95 transition-all duration-300 animate-left-ripple-zalo"
        aria-label="Chat Zalo Đồng Nai Ford"
      >
        <ZaloIcon className="w-8 h-8 md:w-9 md:h-9" />
      </Link>

      {/* 2. Đăng ký nhận ưu đãi Pill */}
      <button
        onClick={handleRegisterClick}
        type="button"
        className="group relative flex items-center bg-[#00095B] hover:bg-[#001380] text-white rounded-full p-1 pr-5 shadow-[0_8px_24px_rgba(0,9,91,0.35)] border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-left"
        aria-label="Đăng ký nhận ưu đãi"
      >
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#00095B] group-hover:bg-[#001380] text-white flex items-center justify-center shrink-0 border-2 border-white shadow-md mr-2.5 transition-colors">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] md:text-[11px] font-bold text-gray-200 tracking-wider uppercase">
            Đăng ký
          </span>
          <span className="text-xs md:text-[13px] font-extrabold text-white tracking-tight uppercase whitespace-nowrap">
            Nhận ưu đãi
          </span>
        </div>
      </button>

      {/* 3. Hotline tư vấn Pill */}
      <a
        href="tel:0918909060"
        className="group relative flex items-center bg-[#066FEF] hover:bg-[#005bbd] text-white rounded-full p-1 pr-5 shadow-[0_8px_24px_rgba(6,111,239,0.4)] border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-left animate-left-ripple-phone"
        aria-label="Hotline tư vấn Đồng Nai Ford"
      >
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#066FEF] group-hover:bg-[#005bbd] text-white flex items-center justify-center shrink-0 border-2 border-white shadow-md mr-2.5 transition-colors">
          <PhoneCall className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] md:text-[11px] font-bold text-white tracking-wider uppercase">
            Hotline tư vấn
          </span>
          <span className="text-xs md:text-[14px] font-black text-white tracking-tight uppercase whitespace-nowrap">
            0918 90 90 60
          </span>
        </div>
      </a>
    </div>
  );
}
