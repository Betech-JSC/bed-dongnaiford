import Image from "next/image";
import Link from "next/link";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";
import ServicePageBanner from "@/components/services/ServicePageBanner";
import { maintenanceAPI } from "@/lib/api";

export const metadata = {
  title: "Dịch vụ bảo dưỡng định kỳ | Đồng Nai Ford",
  description: "Bảo dưỡng định kỳ giúp bạn lái xe an toàn, kéo dài tuổi thọ của xe và tiết kiệm nhiên liệu.",
};

type VehicleSchedule = {
  name: string;
  image: string;
  links: { label: string; url: string }[];
};

const schedules: VehicleSchedule[] = [
  {
    name: "Fiesta",
    image: "/assets/car-fiesta.png",
    links: [
      { label: "Fiesta 2011 - 2013", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20%26%20Maintainance/maintenance-schedule-plan/Fiesta-2011-2013.pdf" },
      { label: "Fiesta 2013 - 2018", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Fiesta-2013-nay.pdf" },
    ]
  },
  {
    name: "Focus",
    image: "/assets/car-focus.png",
    links: [
      { label: "Focus 2005 - 2012", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Focus-2005-2012.pdf" },
      { label: "Focus 2012 - 2015", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Focus%202012-2015.pdf" },
      { label: "Focus 2015 - 2019", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Focus-2015.pdf" },
    ]
  },
  {
    name: "Ecosport",
    image: "/assets/car-ecosport.png",
    links: [
      { label: "EcoSport 2014 - 2018", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/EcoSport-2014-2018.pdf" },
      { label: "EcoSport 2018 - nay", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/EcoSport-2018.pdf" },
    ]
  },
  {
    name: "Everest",
    image: "/assets/car-everest.png",
    links: [
      { label: "Everest 2009 - 2015", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Everest-2009-2015.pdf" },
      { label: "Everest 2016", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Everest-2016.pdf" },
      { label: "Everest 2018", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/everest-2018.pdf" },
    ]
  },
  {
    name: "Ranger",
    image: "/assets/car-ranger.png",
    links: [
      { label: "Ranger 2012 - 2015", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Ranger-2012-2015.pdf" },
      { label: "Ranger 2016", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Ranger-2016.pdf" },
    ]
  },
  {
    name: "Transit",
    image: "/assets/car-transit.png",
    links: [
      { label: "Transit 2007 - 2012", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Transit-2007-2012.pdf" },
      { label: "Transit 2012 - 2018", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Transit-2012-nay.pdf" },
    ]
  },
  {
    name: "Escape",
    image: "/assets/car-escape.png",
    links: [
      { label: "Escape 2001 - 2013", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Escape-2001-2013.pdf" },
    ]
  },
  {
    name: "Mondeo",
    image: "/assets/car-mondeo.png",
    links: [
      { label: "Mondeo 2009 - 2013", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Mondeo-2009-2013.pdf" },
    ]
  },
  {
    name: "Tourneo",
    image: "/assets/car-tourneo.png",
    links: [
      { label: "Tourneo 2020", url: "https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Tourneo-2020.pdf" },
    ]
  }
];

export default async function PeriodicMaintenancePage() {
  let displaySchedules = schedules;
  try {
    const response = await maintenanceAPI.getSchedules();
    if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
      displaySchedules = response.data.map((item: any) => ({
        name: item.name || "",
        image: item.image || "/assets/car-placeholder.png",
        links: Array.isArray(item.links) ? item.links : [],
      }));
    }
  } catch (error) {
    console.error("Failed to load maintenance schedules from CMS API, using static fallback:", error);
  }

  return (
    <div className="w-full bg-[#fafafa] min-h-screen flex flex-col">
      <ServicePageBanner title="Lịch bảo dưỡng xe ô tô định kỳ">
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/lien-he?reason=Đặt hẹn dịch vụ"
            className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] transition-colors text-white font-bold px-6 py-3 rounded-full text-sm"
          >
            Đặt hẹn
          </Link>
          <a
            href="tel:0918909060"
            className="border border-white hover:bg-white/10 transition-colors text-white font-bold px-6 py-3 rounded-full text-sm"
          >
            Liên hệ hỗ trợ
          </a>
        </div>
      </ServicePageBanner>

      {/* Intro Heading Section */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] py-16">
        <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-2xl md:text-3xl text-gray-900 tracking-tight leading-relaxed max-w-[1100px]">
          Bảo dưỡng định kỳ giúp bạn lái xe an toàn, kéo dài tuổi thọ của xe & tiết kiệm nhiên liệu đảm bảo chiếc xe Ford của bạn luôn ở trong tình trạng tốt nhất.
        </h2>
      </div>

      {/* Grid of Vehicle Schedule Cards */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displaySchedules.map((car, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
            >
              {/* Car Image Wrapper */}
              <div className="relative w-full h-40 overflow-hidden rounded-lg bg-gray-50/50">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Links */}
              <div className="flex flex-col gap-3 flex-1 justify-between">
                <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-lg text-gray-900">
                  {car.name}
                </h3>
                <ul className="space-y-2 text-sm text-[#0562d2]">
                  {car.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="shrink-0 size-1.5 bg-[#0562d2] rounded-full" />
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reusable Booking CTA Banner */}
      <BookingBanner />

      {/* Reusable FAQ Accordion */}
      <FaqAccordion />
    </div>
  );
}
