export interface Specs {
  engine: string;          /* Động cơ */
  power: string;           /* Công suất cực đại */
  torque: string;          /* Mô-men xoắn cực đại */
  transmission: string;    /* Hộp số */
  drivetrain: string;      /* Hệ dẫn động */
  dimensions: string;      /* Kích thước (DxRxC) */
  clearance: string;       /* Khoảng sáng gầm xe */
  fuelEconomy: string;     /* Tiêu hao nhiên liệu (kết hợp) */
}

export interface ColorOption {
  name: string;
  hex: string;
  image: string;
}

export interface Version {
  id: string;
  name: string;
  price: number;
  specs: Specs;
}

export interface Vehicle {
  id: string;
  name: string;
  type: "suv" | "pickup" | "commercial";
  typeName: string;
  isBestSeller?: boolean;
  basePrice: number;
  tagline: string;
  description: string;
  images: string[];
  colors: ColorOption[];
  versions: Version[];
}

export const vehicles: Vehicle[] = [
  {
    id: "new-territory",
    name: "NEW TERRITORY",
    type: "suv",
    typeName: "SUV 5 Chỗ",
    isBestSeller: true,
    basePrice: 739000000,
    tagline: "Cơ hội vàng. Sẵn sàng rước xế.",
    description: "Diện mạo mới đầy cuốn hút, công nghệ ngập tràn và không gian cabin rộng rãi bậc nhất phân khúc. Ford Territory là lựa chọn hoàn hảo cho gia đình trẻ năng động.",
    images: [
      "/assets/territory-hero.png"
    ],
    colors: [
      { name: "Đỏ Hỏa Tinh", hex: "#c61918", image: "red" },
      { name: "Trắng Kim Cương", hex: "#e0e0e0", image: "white" },
      { name: "Xám Ánh Trăng", hex: "#9e9ea3", image: "gray" },
      { name: "Xanh Biển Sâu", hex: "#67859f", image: "blue" },
      { name: "Đen Tuyệt Đối", hex: "#000000", image: "black" }
    ],
    versions: [
      {
        id: "titanium-x",
        name: "Territory Titanium X 1.5L AT",
        price: 954000000,
        specs: {
          engine: "1.5L Ecoboost Xăng tăng áp",
          power: "160 Hp @ 5400-5700 rpm",
          torque: "248 Nm @ 1500-3000 rpm",
          transmission: "Tự động 7 cấp ly hợp kép ướt",
          drivetrain: "Cầu trước (FWD)",
          dimensions: "4.630 x 1.935 x 1.706 mm",
          clearance: "190 mm",
          fuelEconomy: "7.0 L/100km"
        }
      },
      {
        id: "titanium",
        name: "Territory Titanium 1.5L AT",
        price: 899000000,
        specs: {
          engine: "1.5L Ecoboost Xăng tăng áp",
          power: "160 Hp @ 5400-5700 rpm",
          torque: "248 Nm @ 1500-3000 rpm",
          transmission: "Tự động 7 cấp ly hợp kép ướt",
          drivetrain: "Cầu trước (FWD)",
          dimensions: "4.630 x 1.935 x 1.706 mm",
          clearance: "190 mm",
          fuelEconomy: "7.0 L/100km"
        }
      },
      {
        id: "trend",
        name: "Territory Trend 1.5L AT",
        price: 739000000,
        specs: {
          engine: "1.5L Ecoboost Xăng tăng áp",
          power: "160 Hp @ 5400-5700 rpm",
          torque: "248 Nm @ 1500-3000 rpm",
          transmission: "Tự động 7 cấp ly hợp kép ướt",
          drivetrain: "Cầu trước (FWD)",
          dimensions: "4.630 x 1.935 x 1.706 mm",
          clearance: "190 mm",
          fuelEconomy: "7.0 L/100km"
        }
      }
    ]
  },
  {
    id: "new-everest",
    name: "NEW EVEREST",
    type: "suv",
    typeName: "SUV 7 Chỗ",
    isBestSeller: true,
    basePrice: 1099000000,
    tagline: "Dấn bước. Dẫn đầu​.",
    description: "Được thiết kế để chinh phục mọi thử thách, Ford Everest thế hệ mới kết hợp khả năng vận hành mạnh mẽ ưu việt, nội thất sang trọng đỉnh cao và hệ thống an toàn thông minh bậc nhất.",
    images: [
      "/assets/car-everest.png"
    ],
    colors: [
      { name: "Đỏ Cam", hex: "#c2410c", image: "orange" },
      { name: "Xám Falcon", hex: "#4b5563", image: "gray" },
      { name: "Trắng Tuyết", hex: "#fafafa", image: "white" }
    ],
    versions: [
      {
        id: "everest-ambient",
        name: "Everest Ambient 2.0L Turbo 6AT",
        price: 1099000000,
        specs: {
          engine: "Single-Turbo Diesel 2.0L i4",
          power: "170 Hp @ 3500 rpm",
          torque: "405 Nm @ 1750-2500 rpm",
          transmission: "Tự động 6 cấp",
          drivetrain: "Một cầu sau (RWD)",
          dimensions: "4.914 x 1.923 x 1.842 mm",
          clearance: "200 mm",
          fuelEconomy: "7.5 L/100km"
        }
      }
    ]
  },
  {
    id: "new-mustang-mach-e",
    name: "NEW MUSTANG MACH-E",
    type: "suv",
    typeName: "SUV Điện Thể Thao",
    isBestSeller: false,
    basePrice: 1699000000,
    tagline: "Tương lai của hiệu năng và phong cách.",
    description: "Dòng SUV thuần điện đầu tiên lấy cảm hứng từ biểu tượng xe cơ bắp Mỹ Mustang. Khả năng tăng tốc vượt trội, phạm vi di chuyển ấn tượng và thiết kế khí động học tương lai.",
    images: [
      "/assets/car-mach-e.png"
    ],
    colors: [
      { name: "Xanh Lucid", hex: "#0b3c5d", image: "lucid-blue" },
      { name: "Đỏ Rapid", hex: "#b22222", image: "rapid-red" },
      { name: "Đen Shadow", hex: "#0a0a0a", image: "shadow-black" }
    ],
    versions: [
      {
        id: "mach-e-premium",
        name: "Mustang Mach-E Premium AWD",
        price: 1699000000,
        specs: {
          engine: "Động cơ điện Dual-Motor",
          power: "346 Hp / 258 kW",
          torque: "580 Nm",
          transmission: "Một cấp tự động",
          drivetrain: "Hai cầu toàn thời gian (AWD)",
          dimensions: "4.713 x 1.881 x 1.597 mm",
          clearance: "147 mm",
          fuelEconomy: "18.7 kWh/100km"
        }
      }
    ]
  },
  {
    id: "ranger-raptor-669",
    name: "Ranger Raptor",
    type: "pickup",
    typeName: "Bán Tải Địa Hình",
    isBestSeller: true,
    basePrice: 669000000,
    tagline: "Vua bán tải chinh phục mọi nẻo đường.",
    description: "Được phát triển để chinh phục những địa hình khắc nghiệt nhất. Ranger Raptor mang trong mình dòng máu hiệu năng cao đặc trưng cùng thiết kế hầm hố chuẩn Mỹ.",
    images: [
      "/assets/car-ranger.png"
    ],
    colors: [
      { name: "Cam Code Orange", hex: "#ea580c", image: "orange" },
      { name: "Xám Meteor", hex: "#4b5563", image: "gray" },
      { name: "Đen Tuyệt Đối", hex: "#000000", image: "black" }
    ],
    versions: [
      {
        id: "raptor-xls",
        name: "Ranger XLS 2.0L Single-Turbo 6AT",
        price: 669000000,
        specs: {
          engine: "Single-Turbo Diesel 2.0L i4",
          power: "170 Hp @ 3500 rpm",
          torque: "405 Nm @ 1750-2500 rpm",
          transmission: "Tự động 6 cấp",
          drivetrain: "Một cầu sau (4x2)",
          dimensions: "5.362 x 1.918 x 1.875 mm",
          clearance: "235 mm",
          fuelEconomy: "7.8 L/100km"
        }
      }
    ]
  },
  {
    id: "ford-transit-2024",
    name: "FORD TRANSIT 2024",
    type: "commercial",
    typeName: "Xe Thương Mại 16 Chỗ",
    isBestSeller: false,
    basePrice: 905000000,
    tagline: "Giải pháp vận chuyển hành khách chuyên nghiệp.",
    description: "Ford Transit Thế hệ Mới được thiết kế tối ưu với không gian rộng rãi hơn, tiện nghi vượt trội cùng độ bền bỉ cao, giúp tối đa hóa hiệu quả kinh doanh của doanh nghiệp.",
    images: [
      "/assets/car-transit.png"
    ],
    colors: [
      { name: "Bạc Tinh Thể", hex: "#cbd5e1", image: "silver" },
      { name: "Trắng Kim Cương", hex: "#ffffff", image: "white" }
    ],
    versions: [
      {
        id: "transit-trend",
        name: "Transit Trend 2.2L TDCi 6MT",
        price: 905000000,
        specs: {
          engine: "Turbo Diesel 2.2L TDCi",
          power: "135 Hp @ 3750 rpm",
          torque: "375 Nm @ 1500-2500 rpm",
          transmission: "Số sàn 6 cấp",
          drivetrain: "Cầu sau (RWD)",
          dimensions: "5.981 x 2.059 x 2.481 mm",
          clearance: "165 mm",
          fuelEconomy: "8.5 L/100km"
        }
      }
    ]
  },
  {
    id: "new-raptor",
    name: "NEW RAPTOR",
    type: "pickup",
    typeName: "Bán Tải Hiệu Năng Cao",
    isBestSeller: true,
    basePrice: 1299000000,
    tagline: "Độc bản hiệu năng. Chiến binh sa mạc.",
    description: "Được phát triển bởi bộ phận Ford Performance, NEW Ranger Raptor 2026 sở hữu động cơ Bi-Turbo cực đại kết hợp hệ thống treo FOX đỉnh cao.",
    images: [
      "/assets/car-ranger.png"
    ],
    colors: [
      { name: "Cam Code Orange", hex: "#ea580c", image: "orange" },
      { name: "Xám Meteor", hex: "#374151", image: "gray" },
      { name: "Đen Bóng", hex: "#000000", image: "black" }
    ],
    versions: [
      {
        id: "new-raptor-biturbo",
        name: "Ranger Raptor 2.0L Bi-Turbo 10AT",
        price: 1299000000,
        specs: {
          engine: "Bi-Turbo Diesel 2.0L i4 Ford Performance",
          power: "210 Hp @ 3750 rpm",
          torque: "500 Nm @ 1750-2000 rpm",
          transmission: "Tự động 10 cấp điện tử",
          drivetrain: "Hai cầu chủ động bán thời gian thông minh",
          dimensions: "5.381 x 2.028 x 1.922 mm",
          clearance: "272 mm",
          fuelEconomy: "8.9 L/100km"
        }
      }
    ]
  }
];

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find(v => v.id === id);
}

export function getVehiclesByType(type: "suv" | "pickup" | "commercial"): Vehicle[] {
  return vehicles.filter(v => v.type === type);
}
