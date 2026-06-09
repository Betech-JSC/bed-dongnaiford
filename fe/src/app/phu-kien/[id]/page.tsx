"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { contactsAPI, accessoriesAPI } from "@/lib/api";
import { 
  Phone, 
  Plus, 
  Minus, 
  Check, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { accessoriesData, AccessoryItem } from "@/data/accessories";
import { handleImageError } from "@/lib/site-assets";

const mapAPIAccessoryToItem = (apiAcc: any): AccessoryItem => {
  const catMap: Record<number, string> = {
    1: "interior",
    2: "exterior",
    3: "tech",
    4: "wheels",
    5: "performance",
  };
  const categoryId = apiAcc.categories?.[0]?.id || 2;
  const categoryKey = catMap[categoryId] || "exterior";

  return {
    id: apiAcc.slug || String(apiAcc.id),
    name: apiAcc.title,
    code: apiAcc.code || "",
    category: categoryKey as any,
    categoryName: apiAcc.category_name || apiAcc.categories?.[0]?.title || "Phụ Kiện Ngoại Thất",
    price: Number(apiAcc.price) || 0,
    description: apiAcc.description || "",
    images: Array.isArray(apiAcc.images) && apiAcc.images.length > 0 
      ? apiAcc.images.map((img: any) => img.url).filter(Boolean)
      : [apiAcc.image?.url].filter(Boolean),
    fitVehicles: apiAcc.fit_vehicles || [],
    features: apiAcc.features || [],
    compatibilityText: apiAcc.compatibility_text,
    safetyText: apiAcc.safety_text,
    productDescText: apiAcc.product_desc_text,
    brand: apiAcc.brand ? {
      id: apiAcc.brand.id,
      title: apiAcc.brand.title,
      slug: apiAcc.brand.slug
    } : null
  };
};

export default function AccessoryDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [accessory, setAccessory] = useState<AccessoryItem | null>(null);
  const [allAccessories, setAllAccessories] = useState<AccessoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState<string>("");
  const [prevId, setPrevId] = useState(id);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeAccordion, setActiveAccordion] = useState<string>("mota");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true);
      try {
        const response = await accessoriesAPI.getBySlug(id);
        if (response && response.success && response.data) {
          const mapped = mapAPIAccessoryToItem(response.data);
          setAccessory(mapped);
          setActiveImage(mapped.images[0] || "");
        } else {
          const staticItem = accessoriesData.find(a => a.id === id) || null;
          setAccessory(staticItem);
          setActiveImage(staticItem && staticItem.images.length > 0 ? staticItem.images[0] : "");
        }
      } catch (err) {
        console.error("Failed to fetch accessory details, using static fallback:", err);
        const staticItem = accessoriesData.find(a => a.id === id) || null;
        setAccessory(staticItem);
        setActiveImage(staticItem && staticItem.images.length > 0 ? staticItem.images[0] : "");
      } finally {
        setIsLoading(false);
      }
    }

    loadDetail();
  }, [id]);

  useEffect(() => {
    async function loadAll() {
      try {
        const response = await accessoriesAPI.getAll();
        if (response && response.success && Array.isArray(response.data)) {
          setAllAccessories(response.data.map(mapAPIAccessoryToItem));
        } else {
          setAllAccessories(accessoriesData);
        }
      } catch (err) {
        setAllAccessories(accessoriesData);
      }
    }
    loadAll();
  }, []);
  
  // Reset state when id changes
  if (id !== prevId) {
    setPrevId(id);
    setQuantity(1);
    setActiveAccordion("mota");
  }

  // Booking Form States
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    phone: "",
    carModel: "Ford Everest",
    date: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (isLoading && !accessory) {
    return (
      <div className="bg-[#fafafa] min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4">
        <Loader2 className="w-10 h-10 text-[#0562D2] animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Đang tải thông tin phụ kiện...</p>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="bg-[#fafafa] min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4">
        <h2 className="font-['Ford_Antenna',sans-serif] font-bold text-xl text-gray-800">
          Không tìm thấy phụ kiện yêu cầu
        </h2>
        <p className="text-sm text-gray-500 max-w-md">
          Sản phẩm có thể đã ngừng cung cấp hoặc liên kết bị lỗi. Vui lòng quay lại danh mục sản phẩm chính hãng.
        </p>
        <Link
          href="/phu-kien"
          className="btn-ford-primary text-xs py-2.5 px-6 font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang phụ kiện</span>
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
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
              id: accessory.id,
              slug: accessory.id,
              title: accessory.name,
            },
            CarModel: bookingForm.carModel,
            InstallDate: bookingForm.date,
            "Nội dung cần hỗ trợ": bookingForm.note || `Đăng ký tư vấn & lắp đặt phụ kiện ${accessory.name}`,
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
            carModel: "Ford Everest",
            date: "",
            note: ""
          });
        }, 2000);
      }
    } catch (error: any) {
      console.error("Accessory booking submit error:", error);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  // Get related accessories (excluding the current one)
  const sourceList = allAccessories.length > 0 ? allAccessories : accessoriesData;
  const currentCategory = accessory.category;
  const currentId = accessory.id;

  const relatedAccessories = sourceList
    .filter(a => a.id !== currentId && (a.category === currentCategory || a.category === "interior"))
    .slice(0, 4);

  // If there are less than 4 related items, add some other random items
  if (relatedAccessories.length < 4) {
    const ids = new Set(relatedAccessories.map(a => a.id));
    sourceList.forEach(a => {
      if (a.id !== currentId && !ids.has(a.id) && relatedAccessories.length < 4) {
        relatedAccessories.push(a);
      }
    });
  }

  // Generate 5 thumbnails to match Figma vertical layout (repeating if necessary)
  const thumbnails = Array.isArray(accessory.images) && accessory.images.length > 0 ? [...accessory.images] : [];
  if (thumbnails.length === 0) {
    thumbnails.push("");
  }
  while (thumbnails.length < 5) {
    thumbnails.push(thumbnails[0]);
  }
  const displayThumbnails = thumbnails.slice(0, 5);

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans pb-0">
      
      {/* Breadcrumbs Section - matching Figma spacing */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-[32px] pb-[12px]">
        <div className="flex flex-wrap items-center gap-[13px] text-[12px] text-gray-500 font-medium font-['Ford_Antenna',sans-serif]">
          <Link href="/" className="hover:text-[#0562D2] transition-colors">
            Trang chủ
          </Link>
          <span className="w-[3px] h-[3px] rounded-full bg-[#333] opacity-60 shrink-0" />
          <Link href="/phu-kien" className="hover:text-[#0562D2] transition-colors">
            Phụ Kiện
          </Link>
          <span className="w-[3px] h-[3px] rounded-full bg-[#333] opacity-60 shrink-0" />
          <span className="text-[#333] font-semibold line-clamp-1 flex-1">
            {accessory.name}
          </span>
        </div>
      </div>

      {/* Main Core Showcase Columns */}
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pb-[64px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-start bg-white rounded-[8px] overflow-hidden p-0">
          
          {/* Left Column: Image Showcase with Vertical Thumbnails */}
          <div className="lg:col-span-6 flex gap-[8px] w-full">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-[8px] shrink-0 w-[80px]">
              {displayThumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(thumb)}
                  className={`aspect-square w-full relative overflow-hidden rounded-[4px] border transition-all duration-200 cursor-pointer bg-white
                    ${(activeImage || accessory.images[0]) === thumb ? "border-2 border-[#0562D2] shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <Image
                    src={thumb}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>

            {/* Main Big Image Preview */}
            <div className="flex-1 aspect-square relative overflow-hidden rounded-[8px] border border-gray-100 bg-white">
              <Image
                src={activeImage || accessory.images[0]}
                alt={accessory.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                onError={handleImageError}
              />
            </div>
          </div>

          {/* Right Column: Specs Info panel */}
          <div className="lg:col-span-6 flex flex-col gap-[4px] px-[16px] relative justify-center">
            
            <div className="flex flex-col gap-[32px] items-start w-full">
              <div className="flex flex-col gap-[8px] items-start w-full">
                {accessory.brand && (
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#0562D2] bg-[#0562D2]/10 px-3 py-1 rounded-full font-sans mb-1">
                    Thương hiệu: {accessory.brand.title}
                  </span>
                )}
                <h1 className="font-['Ford_Antenna',sans-serif] font-semibold text-[28px] text-[#101828] leading-[1.2] w-full">
                  {accessory.name}
                </h1>
                <p className="font-['Ford_Antenna',sans-serif] font-normal text-[12px] text-[#1d2939] leading-[1.5]">
                  Mã sản phẩm: {accessory.code}
                </p>
              </div>

              {/* Description */}
              <p className="font-['Ford_Antenna',sans-serif] font-normal text-[16px] text-[#1d2939] leading-[1.5]">
                {accessory.description}
              </p>

              {/* Price & Quantity & Action Row */}
              <div className="flex flex-col gap-[12px] w-full">
                <div className="font-['Ford_Antenna',sans-serif] font-semibold text-[22px] text-[#344054] leading-[1.45]">
                  {formatPrice(accessory.price)}
                </div>
                
                <div className="flex gap-[8px] items-start w-full">
                  {/* Quantity incrementer */}
                  <div className="bg-white border border-[#d6d6d6] rounded-[800px] flex gap-[8px] h-[51px] items-center justify-center px-[16px] py-[12px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-[140px] shrink-0">
                    <button
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="disabled:opacity-30 cursor-pointer border-0 bg-transparent p-1 hover:text-[#0562D2] transition-colors"
                    >
                      <Minus className="w-[20px] h-[20px] text-gray-600" />
                    </button>
                    <span className="font-['Ford_Antenna',sans-serif] font-semibold text-[#424242] text-[18px] w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="cursor-pointer border-0 bg-transparent p-1 hover:text-[#0562D2] transition-colors"
                    >
                      <Plus className="w-[20px] h-[20px] text-gray-600" />
                    </button>
                  </div>

                  {/* Primary Button "Liên hệ ngay" */}
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="bg-[#0562d2] border border-[#0562d2] text-white rounded-[800px] flex flex-[1_0_0] gap-[8px] items-center justify-center px-[28px] py-[12px] h-[51px] font-['Ford_Antenna',sans-serif] font-semibold text-[18px] hover:bg-[#044ea7] transition-colors duration-200 cursor-pointer shadow-sm"
                  >
                    <Phone className="w-[20px] h-[20px]" />
                    <span>Liên hệ ngay</span>
                  </button>
                </div>
              </div>

              {/* Social Share row */}
              <div className="flex items-center gap-[16px]">
                <span className="font-['Ford_Antenna',sans-serif] font-normal text-[14px] text-[#1d2939] leading-[1.4]">
                  Chia sẻ
                </span>
                <div className="flex gap-[24px] items-start">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-0.5 text-gray-600 hover:text-[#0562D2] transition-colors flex items-center justify-center" aria-label="Facebook">
                    <svg className="w-[24px] h-[24px] fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  </a>
                  <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="p-0.5 text-gray-600 hover:text-[#0562D2] transition-colors flex items-center justify-center" aria-label="Zalo">
                    <svg className="w-[24px] h-[24px] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-0.5 text-gray-600 hover:text-[#0562D2] transition-colors flex items-center justify-center" aria-label="YouTube">
                    <svg className="w-[24px] h-[24px] fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Trust points card */}
              <div className="border border-[#d6d6d6] p-[12px] rounded-[12px] flex flex-col gap-[8px] w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <Check className="w-[20px] h-[20px] text-[#0562D2] shrink-0 mt-0.5" />
                  <p className="font-['Ford_Antenna',sans-serif] font-normal text-[14px] text-[#1d2939] leading-[1.4]">
                    Khách hàng thân thiết nhận thêm 10% giảm giá cho lần mua tiếp theo.
                  </p>
                </div>
                <div className="flex gap-[8px] items-start w-full">
                  <Check className="w-[20px] h-[20px] text-[#0562D2] shrink-0 mt-0.5" />
                  <p className="font-['Ford_Antenna',sans-serif] font-normal text-[14px] text-[#1d2939] leading-[1.4]">
                    Đổi trả sản phẩm trong vòng 30 ngày nếu không hài lòng.
                  </p>
                </div>
                <div className="flex gap-[8px] items-start w-full">
                  <Check className="w-[20px] h-[20px] text-[#0562D2] shrink-0 mt-0.5" />
                  <p className="font-['Ford_Antenna',sans-serif] font-normal text-[14px] text-[#1d2939] leading-[1.4]">
                    Tặng kèm quà nhỏ cho mỗi đơn hàng trên 1.000.000 VNĐ.
                  </p>
                </div>
              </div>

              {/* Collapsible Accordions (Mô tả, Tương thích, An toàn, Mô tả sản phẩm) */}
              <div className="flex flex-col items-start w-full">
                {[
                  { id: "mota", label: "Mô tả", text: accessory.productDescText || accessory.description },
                  { id: "compatibility", label: "Tương thích", text: accessory.compatibilityText || "Sản phẩm được thiết kế chuẩn theo thông số lắp ráp zin các dòng xe Ford." },
                  { id: "safety", label: "Thông tin an toàn", text: accessory.safetyText || "Khuyến nghị lắp ráp bởi kỹ thuật viên ủy quyền chính hãng để bảo toàn đường điện zin." },
                  { id: "productdesc", label: "Mô tả sản phẩm", text: "Chất liệu cao cấp đúc khuôn nguyên khối, chịu lực, chống chịu tốt mọi thời tiết mưa gió tại Việt Nam." }
                ].map((acc) => {
                  const isOpen = activeAccordion === acc.id;
                  return (
                    <div key={acc.id} className="border-b border-[#d6d6d6] py-[24px] flex flex-col gap-[16px] w-full">
                      <button
                        onClick={() => setActiveAccordion(isOpen ? "" : acc.id)}
                        className="w-full flex justify-between items-center text-left cursor-pointer border-0 bg-transparent"
                      >
                        <span className={`font-['Ford_Antenna',sans-serif] font-semibold text-[16px] ${isOpen ? "text-[#0562D2]" : "text-[#1a1a1a]"}`}>
                          {acc.label}
                        </span>
                        <span className="text-[24px] font-medium leading-none text-[#1a1a1a]">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="font-['Ford_Antenna',sans-serif] font-normal text-[16px] text-[#333] leading-[1.5]">
                          {acc.text}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 3. Related Accessories Section - bg-[#f0f0f0] background and top border */}
      <section className="bg-[#f0f0f0] border-t border-[#e5e5e5] py-[64px]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col gap-[32px]">
          <div className="flex flex-col items-start">
            <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] text-[#1a1a1a] leading-[1.2]">
              Phụ kiện liên quan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[24px] w-full">
            {relatedAccessories.map((item) => (
              <Link
                key={item.id}
                href={`/phu-kien/${item.id}`}
                className="group bg-white flex flex-col h-full rounded-[8px] overflow-hidden border border-transparent hover:border-[#0562D2] hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square relative bg-gray-50 overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    onError={handleImageError}
                  />
                </div>
                <div className="px-[16px] py-[12px] flex flex-col gap-[4px] items-center text-center flex-1 justify-between">
                  <div className="flex flex-col items-center gap-[4px]">
                    {item.brand && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0562D2] bg-[#0562D2]/10 px-2.5 py-0.5 rounded-full font-sans mb-1">
                        {item.brand.title}
                      </span>
                    )}
                    <h4 className="font-['Ford_Antenna',sans-serif] font-semibold text-[16px] text-[#1a1a1a] group-hover:text-[#0562D2] transition-colors leading-[1.5] line-clamp-2">
                      {item.name}
                    </h4>
                  </div>
                  <p className="font-['Ford_Antenna',sans-serif] font-medium text-[14px] text-[#0562d2] mt-auto leading-[1.4]">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Modal Overlay */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-[500px] max-h-[95vh] overflow-y-auto shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="bg-[#00095b] text-white p-6 relative">
              <h3 className="text-lg font-bold uppercase tracking-wide font-display">
                Đăng Ký Tư Vấn & Lắp Đặt
              </h3>
              <p className="text-xs text-white/70 mt-1">
                Sản phẩm: <span className="text-white font-bold">{accessory.name}</span>
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
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900">Gửi yêu cầu thành công!</h4>
                  <p className="text-xs text-gray-500">Đại lý Đồng Nai Ford sẽ gọi điện tư vấn và hẹn lịch lắp đặt cho bạn trong 15 phút.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-sm text-xs text-center font-semibold">
                      {errorMessage}
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-dark uppercase tracking-wider block">Họ và tên của bạn *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={bookingForm.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2.5 rounded-sm border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-dark uppercase tracking-wider block">Số điện thoại liên hệ *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="0918xxxxxx"
                      className="w-full px-4 py-2.5 rounded-sm border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-dark uppercase tracking-wider block">Dòng xe bạn đang sử dụng</label>
                    <select 
                      name="carModel"
                      value={bookingForm.carModel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-sm border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0562D2] cursor-pointer"
                    >
                      <option value="Ford Everest">Ford Everest</option>
                      <option value="Ford Explorer">Ford Explorer</option>
                      <option value="Ford Territory">Ford Territory</option>
                      <option value="Ford Ranger">Ford Ranger</option>
                      <option value="Ranger Raptor">Ranger Raptor</option>
                      <option value="Ford Transit">Ford Transit</option>
                      <option value="Dòng xe khác">Dòng xe khác</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-dark uppercase tracking-wider block">Ngày lắp đặt mong muốn</label>
                    <input 
                      type="date" 
                      name="date"
                      value={bookingForm.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-sm border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-dark uppercase tracking-wider block">Ghi chú yêu cầu</label>
                    <textarea 
                      name="note"
                      value={bookingForm.note}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Số lượng, màu sắc hoặc yêu cầu kỹ thuật đặc biệt..."
                      className="w-full px-4 py-2.5 rounded-sm border border-gray-200 text-xs focus:outline-none focus:border-[#0562D2] bg-white resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0562d2] hover:bg-[#044EA7] disabled:bg-gray-400 text-white py-3 rounded-sm font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer border-0 mt-2"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
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

