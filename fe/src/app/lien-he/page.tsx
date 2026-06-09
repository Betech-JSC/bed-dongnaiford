"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, CheckCircle, X } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";
import { contactsAPI, vehiclesAPI, agenciesAPI } from "@/lib/api";

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
  const [formVehicle, setFormVehicle] = useState(vehicleParam || "new-everest");
  const [formReason] = useState(() => reasonParam || "Đăng ký lái thử");
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Data States
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [agenciesList, setAgenciesList] = useState<any[]>([]);
  const [selectedAgencyIndex, setSelectedAgencyIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic data
  useEffect(() => {
    Promise.all([
      vehiclesAPI.getAll().catch(() => ({ success: false, data: [] })),
      agenciesAPI.getAll().catch(() => ({ success: false, data: [] }))
    ]).then(([vehRes, agRes]: [any, any]) => {
      if (vehRes && vehRes.success && Array.isArray(vehRes.data)) {
        setVehiclesList(vehRes.data);
      }
      
      if (agRes) {
        const responseData = agRes.data || agRes;
        const list: any[] = [];
        if (responseData.agencies && Array.isArray(responseData.agencies)) {
          responseData.agencies.forEach((group: any) => {
            if (group.agencies && Array.isArray(group.agencies)) {
              list.push(...group.agencies);
            }
          });
        } else if (Array.isArray(responseData)) {
          list.push(...responseData);
        }
        setAgenciesList(list);
      }
    }).catch(err => {
      console.error("Error loading dynamic contact page data:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const getSelectedVehicleName = () => {
    const matched = vehiclesList.find(
      (v) => v.slug === formVehicle || String(v.id) === String(formVehicle)
    );
    return matched ? matched.title : formVehicle;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      setToastMessage("Vui lòng điền Họ tên và Số điện thoại!");
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await contactsAPI.submit({
        contact: {
          type: "CONTACT_FORM",
          data: {
            Name: formName,
            Phone: formPhone,
            Email: formEmail || undefined,
            "Nội dung cần hỗ trợ": formNote || `Yêu cầu liên hệ: ${formReason} cho xe ${getSelectedVehicleName()}`,
          }
        }
      });

      if (response && response.success === false) {
        setToastMessage(response.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
        setShowToast(true);
      } else {
        const selectedVehicleName = getSelectedVehicleName();
        setToastMessage(
          `Đăng ký thành công! Đồng Nai Ford đã nhận được yêu cầu ${formReason.toLowerCase()} của quý khách cho dòng xe ${selectedVehicleName}. Chúng tôi sẽ liên hệ tư vấn trong vòng 15 phút.`
        );
        setShowToast(true);

        // Clear inputs
        setFormName("");
        setFormPhone("");
        setFormEmail("");
        setFormNote("");
      }
    } catch (error: any) {
      console.error("Contact submit error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối đến máy chủ. Vui lòng thử lại sau!";
      if (error && error.data && error.data.message) {
        const backendMessage = error.data.message;
        if (typeof backendMessage === "object") {
          if (backendMessage.Phone) {
            errMsg = "Số điện thoại không hợp lệ (yêu cầu từ 9 đến 12 chữ số)!";
          } else if (backendMessage.Name) {
            errMsg = "Họ và tên không hợp lệ!";
          }
        } else {
          errMsg = backendMessage;
        }
      }
      setToastMessage(errMsg);
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };



  const defaultAgency = {
    title: "Showroom Đồng Nai Ford - Biên Hòa",
    location: "Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Đồng Nai",
    phone: "0918 90 90 60",
    email: "marketing@dongnaiford.com.vn",
    phones: [
      { type: "Dịch vụ", number: "1800 55 68 58" },
      { type: "Kinh doanh", number: "0918 90 90 60" },
      { type: "Điện thoại bàn", number: "(0251) 3857 130 – (0251) 3857 131" }
    ],
    link_google_map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.847587130283!2d106.84501431471853!3d10.940989992211995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dd0039755497%3A0x6e788090885c353c!2s%C4%90%E1%BB%93ng%20Nai%20Ford!5e0!3m2!1svi!2s!4v1717380000000!5m2!1svi!2s"
  };

  const displayAgencies = agenciesList.length > 0 ? agenciesList : [defaultAgency];
  const activeAgency = displayAgencies[selectedAgencyIndex] || displayAgencies[0];

  const getEmbedMapUrl = (linkGoogleMap: string) => {
    if (!linkGoogleMap) return defaultAgency.link_google_map;
    if (linkGoogleMap.includes("embed") || linkGoogleMap.includes("pb=")) return linkGoogleMap;

    let url = linkGoogleMap.replace("maps.google.com/?", "maps.google.com/maps?");
    url = url.replace("google.com/maps/?", "google.com/maps?");
    if (!url.includes("output=embed")) {
      url += (url.includes("?") ? "&" : "?") + "output=embed";
    }
    return url;
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
          src={siteAssets.showroomBg}
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

          {/* Details Wrapper Cards */}
          <div className="flex flex-col gap-6 w-full">
            {displayAgencies.map((agency: any, idx: number) => {
              const isSelected = selectedAgencyIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedAgencyIndex(idx)}
                  className={`bg-white border cursor-pointer p-6 rounded-[12px] shadow-sm transition-all duration-300 ${
                    isSelected ? "border-[#0562d2] ring-2 ring-[#0562d2]/10" : "border-[#d6d6d6] hover:border-gray-400"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-lg text-[#101828] uppercase">
                      {agency.title}
                    </h3>
                    {isSelected && (
                      <span className="text-xs bg-[#0562d2] text-white font-semibold px-2.5 py-1 rounded-full">
                        Đang chọn bản đồ
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {/* Showroom Address */}
                    <div className="flex gap-3 items-start">
                      <MapPin className="w-4 h-4 text-[#0562d2] mt-0.5 flex-shrink-0" />
                      <p className="font-['Ford_Antenna',sans-serif] text-sm text-[#424242] leading-relaxed">
                        {agency.location}
                      </p>
                    </div>

                    {/* Hotlines */}
                    <div className="flex gap-3 items-start border-t border-gray-150 pt-4">
                      <Phone className="w-4 h-4 text-[#0562d2] mt-0.5 flex-shrink-0" />
                      <div className="font-['Ford_Antenna',sans-serif] text-sm text-[#424242] leading-relaxed space-y-1">
                        {agency.phones && agency.phones.length > 0 ? (
                          agency.phones.map((phoneItem: any, pIdx: number) => (
                            <p key={pIdx}>
                              {phoneItem.type === 'main' || phoneItem.type === 'Kinh doanh' ? 'Kinh doanh' : phoneItem.type || 'Hotline'}:{' '}
                              <span className="font-semibold text-black">{phoneItem.number}</span>
                            </p>
                          ))
                        ) : (
                          <p>Kinh doanh: <span className="font-semibold text-black">{agency.phone}</span></p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    {agency.email && (
                      <div className="flex gap-3 items-start border-t border-gray-150 pt-4">
                        <Mail className="w-4 h-4 text-[#0562d2] mt-0.5 flex-shrink-0" />
                        <p className="font-['Ford_Antenna',sans-serif] text-sm text-[#424242]">
                          {agency.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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

            {/* Dynamic Vehicle Selector Dropdown */}
            {vehiclesList.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                  Dòng xe quan tâm
                </label>
                <div className="relative">
                  <select
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    className="w-full bg-white border border-[#d6d6d6] text-gray-900 rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm font-sans cursor-pointer appearance-none"
                  >
                    {vehiclesList.map((veh: any) => (
                      <option key={veh.id} value={veh.slug || veh.id}>
                        {veh.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-550 flex items-center">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Ford_Antenna',sans-serif] font-medium text-sm text-white">
                Lời nhắn
              </label>
              <textarea
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                placeholder="Nhập lời nhắn..."
                className="w-full h-[140px] bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0562d2] focus:ring-4 focus:ring-[#0562d2]/20 transition shadow-sm resize-none font-sans"
              />
            </div>

            {/* Action button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[240px] py-[10px] bg-[#0562d2] border border-[#0562d2] hover:bg-[#00095b] hover:border-[#00095b] disabled:bg-gray-400 disabled:border-gray-400 text-white font-semibold text-[16px] tracking-wide rounded-[800px] shadow-md transition cursor-pointer text-center"
              >
                {isSubmitting ? "Đang gửi..." : "Đặt lịch"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Google Maps Full Width at Bottom */}
      <div className="w-full h-[427px] rounded-[24px] overflow-hidden border border-[#d6d6d6] shadow-sm relative mb-6">
        <iframe
          src={getEmbedMapUrl(activeAgency?.link_google_map || activeAgency?.map_embed_url)}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Địa chỉ ${activeAgency?.title} trên Google Map`}
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
