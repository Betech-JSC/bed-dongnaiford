"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { vehiclesAPI, servicesAPI } from "@/lib/api";

export default function Footer() {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const fetchFooterData = async () => {
      try {
        const [catsData, servicesData] = await Promise.all([
          vehiclesAPI.getCategories().catch(() => null),
          servicesAPI.getAll().catch(() => null)
        ]);

        const cats = (catsData as any)?.data || catsData;
        if (active && Array.isArray(cats) && cats.length > 0) {
          setCategoriesList(cats);
        }

        const services = (servicesData as any)?.services || (servicesData as any)?.data || servicesData;
        if (active && Array.isArray(services) && services.length > 0) {
          setServicesList(services);
        }
      } catch (err) {
        console.error("Error fetching footer data:", err);
      }
    };
    fetchFooterData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="bg-[#00095b] text-white pt-[40px] pb-[20px] px-4 lg:px-[144px] border-t border-[#00095b] mt-auto">
      {/* Upper Grid Area */}
      <div className="max-w-[1152px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 items-start mb-12">
        
        {/* Column 1: Company Profile Info */}
        <div className="space-y-4">
          <h3 className="text-[20px] font-semibold tracking-tight text-white uppercase font-display leading-[1.3]">
            CÔNG TY TNHH DỊCH VỤ – THƯƠNG MẠI TẤN PHÁT ĐẠT
          </h3>
          <div className="text-xs text-white/80 space-y-2 font-normal">
            <p>
              <strong className="text-white font-bold">Mã số thuế:</strong> 3600843328
            </p>
            <p>
              <strong className="text-white font-bold">Địa chỉ:</strong> Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Đồng Nai
            </p>
            <p>
              <strong className="text-white font-bold">Hotline KD:</strong> 0918 90 90 60
            </p>
            <p>
              <strong className="text-white font-bold">Hotline Dv:</strong> 1800 55 68 58
            </p>
            <p>
              <strong className="text-white font-bold">ĐT:</strong> (0251) 3857 130 – (0251) 3857 131
            </p>
            <p>
              <strong className="text-white font-bold">Email:</strong> marketing@dongnaiford.com.vn
            </p>
            <p>
              <strong className="text-white font-bold">Website:</strong> dongnaiford.com.vn
            </p>
          </div>
        </div>


          </div>

        </div>

      </div>

      {/* Bottom Copyright Disclosures */}
      <div className="max-w-[1152px] mx-auto border-t border-white/10 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-4">
          <p>
            Copyright © 2026 Đồng Nai Ford. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6">
            <Link href="/dieu-khoan-su-dung" className="hover:text-white/80 transition-colors">
              Điều khoản và điều kiện
            </Link>
            <Link href="/chinh-sach-bao-mat" className="hover:text-white/80 transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
