"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LazyWidgets from "@/components/layout/LazyWidgets";
import { formatPersonName } from "@/lib/formatters";
import { resolveImageUrl } from "@/lib/site-assets";
import { ldpAPI } from "@/lib/api";

export default function MainLayoutStructure({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLdp = pathname?.startsWith("/ldp/") ?? false;
  const [consultant, setConsultant] = useState<any>(null);

  useEffect(() => {
    if (!isLdp) {
      setConsultant(null);
      return;
    }

    if (typeof window !== "undefined" && (window as any).__ldpSalesConsultant) {
      setConsultant((window as any).__ldpSalesConsultant);
    }

    const handleConsultantUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setConsultant(customEvent.detail);
      }
    };

    window.addEventListener("ldp-consultant-updated", handleConsultantUpdate);

    // Fallback: nếu truy cập trực tiếp và chưa nhận event, lấy từ salesSlug trên URL
    const segments = pathname?.split("/").filter(Boolean) || [];
    const salesSlug = segments[0] === "ldp" ? segments[1] : null;
    if (salesSlug && (!(window as any).__ldpSalesConsultant || (window as any).__ldpSalesConsultant?.slug !== salesSlug)) {
      ldpAPI
        .getBySalesSlug(salesSlug)
        .then((res: any) => {
          const sc = res?.data?.sales_consultant;
          if (sc) {
            (window as any).__ldpSalesConsultant = sc;
            setConsultant(sc);
          }
        })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener("ldp-consultant-updated", handleConsultantUpdate);
    };
  }, [isLdp, pathname]);

  const consultantName = consultant?.name ? formatPersonName(consultant.name) : "";
  const consultantAvatar = resolveImageUrl(consultant?.avatar_url || consultant?.avatar);
  const segments = pathname?.split("/").filter(Boolean) || [];
  const salesSlug = consultant?.slug || (segments[0] === "ldp" ? segments[1] : "");
  const ldpHomeHref = salesSlug ? `/ldp/${salesSlug}` : "#";

  return (
    <>
      {isLdp ? (
        <header className="bg-white border-b border-gray-150 py-3 select-none sticky top-0 z-[45] shadow-2xs">
          <div className="max-w-[1152px] mx-auto px-4 flex items-center justify-between gap-2">
            <Link
              href={ldpHomeHref}
              className="flex items-center gap-2 sm:gap-2.5 min-w-0 no-underline group"
            >
              <div className="h-[32px] w-[85.3px] relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/ford_logo.svg" 
                  alt="Ford Oval Logo" 
                  className="block size-full object-contain"
                />
              </div>
              <span className="font-['Ford_Antenna',sans-serif] font-bold text-[#00095b] text-[12px] sm:text-[13px] tracking-tight leading-none uppercase shrink-0">
                DONG NAI FORD
              </span>

              {consultantName && (
                <>
                  <span className="h-4 w-[1.5px] bg-gray-300 shrink-0 mx-0.5 sm:mx-1" />
                  <div className="flex items-center gap-1.5 min-w-0">
                    {consultantAvatar && (
                      <img
                        src={consultantAvatar}
                        alt={consultantName}
                        className="w-6 h-6 rounded-full object-cover border border-[#0562d2]/30 shrink-0"
                      />
                    )}
                    <span className="font-['Ford_Antenna',sans-serif] font-bold text-[#0562d2] group-hover:text-[#00095b] transition-colors text-[12px] sm:text-[13px] tracking-tight leading-none uppercase truncate">
                      {consultantName}
                    </span>
                  </div>
                </>
              )}
            </Link>
            <span className="hidden md:inline-block text-xs font-bold text-gray-500 uppercase tracking-wider font-sans shrink-0">
              Đại lý ủy quyền chính thức
            </span>
          </div>
        </header>
      ) : (
        <Navbar />
      )}

      <main className="flex-1 flex flex-col pb-20 md:pb-0">{children}</main>

      {/* Ẩn toàn bộ footer trên các trang Landing Page của Sale để giữ tập trung vào thông tin cố vấn */}
      {!isLdp && <Footer />}

      <LazyWidgets isLdp={isLdp} />
    </>
  );
}
