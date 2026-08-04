"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, CheckCircle, X } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";
import { contactsAPI, vehiclesAPI } from "@/lib/api";

function ContactFormContent() {
  const searchParams = useSearchParams();

  const vehicleParam = searchParams.get("vehicle");
  const reasonParam = searchParams.get("reason");
  const noteParam = searchParams.get("note");

  // Active Tab: "sales" | "service"
  const [activeFormTab, setActiveFormTab] = useState<"sales" | "service">("sales");

  // Shared Form States
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [allVehicles, setAllVehicles] = useState<any[]>([]);

  // Service Booking Form States
  const [formLicensePlate, setFormLicensePlate] = useState("");
  const [formAppointmentTime, setFormAppointmentTime] = useState("");
  const [formLocation, setFormLocation] = useState("Tại đại lý");
  const [formContent, setFormContent] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getVehicleName = (vId: string, vehicleList: any[]) => {
    const found = vehicleList.find((v) => v.id === vId || v.slug === vId);
    if (found) return found.name || found.title;
    return vId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await vehiclesAPI.getAll().catch(() => null);
        const items = res?.data || res;
        let vehicleList: any[] = [];
        if (Array.isArray(items) && items.length > 0) {
          vehicleList = items.map((v: any) => ({
            id: v.slug || v.id,
            name: v.title || v.name
          }));
          setAllVehicles(vehicleList);
        }

        // Auto-detect form tab based on query params
        const combinedText = `${reasonParam || ""} ${noteParam || ""}`.toLowerCase();
        const isServiceRelated = 
          combinedText.includes("bảo dưỡng") || 
          combinedText.includes("sửa chữa") || 
          combinedText.includes("thay dầu") || 
          combinedText.includes("dịch vụ") || 
          combinedText.includes("cứu hộ") || 
          combinedText.includes("phụ kiện") || 
          combinedText.includes("đặt hẹn") ||
          combinedText.includes("detail");

        if (isServiceRelated) {
          setActiveFormTab("service");
        } else {
          setActiveFormTab("sales");
        }

        // Pre-fill selected vehicle if available
        if (vehicleParam) {
          setSelectedVehicle(vehicleParam);
        }

        // Pre-fill content
        if (noteParam) {
          setFormContent(noteParam);
        } else if (reasonParam) {
          if (vehicleParam) {
            const vName = getVehicleName(vehicleParam, vehicleList);
            setFormContent(`${reasonParam}: ${vName}`);
          } else {
            setFormContent(reasonParam);
          }
        }
      } catch (e) {
        console.warn("Notice loading vehicles in ContactPage:", e);
      }
    };
    fetchVehicles();
  }, [noteParam, reasonParam, vehicleParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      setToastMessage("Vui lòng điền Họ tên và Số điện thoại!");
      setShowToast(true);
      return;
    }

    // Phone validation
    const phoneRegex = /^0[0-9]{8,11}$/;
    if (!phoneRegex.test(formPhone.replace(/\s+/g, ""))) {
      setToastMessage("Số điện thoại không hợp lệ! Vui lòng nhập từ 9 đến 12 chữ số và bắt đầu bằng số 0.");
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      let payload: any;

      if (activeFormTab === "service") {
        // SERVICE_BOOKING Validation
        if (!formLicensePlate.trim()) {
          setToastMessage("Vui lòng điền Biển số xe để đặt hẹn dịch vụ!");
          setShowToast(true);
          setIsSubmitting(false);
          return;
        }
        if (!formAppointmentTime) {
          setToastMessage("Vui lòng chọn Thời gian hẹn dịch vụ!");
          setShowToast(true);
          setIsSubmitting(false);
          return;
        }
        if (!formContent.trim()) {
          setToastMessage("Vui lòng nhập Nội dung yêu cầu dịch vụ!");
          setShowToast(true);
          setIsSubmitting(false);
          return;
        }

        payload = {
          contact: {
            type: "SERVICE_BOOKING" as const,
            data: {
              "Họ và tên": formName.trim(),
              "Số điện thoại": formPhone.trim(),
              "E-mail": formEmail.trim() || undefined,
              "Biển số xe": formLicensePlate.trim(),
              "Thời gian hẹn": formAppointmentTime,
              "Nội dung yêu cầu dịch vụ": formContent.trim(),
              "Tại": formLocation
            }
          }
        };
      } else {
        // CONTACT_FORM (Sales / Consultation / Quote Lead)
        let finalMessage = formContent.trim() || "Yêu cầu tư vấn báo giá xe Ford";
        if (selectedVehicle) {
          const vName = getVehicleName(selectedVehicle, allVehicles);
          finalMessage = `[Quan tâm xe: ${vName}] - ${finalMessage}`;
        }

        payload = {
          contact: {
            type: "CONTACT_FORM" as const,
            data: {
              "Name": formName.trim(),
              "Phone": formPhone.trim(),
              "Email": formEmail.trim() || undefined,
              "Message": finalMessage
            }
          }
        };
      }

      const response = await contactsAPI.submit(payload);

      if (response && response.success === false) {
        setToastMessage(response.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
        setShowToast(true);
      } else {
        setToastMessage(
          activeFormTab === "service"
            ? "Đăng ký thành công! Đồng Nai Ford đã nhận được yêu cầu đặt hẹn dịch vụ. Cố vấn dịch vụ sẽ liên hệ xác nhận lịch hẹn trong ít phút."
            : "Đăng ký tư vấn thành công! Chuyên viên tư vấn Đồng Nai Ford sẽ liên hệ báo giá và hỗ trợ Quý khách trong thời gian sớm nhất."
        );
        setShowToast(true);

        // Reset inputs
        setFormName("");
        setFormPhone("");
        setFormEmail("");
        setFormLicensePlate("");
        setFormAppointmentTime("");
        setFormContent("");
        setFormLocation("Tại đại lý");
      }
    } catch (error: any) {
      console.warn("Contact submit notice:", error);
      let errMsg = "Đã xảy ra lỗi kết nối đến máy chủ. Vui lòng thử lại sau!";
      if (error && error.data && error.data.message) {
        const backendMessage = error.data.message;
        if (typeof backendMessage === "object") {
          if (backendMessage.Phone || backendMessage["Số điện thoại"]) {
            errMsg = "Số điện thoại không hợp lệ (yêu cầu từ 9 đến 12 chữ số và bắt đầu bằng số 0)!";
          } else if (backendMessage.Name || backendMessage["Họ và tên"]) {
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

  return (
    <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] py-12 w-full font-antenna">
      {/* Toast Notification Modal */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#d6d6d6] text-[#1a1a1a] p-6 max-w-md w-full rounded-2xl shadow-2xl flex gap-4 items-start relative">
            <div className="w-10 h-10 bg-blue-50 text-[#0562d2] flex items-center justify-center rounded-full flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[#0562d2]" />
            </div>
            <div className="flex-1 space-y-2 pr-6">
              <h4 className="font-bold text-sm text-[#0562d2]">Thông báo hệ thống</h4>
              <p className="text-sm text-[#424242] leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Showroom Banner */}
      <div className="h-[384px] relative rounded-[24px] overflow-hidden w-full mb-12 shadow-sm border border-[#e5e5e5]">
        <img
          alt="Showroom Ford Đồng Nai"
          className="absolute inset-0 object-cover w-full h-full"
          src={siteAssets.showroomBg}
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-12">
        
        {/* Left Side: Contact Information Cards */}
        <div className="flex flex-col gap-8 w-full">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold leading-[1.32] text-[#101828] text-[32px] md:text-[36px] tracking-tight">
              Liên hệ trực tiếp với đại lý Đồng Nai Ford
            </h2>
            <p className="leading-[1.5] text-[#1d2939] text-[16px]">
              Đồng Nai Ford luôn sẵn sàng lắng nghe và hỗ trợ mọi nhu cầu của bạn. Cho dù bạn cần tư vấn dòng xe mới, báo giá lăn bánh hay đặt lịch bảo dưỡng 3S, hãy kết nối với chúng tôi qua các kênh liên hệ bên dưới.
            </p>
          </div>

          {/* Details Wrapper Card */}
          <div className="bg-white border border-[#d6d6d6] flex flex-col gap-6 p-6 md:p-8 rounded-[16px] shadow-sm">
            {/* Showroom Address */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Showroom 3S
                </h4>
                <p className="text-sm text-[#1a1a1a] leading-relaxed font-medium">
                  Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Biên Hòa, Tỉnh Đồng Nai
                </p>
              </div>
            </div>

            {/* Hotlines */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Hotline Hỗ Trợ 24/7
                </h4>
                <div className="text-sm text-[#1a1a1a] leading-relaxed space-y-1">
                  <p>Phòng Kinh doanh: <a href="tel:0918909060" className="font-bold text-[#0562d2] hover:underline">0918 90 90 60</a></p>
                  <p>Xưởng Dịch vụ: <a href="tel:1800556858" className="font-bold text-[#0562d2] hover:underline">1800 55 68 58</a></p>
                  <p>Tổng đài bàn: <span className="text-[#424242]">(0251) 3857 130 – (0251) 3857 131</span></p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
              <div className="w-10 h-10 bg-[#0562d2]/10 text-[#0562d2] flex items-center justify-center rounded-lg flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-[#0562d2]">
                  Email Liên Hệ
                </h4>
                <p className="text-sm text-[#1a1a1a] font-medium">
                  marketing@dongnaiford.com.vn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Intelligent Dual-Mode Form */}
        <div className="bg-[#002F6C] flex flex-col gap-6 p-6 md:p-8 rounded-[20px] shadow-xl text-white">
          {/* Tab Selector Buttons */}
          <div className="grid grid-cols-2 gap-2 bg-white/10 p-1.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveFormTab("sales")}
              className={`py-3 px-4 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center justify-center cursor-pointer ${
                activeFormTab === "sales"
                  ? "bg-[#066fef] text-white shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>Báo Giá & Tư Vấn Xe</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFormTab("service")}
              className={`py-3 px-4 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center justify-center cursor-pointer ${
                activeFormTab === "service"
                  ? "bg-[#066fef] text-white shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>Đặt Hẹn Dịch Vụ 3S</span>
            </button>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-semibold text-[24px] text-white uppercase tracking-tight">
              {activeFormTab === "sales" ? "Đăng Ký Tư Vấn & Nhận Báo Giá" : "Đặt Lịch Bảo Dưỡng & Sửa Chữa"}
            </h3>
            <p className="text-xs text-white/70">
              {activeFormTab === "sales" 
                ? "Điền thông tin bên dưới để nhận bảng giá lăn bánh và ưu đãi mới nhất từ Đồng Nai Ford"
                : "Chọn mốc thời gian và địa điểm để đội ngũ tư vấn dịch vụ chuẩn bị đón tiếp chu đáo nhất"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Họ và tên */}
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-xs md:text-sm text-white">
                Họ và tên <span className="text-[#f97066]">*</span>
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#066fef] focus:ring-2 focus:ring-[#066fef]/30 transition shadow-xs"
              />
            </div>

            {/* Số điện thoại & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-xs md:text-sm text-white">
                  Số điện thoại <span className="text-[#f97066]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0918909060"
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#066fef] focus:ring-2 focus:ring-[#066fef]/30 transition shadow-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-xs md:text-sm text-white">
                  Email (Tùy chọn)
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#066fef] focus:ring-2 focus:ring-[#066fef]/30 transition shadow-xs"
                />
              </div>
            </div>

            {/* Conditional fields based on activeFormTab */}
            {activeFormTab === "sales" ? (
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-xs md:text-sm text-white">
                  Dòng xe Quý khách quan tâm
                </label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full bg-white border border-[#d6d6d6] text-gray-900 rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#066fef] focus:ring-2 focus:ring-[#066fef]/30 transition shadow-xs cursor-pointer"
                >
                  <option value="">-- Chọn dòng xe Ford --</option>
                  {allVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                  <option value="next-gen-ranger">Next-Gen Ranger</option>
                  <option value="next-gen-everest">Next-Gen Everest</option>
                  <option value="next-gen-territory">Next-Gen Territory</option>
                  <option value="ranger-raptor">Ranger Raptor</option>
                  <option value="ford-explorer">Ford Explorer</option>
                  <option value="ford-transit">Ford Transit</option>
                </select>
              </div>
            ) : (
              <>
                {/* Biển số xe & Thời gian hẹn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-medium text-xs md:text-sm text-white">
                      Biển số xe <span className="text-[#f97066]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formLicensePlate}
                      onChange={(e) => setFormLicensePlate(e.target.value)}
                      placeholder="Ví dụ: 60A-123.45"
                      className="w-full bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#066fef] focus:ring-2 focus:ring-[#066fef]/30 transition shadow-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-medium text-xs md:text-sm text-white">
                      Thời gian hẹn <span className="text-[#f97066]">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formAppointmentTime}
                      onChange={(e) => setFormAppointmentTime(e.target.value)}
                      className="w-full bg-white border border-[#d6d6d6] text-gray-900 rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#066fef] focus:ring-2 focus:ring-[#066fef]/30 transition shadow-xs"
                    />
                  </div>
                </div>

                {/* Địa điểm thực hiện dịch vụ */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-xs md:text-sm text-white">
                    Địa điểm làm dịch vụ <span className="text-[#f97066]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Tại đại lý", "Tại nhà"].map((loc) => {
                      const isSel = formLocation === loc;
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setFormLocation(loc)}
                          className={`py-2.5 rounded-lg border font-semibold text-xs transition cursor-pointer text-center ${
                            isSel 
                              ? "bg-[#066fef] border-[#066fef] text-white shadow-xs" 
                              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                          }`}
                        >
                          {loc === "Tại đại lý" ? "Tại Showroom" : "Giao Nhận Tận Nhà"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Nội dung yêu cầu */}
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-xs md:text-sm text-white">
                {activeFormTab === "sales" ? "Nội dung cần tư vấn" : "Nội dung yêu cầu dịch vụ"}{" "}
                <span className="text-[#f97066]">*</span>
              </label>
              <textarea
                required
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder={
                  activeFormTab === "sales"
                    ? "Nhập câu hỏi hoặc yêu cầu báo giá lăn bánh..."
                    : "Nhập các hạng mục cần bảo dưỡng, sửa chữa..."
                }
                className="w-full h-[100px] bg-white border border-[#d6d6d6] text-gray-900 placeholder-[#808080] rounded-[8px] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#066fef] focus:ring-2 focus:ring-[#066fef]/30 transition shadow-xs resize-none"
              />
            </div>

            {/* Action Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#066fef] hover:bg-[#00095B] disabled:bg-gray-400 text-white font-bold text-base tracking-wide rounded-xl shadow-lg transition-all cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <span>
                  {isSubmitting
                    ? "Đang gửi yêu cầu..."
                    : activeFormTab === "sales"
                    ? "Gửi Yêu Cầu Báo Giá"
                    : "Xác Nhận Đặt Lịch Hẹn"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1440px] mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#066fef] mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Đang tải trang liên hệ...</p>
      </div>
    }>
      <ContactFormContent />
    </Suspense>
  );
}
