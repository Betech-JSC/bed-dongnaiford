"use client";

import { useState, useEffect } from "react";
import { useVehicle, VehicleTabBar } from "../layout";
import { regionsAPI, contactsAPI } from "@/lib/api";
import { calculateRollingCost } from "@/lib/rolling-cost";
import { Check, Info, FileText } from "lucide-react";

export default function VehiclePriceCalculatorPage() {
  const {
    vehicle,
    allVehicles
  } = useVehicle();

  // Selected state
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Đồng Nai");
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Set default selected version
  useEffect(() => {
    if (vehicle && vehicle.versions && vehicle.versions.length > 0) {
      setSelectedVersionId(vehicle.versions[0].id);
    }
  }, [vehicle]);

  // Load provinces
  useEffect(() => {
    regionsAPI.getProvinces()
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setProvinces(res.data);
          const hasDongNai = res.data.some(p => p.name.includes("Đồng Nai"));
          if (hasDongNai) {
            setSelectedProvince("Đồng Nai");
          } else if (res.data.length > 0) {
            setSelectedProvince(res.data[0].name);
          }
        }
      })
      .catch((err) => {
        console.error("Error loading provinces:", err);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getSelectedVersion = () => {
    return vehicle?.versions?.find((v: any) => String(v.id) === String(selectedVersionId)) || vehicle?.versions?.[0];
  };

  const selectedVersion = getSelectedVersion();

  const getRollingCostDetails = () => {
    if (!selectedVersion || !vehicle) {
      return {
        basePrice: 0,
        registrationTax: 0,
        plateFee: 0,
        registryFee: 0,
        roadFee: 0,
        insuranceFee: 0,
        total: 0,
      };
    }

    return calculateRollingCost(vehicle, selectedVersion, selectedProvince);
  };

  const rollingCost = getRollingCostDetails();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const productId = String(vehicle?.id || "");
      const productSlug = vehicle?.slug || String(vehicle?.id || "");
      const productTitle = `${vehicle?.name} - ${selectedVersion?.name || ""}`;
      const note = formData.note || `Yêu cầu báo giá lăn bánh xe ${productTitle} tại ${selectedProvince}. Tổng dự toán: ${formatPrice(rollingCost.total)}`;

      const response = await contactsAPI.submit({
        contact: {
          type: "ADVISE_FORM",
          data: {
            Name: formData.fullName,
            Phone: formData.phone,
            Email: formData.email || undefined,
            Province: selectedProvince,
            Product: {
              id: productId,
              slug: productSlug,
              title: productTitle,
              type: "vehicle"
            },
            "Nội dung cần hỗ trợ": note
          }
        }
      });

      if (response && response.success === false) {
        setErrorMessage(response.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
      } else {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ fullName: "", phone: "", email: "", note: "" });
        }, 3000);
      }
    } catch (error: any) {
      console.error("Calculator submit error:", error);
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
          errMsg = String(backendMessage);
        }
      }
      setErrorMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicle) return null;

  return (
    <div className="bg-[#ffffff] text-[#1a1a1a] font-sans pb-24">
      <VehicleTabBar />
      <section className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full py-16">
        
        <div className="flex flex-col gap-4 items-start mb-12 border-b border-[#e5e5e5] pb-6 w-full">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0562d2]">
            Dự toán chi phí
          </span>
          <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-[36px] sm:text-[44px] text-[#1a1a1a] leading-none mt-1">
            Tính Phí Lăn Bánh Xe Ford {vehicle.name}
          </h1>
          <p className="text-gray-500 text-sm max-w-xl">
            Bảng tính tự động các khoản lệ phí trước bạ, phí cấp biển số, bảo hiểm đường bộ bắt buộc giúp quý khách dự toán ngân sách sở hữu xe chính xác nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side Column: Configurator & Advise Form */}
          <div className="lg:col-span-6 flex flex-col gap-8 w-full">
            <div className="bg-[#fafafa] p-6 rounded-xl border border-[#e5e5e5] space-y-5">
              <h3 className="font-bold text-base text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#0562d2]" />
                <span>Cấu hình tính phí</span>
              </h3>

              {/* Version Select */}
              <div className="flex flex-col gap-1.5 items-start w-full relative">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">
                  Chọn Phiên Bản Xe
                </label>
                <div className="relative w-full">
                  <select
                    value={selectedVersionId}
                    onChange={(e) => setSelectedVersionId(e.target.value)}
                    className="w-full bg-white border border-[#d6d6d6] px-4 py-2.5 rounded-lg shadow-sm text-xs font-semibold appearance-none cursor-pointer focus:outline-none focus:border-[#0562d2] text-black"
                  >
                    {vehicle.versions?.map((ver: any) => (
                      <option key={ver.id} value={ver.id}>
                        {ver.name} ({formatPrice(ver.price)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Province Select */}
              <div className="flex flex-col gap-1.5 items-start w-full relative">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">
                  Khu vực đăng ký biển số
                </label>
                <div className="relative w-full">
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full bg-white border border-[#d6d6d6] px-4 py-2.5 rounded-lg shadow-sm text-xs font-semibold appearance-none cursor-pointer focus:outline-none focus:border-[#0562d2] text-black"
                  >
                    {provinces.length > 0 ? (
                      provinces.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Đồng Nai">Đồng Nai</option>
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Bình Dương">Bình Dương</option>
                        <option value="Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Lead Form */}
            <div className="bg-white p-6 rounded-xl border border-[#e5e5e5] space-y-5">
              <h3 className="font-bold text-base text-gray-900 border-b border-gray-200 pb-2">
                Nhận báo giá chi tiết và ưu đãi đặc quyền
              </h3>

              {isSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Gửi thông tin thành công!</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">Đồng Nai Ford sẽ liên hệ lại qua số điện thoại của bạn trong 15 phút để tư vấn ưu đãi lăn bánh và các phụ kiện tặng kèm.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-650 p-3 rounded-sm text-xs text-center font-bold">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Họ và tên của bạn *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="0918xxxxxx"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Địa chỉ Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@mail.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Ghi chú yêu cầu tư vấn</label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Ví dụ: Cần tư vấn trả góp ngân hàng 80%, cần giao xe nhanh..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white resize-none text-black"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0562d2] hover:bg-[#044ea7] disabled:bg-gray-400 text-white py-3.5 rounded-full font-bold uppercase text-xs tracking-wider shadow-md transition-colors cursor-pointer border-0 mt-2"
                  >
                    {isSubmitting ? "Đang gửi thông tin..." : "Nhận báo giá lăn bánh tốt nhất"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Side Column: Calculations Sheet */}
          <div className="lg:col-span-6 flex flex-col gap-6 w-full">
            <div className="bg-[#fafafa] p-6 rounded-xl border border-gray-200/80 shadow-md space-y-5">
              <h3 className="font-bold text-base text-gray-900 border-b border-gray-200 pb-2">
                Bảng tính chi phí lăn bánh dự toán
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-[#e5e5e5]">
                  <span className="text-gray-500 font-medium">Giá xe niêm yết:</span>
                  <span className="font-extrabold text-gray-900 text-base">{formatPrice(rollingCost.basePrice)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#e5e5e5]">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <span>Lệ phí trước bạ (tạm tính {((rollingCost.registrationTax / (rollingCost.basePrice || 1)) * 100).toFixed(1)}%):</span>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </span>
                  <span className="font-bold text-gray-800">+{formatPrice(rollingCost.registrationTax)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#e5e5e5]">
                  <span className="text-gray-500 font-medium">Lệ phí cấp biển số:</span>
                  <span className="font-bold text-gray-800">+{formatPrice(rollingCost.plateFee)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#e5e5e5]">
                  <span className="text-gray-500 font-medium">Phí kiểm định đăng kiểm:</span>
                  <span className="font-bold text-gray-800">+{formatPrice(rollingCost.registryFee)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#e5e5e5]">
                  <span className="text-gray-500 font-medium">Phí bảo trì đường bộ (1 năm):</span>
                  <span className="font-bold text-gray-800">+{formatPrice(rollingCost.roadFee)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#e5e5e5]">
                  <span className="text-gray-500 font-medium">Bảo hiểm trách nhiệm dân sự bắt buộc:</span>
                  <span className="font-bold text-gray-800">+{formatPrice(rollingCost.insuranceFee)}</span>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-250 flex justify-between items-center">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-extrabold text-gray-950 text-md sm:text-lg">Tổng giá trị lăn bánh tạm tính:</span>
                    <span className="text-[11px] text-gray-400 font-bold block">(Lưu ý: Chưa bao gồm ưu đãi giá &amp; bảo hiểm tự nguyện)</span>
                  </div>
                  <span className="font-black text-[#0562D2] text-xl sm:text-2xl tracking-tight">
                    {formatPrice(rollingCost.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Note alert */}
            <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-[#0562D2] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-blue-900">
                <span className="font-bold block">Thông tin lưu ý thêm:</span>
                <p className="leading-relaxed">Chi phí lăn bánh trên đây là tạm tính dựa trên bảng giá niêm yết hiện tại của Ford Việt Nam và quy định áp dụng chung. Giá lăn bánh thực tế tại Đồng Nai Ford thường **thấp hơn** đáng kể nhờ các chương trình **khuyến mại giảm tiền mặt**, tặng kèm **bảo hiểm thân vỏ**, phụ kiện chính hãng đặc biệt. Vui lòng gửi form thông tin bên cạnh để nhận báo giá lăn bánh chính xác và ưu đãi lớn nhất của tháng.</p>
              </div>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}
