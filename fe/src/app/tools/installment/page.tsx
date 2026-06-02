"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronDown, 
  ChevronRight,
  HelpCircle, 
  Printer, 
  Eye, 
  Calculator,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { vehicles, Vehicle, Version } from "@/data/vehicles";

interface RepaymentRow {
  period: number;
  remainingPrincipal: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
}

export default function InstallmentCalculatorPage() {
  // State for car selection
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(vehicles[0]);
  const [selectedVersion, setSelectedVersion] = useState<Version>(vehicles[0].versions[0]);
  
  // Form input states
  const [listPrice, setListPrice] = useState<number>(vehicles[0].versions[0].price);
  const [prepaidPercentage, setPrepaidPercentage] = useState<number>(20);
  const [prepaidAmount, setPrepaidAmount] = useState<number>(
    Math.round(vehicles[0].versions[0].price * 0.2)
  );
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60); // 5 years (60 months)
  const [rateYear1, setRateYear1] = useState<number>(8.5); // 8.5%
  const [rateSubsequent, setRateSubsequent] = useState<number>(11.0); // 11%
  const [repaymentMethod, setRepaymentMethod] = useState<"declining" | "flat">("declining");
  
  // UI States
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [isTermOpen, setIsTermOpen] = useState(false);
  const [showAllSchedule, setShowAllSchedule] = useState(false);
  const [isCalculated, setIsCalculated] = useState(true);

  const resultsRef = useRef<HTMLDivElement>(null);
  const vehicleDropdownRef = useRef<HTMLDivElement>(null);
  const versionDropdownRef = useRef<HTMLDivElement>(null);
  const termDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(event.target as Node)) {
        setIsVehicleOpen(false);
      }
      if (versionDropdownRef.current && !versionDropdownRef.current.contains(event.target as Node)) {
        setIsVersionOpen(false);
      }
      if (termDropdownRef.current && !termDropdownRef.current.contains(event.target as Node)) {
        setIsTermOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update version and pricing when vehicle changes
  const handleVehicleChange = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    const defaultVersion = vehicle.versions[0] || { id: "none", name: "Đang cập nhật", price: vehicle.basePrice };
    setSelectedVersion(defaultVersion);
    setListPrice(defaultVersion.price);
    
    // Recalculate prepaid amount based on new price and current percentage
    const newPrepaidAmount = Math.round(defaultVersion.price * (prepaidPercentage / 100));
    setPrepaidAmount(newPrepaidAmount);
    setIsVehicleOpen(false);
  };

  // Update pricing when version changes
  const handleVersionChange = (version: Version) => {
    setSelectedVersion(version);
    setListPrice(version.price);
    
    // Recalculate prepaid amount based on new price and current percentage
    const newPrepaidAmount = Math.round(version.price * (prepaidPercentage / 100));
    setPrepaidAmount(newPrepaidAmount);
    setIsVersionOpen(false);
  };

  // Manual list price input handler
  const handleListPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const val = rawVal ? parseInt(rawVal, 10) : 0;
    setListPrice(val);
    
    // Recalculate prepaid amount
    const newPrepaidAmount = Math.round(val * (prepaidPercentage / 100));
    setPrepaidAmount(newPrepaidAmount);
  };

  // Manual prepaid amount input handler
  const handlePrepaidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const val = rawVal ? parseInt(rawVal, 10) : 0;
    
    // Limit prepaid amount to list price
    const safeVal = Math.min(val, listPrice);
    setPrepaidAmount(safeVal);
    
    // Recalculate percentage
    if (listPrice > 0) {
      const percentage = parseFloat(((safeVal / listPrice) * 100).toFixed(1));
      setPrepaidPercentage(percentage);
    }
  };

  // Prepaid percentage preset buttons handler
  const handlePrepaidPercentagePreset = (pct: number) => {
    setPrepaidPercentage(pct);
    const amount = Math.round(listPrice * (pct / 100));
    setPrepaidAmount(amount);
  };

  // Calculations details
  const loanAmount = Math.max(0, listPrice - prepaidAmount);
  
  // Format currency output helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val) + " đ";
  };

  // Compute Amortization Schedule
  const scheduleRows: RepaymentRow[] = [];
  let tempRemaining = loanAmount;
  const monthlyPrincipal = loanAmount > 0 && loanTermMonths > 0 ? Math.round(loanAmount / loanTermMonths) : 0;

  for (let t = 1; t <= loanTermMonths; t++) {
    const annualRate = t <= 12 ? rateYear1 : rateSubsequent;
    const monthlyRate = annualRate / 12 / 100;
    
    let principalPaid = monthlyPrincipal;
    if (t === loanTermMonths) {
      principalPaid = tempRemaining; // Pay off exactly the remainder at the final month
    }
    
    let interestPaid = 0;
    if (repaymentMethod === "declining") {
      interestPaid = Math.round(tempRemaining * monthlyRate);
    } else {
      interestPaid = Math.round(loanAmount * monthlyRate);
    }
    
    const totalPaid = principalPaid + interestPaid;
    
    scheduleRows.push({
      period: t,
      remainingPrincipal: tempRemaining,
      principalPaid,
      interestPaid,
      totalPaid
    });
    
    tempRemaining = Math.max(0, tempRemaining - principalPaid);
  }

  // Totals calculations
  const totalPrincipal = loanAmount;
  const totalInterest = scheduleRows.reduce((sum, r) => sum + r.interestPaid, 0);
  const totalRepayment = totalPrincipal + totalInterest;

  const firstMonthTotal = scheduleRows[0]?.totalPaid || 0;

  // Scroll to results section on click
  const handleCalculate = () => {
    setIsCalculated(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handlePrint = () => {
    window.print();
  };

  const termOptions = [
    { label: "1 năm (12 tháng)", months: 12 },
    { label: "2 năm (24 tháng)", months: 24 },
    { label: "3 năm (36 tháng)", months: 36 },
    { label: "4 năm (48 tháng)", months: 48 },
    { label: "5 năm (60 tháng)", months: 60 },
    { label: "6 năm (72 tháng)", months: 72 },
    { label: "7 năm (84 tháng)", months: 84 },
    { label: "8 năm (96 tháng)", months: 96 },
  ];

  return (
    <section className="bg-gray-50/50 py-8 md:py-16 font-sans print:bg-white print:py-0 w-full">
      {/* Print-only Dealership Header */}
      <div className="hidden print:block mb-8 border-b pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#00095B] uppercase tracking-tight">ĐỒNG NAI FORD</h1>
            <p className="text-xs text-gray-500 mt-1">
              Địa chỉ: Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, TP. Biên Hòa, Đồng Nai
            </p>
            <p className="text-xs text-gray-500">Hotline KD: 0918 90 90 60 | Email: marketing@dongnaiford.com.vn</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-gray-800">BẢNG ƯỚC TÍNH CHI PHÍ TRẢ GÓP</h2>
            <p className="text-xs text-gray-500 mt-1">Ngày lập: {new Date().toLocaleDateString("vi-VN")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
        
        {/* Page Header (14144:5312) */}
        <div className="mb-8 md:mb-12 print:hidden">
          <h1 className="text-headline-1 text-vivid font-bold tracking-tight mb-2">
            Ước tính chi phí trả góp
          </h1>
          <p className="text-body-1 text-gray-med">
            Nhập thông tin để tính toán khoản vay và kế hoạch trả nợ của bạn
          </p>
        </div>

        {/* Main Grid Layout (14144:5315) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full print:hidden">
          
          {/* Left Column - Inputs Form (14144:5316) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
            
            {/* Row 1: Car Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dropdown: Chọn mẫu xe */}
              <div className="relative" ref={vehicleDropdownRef}>
                <label className="block text-label-2 text-gray-dark font-medium mb-1.5">
                  Chọn mẫu xe
                </label>
                <button
                  type="button"
                  onClick={() => setIsVehicleOpen(!isVehicleOpen)}
                  className="w-full flex items-center justify-between bg-white border border-[#d6d6d6] rounded-lg px-4 py-2.5 text-body-1 text-gray-dark text-left focus:outline-none focus:ring-1 focus:ring-vivid cursor-pointer shadow-sm"
                >
                  <span className="truncate font-semibold">{selectedVehicle.name}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isVehicleOpen ? "rotate-180" : ""}`} />
                </button>
                {isVehicleOpen && (
                  <div className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    {vehicles.map((car) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => handleVehicleChange(car)}
                        className={`w-full px-4 py-2 text-left text-body-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                          selectedVehicle.id === car.id ? "text-vivid font-bold bg-blue-50/30" : "text-gray-dark"
                        }`}
                      >
                        <span>{car.name}</span>
                        <span className="text-xs text-gray-400">{car.typeName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown: Chọn phiên bản */}
              <div className="relative" ref={versionDropdownRef}>
                <label className="block text-label-2 text-gray-dark font-medium mb-1.5">
                  Chọn phiên bản
                </label>
                <button
                  type="button"
                  disabled={selectedVehicle.versions.length <= 1 && selectedVehicle.versions[0]?.id === "none"}
                  onClick={() => setIsVersionOpen(!isVersionOpen)}
                  className="w-full flex items-center justify-between bg-white border border-[#d6d6d6] rounded-lg px-4 py-2.5 text-body-1 text-gray-dark text-left focus:outline-none focus:ring-1 focus:ring-vivid cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="truncate font-medium">{selectedVersion.name}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isVersionOpen ? "rotate-180" : ""}`} />
                </button>
                {isVersionOpen && (
                  <div className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    {selectedVehicle.versions.map((ver) => (
                      <button
                        key={ver.id}
                        type="button"
                        onClick={() => handleVersionChange(ver)}
                        className={`w-full px-4 py-2 text-left text-body-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                          selectedVersion.id === ver.id ? "text-vivid font-bold bg-blue-50/30" : "text-gray-dark"
                        }`}
                      >
                        <span>{ver.name}</span>
                        <span className="text-xs text-vivid font-bold">{formatCurrency(ver.price)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: List Price & Prepaid Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Input: Giá niêm yết */}
              <div>
                <label className="block text-label-2 text-gray-dark font-medium mb-1.5">
                  Giá niêm yết (VNĐ)
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type="text"
                    value={listPrice ? new Intl.NumberFormat("vi-VN").format(listPrice) : ""}
                    onChange={handleListPriceChange}
                    placeholder="Nhập giá xe..."
                    className="w-full bg-white border border-[#d6d6d6] rounded-lg px-4 py-2 text-body-1 text-gray-dark font-semibold focus:outline-none focus:ring-1 focus:ring-vivid placeholder:text-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm font-medium">đ</span>
                  </div>
                </div>
              </div>

              {/* Input: Khoản trả trước */}
              <div>
                <label className="block text-label-2 text-gray-dark font-medium mb-1.5 flex justify-between">
                  <span>Khoản trả trước (VNĐ)</span>
                  <span className="text-vivid font-bold text-xs bg-blue-50 px-1.5 py-0.5 rounded">
                    {prepaidPercentage}%
                  </span>
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type="text"
                    value={prepaidAmount ? new Intl.NumberFormat("vi-VN").format(prepaidAmount) : ""}
                    onChange={handlePrepaidAmountChange}
                    placeholder="Nhập số tiền trả trước..."
                    className="w-full bg-white border border-[#d6d6d6] rounded-lg px-4 py-2 text-body-1 text-gray-dark font-medium focus:outline-none focus:ring-1 focus:ring-vivid placeholder:text-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm font-medium">đ</span>
                  </div>
                </div>

                {/* Preset downpayment buttons */}
                <div className="flex gap-2 mt-2">
                  {[20, 30, 50, 70].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePrepaidPercentagePreset(pct)}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer font-medium ${
                        prepaidPercentage === pct
                          ? "bg-vivid text-white border-vivid"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Term & Interest Rates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dropdown: Thời gian vay */}
              <div className="relative" ref={termDropdownRef}>
                <label className="block text-label-2 text-gray-dark font-medium mb-1.5">
                  Thời gian vay
                </label>
                <button
                  type="button"
                  onClick={() => setIsTermOpen(!isTermOpen)}
                  className="w-full flex items-center justify-between bg-white border border-[#d6d6d6] rounded-lg px-4 py-2.5 text-body-1 text-gray-dark text-left focus:outline-none focus:ring-1 focus:ring-vivid cursor-pointer shadow-sm"
                >
                  <span className="truncate font-medium">
                    {termOptions.find((t) => t.months === loanTermMonths)?.label || `${loanTermMonths} tháng`}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                {isTermOpen && (
                  <div className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    {termOptions.map((opt) => (
                      <button
                        key={opt.months}
                        type="button"
                        onClick={() => {
                          setLoanTermMonths(opt.months);
                          setIsTermOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-body-2 hover:bg-gray-50 cursor-pointer ${
                          loanTermMonths === opt.months ? "text-vivid font-bold" : "text-gray-dark"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Interest Rate row */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Year 1 Rate */}
                <div>
                  <label className="block text-[13px] text-gray-dark font-medium mb-1.5 truncate">
                    Lãi suất năm đầu
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      value={rateYear1}
                      onChange={(e) => setRateYear1(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#d6d6d6] rounded-lg pl-3 pr-6 py-2 text-body-1 text-gray-dark font-medium focus:outline-none focus:ring-1 focus:ring-vivid text-center"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-xs">%</span>
                    </div>
                  </div>
                </div>

                {/* Subsequent Years Rate */}
                <div>
                  <label className="block text-[13px] text-gray-dark font-medium mb-1.5 truncate">
                    Lãi suất năm sau
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      value={rateSubsequent}
                      onChange={(e) => setRateSubsequent(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#d6d6d6] rounded-lg pl-3 pr-6 py-2 text-body-1 text-gray-dark font-medium focus:outline-none focus:ring-1 focus:ring-vivid text-center"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-xs">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Repayment Method Segment Tab */}
            <div>
              <label className="block text-label-2 text-gray-dark font-medium mb-2">
                Phương thức trả góp
              </label>
              <div className="bg-gray-100 p-1 rounded-lg grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setRepaymentMethod("declining")}
                  className={`py-2 px-4 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                    repaymentMethod === "declining"
                      ? "bg-white text-vivid shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Dư nợ giảm dần (Khuyên dùng)
                </button>
                <button
                  type="button"
                  onClick={() => setRepaymentMethod("flat")}
                  className={`py-2 px-4 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                    repaymentMethod === "flat"
                      ? "bg-white text-vivid shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Dư nợ gốc cố định (Trả đều)
                </button>
              </div>
              <p className="text-[12px] text-gray-500 mt-2 flex items-start gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>
                  {repaymentMethod === "declining" 
                    ? "Dư nợ giảm dần: Tiền lãi giảm dần hàng tháng dựa trên số dư gốc thực tế còn lại. Hầu hết ngân hàng áp dụng phương thức này."
                    : "Dư nợ gốc cố định: Tiền lãi cố định hàng tháng tính trên khoản vay ban đầu, số tiền thanh toán bằng nhau mỗi tháng."}
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-vivid hover:bg-secondary text-white py-3 px-6 rounded-lg text-title-3 font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0 mt-4 active:scale-[0.99]"
            >
              <Calculator className="w-5 h-5" />
              Tính toán khoản vay của bạn
            </button>
          </div>

          {/* Right Column - Selected Car Showcase Card (14144:5327) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
            {/* Card Visual Header */}
            <div className="bg-gradient-to-br from-primary to-secondary p-6 text-white text-center relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(5,98,210,0.3),transparent)]" />
              <div className="relative z-10">
                <span className="text-[11px] font-bold tracking-widest uppercase bg-[#0562d2] px-2 py-0.5 rounded-full">
                  Ưu đãi trả góp 2026
                </span>
                <h3 className="text-xl font-bold mt-2 font-display">{selectedVehicle.name}</h3>
                <p className="text-xs text-white/80 font-medium">{selectedVersion.name}</p>
              </div>
            </div>

            {/* Vehicle Image Container */}
            <div className="flex-1 p-6 flex flex-col justify-between gap-6 bg-gray-50/20">
              <div className="w-full h-[180px] relative mt-2 flex items-center justify-center">
                {selectedVehicle.images[0] ? (
                  <Image
                    src={selectedVehicle.images[0]}
                    alt={selectedVehicle.name}
                    fill
                    sizes="(max-width: 1024px) 80vw, 30vw"
                    className="object-contain hover:scale-105 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="text-xs text-gray-400">Hình ảnh đang cập nhật</div>
                )}
              </div>

              {/* Loan Summary Listing */}
              <div className="border-t border-gray-150 pt-4 space-y-3.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Giá xe (phiên bản):</span>
                  <span className="font-bold text-gray-800">{formatCurrency(listPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Khoản trả trước ({prepaidPercentage}%):</span>
                  <span className="font-bold text-gray-800">{formatCurrency(prepaidAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-dashed border-gray-150 pb-3">
                  <span className="text-gray-500 font-medium">Khoản vay ngân hàng:</span>
                  <span className="font-bold text-vivid text-base">{formatCurrency(loanAmount)}</span>
                </div>
                
                {/* Result Monthly Estimate */}
                <div className="flex justify-between items-center pt-1.5">
                  <div className="flex items-center gap-1.5">
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    <div>
                      <span className="text-xs text-gray-400 block leading-none">Thanh toán tháng đầu</span>
                      <span className="text-[11px] text-gray-500">(Gốc + Lãi)</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(firstMonthTotal)}
                  </span>
                </div>
              </div>

              {/* Bottom Quick Action Link */}
              <Link
                href={`/products/${selectedVehicle.id}`}
                className="w-full border border-gray-200 hover:border-vivid hover:bg-blue-50/10 text-gray-700 hover:text-vivid py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 mt-2 text-center"
              >
                <span>Xem chi tiết dòng sản phẩm này</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Results Block - Amortization Schedule (14144:5395) */}
        {isCalculated && loanAmount > 0 && (
          <div ref={resultsRef} className="mt-12 bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6 scroll-mt-24 print:border-0 print:shadow-none print:p-0 print:mt-0">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-5 print:border-b-0 print:pb-0">
              <div>
                <h3 className="text-headline-3 text-primary font-bold uppercase tracking-wide print:text-xl">
                  Lịch trả nợ ước tính
                </h3>
                <p className="text-body-2 text-gray-med mt-1 print:text-xs">
                  Chi tiết bảng thanh toán từng kỳ dựa trên phương thức <span className="text-vivid font-bold">{repaymentMethod === "declining" ? "Dư nợ giảm dần" : "Dư nợ gốc cố định"}</span>
                </p>
              </div>

              {/* Print action buttons */}
              <div className="flex items-center gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  In / Xuất PDF
                </button>
                <Link
                  href={`/contact?reason=Tư vấn trả góp&model=${selectedVehicle.name}`}
                  className="flex items-center gap-1.5 text-xs bg-vivid hover:bg-secondary text-white font-semibold px-4 py-2 rounded-lg shadow-sm"
                >
                  Nhận báo giá chi tiết
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Loan Metrics Grid for Print & Web Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100/50 print:bg-white print:border print:border-gray-200">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-medium uppercase">Mẫu xe & Phiên bản</span>
                <span className="text-sm font-bold text-gray-800 block truncate">{selectedVehicle.name} - {selectedVersion.name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-medium uppercase">Khoản vay ngân hàng</span>
                <span className="text-sm font-bold text-vivid block">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-medium uppercase">Tổng thời gian vay</span>
                <span className="text-sm font-bold text-gray-800 block">{loanTermMonths} tháng ({loanTermMonths / 12} năm)</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-medium uppercase">Tổng lãi phải trả</span>
                <span className="text-sm font-bold text-green-600 block">{formatCurrency(totalInterest)}</span>
              </div>
            </div>

            {/* Repayment Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-150 text-label-2 text-gray-dark font-semibold">
                    <th className="py-3 px-4 text-center w-16">Kỳ</th>
                    <th className="py-3 px-4">Số dư nợ bắt đầu</th>
                    <th className="py-3 px-4 text-right">Gốc trả</th>
                    <th className="py-3 px-4 text-right">Lãi trả</th>
                    <th className="py-3 px-4 text-right font-bold text-vivid">Tổng trả (Gốc + Lãi)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-body-2 text-gray-dark font-medium">
                  {/* Period 0 - Initial state */}
                  <tr className="bg-gray-50/30">
                    <td className="py-3 px-4 text-center text-gray-500 font-bold">0</td>
                    <td className="py-3 px-4 font-semibold text-gray-600">{formatCurrency(loanAmount)}</td>
                    <td className="py-3 px-4 text-right text-gray-400">-</td>
                    <td className="py-3 px-4 text-right text-gray-400">-</td>
                    <td className="py-3 px-4 text-right text-gray-400 font-bold">-</td>
                  </tr>

                  {/* Render list of rows */}
                  {scheduleRows
                    .slice(0, showAllSchedule ? scheduleRows.length : 12)
                    .map((row) => (
                      <tr key={row.period} className="hover:bg-gray-50/40">
                        <td className="py-3 px-4 text-center text-gray-500 font-bold">{row.period}</td>
                        <td className="py-3 px-4 text-gray-600">{formatCurrency(row.remainingPrincipal)}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(row.principalPaid)}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(row.interestPaid)}</td>
                        <td className="py-3 px-4 text-right font-bold text-gray-800">{formatCurrency(row.totalPaid)}</td>
                      </tr>
                    ))}
                  
                  {/* Totals row */}
                  <tr className="bg-blue-50/20 border-t-2 border-gray-200 text-label-2 text-gray-800 font-bold">
                    <td className="py-4 px-4 text-center">Tổng</td>
                    <td className="py-4 px-4">-</td>
                    <td className="py-4 px-4 text-right">{formatCurrency(totalPrincipal)}</td>
                    <td className="py-4 px-4 text-right text-green-600">{formatCurrency(totalInterest)}</td>
                    <td className="py-4 px-4 text-right text-vivid text-base">{formatCurrency(totalRepayment)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Amortization Collapse Button */}
            {loanTermMonths > 12 && (
              <div className="flex justify-center pt-2 print:hidden">
                <button
                  type="button"
                  onClick={() => setShowAllSchedule(!showAllSchedule)}
                  className="flex items-center gap-1 text-xs text-vivid font-bold hover:text-secondary bg-blue-50 hover:bg-blue-100/70 px-4 py-2 rounded-full cursor-pointer transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>
                    {showAllSchedule 
                      ? `Ẩn bớt lịch trả nợ (chỉ hiện 12 tháng đầu)` 
                      : `Xem chi tiết tất cả lịch trả nợ (${loanTermMonths} tháng)`}
                  </span>
                </button>
              </div>
            )}

            {/* Print Specific Footer Notes */}
            <div className="hidden print:block text-[10px] text-gray-400 mt-8 border-t pt-4">
              <p>* Bảng tính này chỉ mang tính chất tham khảo. Lãi suất thực tế sẽ được cập nhật cụ thể theo quy định của ngân hàng đối tác tại từng thời điểm.</p>
              <p>Mọi chi tiết xin vui lòng liên hệ Đồng Nai Ford - Hotline KD: 0918 90 90 60 để nhận báo giá chính xác nhất.</p>
            </div>
            
          </div>
        )}

      </div>
    </section>
  );
}
