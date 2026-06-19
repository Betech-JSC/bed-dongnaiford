"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useVehicle } from "../layout";
import BookingBanner from "@/components/services/BookingBanner";
import { Cpu, Sparkles, Info, Shield, Calendar, Calculator, ChevronLeft, ChevronRight } from "lucide-react";
import { VehicleTabBar } from "../layout";

interface FeatureItem {
  title: string;
  desc: string;
  image: string;
  category: string;
}

// ----------------------------------------------------------------------
// 1. Vehicle-Specific Premium Features Dataset
// ----------------------------------------------------------------------
const DEFAULT_FEATURES_BY_MODEL: Record<string, Record<string, Omit<FeatureItem, "image">[]>> = {
  everest: {
    performance: [
      {
        title: "Động cơ Diesel Bi-Turbo 2.0L mạnh mẽ",
        desc: "Động cơ diesel Bi-Turbo 2.0L trên các bản cao cấp cung cấp mô-men xoắn cực đại 500Nm và công suất 210 mã lực, kết hợp cùng hộp số tự động 10 cấp số êm ái, tối ưu hóa công suất vận hành và hiệu quả tiết kiệm nhiên liệu vượt trội.",
        category: "performance"
      },
      {
        title: "Hệ thống kiểm soát đường địa hình (TMS)",
        desc: "Lựa chọn chế độ lái dễ dàng qua nút xoay chuyển tiện lợi. Xe hỗ trợ lên tới 6 chế độ lái tùy chọn (Normal, Eco, Tow/Haul, Slippery, Mud/Ruts, Sand) giúp bạn tự tin vượt qua mọi loại địa hình phức tạp nhất.",
        category: "performance"
      }
    ],
    design: [
      {
        title: "Thiết kế ngoại thất bề thế chuẩn Mỹ",
        desc: "Cụm đèn pha LED hình chữ C đặc trưng kết hợp thanh lưới tản nhiệt mạ chrome to bản tạo nên diện mạo vững chãi, nam tính và vô cùng sang trọng của Everest thế hệ mới.",
        category: "design"
      },
      {
        title: "Cửa sổ trời toàn cảnh Panorama cao cấp",
        desc: "Không gian nội thất tràn ngập ánh sáng tự nhiên với thiết kế cửa sổ trời toàn cảnh mở rộng đến hàng ghế thứ hai, tạo cảm giác thoáng đạt và thời thượng vượt mong đợi.",
        category: "design"
      },
      {
        title: "Khoang cabin 7 chỗ rộng rãi & Sang trọng",
        desc: "Cả 3 hàng ghế bọc da cao cấp được bố trí thông minh. Hàng ghế thứ ba gập điện 50:50 bằng một nút bấm tiện lợi, tối ưu hóa không gian hành lý khi cần mang nhiều đồ đạc cồng kềnh.",
        category: "design"
      }
    ],
    tech: [
      {
        title: "Màn hình cảm ứng trung tâm 12 inch SYNC 4A",
        desc: "Màn hình giải trí cảm ứng cỡ lớn đặt dọc hiện đại hỗ trợ kết nối Apple CarPlay và Android Auto không dây, hiển thị đa thông tin cùng thao tác phản hồi mượt mà.",
        category: "tech"
      },
      {
        title: "Kết nối thông minh ứng dụng FordPass",
        desc: "Ứng dụng giúp bạn kiểm soát xe mọi lúc mọi nơi ngay trên điện thoại di động: khởi động xe để làm mát cabin trước khi lên xe, định vị xe, kiểm tra áp suất lốp và tình trạng sức khỏe xe.",
        category: "tech"
      }
    ],
    safety: [
      {
        title: "Hệ thống Hỗ trợ đỗ xe tự động 2.0",
        desc: "Đỗ xe chưa bao giờ dễ dàng đến thế. Chỉ cần giữ nút kích hoạt, xe sẽ tự điều khiển vô lăng, chuyển số, tăng ga và phanh để đưa xe vào chỗ đỗ song song hoặc vuông góc an toàn.",
        category: "safety"
      },
      {
        title: "Kiểm soát hành trình thích ứng (Adaptive Cruise Control)",
        desc: "Hệ thống tự động duy trì khoảng cách an toàn với xe phía trước, có khả năng bám đuôi Stop & Go và hỗ trợ giữ xe luôn di chuyển ở tâm làn đường.",
        category: "safety"
      },
      {
        title: "Hệ thống Camera 360 độ góc nhìn rộng",
        desc: "Cung cấp cái nhìn toàn cảnh xung quanh xe từ trên cao giúp bạn dễ dàng xoay xở trong không gian chật hẹp, tích hợp camera trước hiển thị mặt đường khi đi off-road.",
        category: "safety"
      }
    ]
  },
  ranger: {
    performance: [
      {
        title: "Khả năng kéo tải và off-road vô song",
        desc: "Động cơ 2.0L Bi-Turbo cùng hộp số tự động 10 cấp mang lại sức mạnh kéo tải lên đến 3.5 tấn. Hệ thống dẫn động 2 cầu chủ động giúp Ranger dễ dàng đương đầu với mọi cung đường hiểm trở.",
        category: "performance"
      },
      {
        title: "Khóa vi sai cầu sau điện tử",
        desc: "Giúp tối đa hóa lực kéo trên các địa hình trơn trượt, bùn lầy bằng cách khóa cứng hai bánh xe trục sau quay cùng tốc độ, hỗ trợ đắc lực khi xe vượt lầy.",
        category: "performance"
      }
    ],
    design: [
      {
        title: "Thiết kế hầm hố, đậm chất bán tải Mỹ",
        desc: "Thiết kế đầu xe nổi bật với cụm đèn LED chữ C độc bản và mặt ca-lăng cơ bắp. Khoảng cách hai trục bánh được mở rộng giúp tăng góc tiếp cận và góc thoát khi đi địa hình.",
        category: "design"
      },
      {
        title: "Thùng hàng đa năng & Tiện ích bệ bước chân",
        desc: "Thùng hàng lớn hơn tích hợp các điểm neo buộc đồ tiện lợi và ổ cắm nguồn điện 230V/400W. Bệ bước chân bên hông thùng xe giúp bạn bốc xếp hàng hóa lên xuống dễ dàng hơn bao giờ hết.",
        category: "design"
      }
    ],
    tech: [
      {
        title: "Hệ thống thông tin giải trí SYNC 4A",
        desc: "Màn hình cảm ứng 12 inch kết hợp bảng đồng hồ kỹ thuật số sắc nét mang lại trải nghiệm buồng lái thông minh vượt trội, tương thích Apple CarPlay & Android Auto không dây.",
        category: "tech"
      },
      {
        title: "Sạc không dây & Tiện nghi cao cấp",
        desc: "Trang bị khay sạc không dây hiện đại giúp cabin gọn gàng hơn, cùng hệ thống điều hòa tự động và các cổng sạc USB-A, USB-C được bố trí xung quanh cabin.",
        category: "tech"
      }
    ],
    safety: [
      {
        title: "Hệ thống hỗ trợ phanh tự động khẩn cấp (AEB)",
        desc: "Sử dụng camera và radar quét phía trước xe để phát hiện nguy cơ va chạm với phương tiện hoặc người đi bộ, tự động tác động lực phanh nếu người lái không kịp phản ứng.",
        category: "safety"
      },
      {
        title: "Hệ thống cảnh báo điểm mù tích hợp quét rơ-moóc",
        desc: "Công nghệ cảnh báo điểm mù thông minh BLIS giúp giám sát cả vùng mù của xe và rơ-moóc phía sau, đảm bảo an toàn tuyệt đối khi chuyển làn.",
        category: "safety"
      }
    ]
  },
  territory: {
    performance: [
      {
        title: "Động cơ Ecoboost 1.5L mạnh mẽ & Tiết kiệm",
        desc: "Công nghệ EcoBoost danh tiếng của Ford giúp sản sinh công suất 160 mã lực cùng mô-men xoắn 248Nm, kết hợp hộp số tự động 7 cấp ly hợp kép ướt êm ái, vận hành mượt mà và tiết kiệm.",
        category: "performance"
      },
      {
        title: "4 Chế độ lái tùy chọn linh hoạt",
        desc: "Bốn chế độ lái gồm Normal, Eco, Sport và Mountain giúp xe tối ưu hóa phản hồi chân ga, độ nhạy vô lăng để thích ứng hoàn hảo với từng điều kiện hành trình.",
        category: "performance"
      }
    ],
    design: [
      {
        title: "Ngôn ngữ thiết kế năng động và hiện đại",
        desc: "Lưới tản nhiệt bát giác mở rộng cùng cụm đèn LED Matrix tinh xảo tạo vẻ ngoài thời thượng, nổi bật và vô cùng phong cách giữa lòng đô thị sầm uất.",
        category: "design"
      },
      {
        title: "Khoang cabin rộng rãi hàng đầu phân khúc",
        desc: "Không gian ghế sau cực kỳ rộng rãi với sàn phẳng hoàn toàn, mang lại sự thoải mái tuyệt đối cho cả 5 người lớn cùng hành lý trong những chuyến đi xa.",
        category: "design"
      }
    ],
    tech: [
      {
        title: "Màn hình đôi kỹ thuật số 12.3 inch cực đại",
        desc: "Bảng đồng hồ kỹ thuật số liền mạch với màn hình giải trí trung tâm sắc nét, mang lại không gian công nghệ tương lai hiện đại và sang trọng bậc nhất.",
        category: "tech"
      },
      {
        title: "Cửa cốp mở rảnh tay thông minh",
        desc: "Chỉ cần đá nhẹ chân dưới cản sau, cốp xe sẽ tự động mở ra hoặc đóng lại vô cùng tiện lợi khi hai tay bạn đang bận xách đồ đạc.",
        category: "tech"
      }
    ],
    safety: [
      {
        title: "Hỗ trợ đỗ xe tự động thông minh",
        desc: "Hệ thống tự động tìm chỗ đỗ và đưa xe vào vị trí ghép song song hoặc vuông góc mà bạn không cần phải chạm tay vào vô-lăng hay đạp chân ga.",
        category: "safety"
      },
      {
        title: "Hệ thống kiểm soát hành trình thích ứng (ACC)",
        desc: "Hệ thống tự động bám đuôi xe phía trước và điều chỉnh tốc độ, kết hợp phanh tự động khẩn cấp giúp bạn thư thái và an toàn hơn trên đường cao tốc.",
        category: "safety"
      }
    ]
  },
  transit: {
    performance: [
      {
        title: "Động cơ Turbo Diesel 2.3L Duratorq bền bỉ",
        desc: "Động cơ diesel 2.3L thế hệ mới cung cấp sức kéo mạnh mẽ ở dải vòng tua thấp, kết hợp hộp số sàn 6 cấp vận hành êm ái, bền bỉ và tối ưu hóa chi phí nhiên liệu tối đa.",
        category: "performance"
      },
      {
        title: "Hệ thống treo được nâng cấp êm ái hơn",
        desc: "Sự kết hợp giữa treo trước độc lập MacPherson và treo sau lá nhíp giúp giảm chấn tối đa cho khoang cabin, đem lại sự dễ chịu nhất cho hành khách trên mọi cung đường.",
        category: "performance"
      }
    ],
    design: [
      {
        title: "Diện mạo mới chuyên nghiệp & Sang trọng",
        desc: "Thiết kế đầu xe mạnh mẽ với cụm đèn LED hiện đại và lưới tản nhiệt mới. Cửa trượt bên hông mở rộng tối đa giúp hành khách lên xuống xe dễ dàng và nhanh chóng.",
        category: "design"
      },
      {
        title: "Khoang hành khách 16 chỗ tối ưu tiện nghi",
        desc: "Ghế ngồi bọc nỉ cao cấp, thiết kế ôm sát cơ thể mang lại sự thoải mái. Hệ thống điều hòa độc lập với các cửa gió tại từng hàng ghế giúp làm mát nhanh toàn bộ cabin.",
        category: "design"
      }
    ],
    tech: [
      {
        title: "Màn hình giải trí đa chức năng 10 inch",
        desc: "Màn hình cảm ứng trung tâm hỗ trợ kết nối Bluetooth, đàm thoại rảnh tay và cổng USB giúp tài xế dễ dàng dẫn đường, quản lý hành trình và thư giãn khi lái xe.",
        category: "tech"
      },
      {
        title: "Cổng sạc USB tiện lợi tại mỗi hàng ghế",
        desc: "Các hàng ghế sau đều được trang bị cổng sạc USB tiện dụng, giúp hành khách luôn giữ kết nối cho các thiết bị di động trong suốt hành trình dài.",
        category: "tech"
      }
    ],
    safety: [
      {
        title: "Hệ thống cân bằng điện tử ESP thế hệ mới",
        desc: "Hệ thống ESP liên tục giám sát quỹ đạo di chuyển của xe và can thiệp phanh độc lập tại từng bánh xe để giữ xe thăng bằng, tránh lật bánh khi vào cua gấp.",
        category: "safety"
      },
      {
        title: "Hệ thống phanh ABS và EBD an toàn vượt trội",
        desc: "Chống khóa cứng bánh xe khi phanh gấp và phân bổ lực phanh tối ưu giữa bánh trước/sau tùy theo tải trọng thực tế, giúp tài xế kiểm soát tay lái tốt nhất.",
        category: "safety"
      }
    ]
  },
  generic: {
    performance: [
      {
        title: "Động cơ tăng áp vượt trội",
        desc: "Vận hành mạnh mẽ, tối ưu hóa công suất chân ga cùng hộp số thông minh giúp xe di chuyển êm ái, bền bỉ trên mọi loại địa hình phức tạp.",
        category: "performance"
      }
    ],
    design: [
      {
        title: "Kiểu dáng thể thao khỏe khoắn",
        desc: "Thiết kế mạnh mẽ chuẩn Mỹ với lưới tản nhiệt cỡ lớn, cụm đèn LED sắc sảo cùng những đường dập nổi cơ bắp chạy dọc thân xe.",
        category: "design"
      },
      {
        title: "Khoang lái hiện đại, cao cấp",
        desc: "Nội thất sử dụng vật liệu cao cấp, các chi tiết được hoàn thiện tinh xảo tạo cảm giác sang trọng và tiện nghi tối đa cho người sử dụng.",
        category: "design"
      }
    ],
    tech: [
      {
        title: "Hệ thống kết nối thông minh",
        desc: "Màn hình cảm ứng trung tâm cỡ lớn, tương thích Apple CarPlay và Android Auto giúp bạn kết nối dễ dàng không giới hạn.",
        category: "tech"
      }
    ],
    safety: [
      {
        title: "Công nghệ hỗ trợ lái thông minh",
        desc: "Trang bị các camera và cảm biến xung quanh xe giúp phát hiện chướng ngại vật, phanh khẩn cấp tự động và bảo vệ tối ưu.",
        category: "safety"
      }
    ]
  }
};

const resolveFileUrl = (file: any): string => {
  if (!file) return "";
  if (typeof file === "string") {
    if (file.startsWith("http://") || file.startsWith("https://") || file.startsWith("/")) {
      return file;
    }
    const cleanPath = file.startsWith("uploads/") ? file.replace("uploads/", "") : file;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    let apiHost = "http://localhost:8000";
    try {
      apiHost = new URL(apiBase).origin;
    } catch (e) { }
    return `${apiHost}/static/${cleanPath}`;
  }
  if (typeof file === "object") {
    if (file.url) return file.url;
    if (file.path) {
      const cleanPath = file.path.startsWith("uploads/") ? file.path.replace("uploads/", "") : file.path;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      let apiHost = "http://localhost:8000";
      try {
        apiHost = new URL(apiBase).origin;
      } catch (e) { }
      return `${apiHost}/static/${cleanPath}`;
    }
  }
  return "";
};

interface FeatureSectionSliderProps {
  sec: {
    id: string;
    label: string;
    subLabel: string;
    title: string;
    desc: string;
    features: FeatureItem[];
  };
  openDriveDrawer: () => void;
}

function FeatureSectionSlider({ sec, openDriveDrawer }: FeatureSectionSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [sec.features]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;

    e.preventDefault();
    const startX = e.pageX - el.offsetLeft;
    const scrollLeft = el.scrollLeft;
    let isDragging = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      isDragging = true;
      const x = moveEvent.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <section
      key={sec.id}
      id={sec.id}
      className="w-full py-16 border-b border-[#e5e5e5] bg-white transition-colors duration-300 relative group/slider"
    >
      <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
        
        {/* Section Header with "Bắt đầu mua xe" on the right */}
        <div className="flex flex-row justify-between items-center border-b border-gray-150 pb-4 mb-8">
          <h2 className="font-['Ford_Antenna',sans-serif] font-extrabold text-2xl md:text-3xl text-[#00095b] tracking-tight">
            {sec.label}
          </h2>
          <div className="flex items-center gap-3.5">
            {/* Scroll navigation arrows */}
            {sec.features.length > 5 && (
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  disabled={!showLeftArrow}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer bg-white shadow-xs
                    ${showLeftArrow 
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95" 
                      : "border-gray-200 text-gray-300 cursor-not-allowed opacity-50"}`}
                  aria-label="Previous features"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!showRightArrow}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer bg-white shadow-xs
                    ${showRightArrow 
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95" 
                      : "border-gray-200 text-gray-300 cursor-not-allowed opacity-50"}`}
                  aria-label="Next features"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => openDriveDrawer()}
              className="flex items-center gap-1 border border-[#0562d2]/70 hover:border-[#0562d2] text-[#0562d2] hover:bg-[#0562d2] hover:text-white bg-transparent font-bold px-4 py-1.5 rounded-full text-[10px] md:text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-xs"
            >
              <span>Bắt đầu mua xe</span>
            </button>
          </div>
        </div>

        {/* Slider Layout for Cards */}
        {sec.features.length > 0 ? (
          <div className="relative w-full">
            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none gap-6 cursor-grab active:cursor-grabbing pb-4"
            >
              {sec.features.map((feat) => (
                <div 
                  key={feat.title}
                  className="group flex flex-col items-start text-left bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-1.5 shrink-0 snap-start
                    w-[85vw] sm:w-[45vw] md:w-[calc((100%-48px)/3)] xl:w-[calc((100%-96px)/5)]"
                >
                  {/* Image container with scale effect on hover */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                    <img
                      src={feat.image}
                      alt={feat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  
                  {/* Text details */}
                  <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-sm md:text-[15px] text-[#1a1a1a] mt-4 mb-2 line-clamp-2 min-h-[40px] md:min-h-[44px]">
                    {feat.title}
                  </h3>
                  <p className="text-[#616161] text-xs md:text-[13px] leading-relaxed font-normal line-clamp-4 hover:line-clamp-none transition-all duration-300">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Hover Side Navigation Arrows for Desktop Overlay */}
            {sec.features.length > 5 && (
              <>
                <button
                  onClick={() => scroll("left")}
                  className={`absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 transition-all duration-300 cursor-pointer z-10 hover:bg-gray-50 active:scale-95 md:flex hidden
                    ${showLeftArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                  aria-label="Previous features scroll overlay"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className={`absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 transition-all duration-300 cursor-pointer z-10 hover:bg-gray-50 active:scale-95 md:flex hidden
                    ${showRightArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                  aria-label="Next features scroll overlay"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400 italic py-8">Chưa có tính năng nào trong mục này.</p>
        )}

      </div>
    </section>
  );
}

export default function VehicleFeaturesPage() {
  const {
    vehicle,
    openDriveDrawer,
    openQuoteDrawer
  } = useVehicle();


  // Get vehicle type identifier
  const vehicleKey = useMemo(() => {
    if (!vehicle || !vehicle.name) return "generic";
    const n = vehicle.name.toLowerCase();
    if (n.includes("everest")) return "everest";
    if (n.includes("ranger")) return "ranger";
    if (n.includes("territory")) return "territory";
    if (n.includes("transit")) return "transit";
    return "generic";
  }, [vehicle]);

  // 1. Parse raw features from CMS API
  const parsedCMSFeatures = useMemo<FeatureItem[]>(() => {
    if (!vehicle) return [];

    const rawFeatures: { title: string; desc: string; image: string; category?: any }[] = [];

    // Parse from FeaturesList block
    const listBlock = vehicle.layout_blocks?.find((b: any) => b.type === "FeaturesList");
    if (listBlock && listBlock.data?.features && listBlock.data.features.length > 0) {
      listBlock.data.features.forEach((f: any) => {
        rawFeatures.push({
          title: f.title || "",
          desc: f.description || f.desc || "",
          image: resolveFileUrl(f.image || vehicle.image_url || ""),
          category: f.category || undefined
        });
      });
    }

    // Parse from FeaturesGrid block if listBlock is empty
    const gridBlock = vehicle.layout_blocks?.find((b: any) => b.type === "FeaturesGrid");
    if (rawFeatures.length === 0 && gridBlock && gridBlock.data) {
      const d = gridBlock.data;
      if (d.title_1) rawFeatures.push({ title: d.title_1, desc: "Thiết kế hiện đại chuẩn Ford nâng tầm khí động học và phong cách cá nhân cá tính.", image: resolveFileUrl(d.image_1 || vehicle.images?.[0] || "") });
      if (d.title_2) rawFeatures.push({ title: d.title_2, desc: "Khoang cabin rộng rãi tối ưu, tiện nghi sang trọng và vật liệu da cao cấp.", image: resolveFileUrl(d.image_large || vehicle.images?.[1] || "") });
      if (d.split_title) rawFeatures.push({ title: d.split_title, desc: "Trang bị công nghệ hàng đầu, đồng bộ hóa kết nối thông minh SYNC 4A.", image: resolveFileUrl(d.split_image || vehicle.images?.[2] || "") });
    }

    // Dynamic Categorization based on keywords (matching performance, design, tech, safety)
    return rawFeatures.map((f) => {
      const text = (f.title + " " + f.desc).toLowerCase();
      let category = f.category || "Thiết kế";

      if (!f.category) {
        if (
          text.includes("động cơ") ||
          text.includes("vận hành") ||
          text.includes("hộp số") ||
          text.includes("ecoboost") ||
          text.includes("mã lực") ||
          text.includes("dẫn động") ||
          text.includes("4wd") ||
          text.includes("4x4") ||
          text.includes("treo") ||
          text.includes("cầu")
        ) {
          category = "Vận hành";
        } else if (
          text.includes("an toàn") ||
          text.includes("phanh") ||
          text.includes("túi khí") ||
          text.includes("cảnh báo") ||
          text.includes("kiểm soát") ||
          text.includes("bám đường") ||
          text.includes("hỗ trợ lái") ||
          text.includes("giữ làn") ||
          text.includes("va chạm") ||
          text.includes("điểm mù")
        ) {
          category = "An toàn";
        } else if (
          text.includes("công nghệ") ||
          text.includes("sync") ||
          text.includes("kết nối") ||
          text.includes("màn hình") ||
          text.includes("sạc không dây") ||
          text.includes("apple") ||
          text.includes("android") ||
          text.includes("usb") ||
          text.includes("bluetooth") ||
          text.includes("âm thanh")
        ) {
          category = "Công nghệ";
        }
      }

      return {
        ...f,
        category
      };
    });
  }, [vehicle]);

  // 2. Assemble sections (CMS + Fallbacks mapped to real images)
  const sections = useMemo(() => {
    const defaults = DEFAULT_FEATURES_BY_MODEL[vehicleKey] || DEFAULT_FEATURES_BY_MODEL.generic;

    const getFallbackImage = (cat: string, index: number) => {
      if (!vehicle?.images || vehicle.images.length === 0) return vehicle?.image_url || "";
      const imgs = vehicle.images;
      // Distribute images across categories with offsets to ensure variety
      if (cat === "performance" || cat === "Vận hành") return imgs[(index + 2) % imgs.length];
      if (cat === "design" || cat === "Thiết kế") return imgs[(index + 1) % imgs.length];
      if (cat === "tech" || cat === "Công nghệ") return imgs[(index + 4) % imgs.length];
      if (cat === "safety" || cat === "An toàn") return imgs[(index + 3) % imgs.length];
      return imgs[index % imgs.length];
    };

    const getCategoryKey = (catName: string): string => {
      const c = catName.trim().toLowerCase();
      if (c === "thiết kế" || c === "design") return "design";
      if (c === "vận hành" || c === "performance") return "performance";
      if (c === "công nghệ" || c === "tech") return "tech";
      if (c === "an toàn" || c === "safety") return "safety";
      return catName; // custom category name
    };

    // Load custom categories list from CMS, fallback to the default 4
    let cmsCategories: string[] = ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];
    const listBlock = vehicle.layout_blocks?.find((b: any) => b.type === "FeaturesList");
    if (listBlock && listBlock.data?.categories && Array.isArray(listBlock.data.categories)) {
      cmsCategories = listBlock.data.categories;
    }

    const standardMeta: Record<string, { subLabel: string; title: string; desc: string }> = {
      design: {
        subLabel: "THIẾT KẾ & TIỆN NGHI",
        title: "Diện Mạo Kiêu Hãnh & Không Gian Sang Trọng",
        desc: "Sự kết hợp hoàn hảo giữa kiểu dáng hầm hố, tinh tế bên ngoài cùng khoang cabin rộng rãi, tiện ích cao cấp bên trong."
      },
      performance: {
        subLabel: "HIỆU NĂNG & VẬN HÀNH",
        title: "Sức Mạnh Cơ Bắp & Khả Năng Vận Hành Ưu Việt",
        desc: "Khám phá thế hệ động cơ mạnh mẽ cùng hệ truyền động tiên tiến, giúp xe chinh phục mọi cung đường một cách êm ái và đầy hứng khởi."
      },
      tech: {
        subLabel: "CÔNG NGHỆ THÔNG MINH",
        title: "Kết Nối Không Giới Hạn & Trải Nghiệm Tiện Nghi",
        desc: "Những trang bị công nghệ đỉnh cao giúp tối ưu hóa sự kết nối giữa người lái và xe, mang lại hành trình thoải mái và thông minh hơn."
      },
      safety: {
        subLabel: "AN TOÀN VƯỢT TRỘI",
        title: "Hỗ Trợ Lái Thông Minh & Bảo Vệ Toàn Diện",
        desc: "Hệ thống hỗ trợ người lái tiên tiến Co-Pilot360 chủ động bảo vệ bạn và gia đình trước mọi tình huống giao thông phức tạp."
      }
    };

    const categoriesList = cmsCategories.map((catName) => {
      const key = getCategoryKey(catName);
      const isStandard = ["design", "performance", "tech", "safety"].includes(key);
      const meta = isStandard 
        ? standardMeta[key] 
        : {
            subLabel: `${catName.toUpperCase()} & TIỆN NGHI`,
            title: `Trang Bị ${catName} & Tiện Nghi Nổi Bật`,
            desc: `Khám phá các tính năng và trang bị nổi bật thuộc nhóm ${catName} của dòng xe.`
          };

      return {
        id: key,
        label: catName,
        ...meta
      };
    });

    const result: { id: string; label: string; subLabel: string; title: string; desc: string; features: FeatureItem[] }[] = [];

    categoriesList.forEach((cat) => {
      let catFeatures = parsedCMSFeatures.filter(
        (f) => getCategoryKey(f.category) === cat.id
      );

      const isStandard = ["design", "performance", "tech", "safety"].includes(cat.id);

      // If category features are empty and it is standard, use default mock data
      if (catFeatures.length === 0 && isStandard) {
        const defaultList = defaults[cat.id] || [];
        catFeatures = defaultList.map((df, idx) => ({
          ...df,
          image: getFallbackImage(cat.id, idx) || ""
        })) as FeatureItem[];
      }

      // For custom categories, only render if there are active features configured
      if (catFeatures.length > 0) {
        result.push({
          ...cat,
          features: catFeatures
        });
      }
    });

    return result;
  }, [vehicle, parsedCMSFeatures, vehicleKey]);



  if (!vehicle) return null;

  return (
    <div className="bg-[#ffffff] text-[#1a1a1a] font-sans pb-16 selection:bg-[#0562d2] selection:text-white">
      
      {/* 1. Hero Banner Section */}
      <section className="relative h-[400px] md:h-[480px] w-full overflow-hidden bg-slate-950 flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={vehicle.image_url}
            alt={vehicle.name}
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-10" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full relative z-10 text-white flex flex-col gap-5 items-start text-left">
          <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#0562d2] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-xs">
            Tính năng &amp; Công nghệ
          </span>
          <h1 className="font-['Ford_Antenna',sans-serif] font-bold text-3xl md:text-5xl lg:text-[52px] tracking-tight max-w-2xl leading-[1.15] text-white">
            Trang bị ưu việt cùng Ford {vehicle.name}
          </h1>
          <p className="text-xs md:text-[15px] text-gray-300 max-w-xl leading-relaxed">
            Sự kết hợp hoàn hảo giữa công nghệ lái thông minh vượt trội, khả năng vận hành off-road hầm hố chuẩn Mỹ và các giải pháp an toàn tối ưu bảo vệ cả gia đình.
          </p>
          <div className="flex flex-wrap gap-3.5 mt-2">
            <button
              onClick={() => openDriveDrawer()}
              className="flex items-center gap-2 bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] text-white font-bold px-6 py-3 rounded-full text-[11px] uppercase tracking-wider transition-all hover:scale-102 cursor-pointer shadow-lg shadow-blue-500/15 active:scale-98"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Đăng ký lái thử</span>
            </button>
            <button
              onClick={() => openQuoteDrawer(vehicle.id)}
              className="flex items-center gap-2 bg-transparent hover:bg-white/10 border border-white/60 text-white font-bold px-6 py-3 rounded-full text-[11px] uppercase tracking-wider transition-all hover:scale-102 cursor-pointer active:scale-98"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Dự toán chi phí</span>
            </button>
          </div>
        </div>
      </section>

      {/* Vehicle Secondary Navigation Tab Bar */}
      <VehicleTabBar />

      {/* 3. Feature Sections Content (Slider/Carousel) */}
      {sections.map((sec) => (
        <FeatureSectionSlider 
          key={sec.id} 
          sec={sec} 
          openDriveDrawer={openDriveDrawer} 
        />
      ))}
      
      {/* 4. Shared Booking Call To Action Banner */}
      <div className="mt-16">
        <BookingBanner />
      </div>
    </div>
  );
}
