"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Mail, Phone, Menu, X, Search, ChevronDown, ChevronRight } from "lucide-react";
import { vehicles } from "@/data/vehicles";

type DropdownItem = {
  name: string;
  href: string;
};

type NavLink = {
  name: string;
  href: string;
  dropdownItems?: DropdownItem[];
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  const [isProductHovered, setIsProductHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<"suv" | "commercial">("suv");
  const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<"suv" | "commercial" | null>(null);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsProductHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsProductHovered(false);
    }, 150);
  };

  const handleMouseLeaveImmediate = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsProductHovered(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price) + "đ";
  };

  const getCarData = (id: string) => {
    const vehicle = vehicles.find((v) => v.id === id);
    if (!vehicle) {
      return {
        price: "Đang cập nhật",
        image: "",
      };
    }
    return {
      price: formatPrice(vehicle.basePrice),
      image: vehicle.images[0] || "",
    };
  };

  const productCategories = {
    suv: {
      id: "suv",
      name: "Xe SUV",
      bannerTitle: "Khám phá các dòng xe SUV của Ford",
      bannerDesc: "Mạnh mẽ, thông minh, sẵn sàng cho mọi hành trình gia đình",
      bannerBg: "bg-gradient-to-r from-[#00095B] via-[#02337A] to-[#0562D2]",
      cars: [
        { id: "new-territory", displayName: "TERRITORY" },
        { id: "new-everest", displayName: "FORD EVEREST" },
        { id: "new-mustang-mach-e", displayName: "FORD MUSTANG MACH-E" },
      ],
    },
    commercial: {
      id: "commercial",
      name: "Xe thương mại",
      bannerTitle: "Khám phá các dòng xe thương mại của Ford",
      bannerDesc: "Bền bỉ, hiệu quả, tối ưu hóa lợi ích kinh doanh",
      bannerBg: "bg-gradient-to-r from-[#1A1A1A] via-[#2D2D2D] to-[#404040]",
      cars: [
        { id: "ranger-raptor-669", displayName: "NEW RANGER" },
        { id: "ford-transit-2024", displayName: "FORD TRANSIT" },
        { id: "new-raptor", displayName: "FORD RAPTOR" },
      ],
    },
  };

  const navLinks: NavLink[] = [
    {
      name: "Giới thiệu",
      href: "/about",
      dropdownItems: [
        { name: "Câu chuyện Ford Đồng Nai", href: "/about#our-story" },
        { name: "Ban giám đốc & Nhân sự", href: "/about#board-of-directors" },
        { name: "Cơ sở vật chất & Showroom", href: "/about#facilities" },
      ],
    },
    {
      name: "Sản phẩm",
      href: "/#showroom",
      dropdownItems: [
        { name: "Ford Everest Thế hệ mới", href: "/#showroom" },
        { name: "Ford Explorer Đẳng cấp", href: "/#showroom" },
        { name: "Ford Territory Hiện đại", href: "/#showroom" },
        { name: "Ford Ranger Vua bán tải", href: "/#showroom" },
        { name: "Ford Transit Thương mại", href: "/#showroom" },
        { name: "Phụ kiện chính hãng", href: "/accessories" },
      ],
    },
    {
      name: "Dịch vụ",
      href: "/services/customer-care",
      dropdownItems: [
        { name: "Chăm sóc khách hàng", href: "/services/customer-care" },
        { name: "Bảo dưỡng nhanh 60 phút", href: "/services/express-maintenance" },
        { name: "Bảo dưỡng định kỳ", href: "/services/periodic-maintenance" },
        { name: "Nhận & Giao xe tận nơi", href: "/services/pickup-delivery" },
      ],
    },
    {
      name: "Bài viết",
      href: "/news",
      dropdownItems: [
        { name: "Tin tức & Ưu đãi", href: "/news" },
        { name: "Thư viện Media", href: "/media" },
      ],
    },
    {
      name: "Công cụ",
      href: "/tools/installment",
      dropdownItems: [
        { name: "Ước tính trả góp", href: "/tools/installment" },
      ],
    },
    { name: "Liên hệ", href: "/contact" },
  ];

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["our-story", "showroom", "services", "news", "media", "consultation"];
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [pathname]);

  return (
    <header className="w-full z-50 bg-white border-b border-gray-200 sticky top-0">
      {/* Top Header Utility Bar */}
      <div className="hidden lg:block bg-black text-white text-xs py-2">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[128px] flex justify-between items-center font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-white/90">
              <MapPin className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
              Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Đồng Nai
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-white/90">
              <Mail className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
              marketing@dongnaiford.com.vn
            </span>
            <span className="text-white/30">|</span>
            <button 
              onClick={() => { window.location.href = "tel:0918909060"; }}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 font-medium text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
              0918 90 90 60
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-[1440px] mx-auto px-4 xl:px-[128px] h-[72px] flex items-center">
        <div className="flex justify-between items-center w-full h-full">
          
          {/* Logo with Oval styling inspired by Ford */}
          <Link href="/" className="flex items-center gap-[5.2px] group">
            <div className="h-[32px] w-[85.3px] relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/ford_logo.svg" 
                alt="Ford Oval Logo" 
                className="block size-full object-contain"
              />
            </div>
            <span className="font-['Ford_Antenna',sans-serif] font-bold text-[#00095b] text-[13px] tracking-tight leading-none uppercase">
              DONG NAI FORD
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-stretch gap-8 h-full">
            {navLinks.map((link) => {
              const sectionId = link.href.includes("#") ? link.href.split("#")[1] : "";
              const isActive = pathname === "/contact"
                ? link.href === "/contact"
                : pathname === "/" && sectionId && activeSection === sectionId;
              
              const hasDropdown = !!link.dropdownItems;

              if (link.name === "Sản phẩm") {
                return (
                  <div
                    key={link.name}
                    className="relative flex items-stretch h-full"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={link.href}
                      onClick={handleMouseLeaveImmediate}
                      className={`relative px-1 h-full flex items-center text-[16px] font-['Ford_Antenna',sans-serif] font-medium tracking-wide transition-colors duration-200 hover:text-[#0562d2] flex items-center gap-1 cursor-pointer
                        after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#0562d2] after:transition-all after:duration-300
                        ${isProductHovered || isActive ? "text-[#0562d2] after:w-full" : "text-[#333333] after:w-0 hover:after:w-full"}`}
                    >
                      {link.name}
                      <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${isProductHovered ? "rotate-180 text-[#0562d2] opacity-100" : ""}`} />
                    </Link>
                  </div>
                );
              }

              if (hasDropdown) {
                return (
                  <div 
                    key={link.name} 
                    className="relative group flex items-stretch h-full" 
                    onMouseEnter={handleMouseLeaveImmediate}
                  >
                    <Link
                      href={link.href}
                      className={`relative px-1 h-full flex items-center text-[16px] font-['Ford_Antenna',sans-serif] font-medium tracking-wide transition-colors duration-200 group-hover:text-[#0562d2] flex items-center gap-1 cursor-pointer
                        after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#0562d2] after:transition-all after:duration-300
                        ${isActive ? "text-[#0562d2] after:w-full" : "text-[#333333] after:w-0 group-hover:after:w-full"}`}
                    >
                      {link.name}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-[#0562d2] group-hover:rotate-180 transition-transform duration-300" />
                    </Link>

                    {/* Hover Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-[0px_4px_4px_rgba(16,24,40,0.1),0px_2px_2px_rgba(16,24,40,0.06)] py-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] rounded-b-[12px] rounded-t-none">
                      {link.dropdownItems?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-5 py-3 text-sm font-['Ford_Antenna',sans-serif] font-medium text-[#333333] hover:bg-[#f0f0f0] hover:text-gray-900 transition-colors first:rounded-t-none last:rounded-b-[12px]"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={handleMouseLeaveImmediate}
                  className={`relative px-1 h-full flex items-center text-[16px] font-['Ford_Antenna',sans-serif] font-medium tracking-wide transition-colors duration-200 hover:text-[#0562d2] flex items-center gap-1 cursor-pointer
                    after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#0562d2] after:transition-all after:duration-300
                    ${isActive ? "text-[#0562d2] after:w-full" : "text-[#333333] after:w-0 hover:after:w-full"}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Search Icon & Call to Action */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-[#333333] hover:text-[#0562d2] transition-colors cursor-pointer" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/contact?reason=Đăng ký lái thử"
              className="btn-ford-primary text-xs py-1.5 px-3 uppercase tracking-wider font-bold"
            >
              Lái Thử
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-primary hover:text-accent transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Products Mega Menu Dropdown */}
      <div 
        className={`absolute top-full left-0 w-full bg-white border-t border-b border-gray-200 shadow-xl transition-all duration-300 z-50 overflow-hidden
          ${isProductHovered ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[128px] py-8 grid grid-cols-4 gap-8">
          {/* Left Category Sidebar */}
          <div className="col-span-1 border-r border-gray-100 pr-6 flex flex-col gap-3">
            <button
              onClick={() => setActiveTab("suv")}
              onMouseEnter={() => setActiveTab("suv")}
              className={`flex items-center justify-between px-4 py-3 rounded-lg font-['Ford_Antenna',sans-serif] font-bold text-sm tracking-wider uppercase transition-all duration-200 text-left cursor-pointer
                ${activeTab === "suv" 
                  ? "text-[#0562D2] bg-blue-50/50 border-l-4 border-[#0562D2] pl-3" 
                  : "text-[#333333] hover:text-[#0562D2] hover:bg-gray-50 border-l-4 border-transparent"}`}
            >
              <span>Xe SUV</span>
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeTab === "suv" ? "translate-x-1" : ""}`} />
            </button>
            <button
              onClick={() => setActiveTab("commercial")}
              onMouseEnter={() => setActiveTab("commercial")}
              className={`flex items-center justify-between px-4 py-3 rounded-lg font-['Ford_Antenna',sans-serif] font-bold text-sm tracking-wider uppercase transition-all duration-200 text-left cursor-pointer
                ${activeTab === "commercial" 
                  ? "text-[#0562D2] bg-blue-50/50 border-l-4 border-[#0562D2] pl-3" 
                  : "text-[#333333] hover:text-[#0562D2] hover:bg-gray-50 border-l-4 border-transparent"}`}
            >
              <span>Xe thương mại</span>
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeTab === "commercial" ? "translate-x-1" : ""}`} />
            </button>
            <div className="h-px bg-gray-100 my-1" />
            <Link
              href="/accessories"
              onClick={handleMouseLeaveImmediate}
              className="flex items-center justify-between px-4 py-3 rounded-lg font-['Ford_Antenna',sans-serif] font-bold text-sm tracking-wider uppercase transition-all duration-200 text-left text-[#333333] hover:text-[#0562D2] hover:bg-gray-50 border-l-4 border-transparent cursor-pointer"
            >
              <span>Phụ kiện chính hãng</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Product Showcase Panel */}
          <div className="col-span-3 flex flex-col gap-6">
            {/* Banner Card */}
            <div className={`p-6 rounded-xl text-white flex justify-between items-center ${productCategories[activeTab].bannerBg}`}>
              <div className="space-y-1">
                <h4 className="font-['Ford_Antenna',sans-serif] font-bold text-lg">
                  {productCategories[activeTab].bannerTitle}
                </h4>
                <p className="text-xs text-white/80 font-medium">
                  {productCategories[activeTab].bannerDesc}
                </p>
              </div>
              <Link
                href="/contact?reason=Báo giá"
                onClick={handleMouseLeaveImmediate}
                className="bg-white text-gray-900 hover:bg-gray-100 transition-colors px-5 py-2.5 rounded-full text-xs font-bold font-['Ford_Antenna',sans-serif] flex items-center gap-1.5 shrink-0"
              >
                <span>Chọn xe & Báo giá</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-3 gap-6">
              {productCategories[activeTab].cars.map((car) => {
                const carData = getCarData(car.id);
                return (
                  <Link
                    key={car.id}
                    href={`/products/${car.id}`}
                    onClick={handleMouseLeaveImmediate}
                    className="group border border-gray-100 hover:border-blue-200 rounded-xl p-4 flex flex-col items-center bg-gray-50/30 hover:bg-white hover:shadow-lg transition-all duration-300 text-center"
                  >
                    {/* Vehicle Image Container */}
                    <div className="w-full h-32 relative mb-3 overflow-hidden">
                      {carData.image ? (
                        <Image
                          src={carData.image}
                          alt={car.displayName}
                          fill
                          sizes="(max-width: 1024px) 30vw, 20vw"
                          className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg text-xs text-gray-400">
                          Hình ảnh đang cập nhật
                        </div>
                      )}
                    </div>
                    {/* Vehicle Title */}
                    <h5 className="font-['Ford_Antenna',sans-serif] font-bold text-sm text-gray-900 group-hover:text-[#0562D2] transition-colors mb-1">
                      {car.displayName}
                    </h5>
                    {/* Vehicle Starting Price */}
                    <p className="text-xs text-gray-500 font-medium">
                      Giá khởi điểm: <span className="text-[#0562D2] font-bold">{carData.price}</span>
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-inner">
          {navLinks.map((link) => {
            if (link.name === "Sản phẩm") {
              return (
                <div key={link.name} className="space-y-1">
                  <button
                    onClick={() => setIsMobileProductOpen(!isMobileProductOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-base font-bold text-[#333333] hover:bg-gray-50 rounded-sm text-left"
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isMobileProductOpen ? "rotate-180 text-[#0562D2]" : ""}`} />
                  </button>
                  
                  {isMobileProductOpen && (
                    <div className="pl-4 border-l border-gray-100 flex flex-col gap-2 py-1">
                      {/* SUV Category */}
                      <div className="space-y-1">
                        <button
                          onClick={() => setMobileActiveTab(mobileActiveTab === "suv" ? null : "suv")}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-semibold text-gray-700 hover:text-[#0562D2] hover:bg-gray-50 rounded text-left"
                        >
                          <span>Xe SUV</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${mobileActiveTab === "suv" ? "rotate-180 text-[#0562D2]" : ""}`} />
                        </button>
                        {mobileActiveTab === "suv" && (
                          <div className="pl-4 flex flex-col gap-1 py-1">
                            {productCategories.suv.cars.map((car) => (
                              <Link
                                key={car.id}
                                href={`/products/${car.id}`}
                                onClick={() => {
                                  setIsOpen(false);
                                  setIsMobileProductOpen(false);
                                }}
                                className="block px-2 py-1.5 text-xs font-medium text-gray-550 hover:text-[#0562D2] hover:bg-gray-50 rounded"
                              >
                                {car.displayName}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Commercial Category */}
                      <div className="space-y-1">
                        <button
                          onClick={() => setMobileActiveTab(mobileActiveTab === "commercial" ? null : "commercial")}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-semibold text-gray-700 hover:text-[#0562D2] hover:bg-gray-50 rounded text-left cursor-pointer"
                        >
                          <span>Xe thương mại</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${mobileActiveTab === "commercial" ? "rotate-180 text-[#0562D2]" : ""}`} />
                        </button>
                        {mobileActiveTab === "commercial" && (
                          <div className="pl-4 flex flex-col gap-1 py-1">
                            {productCategories.commercial.cars.map((car) => (
                              <Link
                                key={car.id}
                                href={`/products/${car.id}`}
                                onClick={() => {
                                  setIsOpen(false);
                                  setIsMobileProductOpen(false);
                                }}
                                className="block px-2 py-1.5 text-xs font-medium text-gray-550 hover:text-[#0562D2] hover:bg-gray-50 rounded"
                              >
                                {car.displayName}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="h-px bg-gray-100 my-1" />
                      
                      {/* Accessories Link */}
                      <Link
                        href="/accessories"
                        onClick={() => {
                          setIsOpen(false);
                          setIsMobileProductOpen(false);
                        }}
                        className="block px-2 py-1.5 text-sm font-semibold text-gray-700 hover:text-[#0562D2] hover:bg-gray-50 rounded text-left cursor-pointer"
                      >
                        Phụ kiện chính hãng
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={link.name} className="space-y-1">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-bold text-[#333333] hover:bg-gray-50 rounded-sm"
                >
                  {link.name}
                </Link>
                {link.dropdownItems && (
                  <div className="pl-6 border-l border-gray-100 flex flex-col gap-1.5 py-1">
                    {link.dropdownItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-gray-550 hover:text-[#0562d2] py-1 block"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2.5">
            <div className="text-xs text-gray-550 px-3 space-y-1.5 font-medium">
              <p className="flex items-start gap-1.5">📍 <span className="leading-tight text-[#424242]">Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Đồng Nai</span></p>
              <p className="text-[#424242]">📞 Hotline: 0918 90 90 60</p>
              <p className="text-[#424242]">✉️ Email: marketing@dongnaiford.com.vn</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
