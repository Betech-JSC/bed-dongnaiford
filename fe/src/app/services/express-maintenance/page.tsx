import Image from "next/image";
import Link from "next/link";
import BookingBanner from "@/components/services/BookingBanner";
import FaqAccordion from "@/components/services/FaqAccordion";

export const metadata = {
  title: "Dịch vụ bảo dưỡng nhanh | Đồng Nai Ford",
  description: "Toàn bộ công đoạn bảo dưỡng nhanh chỉ diễn ra trong 60 phút với đầy đủ các quy trình và công đoạn tiêu chuẩn.",
};

export default function ExpressMaintenancePage() {
  return (
    <div className="w-full bg-[#fafafa] min-h-screen flex flex-col">
      {/* Header Banner Section */}
      <div className="relative h-[480px] w-full flex items-end justify-center pb-12 overflow-hidden">
        {/* Background & Foreground Images */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/service-banner-bg.png"
            alt="Express Maintenance Banner Background"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          <Image
            src="/assets/service-banner-fg.png"
            alt="Express Maintenance Banner Foreground"
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
            Dịch vụ bảo dưỡng nhanh
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

      {/* Main Process Showcase */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-[128px] py-16 flex flex-col gap-10">
        <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-2xl md:text-3xl text-gray-900 tracking-tight">
          QUY TRÌNH BẢO DƯỠNG NHANH
        </h2>

        {/* Flow Diagram Image */}
        <div className="relative w-full aspect-[1440/500] rounded-xl overflow-hidden shadow-sm">
          <Image
            src="/assets/express-maintenance-flow.png"
            alt="Express Maintenance Flow"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Advantages/Benefits list */}
        <div className="flex flex-col gap-6 text-gray-900 mt-4">
          <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-2xl text-gray-900">
            Ưu Điểm Chính
          </h3>
          <ul className="space-y-4 text-lg text-gray-700 leading-relaxed font-normal">
            <li className="flex items-start gap-2.5">
              <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
              <span>Sử dụng các dụng cụ bảo dưỡng tiêu chuẩn, các trang thiết bị hiện đại.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
              <span>Phụ tùng bảo dưỡng chính hãng luôn được chuẩn bị sẵn sàng.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
              <span>Đội ngũ kỹ thuật viên được đào tạo chuyên sâu về bảo dưỡng nhanh các dòng xe Ford.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
              <span>Toàn bộ công đoạn bảo dưỡng nhanh chỉ diễn ra trong 60 phút với đầy đủ các quy trình và công đoạn như bảo dưỡng thông thường.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#0562d2] mt-1.5 shrink-0 size-2 bg-[#0562d2] rounded-full" />
              <span>Giảm thiểu thời gian chờ đợi bảo dưỡng xe Ford của khách hàng.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Reusable Booking CTA Banner */}
      <BookingBanner />

      {/* Reusable FAQ Accordion */}
      <FaqAccordion />
    </div>
  );
}
