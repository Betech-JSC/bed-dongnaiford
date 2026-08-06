"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Bookmark } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";
import { handleCtaFormClick } from "@/lib/scroll-helper";

export default function BookingBanner() {
  return (
    <div className="w-full bg-[#00095b] py-8 lg:py-12 px-4 sm:px-6 lg:px-8 flex justify-center overflow-visible">
      <div className="max-w-[1152px] w-full relative overflow-visible">
        {/* Inner Rounded Banner */}
        <div className="w-full bg-gradient-to-r from-[#00095B] via-[#02337A] to-[#0562D2] rounded-2xl p-6 sm:p-8 lg:p-10 min-h-[260px] lg:min-h-[280px] flex items-center relative shadow-2xl overflow-visible">
          {/* Content */}
          <div className="flex flex-col gap-5 w-full lg:max-w-[55%] relative z-10 text-white">
            <h3 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-bold font-display leading-tight tracking-tight">
              Kết nối ngay với chuyên viên Đồng Nai Ford
            </h3>
            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href="tel:1800556858"
                className="inline-flex items-center justify-center gap-2 bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] transition-all text-white font-bold px-6 py-3 rounded-full text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>1800 55 68 58</span>
              </a>
              <button
                onClick={(e) => {
                  handleCtaFormClick(e, "consultation", () => {
                    if (typeof window !== "undefined") {
                      window.location.href = "/lien-he";
                    }
                  });
                }}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/40 transition-all text-white font-bold px-6 py-3 rounded-full text-sm sm:text-base backdrop-blur-xs hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer"
              >
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Đặt lịch hẹn</span>
              </button>
            </div>
          </div>

          {/* Overlapping Car Image */}
          <div className="hidden lg:flex absolute right-0 lg:-right-2 xl:-right-6 top-1/2 -translate-y-1/2 w-[440px] lg:w-[480px] xl:w-[540px] h-[300px] lg:h-[340px] xl:h-[380px] pointer-events-none z-20 items-center justify-center">
            <Image
              src={siteAssets.bookingCar}
              alt="Ford Booking Vehicle"
              fill
              sizes="(max-width: 1280px) 480px, 540px"
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
