"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, CheckCircle, X } from "lucide-react";
import { vehicles } from "@/data/vehicles";

function ContactFormContent() {
  const searchParams = useSearchParams();

  const vehicleParam = searchParams.get("vehicle");
  const reasonParam = searchParams.get("reason");
  const noteParam = searchParams.get("note");

  // Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formNote, setFormNote] = useState(() => noteParam || "");
  
  // Hidden/Implicit state derived from query params
  const [formVehicle] = useState(() => 
    (vehicleParam && vehicles.some((v) => v.id === vehicleParam)) ? vehicleParam : "new-everest"
  );
  const [formReason] = useState(() => reasonParam || "Đăng ký lái thử");
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      setToastMessage("Vui lòng điền Họ tên và Số điện thoại!");
      setShowToast(true);
      return;
    }

    const selectedVehicleName = vehicles.find((v) => v.id === formVehicle)?.name || "";
    setToastMessage(
      `Đăng ký thành công! Đồng Nai Ford đã nhận được yêu cầu ${formReason.toLowerCase()} của quý khách cho dòng xe ${selectedVehicleName}. Chúng tôi sẽ liên hệ tư vấn trong vòng 15 phút.`
    );
    setShowToast(true);

    // Clear inputs
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormNote("");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] py-12 w-full">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-white border border-[#d6d6d6] text-[#1a1a1a] p-4 max-w-sm rounded-lg shadow-2xl flex gap-3 items-start animate-fade-in">
          <div className="w-5 h-5 bg-[#0562d2] text-white flex items-center justify-center rounded-full mt-0.5 flex-shrink-0">
            <CheckCircle className="w-3.5 h-3.5 text-white fill-current" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-semibold text-xs tracking-wider text-[#0562d2]">Thông báo hệ thống</h4>
            <p className="text-xs text-[#424242] leading-normal">{toastMessage}</p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Showroom Banner */}
      <div className="h-[384px] relative rounded-[24px] overflow-hidden w-full mb-12 shadow-sm border border-[#e5e5e5]">
        <img
          alt="Showroom Ford Đồng Nai"
          className="absolute inset-0 object-cover w-full h-full"
          src="/showroom_bg.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-12">
        
        {/* Left Side: Contact Information Cards */}
        <div className="flex flex-col gap-8 w-full">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h2 className="font-['Ford_Antenna',sans-serif] font-semibold leading-[1.32] text-[#101828] text-[36px] tracking-tight">
              Liên hệ trực tiếp với đại lý Đồng Nai Ford
            </h2>
            <p className="font-['Ford_Antenna',sans-serif] leading-[1.5] text-[#1d2939] text-[16px]">
              Đồng Nai Ford luôn sẵn sàng lắng nghe và hỗ trợ mọi nhu cầu của bạn. Cho dù bạn cần tư vấn dòng xe mới, đặt lịch bảo dưỡng hay phản hồi về dịch vụ, hãy kết nối với chúng tôi qua các kênh liên hệ thuận tiện nhất dưới đây.
            </p>
          </div>

          {/* Details Wrapper Card */}
          <div className="bg-white border border-[#d6d6d6] flex flex-col gap-6 p-6 rounded-[12px] shadow-sm">
            {/* Showroom Address */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Showroom
                </h4>
                <p className="font-['Ford_Antenna',sans-serif] text-sm text-[#1a1a1a] leading-relaxed">
                  Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Đồng Nai
                </p>
              </div>
            </div>

            {/* Hotlines */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Hotline
                </h4>
                <div className="font-['Ford_Antenna',sans-serif] text-sm text-[#1a1a1a] leading-relaxed space-y-1">
                  <p>Dịch vụ: <span className="font-semibold text-dark">1800 55 68 58</span></p>
                  <p>Kinh doanh: <span className="font-semibold text-dark">0918 90 90 60</span></p>
                  <p>Điện thoại bàn: <span className="text-[#424242]">(0251) 3857 130 – (0251) 3857 131</span></p>
                </div>
              </div>
            </div>

            {/* Email & Website */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Email
                </h4>
                <p className="font-['Ford_Antenna',sans-serif] text-sm text-[#1a1a1a]">
                  marketing@dongnaiford.com.vn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Appointment Booking Form */}
        <div className="bg-[#003478] flex flex-col gap-6 p-8 rounded-[16px] shadow-lg text-white">
          <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[28px] text-center text-white">
            Đặt lịch hẹn
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                Họ và tên <span className="text-[#f97066]">*</span>
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans"
              />
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                  Số điện thoại <span className="text-[#f97066]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0909888888"
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                Lời nhắn
              </label>
              <textarea
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                placeholder="Nhập lời nhắn..."
                className="w-full h-[180px] bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm resize-none font-sans"
              />
            </div>

            {/* Action button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                type="submit"
                className="w-[240px] py-[10px] bg-[#0562d2] border border-[#0562d2] hover:bg-[#00095b] hover:border-[#00095b] text-white font-semibold text-[16px] tracking-wide rounded-[800px] shadow-md transition cursor-pointer text-center"
              >
                Đặt lịch
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Google Maps Full Width at Bottom */}
      <div className="w-full h-[427px] rounded-[24px] overflow-hidden border border-[#d6d6d6] shadow-sm relative mb-6">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m10!1m3!1d3916.920556106606!2d106.87413647570415!3d10.969446055598686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dfb24e6503ab%3A0xe54fb72831fdb9!2zRMWJbmcgTmFpIEZvcmQ!5e0!3m2!1svi!2svn!4v1716300000000!5m2!1svi!2svn"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Địa chỉ Đồng Nai Ford trên Google Map"
          className="absolute inset-0"
        ></iframe>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="bg-[#fafafa] flex-1 min-h-screen">
      <Suspense fallback={
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] py-24 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-[#0562d2] border-t-transparent rounded-full" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      }>
        <ContactFormContent />
      </Suspense>
    </div>
  );
}
