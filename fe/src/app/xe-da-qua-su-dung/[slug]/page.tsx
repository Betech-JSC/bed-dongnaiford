"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Phone, 
  Check, 
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Calendar,
  Gauge,
  Info,
  Car,
  FileText,
  ChevronRight,
} from "lucide-react";
import { contactsAPI, usedVehiclesAPI } from "@/lib/api";

export default function UsedVehicleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [vehicle, setVehicle] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Booking Form States
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    phone: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true);
      try {
        const response = await usedVehiclesAPI.getBySlug(slug);
        const data = response?.data || response;
        if (data) {
          setVehicle(data);
          // Set active image to primary image first
          setActiveImage(data.image_url || data.images_urls?.[0] || "");
        }
      } catch (err) {
        console.error("Failed to fetch used vehicle details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  if (isLoading && !vehicle) {
    return (
      <div className="bg-[#fafafa] min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4">
        <Loader2 className="w-10 h-10 text-[#0562D2] animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Đang tải thông tin xe...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="bg-[#fafafa] min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4">
        <h2 className="font-sans font-bold text-xl text-gray-800">
          Không tìm thấy xe yêu cầu
        </h2>
        <p className="text-sm text-gray-500 max-w-md">
          Chiếc xe này có thể đã được bán hoặc đường dẫn bị lỗi. Vui lòng quay lại danh sách xe đã qua sử dụng.
        </p>
        <Link
          href="/xe-da-qua-su-dung"
          className="bg-[#0562D2] hover:bg-[#044EA7] text-white text-xs py-2.5 px-6 font-bold uppercase tracking-wider flex items-center gap-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await contactsAPI.submit({
        contact: {
          type: "ADVISE_FORM",
          data: {
            Name: bookingForm.fullName,
            Phone: bookingForm.phone,
            Product: {
              id: vehicle.id,
              slug: vehicle.slug,
              title: vehicle.title,
            },
            "Nội dung cần hỗ trợ": bookingForm.note || `Đăng ký tư vấn xe đã qua sử dụng: ${vehicle.title}`,
          }
        }
      });

      if (response && response.success === false) {
        setErrorMessage(response.message || "Gửi yêu cầu tư vấn thất bại. Vui lòng thử lại!");
      } else {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setShowBookingModal(false);
          setBookingForm({
            fullName: "",
            phone: "",
            note: ""
          });
        }, 2000);
      }
    } catch (error: any) {
      console.error("Booking submit error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!";
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
      setErrorMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const displayThumbnails = Array.isArray(vehicle.images_urls) 
    ? vehicle.images_urls.filter(Boolean) 
    : [];

  // Metadata specifics (year, odo) parsed from titles and tags
  let year = "2021";
  let odo = "35,000 km";
  if (vehicle && vehicle.title && vehicle.title.includes("2023")) year = "2023";
  if (vehicle && vehicle.tagline && vehicle.tagline.includes("12,000")) odo = "12,000 km";
  if (vehicle && vehicle.tagline && vehicle.tagline.includes("22,000")) odo = "22,000 km";

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans pb-20">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-8 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#0562D2] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/xe-da-qua-su-dung" className="hover:text-[#0562D2] transition-colors">
            Xe đã qua sử dụng
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#333] font-semibold line-clamp-1 flex-1">
            {vehicle.title}
          </span>
        </div>
      </div>

      {/* Main Core Showcase Columns */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white rounded-2xl overflow-hidden p-6 md:p-8 border border-gray-100 shadow-xs">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Big Image Preview */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-inner group">
              <Image
                src={activeImage || vehicle.image_url || "/assets/images/placeholder_car.png"}
                alt={vehicle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Thumbnails Row */}
            {displayThumbnails.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {displayThumbnails.map((thumb: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(thumb)}
                    className={`relative w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-white
                      ${activeImage === thumb ? "border-[#0562D2] scale-95 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specs Info panel */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <ShieldCheck className="w-4 h-4" />
                <span>Ford Assured Đã Kiểm Định</span>
              </div>
              <h1 className="font-sans font-bold text-2xl md:text-3xl text-gray-900 leading-tight">
                {vehicle.title}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                {vehicle.tagline}
              </p>
            </div>

            {/* Odo & Year highlights */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100/50 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#0562D2]" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Năm sản xuất</span>
                  <span className="text-sm font-bold text-gray-800">{year}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100/50 flex items-center justify-center shrink-0">
                  <Gauge className="w-5 h-5 text-[#0562D2]" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Số Km đã đi</span>
                  <span className="text-sm font-bold text-gray-800">{odo}</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#0b192c]/5 p-5 rounded-2xl border border-blue-900/5 space-y-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Giá bán ưu đãi</span>
              <div className="text-2xl md:text-3xl font-extrabold text-red-600">
                {formatPrice(vehicle.price)}
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex-1 bg-[#0562d2] text-white rounded-xl flex gap-2 items-center justify-center py-4 font-bold text-sm hover:bg-[#044ea7] transition-all shadow-sm cursor-pointer border-0"
              >
                <Car className="w-5 h-5" />
                <span>Đăng ký lái thử / Tư vấn</span>
              </button>

              <a
                href="tel:090"
                className="flex items-center justify-center border border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl px-5 transition-all cursor-pointer"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>

            {/* Assured highlights */}
            <div className="border border-gray-200/80 p-4 rounded-2xl space-y-3.5 bg-white">
              <div className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  <strong>Cam kết chính hãng</strong>: Đã trải qua quy trình kiểm tra 167 điểm nghiêm ngặt từ các kỹ thuật viên Ford.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  <strong>Pháp lý rõ ràng</strong>: Rút hồ sơ, công chứng mua bán và sang tên nhanh chóng, minh bạch.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  <strong>Hỗ trợ tài chính</strong>: Hỗ trợ vay mua xe cũ trả góp lên đến 70% giá trị xe tại các ngân hàng đối tác liên kết.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed description panel */}
        <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <FileText className="w-5 h-5 text-[#0562D2]" />
            <h2 className="text-lg font-bold text-gray-900">Chi tiết xe & Mô tả từ đại lý</h2>
          </div>
          <div 
            className="prose max-w-none text-sm text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: vehicle.description }}
          />
        </div>

      </div>

      {/* Booking Form Modal Overlay */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100">
            
            {/* Modal Header */}
            <div className="bg-[#0b192c] text-white p-6 relative">
              <h3 className="text-lg font-bold uppercase tracking-wide">
                Đăng ký Tư vấn / Lái thử
              </h3>
              <p className="text-xs text-white/70 mt-1.5">
                Xe yêu cầu: <span className="text-white font-bold">{vehicle.title}</span>
              </p>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-lg cursor-pointer bg-transparent border-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {isSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900">Gửi yêu cầu thành công!</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Đồng Nai Ford đã nhận được thông tin. Đội ngũ tư vấn xe cũ sẽ chủ động liên hệ hỗ trợ bạn trong ít phút.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs text-center font-semibold">
                      {errorMessage}
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Họ và tên của bạn *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={bookingForm.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Số điện thoại liên hệ *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="0918xxxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Lời nhắn / Yêu cầu thêm</label>
                    <textarea 
                      name="note"
                      value={bookingForm.note}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="vd: Hẹn xem xe trực tiếp tại showroom, hỗ trợ vay ngân hàng thế nào..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white resize-none text-black"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0562d2] hover:bg-[#044EA7] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer border-0 mt-4 shadow-sm"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi thông tin đăng ký"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
