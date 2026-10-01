"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { servicesAPI } from "@/lib/api";

interface LdpServicesBlockProps {
  data?: any;
  salesConsultant?: any;
  anchorId?: string;
  isEditMode?: boolean;
}

interface ServiceItem {
  id: number | string;
  title: string;
  slug?: string;
  custom_link?: string;
  description?: string;
  image?: { url: string } | string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: "Bảo Dưỡng Định Kỳ",
    slug: "bao-duong-dinh-ky",
    description: "Quy trình kiểm tra 75 hạng mục chuẩn Ford toàn cầu giúp xe vận hành bền bỉ và an toàn tối đa.",
    image: "/service-support-customer.jpg",
  },
  {
    id: 2,
    title: "Sửa Chữa Chung & Đồng Sơn",
    slug: "sua-chua-dong-son",
    description: "Trang thiết bị chẩn đoán hiện đại cùng phòng sơn sấy đạt tiêu chuẩn khắt khe từ Ford Việt Nam.",
    image: "/service-support-customer.jpg",
  },
  {
    id: 3,
    title: "Phụ Tùng & Phụ Kiện Chính Hãng",
    slug: "phu-tung-chinh-hang",
    description: "100% phụ tùng, dầu nhớt và phụ kiện nâng cấp được nhập khẩu chính hãng với bảo hành đầy đủ.",
    image: "/service-support-customer.jpg",
  },
  {
    id: 4,
    title: "Cứu Hộ 24/7 & Giao Xe Tận Nơi",
    slug: "cuu-ho-24-7",
    description: "Đội ngũ kỹ thuật cơ động túc trực 24/7 sẵn sàng hỗ trợ khách hàng trên mọi cung đường.",
    image: "/service-support-customer.jpg",
  }
];

export default function LdpServicesBlock({
  data,
  salesConsultant,
  anchorId = "services",
  isEditMode = false,
}: LdpServicesBlockProps) {
  const [services, setServices] = useState<ServiceItem[]>(() => {
    if (data?.services && Array.isArray(data.services) && data.services.length > 0) {
      return data.services;
    }
    return DEFAULT_SERVICES;
  });

  useEffect(() => {
    if (data?.services && Array.isArray(data.services) && data.services.length > 0) {
      return;
    }

    servicesAPI
      .getAll()
      .then((res: any) => {
        const raw = res?.data || res || [];
        if (Array.isArray(raw) && raw.length > 0) {
          const formatted = raw.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            custom_link: item.custom_link,
            description: item.description || item.excerpt || "",
            image: item.image?.url || item.image || "/service-support-customer.jpg",
          }));
          setServices(formatted);
        }
      })
      .catch(() => {
        // Giữ fallback mặc định
      });
  }, [data]);

  const items = services.length > 0 ? services : DEFAULT_SERVICES;
  // Nhân đôi mảng để tạo vòng lặp vô tận (infinite marquee)
  const marqueeItems = [...items, ...items];

  return (
    <section id={anchorId} className="w-full bg-[#f0f0f0] py-16 md:py-[72px] overflow-x-clip select-none">
      <div className="w-full">
        {/* Header row */}
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] mb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#0562D2] uppercase tracking-wider block">
              Dịch vụ tiêu chuẩn 5S
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1a1a1a] tracking-tight leading-[1.2]">
              {data?.title || "Các dịch vụ của chúng tôi"}
            </h2>
            <p className="text-sm sm:text-base text-[#424242] leading-relaxed max-w-2xl">
              {data?.subtitle || "Đồng Nai Ford cam kết đồng hành cùng bạn với các giải pháp dịch vụ toàn diện, tận tâm và chuyên nghiệp."}
            </p>
          </div>
        </div>

        {/* Services Marquee Slider */}
        <div className="relative w-full overflow-hidden py-4">
          <div className="animate-marquee-continuous gap-[var(--card-gap-service,24px)] flex">
            {marqueeItems.map((srv, idx) => {
              const sTitle = srv.title;
              const sImg = typeof srv.image === "object" ? srv.image?.url : (srv.image || "/service-support-customer.jpg");
              const sHref = (srv.custom_link && srv.custom_link.startsWith("/dich-vu/"))
                ? srv.custom_link
                : `/dich-vu/${srv.slug || ""}`;

              return (
                <Link
                  key={`${srv.id}-${idx}`}
                  href={sHref}
                  className="relative overflow-hidden rounded-xl h-[420px] sm:h-[460px] group cursor-pointer bg-[#121824] flex-shrink-0 transition-all duration-300 block border border-black/5 hover:-translate-y-1 shadow-md hover:shadow-xl"
                  style={{
                    width: "var(--card-width-service, 380px)",
                  }}
                >
                  <Image
                    src={sImg}
                    alt={sTitle}
                    fill
                    sizes="(max-width: 640px) 280px, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 z-10 flex flex-col gap-2.5 sm:gap-3">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white leading-snug group-hover:text-blue-300 transition-colors">
                      {sTitle}
                    </h3>
                    {srv.description && (
                      <p className="text-xs sm:text-sm text-white/70 line-clamp-2 leading-relaxed font-normal">
                        {srv.description}
                      </p>
                    )}
                    <div className="flex flex-row gap-2 mt-2">
                      <span className="bg-[#0562D2] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full group-hover:bg-[#044ea7] transition-all duration-200 whitespace-nowrap">
                        Xem chi tiết →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
