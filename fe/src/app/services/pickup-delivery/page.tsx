import Image from "next/image";
import Link from "next/link";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";

export const metadata = {
  title: "Dịch vụ nhận và giao xe tận nơi | Đồng Nai Ford",
  description: "Sức khỏe và sự an toàn của Quý Khách hàng luôn là ưu tiên hàng đầu với dịch vụ Nhận và Giao xe tận nơi miễn phí.",
};

type StepItem = {
  title: string;
  icon: string;
  bullets: string[];
  note?: string;
};

const steps: StepItem[] = [
  {
    title: "Liên hệ",
    icon: "/assets/icon-contact.svg",
    bullets: [
      "Khách hàng liên hệ Đồng Nai Ford online hoặc gọi điện thoại đến Đồng Nai Ford.",
      "Nhân viên Đồng Nai Ford sẽ giới thiệu chi tiết về các Dịch vụ và tư vấn cho Khách hàng.",
      "Giới thiệu Phương thức thanh toán không dùng tiền mặt an toàn."
    ]
  },
  {
    title: "Đặt hẹn",
    icon: "/assets/icon-booking.svg",
    bullets: [
      "Khách hàng gọi điện thoại đặt hẹn với Đồng Nai Ford qua đường dây Chăm sóc Khách hàng (*).",
      "Chọn Dịch vụ “ Nhận và Giao xe Tận nơi Miễn phí (**).",
      "Nhân viên Đồng Nai Ford sẽ giới thiệu chi tiết về Dịch vụ và tư vấn cho Khách hàng.",
      "Nhân viên Đồng Nai Ford xác nhận cuộc hẹn với khách hàng."
    ],
    note: "(*) Tham khảo Hotline 0918 90 90 60 | (**) Liên hệ Đồng Nai Ford để có thêm chi tiết."
  },
  {
    title: "Tiếp nhận xe tại nhà",
    icon: "/assets/icon-delivery.svg",
    bullets: [
      "Nhân viên Đồng Nai Ford đến nhà Khách hàng nhận xe.",
      "Tiếp nhận xe và tiến hành khử khuẩn nhanh tại chỗ.",
      "Lái xe của Khách hàng an toàn về xưởng Dịch vụ."
    ]
  },
  {
    title: "Tiến hành sửa chữa",
    icon: "/assets/icon-service.svg",
    bullets: [
      "Cố vấn Dịch vụ kiểm tra xe và gọi điện thoại thông báo / báo giá chi tiết cho Khách hàng.",
      "Kỹ thuật viên lành nghề thực hiện sửa chữa, bảo dưỡng.",
      "Vệ sinh và khử khuẩn toàn bộ xe sau khi hoàn tất sửa chữa.",
      "Xác nhận phương thức thanh toán và thời gian giao xe cụ thể."
    ]
  },
  {
    title: "Bàn giao xe tại nhà",
    icon: "/assets/icon-handover.svg",
    bullets: [
      "Nhân viên Đồng Nai Ford lái xe đến bàn giao tận nhà cho Khách hàng.",
      "Giao xe và tiến hành khử khuẩn nhanh lần cuối tại chỗ.",
      "Khách hàng xác nhận và hoàn tất thanh toán trực tuyến an toàn."
    ]
  },
  {
    title: "Thanh toán không bằng tiền mặt",
    icon: "/assets/icon-payment.svg",
    bullets: [
      "Khuyến khích Khách hàng sử dụng các phương thức thanh toán không tiền mặt."
    ]
  }
];

export default function PickupDeliveryPage() {
  return (
    <div className="w-full bg-[#fafafa] min-h-screen flex flex-col">
      {/* Header Banner Section */}
      <div className="relative h-[480px] w-full flex items-end justify-center pb-12 overflow-hidden">
        {/* Background & Foreground Images */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/service-banner-bg.png"
            alt="Pickup and Delivery Service Banner Background"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          <Image
            src="/assets/service-banner-fg.png"
            alt="Pickup and Delivery Service Banner Foreground"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          {/* overlay dark gradients */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Foreground Layout */}
        <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] relative z-10 flex flex-col items-center gap-6 py-6 text-center">
          <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-4xl md:text-5xl text-white tracking-tight">
            Dịch vụ nhận và giao xe tận nơi
          </h1>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact?reason=Đặt hẹn dịch vụ"
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
        </div>
      </div>

      {/* COVID-19 Safety Statement Segment */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] py-16">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-gray-800 text-base md:text-lg leading-relaxed font-normal">
          <p className="mb-4 font-semibold text-gray-900 text-lg md:text-xl">
            Sức khỏe và sự an toàn của Quý Khách hàng luôn là ưu tiên hàng đầu với Đồng Nai Ford!
          </p>
          Trong giai đoạn diễn biến phức tạp của dịch bệnh, để thuận tiện và an toàn cho Khách hàng, Đồng Nai Ford đang cung cấp Dịch vụ Nhận và Giao xe Tận nơi miễn phí (*) cho Quý Khách hàng để giúp giảm thiểu giao tiếp trực tiếp với nhân viên của chúng tôi và các khách hàng khác. Để đảm bảo mọi biện pháp phòng ngừa được thực hiện nghiêm ngặt, xe của Quý khách hàng sẽ được người lái xe khử khuẩn tại thời điểm chúng tôi tiếp nhận xe và tại thời điểm giao xe cho Quý Khách hàng. Quý Khách hàng vui lòng xem thông tin phía dưới cho quy trình Nhận và Giao xe Tận nơi miễn phí (*).
        </div>
      </div>

      {/* 5-Step Process Cards Grid */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] pb-20 flex flex-col gap-10">
        <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-2xl md:text-3xl text-gray-900 tracking-tight">
          QUY TRÌNH DỊCH VỤ NHẬN VÀ GIAO XE TẬN NƠI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-5"
            >
              {/* Icon Container */}
              <div 
                className="bg-[#003478] rounded-xl flex items-center justify-center p-3.5 size-16 shadow-sm relative overflow-hidden shrink-0"
                aria-label={step.title}
              >
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              {/* Title & Bullets */}
              <div className="flex flex-col gap-3 flex-1 justify-between">
                <div className="space-y-3">
                  <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-xl text-[#00095b]">
                    {step.title}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5 leading-relaxed">
                    {step.bullets.map((bullet, bidx) => (
                      <li key={bidx}>{bullet}</li>
                    ))}
                  </ul>
                </div>

                {/* Optional Footnote */}
                {step.note && (
                  <p className="text-xs text-gray-400 italic mt-3 pt-3 border-t border-gray-50 leading-relaxed">
                    {step.note}
                  </p>
                )}
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
