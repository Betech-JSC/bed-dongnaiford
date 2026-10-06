"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LazyWidgets from "@/components/layout/LazyWidgets";

export default function MainLayoutStructure({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLdp = pathname?.startsWith("/ldp/") ?? false;
  const pathParts = pathname ? pathname.split("/").filter(Boolean) : [];
  const isLdpHome = pathParts.length === 2 && pathParts[0] === "ldp";

  return (
    <>
      {isLdp ? (
        <header className="bg-white border-b border-gray-150 py-3 select-none">
          <div className="max-w-[1152px] mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-[5.2px]">
              <div className="h-[32px] w-[85.3px] relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/ford_logo.svg" 
                  alt="Ford Oval Logo" 
                  className="block size-full object-contain"
                />
              </div>
              <span className="font-['Ford_Antenna',sans-serif] font-bold text-[#00095b] text-[13px] tracking-tight leading-none uppercase">
                DONG NAI FORD
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">
              Đại lý ủy quyền chính thức
            </span>
          </div>
        </header>
      ) : (
        <Navbar />
      )}

      <main className="flex-1 flex flex-col pb-20 md:pb-0">{children}</main>

      {isLdp && !isLdpHome ? (
        <footer className="bg-slate-900 text-gray-400 py-6 pb-24 md:pb-6 border-t border-slate-800 font-sans text-xs select-none">
          <div className="max-w-[1152px] mx-auto px-4 text-center">
            <p className="font-bold text-white mb-2">ĐỒNG NAI FORD - ĐẠI LÝ ỦY QUYỀN CHÍNH THỨC CỦA FORD VIỆT NAM</p>
            <p className="text-gray-500">B04, Khu Thương Mại Amata, Phường Long Bình, TP. Biên Hòa, Tỉnh Đồng Nai</p>
            <p className="mt-4 text-[11px] text-gray-500">© 2026 Dong Nai Ford. Bảo lưu mọi quyền.</p>
          </div>
        </footer>
      ) : (
        <Footer />
      )}

      <LazyWidgets isLdp={isLdp} />
    </>
  );
}
