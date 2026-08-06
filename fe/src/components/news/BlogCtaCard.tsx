"use client";

import { useState } from "react";
import { User, Phone as PhoneIcon, ChevronRight, CheckCircle, X, ShieldCheck, Star, Headphones } from "lucide-react";
import { contactsAPI } from "@/lib/api";

type Props = {
  articleTitle: string;
};

export default function BlogCtaCard({ articleTitle }: Props) {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname.trim() || !phone.trim()) {
      setToastType("error");
      setToastMessage("Vui lòng nhập đầy đủ Họ tên và Số điện thoại!");
      setShowToast(true);
      return;
    }

    const phoneRegex = /^0[0-9]{8,11}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      setToastType("error");
      setToastMessage("Số điện thoại không hợp lệ! Vui lòng nhập từ 9 đến 12 chữ số bắt đầu bằng số 0.");
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        contact: {
          type: "CONTACT_FORM" as const,
          data: {
            Name: fullname.trim(),
            Phone: phone.trim(),
            Message: `[Đăng ký tư vấn từ bài viết: "${articleTitle}"]`,
          },
        },
      };

      const response = await contactsAPI.submit(payload);

      if (response && response.success === false) {
        setToastType("error");
        setToastMessage(response.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
        setShowToast(true);
      } else {
        setToastType("success");
        setToastMessage("Đăng ký tư vấn thành công! Chuyên viên tư vấn Đồng Nai Ford sẽ liên hệ Quý khách trong thời gian sớm nhất.");
        setShowToast(true);
        setFullname("");
        setPhone("");
      }
    } catch (error: any) {
      console.warn("Blog CTA submission error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối đến máy chủ. Vui lòng thử lại sau!";
      if (error?.data?.message) {
        const backendMessage = error.data.message;
        if (typeof backendMessage === "object") {
          if (backendMessage.Phone || backendMessage["Số điện thoại"]) {
            errMsg = "Số điện thoại không hợp lệ!";
          } else if (backendMessage.Name || backendMessage["Họ và tên"]) {
            errMsg = "Họ và tên không hợp lệ!";
          }
        } else {
          errMsg = backendMessage;
        }
      }
      setToastType("error");
      setToastMessage(errMsg);
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative font-sans my-4">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#d6d6d6] text-[#1a1a1a] p-4 max-w-xs w-full rounded-xl shadow-2xl flex gap-2.5 items-start relative animate-in fade-in zoom-in-95 duration-200">
            <div className={`w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 ${toastType === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              <CheckCircle className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 space-y-0.5 pr-5">
              <h4 className={`font-bold text-[10px] ${toastType === "success" ? "text-green-600" : "text-red-600"}`}>
                {toastType === "success" ? "Đăng ký thành công" : "Thông báo lỗi"}
              </h4>
              <p className="text-[9px] text-[#424242] leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main CTA Card - Ultra-compact layout with max width wrapper */}
      <div 
        className="w-full max-w-[500px] mx-auto rounded-[14px] overflow-hidden bg-[#f8fafc] shadow-md border border-[#cbd5e1] flex flex-col"
      >
        <div className="flex flex-col lg:flex-row w-full relative z-10">
          
          {/* Left Side: Brand Visual (36% width, ultra-compact vertical split) */}
          <div className="w-full lg:w-[36%] bg-gradient-to-b from-[#003882] via-[#002357] to-[#001433] lg:border-r-[2px] lg:border-[#006fef] p-4 lg:p-5 flex flex-col justify-center items-start min-h-[180px] lg:min-h-[220px]">
            {/* Brand Header */}
            <div className="space-y-3.5 relative z-20 w-full flex flex-col items-start my-auto">
              {/* Centered Logo container */}
              <div className="flex items-center justify-center w-full">
                <img
                  src="/ford_logo.svg"
                  alt="Ford Logo"
                  className="h-6 w-[80px] object-contain flex-shrink-0 mx-auto"
                />
              </div>
              
              {/* Left-aligned Text container */}
              <div className="space-y-1 text-left flex flex-col items-start w-full">
                <h3 className="text-xl lg:text-2xl font-black uppercase leading-none font-['Ford_Antenna',sans-serif] tracking-wider text-white">
                  FORD
                  <span className="block mt-0.5 text-base lg:text-lg">ĐỒNG NAI</span>
                </h3>
                <div className="w-8 h-[2px] bg-[#006fef] mt-1" />
                <p className="text-[9px] text-blue-200 font-semibold tracking-wide mt-1">
                  Cùng bạn trên <span className="text-[#00ffcc]">mọi hành trình</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Clean Sleek Input Cards & Button (64% width) */}
          <div className="w-full lg:w-[64%] p-3.5 lg:p-4 flex flex-col justify-center gap-2 bg-[#f8fafc]">
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-[280px] mx-auto">
              {/* Name Card Input */}
              <div className="flex items-center gap-2 bg-white border border-slate-200/80 hover:border-slate-300 focus-within:!border-[#0052b4] focus-within:ring-4 focus-within:ring-[#0052b4]/10 transition-all rounded-[10px] p-1 shadow-xs">
                <div className="w-7 h-7 bg-[#002f6c] text-white flex items-center justify-center rounded-[5px] flex-shrink-0">
                  <User className="w-3.5 h-3.5 stroke-[1.5] text-white/95" />
                </div>
                <div className="flex-1 flex flex-col min-w-0 pr-1 pl-1">
                  <span className="text-[8px] font-bold text-[#002f6c] tracking-wide uppercase">
                    Họ và Tên Khách Hàng
                  </span>
                  <input
                    type="text"
                    required
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Nhập họ và tên của bạn"
                    className="w-full border-none outline-none text-slate-750 placeholder-slate-400/90 bg-transparent text-[10px] font-semibold p-0 mt-0.5 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone Card Input */}
              <div className="flex items-center gap-2 bg-white border border-slate-200/80 hover:border-slate-300 focus-within:!border-[#0052b4] focus-within:ring-4 focus-within:ring-[#0052b4]/10 transition-all rounded-[10px] p-1 shadow-xs">
                <div className="w-7 h-7 bg-[#002f6c] text-white flex items-center justify-center rounded-[5px] flex-shrink-0">
                  <PhoneIcon className="w-3.5 h-3.5 stroke-[1.5] text-white/95" />
                </div>
                <div className="flex-1 flex flex-col min-w-0 pr-1 pl-1">
                  <span className="text-[8px] font-bold text-[#002f6c] tracking-wide uppercase">
                    Số Điện Thoại
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại của bạn"
                    className="w-full border-none outline-none text-slate-750 placeholder-slate-400/90 bg-transparent text-[10px] font-semibold p-0 mt-0.5 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ford Design Accent Divider */}
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                <div className="h-[1px] bg-slate-200 flex-1" />
                <div className="flex gap-1">
                  <span className="w-0.75 h-2 bg-[#002f6c] transform -skew-x-20 rounded-[1px] opacity-100"></span>
                  <span className="w-0.75 h-2 bg-[#002f6c] transform -skew-x-20 rounded-[1px] opacity-80"></span>
                  <span className="w-0.75 h-2 bg-[#002f6c] transform -skew-x-20 rounded-[1px] opacity-60"></span>
                  <span className="w-0.75 h-2 bg-[#002f6c] transform -skew-x-20 rounded-[1px] opacity-40"></span>
                </div>
                <div className="h-[1px] bg-slate-200 flex-1" />
              </div>

              {/* Glossy Sleek Submit Button - Floating raising effect */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-1.5 px-3 bg-gradient-to-r from-[#006fef] to-[#00255c] hover:from-[#005ec8] hover:to-[#001d4a] disabled:from-slate-400 disabled:to-slate-500 text-white font-extrabold tracking-widest rounded-full shadow-lg hover:shadow-[0_8px_20px_rgba(0,111,239,0.4)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.99] active:translate-y-0 transition-all duration-300 ease-out cursor-pointer flex items-center justify-between group"
              >
                <span className="flex-1 text-center font-black text-[9px] font-['Ford_Antenna',sans-serif] uppercase tracking-wider pl-3 whitespace-nowrap">
                  {isSubmitting ? "Đang xử lý..." : "ĐĂNG KÝ TƯ VẤN NGAY"}
                </span>
                {!isSubmitting && (
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-blue-900 group-hover:translate-x-0.5 transition-transform flex-shrink-0 shadow-md">
                    <ChevronRight className="w-3 h-3 text-blue-900 stroke-[3]" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Features Bar (Dark Navy blue background - Sleek & spacious spacing layout) */}
        <div className="bg-[#001438] border-t border-white/10 px-4 py-1.5 grid grid-cols-1 md:grid-cols-3 gap-y-1.5 md:gap-x-4 text-center text-white relative z-20">
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#00c2ff]/10 flex items-center justify-center text-[#00c2ff] flex-shrink-0">
              <ShieldCheck className="w-2.5 h-2.5 text-[#00c2ff] stroke-[2]" />
            </div>
            <span className="text-[7.5px] md:text-[8px] font-semibold tracking-widest uppercase text-slate-300 font-['Ford_Antenna',sans-serif]">
              Đại lý ủy quyền chính hãng Ford
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 border-t md:border-t-0 md:border-x border-white/10 py-1 md:py-0 md:px-2">
            <div className="w-4 h-4 rounded-full bg-[#00c2ff]/10 flex items-center justify-center text-[#00c2ff] flex-shrink-0">
              <Star className="w-2.5 h-2.5 text-[#00c2ff] stroke-[2]" />
            </div>
            <span className="text-[7.5px] md:text-[8px] font-semibold tracking-widest uppercase text-slate-300 font-['Ford_Antenna',sans-serif]">
              Sản phẩm chất lượng dịch vụ chuyên nghiệp
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#00c2ff]/10 flex items-center justify-center text-[#00c2ff] flex-shrink-0">
              <Headphones className="w-2.5 h-2.5 text-[#00c2ff] stroke-[2]" />
            </div>
            <span className="text-[7.5px] md:text-[8px] font-semibold tracking-widest uppercase text-slate-300 font-['Ford_Antenna',sans-serif]">
              Tư vấn tận tâm hỗ trợ nhanh chóng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
