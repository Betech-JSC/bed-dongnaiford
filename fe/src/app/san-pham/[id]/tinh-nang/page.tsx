"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useVehicle } from "../layout";
import BookingBanner from "@/components/services/BookingBanner";
import { Cpu, Sparkles, Info, Shield, Calendar, Calculator, ChevronRight } from "lucide-react";
import { VehicleTabBar } from "../layout";

interface FeatureItem {
  title: string;
  desc: string;
  image: string;
  category: "performance" | "design" | "tech" | "safety";
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

export default function VehicleFeaturesPage() {
  const {
    vehicle,
    openDriveDrawer,
    openQuoteDrawer
  } = useVehicle();

  const [activeSection, setActiveSection] = useState<string>("performance");

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

    const rawFeatures: { title: string; desc: string; image: string }[] = [];

    // Parse from FeaturesList block
    const listBlock = vehicle.layout_blocks?.find((b: any) => b.type === "FeaturesList");
    if (listBlock && listBlock.data?.features && listBlock.data.features.length > 0) {
      listBlock.data.features.forEach((f: any) => {
        rawFeatures.push({
          title: f.title || "",
          desc: f.description || f.desc || "",
          image: resolveFileUrl(f.image || vehicle.image_url || "")
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
      let category: "performance" | "design" | "tech" | "safety" = "design";

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
        category = "performance";
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
        category = "safety";
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
        category = "tech";
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
      if (cat === "performance") return imgs[(index + 2) % imgs.length];
      if (cat === "design") return imgs[(index + 1) % imgs.length];
      if (cat === "tech") return imgs[(index + 4) % imgs.length];
      if (cat === "safety") return imgs[(index + 3) % imgs.length];
      return imgs[index % imgs.length];
    };

    const categoriesList = [
      {
        id: "performance" as const,
        label: "Vận hành",
        subLabel: "HIỆU NĂNG & VẬN HÀNH",
        title: "Sức Mạnh Cơ Bắp & Khả Năng Vận Hành Ưu Việt",
        desc: "Khám phá thế hệ động cơ mạnh mẽ cùng hệ truyền động tiên tiến, giúp xe chinh phục mọi cung đường một cách êm ái và đầy hứng khởi."
      },
      {
        id: "design" as const,
        label: "Thiết kế",
        subLabel: "THIẾT KẾ & TIỆN NGHI",
        title: "Diện Mạo Kiêu Hãnh & Không Gian Sang Trọng",
        desc: "Sự kết hợp hoàn hảo giữa kiểu dáng hầm hố, tinh tế bên ngoài cùng khoang cabin rộng rãi, tiện ích cao cấp bên trong."
      },
      {
        id: "tech" as const,
        label: "Công nghệ",
        subLabel: "CÔNG NGHỆ THÔNG MINH",
        title: "Kết Nối Không Giới Hạn & Trải Nghiệm Tiện Nghi",
        desc: "Những trang bị công nghệ đỉnh cao giúp tối ưu hóa sự kết nối giữa người lái và xe, mang lại hành trình thoải mái và thông minh hơn."
      },
      {
        id: "safety" as const,
        label: "An toàn",
        subLabel: "AN TOÀN VƯỢT TRỘI",
        title: "Hỗ Trợ Lái Thông Minh & Bảo Vệ Toàn Diện",
        desc: "Hệ thống hỗ trợ người lái tiên tiến Co-Pilot360 chủ động bảo vệ bạn và gia đình trước mọi tình huống giao thông phức tạp."
      }
    ];

    return categoriesList.map((cat) => {
      let catFeatures = parsedCMSFeatures.filter((f) => f.category === cat.id);

      // If category features are empty, use default mock data and map real images
      if (catFeatures.length === 0) {
        const defaultList = defaults[cat.id] || [];
        catFeatures = defaultList.map((df, idx) => ({
          ...df,
          image: getFallbackImage(cat.id, idx) || ""
        })) as FeatureItem[];
      }

      return {
        ...cat,
        features: catFeatures
      };
    });
  }, [vehicle, parsedCMSFeatures, vehicleKey]);

  // 3. Smooth scroll handling
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = window.innerWidth >= 1024 ? 220 : 180;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // 4. Scroll Spy: Track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.innerWidth >= 1024 ? 230 : 190;
      const scrollPos = window.scrollY + offset;
      const sectionIds = ["performance", "design", "tech", "safety"];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* 2. Sticky Category sub-navigation bar */}
      <section className="sticky top-[128px] lg:top-[160px] z-20 bg-white border-b border-[#e5e5e5] shadow-xs select-none py-1">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
          <div className="flex items-center justify-start md:justify-center overflow-x-auto scrollbar-none gap-[24px] md:gap-[40px] py-1">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`relative py-3 px-1 text-xs md:text-sm font-extrabold cursor-pointer transition-colors border-0 bg-transparent shrink-0 active:scale-98 text-left uppercase tracking-widest
                    ${isActive ? "text-[#0562d2]" : "text-[#616161] hover:text-[#0562d2]"}`}
                >
                  <span>{sec.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0562d2] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Alternating Feature Sections Content */}
      {sections.map((sec, idx) => {
        const isOdd = idx % 2 === 1;
        return (
          <section
            key={sec.id}
            id={sec.id}
            className={`w-full py-16 md:py-24 border-b border-[#e5e5e5] transition-colors duration-300 ${
              isOdd ? "bg-[#fafafa]" : "bg-white"
            }`}
          >
            <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
              
              {/* Section Header */}
              <div className="max-w-3xl mb-16 md:mb-20 text-left">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#0562d2] bg-[#0562d2]/10 px-3 py-1 rounded-full mb-3 inline-block">
                  {sec.subLabel}
                </span>
                <h2 className="font-['Ford_Antenna',sans-serif] font-extrabold text-2xl md:text-[36px] text-[#00095b] leading-tight tracking-tight mb-3">
                  {sec.title}
                </h2>
                <p className="text-gray-500 text-xs md:text-[15px] leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-20 md:space-y-28">
                {sec.features.map((feat, fidx) => {
                  const isEven = fidx % 2 === 0;
                  return (
                    <div
                      key={feat.title}
                      className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-between ${
                        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                      }`}
                    >
                      {/* Image panel */}
                      <div className="flex-1 w-full aspect-[16/10] relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-md group">
                        <img
                          src={feat.image}
                          alt={feat.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                          loading="lazy"
                        />
                        {/* Glass overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/5 pointer-events-none" />
                      </div>

                      {/* Content panel */}
                      <div className="flex-1 w-full flex flex-col items-start gap-4 text-left lg:px-4">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0562d2] bg-white border border-blue-100 px-3 py-1 rounded-full shadow-2xs">
                          {sec.label}
                        </span>
                        <h3 className="font-['Ford_Antenna',sans-serif] font-bold text-xl md:text-2xl lg:text-[28px] text-[#1a1a1a] leading-snug tracking-tight">
                          {feat.title}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-[15px] leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>
        );
      })}

      {/* 4. Shared Booking Call To Action Banner */}
      <div className="mt-16">
        <BookingBanner />
      </div>
    </div>
  );
}
