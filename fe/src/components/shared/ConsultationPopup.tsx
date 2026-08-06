"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { User, Phone, MessageSquare, ShieldCheck, Percent, Headphones, Lock, X, ArrowRight, CheckCircle } from "lucide-react";
import { contactsAPI } from "@/lib/api";

export default function ConsultationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const pathname = usePathname();
  const isHomepage = pathname === "/";

  useEffect(() => {
    // Set timer to show popup after 1 second (1000ms)
    const timer = setTimeout(() => {
      const isArticlePage = document.getElementById("article-detail-page") !== null;

      if (isHomepage || isArticlePage) {
        // Always show on reload (ignoring sessionStorage for easy testing)
        setIsOpen(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      setIsOpen(false); // Hide popup on route transition
    };
  }, [isHomepage, pathname]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname.trim() || !phone.trim()) {
      setToastType("error");
      setToastMessage("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
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

    if (!agreed) {
      setToastType("error");
      setToastMessage("Bạn cần đồng ý để Ford Đồng Nai liên hệ tư vấn!");
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
            Message: `[Đăng ký tư vấn từ popup trang chủ] ${message.trim() ? `- Nội dung quan tâm: ${message.trim()}` : ""}`,
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
        setMessage("");
        // Close modal after successful submission
        setTimeout(() => {
          handleClose();
        }, 2500);
      }
    } catch (error: any) {
      console.warn("Popup consultation submission error:", error);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 animate-fade-in font-sans">
      <style jsx global>{`
        @keyframes float-up {
          from {
            transform: translateY(20px) scale(0.97);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-float-up {
          animation: float-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out forwards;
        }
        @keyframes bounce-playful {
          0%, 100% {
            transform: translateY(0) scale(1, 1);
          }
          10% {
            transform: translateY(2px) scale(1.03, 0.95);
          }
          30% {
            transform: translateY(-8px) scale(0.95, 1.05);
          }
          50% {
            transform: translateY(0) scale(1.02, 0.98);
          }
          70% {
            transform: translateY(-4px) scale(0.98, 1.02);
          }
          90% {
            transform: translateY(0) scale(1, 1);
          }
        }
        .animate-bounce-playful {
          animation: bounce-playful 1.8s infinite ease-in-out;
        }
        .animate-bounce-playful:hover {
          animation-play-state: paused;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Toast Notification Container */}
      {showToast && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/45">
          <div className="bg-white border border-[#d6d6d6] text-[#1a1a1a] p-5 max-w-sm w-full rounded-xl shadow-2xl flex gap-3 items-start relative animate-in fade-in zoom-in-95 duration-200">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${toastType === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1 pr-6">
              <h4 className={`font-bold text-sm ${toastType === "success" ? "text-green-600" : "text-red-600"}`}>
                {toastType === "success" ? "Đăng ký thành công" : "Thông báo lỗi"}
              </h4>
              <p className="text-xs text-[#424242] leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Popup Container */}
      <div className="bg-white rounded-[16px] overflow-hidden max-w-[460px] w-full shadow-2xl relative border border-[#e5e5e5] animate-float-up flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-4.5 right-4.5 z-50 w-7.5 h-7.5 flex items-center justify-center bg-black/15 hover:bg-black/25 text-gray-800 hover:text-black rounded-full hover:rotate-90 transition-all duration-300 cursor-pointer"
        >
          <X className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto custom-scrollbar flex-1 flex flex-col pb-5">
          
          {/* Header Branding */}
          <div className="pt-7 px-6 text-center flex flex-col items-center select-none">
            {/* Ford Logo & Name */}
            <div className="flex items-center gap-[5px]">
              <img
                src="/ford_logo.svg"
                alt="Ford Oval Logo"
                className="h-[22px] w-[58px] object-contain flex-shrink-0"
              />
              <span className="font-['Ford_Antenna',sans-serif] font-bold text-[#00095b] text-[12px] tracking-tight leading-none uppercase">
                ĐỒNG NAI FORD
              </span>
            </div>
            <p className="text-[9px] text-[#424242] font-semibold mt-1">
              Đại lý uỷ quyền chính thức của Ford Việt Nam
            </p>

            {/* Main Header Title */}
            <h3 className="font-extrabold text-[#00095b] text-[20px] md:text-[22px] tracking-normal uppercase leading-tight mt-3">
              ĐĂNG KÝ TƯ VẤN<br />FORD ĐỒNG NAI
            </h3>
            <p className="text-[11px] text-[#424242] max-w-[340px] mx-auto mt-1 leading-relaxed">
              Để lại thông tin, chuyên viên Ford Đồng Nai sẽ liên hệ tư vấn chi tiết cho bạn!
            </p>
          </div>

          {/* Vehicle Group Showcase Image */}
          <div className="mt-3.5 w-full relative">
            <img
              src="/assets/vehicle-group.jpg"
              alt="Dòng xe Ford Đồng Nai"
              className="w-full h-auto object-cover max-h-[160px]"
            />
          </div>

          {/* Core Brand Features Bar */}
          <div className="bg-[#002c77] text-white py-2 px-3 text-center flex justify-around items-center select-none gap-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-white/95 shrink-0" />
              <span className="text-[9px] md:text-[9.5px] font-bold tracking-wide uppercase text-white/90">
                Sản phẩm chính hãng
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <div className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-white/95 shrink-0" />
              <span className="text-[9px] md:text-[9.5px] font-bold tracking-wide uppercase text-white/90">
                Ưu đãi hấp dẫn
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <div className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-white/95 shrink-0" />
              <span className="text-[9px] md:text-[9.5px] font-bold tracking-wide uppercase text-white/90 leading-tight">
                Tư vấn tận tâm
              </span>
            </div>
          </div>

          {/* Consultation Form Fields */}
          <form onSubmit={handleSubmit} className="px-6 pt-5 flex flex-col gap-3.5 w-full">
            {/* Input Name */}
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400">
                <User className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                required
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Họ và tên *"
                className="w-full bg-white border border-[#d6d6d6] focus:border-[#0562d2] focus:ring-1 focus:ring-[#0562d2] focus:outline-none rounded-[8px] pl-10 pr-4 py-2.5 text-xs md:text-sm text-gray-800 placeholder-gray-400 transition-colors font-sans"
              />
            </div>

            {/* Input Phone */}
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại *"
                className="w-full bg-white border border-[#d6d6d6] focus:border-[#0562d2] focus:ring-1 focus:ring-[#0562d2] focus:outline-none rounded-[8px] pl-10 pr-4 py-2.5 text-xs md:text-sm text-gray-800 placeholder-gray-400 transition-colors font-sans"
              />
            </div>

            {/* Input Message */}
            <div className="relative flex items-start">
              <div className="absolute left-3.5 top-2.5 text-gray-400">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nội dung bạn quan tâm (không bắt buộc)"
                className="w-full bg-white border border-[#d6d6d6] focus:border-[#0562d2] focus:ring-1 focus:ring-[#0562d2] focus:outline-none rounded-[8px] pl-10 pr-4 py-2.5 text-xs md:text-sm text-gray-800 placeholder-gray-400 transition-colors font-sans min-h-[64px] resize-none"
              />
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer select-none py-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#002c77] border-gray-300 focus:ring-[#002c77]"
              />
              <span className="text-[11px] font-semibold text-gray-700 leading-tight">
                Tôi đồng ý cho Ford Đồng Nai liên hệ tư vấn
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#002c77] hover:bg-[#0562d2] disabled:bg-slate-400 text-white font-extrabold py-2.5 rounded-[8px] text-[13.5px] md:text-[14px] tracking-wider flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-300 ease-out cursor-pointer uppercase select-none font-['Ford_Antenna',sans-serif] animate-bounce-playful"
            >
              <span>{isSubmitting ? "Đang gửi đăng ký..." : "Đăng ký tư vấn ngay"}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Security Disclaimer Note */}
            <div className="flex items-center justify-center gap-1.5 text-gray-400 select-none">
              <Lock className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] md:text-[11px] font-semibold text-gray-500">
                Thông tin của bạn được bảo mật tuyệt đối
              </span>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
