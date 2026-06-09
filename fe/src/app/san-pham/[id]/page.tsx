"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { contactsAPI, vehiclesAPI } from "@/lib/api";
import { 
  ArrowLeft, 
  Check, 
  ChevronDown,
  Plus,
  Minus,
  RotateCcw,
  X
} from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { vehicleMediaAssets } from "@/data/vehicle-media";
import BookingBanner from "@/components/services/BookingBanner";
import Blocks from "@/components/blocks/Blocks";

type ActiveTab = "overview" | "360" | "versions" | "features" | "compare" | "accessories";

const localFaqs = [
  {
    q: "Điều gì tạo nên sự nổi bật thương hiệu Dongnaiford",
    a: "Showroom được đầu tư khá quy mô về trang thiết bị hiện đại, cơ sở hạ tầng khang trang, rộng rãi, đội ngũ kỹ thuật viên đông đảo, tay nghề cao, nhiệt tình, nhiều năm kinh nghiệm, được đào tạo chuyên nghiệp."
  },
  {
    q: "Sự sáng tạo trong thiết kế sản phẩm",
    a: "Sản phẩm Ford luôn tiên phong về ngôn ngữ thiết kế thông minh, tối ưu khí động học và khoang lái hiện đại vượt trội."
  },
  {
    q: "Chất lượng dịch vụ khách hàng xuất sắc",
    a: "Đồng Nai Ford cam kết mang đến dịch vụ bảo dưỡng nhanh chóng, tư vấn tâm huyết và giao xe tận nhà cho khách hàng."
  },
  {
    q: "Cam kết bảo vệ môi trường",
    a: "Các dòng xe Ford thế hệ mới tối ưu lượng phát thải, tiết kiệm nhiên liệu và hướng tới tương lai điện hóa thông minh."
  },
  {
    q: "Chiến lược marketing hiệu quả",
    a: "Chúng tôi luôn mang đến các chương trình ưu đãi, sự kiện lái thử tại nhà và báo giá minh bạch, cạnh tranh nhất thị trường."
  },
  {
    q: "Đội ngũ nhân viên chuyên nghiệp và tận tâm",
    a: "Đội ngũ kỹ thuật viên và tư vấn bán hàng được đào tạo bài bản theo tiêu chuẩn toàn cầu của Ford Motor."
  }
];

const initThreeInterior = (container: HTMLDivElement, imageSrc: string) => {
  const THREE = (window as any).THREE;
  if (!THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1100);
  camera.target = new THREE.Vector3(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(imageSrc, () => {
    renderer.render(scene, camera);
  });

  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let controls: any = null;
  if (THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = -0.25;
    controls.enableZoom = false;
  }

  camera.position.set(0, 0, 0.1);

  let animationFrameId: number;
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    if (controls) {
      controls.update();
    }
    renderer.render(scene, camera);
  };
  animate();

  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Find the static fallback vehicle based on ID
  const staticVehicle = vehicles.find((v) => v.id === id);

  const [apiVehicle, setApiVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const res: any = await vehiclesAPI.getBySlug(id).catch(() => null);
        if (res && res.data) {
          setApiVehicle(res.data);
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Dynamically map API vehicle structure to frontend mock structure to keep all bindings intact
  const vehicle = apiVehicle 
    ? {
        ...apiVehicle,
        id: apiVehicle.slug,
        name: apiVehicle.title,
        typeName: apiVehicle.type_name || apiVehicle.typeName || (
          apiVehicle.type === 'suv' 
            ? (apiVehicle.title?.toLowerCase().includes('everest') ? 'SUV 7 Chỗ' : apiVehicle.title?.toLowerCase().includes('territory') ? 'SUV 5 Chỗ' : 'SUV')
            : apiVehicle.type === 'pickup' 
              ? 'Bán tải' 
              : (apiVehicle.title?.toLowerCase().includes('transit') ? 'Xe Thương Mại 16 Chỗ' : apiVehicle.title?.toLowerCase().includes('tourneo') ? 'Thương Mại 7 Chỗ' : 'Thương mại')
        ),
        basePrice: typeof apiVehicle.base_price === 'string' ? parseFloat(apiVehicle.base_price) : apiVehicle.base_price,
        colors: apiVehicle.colors ? apiVehicle.colors.map((c: any) => ({ name: c.name, hex: c.hex, image: c.image_path || c.image })) : [],
        images: (apiVehicle.images && apiVehicle.images.length > 0) ? apiVehicle.images : [apiVehicle.image_url].filter(Boolean),
        versions: apiVehicle.versions ? apiVehicle.versions.map((v: any) => ({
          id: v.id,
          name: v.name,
          price: typeof v.price === 'string' ? parseFloat(v.price) : v.price,
          specs: {
            engine: v.specs?.engine || '',
            power: v.specs?.power || '',
            torque: v.specs?.torque || '',
            transmission: v.specs?.transmission || '',
            drivetrain: v.specs?.drivetrain || '',
            dimensions: v.specs?.dimensions || '',
            clearance: v.specs?.clearance || '',
            fuelEconomy: v.specs?.fuelEconomy || v.specs?.fuel_guide || v.specs?.fuel_economy || '',
          }
        })) : [],
        layout_blocks: apiVehicle.layout_blocks || []
      }
    : staticVehicle;

  const media = vehicle ? (vehicleMediaAssets[vehicle.id] || vehicleMediaAssets["new-territory"]) : vehicleMediaAssets["new-territory"];

  // Scroll references for programmatic scrolling
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // States
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [viewType, setViewType] = useState<"exterior" | "interior">("exterior");
  const isImageSequence = viewType === "exterior" || (vehicle?.id === "mustang-fastback" && viewType === "interior");
  
  // 360 Interactive Viewer States
  const [is360Active, setIs360Active] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // in degrees
  const [tilt, setTilt] = useState(0); // in degrees
  const [pan, setPan] = useState({ x: 0, y: 0 }); // offset in px

  // Three.js Dynamic CDN Loader
  const [threeLoaded, setThreeLoaded] = useState(false);
  const threeRef = useRef<HTMLDivElement>(null);

  // 360 Colorizer State variables
  const [selectedWheel, setSelectedWheel] = useState("64f");
  const [isTrimDropdownOpen, setIsTrimDropdownOpen] = useState(false);
  const [isMobileColorOpen, setIsMobileColorOpen] = useState(false);
  const [isMobileInteriorColorOpen, setIsMobileInteriorColorOpen] = useState(false);
  const [isMobileWheelOpen, setIsMobileWheelOpen] = useState(false);
  const [selectedInteriorColorIndex, setSelectedInteriorColorIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const [isEditMode, setIsEditMode] = useState(false);
  const [originalBlocks, setOriginalBlocks] = useState<any[]>([]);
  const [currentBlocks, setCurrentBlocks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Initialize blocks when vehicle loads
  useEffect(() => {
    if (vehicle) {
      const hasBlocks = vehicle.layout_blocks && vehicle.layout_blocks.length > 0;
      if (hasBlocks) {
        setCurrentBlocks(vehicle.layout_blocks);
        setOriginalBlocks(JSON.parse(JSON.stringify(vehicle.layout_blocks)));
      } else {
        const colorListStr = vehicle.colors?.map((c: any) => c.name).join(", ");
        const firstVersionSpecs = vehicle.versions?.[0]?.specs;

        // Prepare default template blocks so that if edit mode is toggled, it starts with a beautiful full-page template
        const defaultBlocks = [
          {
            type: "HeroBanner",
            data: {
              title: vehicle.name,
              tagline: vehicle.tagline || "Cơ hội vàng. Sẵn sàng rước xế.",
              button_text: "Book Lái thử",
              button_link: "#drive",
              background_image: vehicle.images?.[0] || vehicle.image_url || "/assets/territory-hero.png"
            }
          },
          {
            type: "Promotions",
            data: {
              title: media?.promoTitle || `Ưu Đãi Đặc Biệt Cho Xe ${vehicle.name}`,
              description: media?.promoDesc || `Nhận ngay ưu đãi giá bán tốt nhất, quà tặng đặc quyền và hỗ trợ trả góp ưu đãi khi mua xe ${vehicle.name} tại Đồng Nai Ford.`,
              image: media?.promoImage || vehicle.images?.[1] || vehicle.images?.[0] || "/assets/img-gradient-2.png",
              button_text: "Báo giá"
            }
          },
          {
            type: "ThreeSixtyViewer",
            data: {
              title: vehicle.id === "mustang-fastback" ? "360° Colorizer & Viewer" : `Khám phá ${vehicle.name} đa chiều`,
              description: vehicle.id === "mustang-fastback" 
                ? "Tùy biến ngoại thất và nội thất theo phong cách riêng của bạn. Kéo để xoay 360 độ hoặc chọn màu sơn và mâm xe."
                : `Diện mạo mới đầy cuốn hút! Trải nghiệm góc nhìn xoay 360 độ và tùy chọn màu sắc ngoại thất yêu thích của dòng xe ${vehicle.name}.`
            }
          },
          {
            type: "FeaturesGrid",
            data: {
              title_1: "Thiết kế ấn tượng, khẳng định vị thế",
              image_1: media?.grid1 || vehicle.images?.[2] || vehicle.images?.[0] || "/assets/territory-hero.png",
              image_2: media?.grid2 || vehicle.images?.[3] || vehicle.images?.[1] || "/assets/territory-tech-split.png",
              image_3: media?.grid3 || vehicle.images?.[4] || vehicle.images?.[2] || "/assets/territory-promo.png",
              title_2: "Không gian nội thất sang trọng & tiện nghi",
              image_large: media?.bannerLarge || vehicle.images?.[5] || vehicle.images?.[1] || "/assets/territory-interior.png",
              title_3: "Trang bị công nghệ thông minh vượt trội",
              split_image: media?.splitLeft || vehicle.images?.[6] || vehicle.images?.[0] || "/assets/territory-tech-split.png",
              split_title: media?.splitTitle || "Tiện nghi kết nối",
              split_features: media?.features ? media.features.map((f: string) => {
                const parts = f.split(" ");
                return {
                  value: parts[0] || "",
                  label: parts.slice(1).join(" ") || ""
                };
              }) : [
                { value: firstVersionSpecs?.engine || "Động cơ", label: "Hiệu năng mạnh mẽ" },
                { value: firstVersionSpecs?.transmission || "Hộp số", label: "Vận hành êm ái" }
              ]
            }
          },
          {
            type: "VersionsGrid",
            data: {
              title: `Các mẫu xe Ford ${vehicle.name.replace("NEW ", "")}`,
              descriptions: vehicle.versions ? vehicle.versions.map((ver: any, idx: number) => {
                if (vehicle.id === "new-territory" || vehicle.id === "territory") {
                  if (idx === 0) return "Ford Territory Titanium X 2026 xe SUV 5 chỗ cao cấp của Ford gây ấn tượng mạnh với thiết kế đặc biệt sắc sảo và công nghệ tối tân. Khám phá và đăng ký lái thử ngay!";
                  if (idx === 1) return "Ford Territory Titanium 2026 vượt trội cùng nhiều nét độc đáo về thiết kế, công nghệ. Một lựa chọn xe SUV 5 chỗ lý tưởng. Khám phá chi tiết và đăng ký lái thử ngay!";
                  return "Ford Territory Trend 2026 với những cải tiến rõ rệt. Khám phá thông số kỹ thuật, phụ kiện, so sánh với các phiên bản khác và đăng ký lái thử.";
                }
                return `Phiên bản Ford ${vehicle.name} ${ver.name} sở hữu động cơ ${ver.specs?.engine || 'mạnh mẽ'}, trang bị hộp số ${ver.specs?.transmission || 'tiên tiến'}, mang lại trải nghiệm lái xuất sắc.`;
              }) : []
            }
          },
          {
            type: "SpecsGrid",
            data: {}
          },
          {
            type: "AccordionFAQs",
            data: {
              faqs: [
                {
                  q: `Xe ${vehicle.name} có những màu ngoại thất nào?`,
                  a: `Dòng xe ${vehicle.name} hiện đang phân phối tại Đồng Nai Ford với các lựa chọn màu sắc ngoại thất: ${colorListStr || 'Đỏ Hỏa Tinh, Xanh Biển Sâu, Xám Ánh Trăng, Trắng Kim Cương, Đen Ngọc Trai'}.`
                },
                {
                  q: `Chính sách bảo hành của xe ${vehicle.name} như thế nào?`,
                  a: `Xe ${vehicle.name} chính hãng mua tại Đồng Nai Ford được bảo hành 3 năm hoặc 100.000 km tùy điều kiện nào đến trước, cùng chính sách bảo dưỡng tiêu chuẩn của Ford Việt Nam.`
                },
                {
                  q: `Đồng Nai Ford có hỗ trợ mua xe ${vehicle.name} trả góp không?`,
                  a: `Có, chúng tôi hỗ trợ vay trả góp lên đến 80% giá trị xe ${vehicle.name} với lãi suất cạnh tranh, thủ tục hồ sơ đơn giản và giải ngân nhanh chóng.`
                }
              ]
            }
          }
        ];
        setCurrentBlocks(defaultBlocks);
        setOriginalBlocks(JSON.parse(JSON.stringify(defaultBlocks)));
      }
    }
  }, [apiVehicle, id]);

  // Check if ?edit=true in URL to auto-enable edit mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("edit") === "true") {
        setIsEditMode(true);
      }
    }
  }, []);

  const handleBlockChange = (index: number, updatedData: any) => {
    const updated = [...currentBlocks];
    updated[index] = { ...updated[index], data: updatedData };
    setCurrentBlocks(updated);
  };

  const handleBlockMove = (index: number, direction: 'up' | 'down') => {
    const updated = [...currentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    
    // Swap blocks
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setCurrentBlocks(updated);
  };

  const handleBlockDelete = (index: number) => {
    const updated = currentBlocks.filter((_, i) => i !== index);
    setCurrentBlocks(updated);
  };

  const handleAddBlock = (type: string) => {
    let defaultData: any = {};
    if (type === "HeroBanner") {
      defaultData = {
        title: vehicle.name,
        tagline: "Khám phá phong cách mới",
        button_text: "Đăng ký lái thử",
        button_link: "#drive",
        background_image: vehicle.images?.[0] || "/assets/territory-hero.png"
      };
    } else if (type === "Promotions") {
      defaultData = {
        title: "Chương Trình Khuyến Mãi",
        description: "Nhập mô tả chi tiết chương trình ưu đãi đặc biệt tại đây.",
        image: "/assets/img-gradient-2.png",
        button_text: "Báo giá"
      };
    } else if (type === "ThreeSixtyViewer") {
      defaultData = {
        title: vehicle.id === "mustang-fastback" ? "360° Colorizer & Viewer" : "Khám phá không gian đa chiều",
        description: "Diện mạo mới đầy cuốn hút! Trải nghiệm góc nhìn đa chiều."
      };
    } else if (type === "FeaturesGrid") {
      defaultData = {
        title_1: "Thiết kế hiện đại, sắc sảo, đầy cuốn hút",
        image_1: "/assets/territory-hero.png",
        image_2: "/assets/territory-tech-split.png",
        image_3: "/assets/territory-promo.png",
        title_2: "Không gian nội thất rộng rãi, tiện nghi",
        image_large: "/assets/territory-interior.png",
        title_3: "Nâng tầm công nghệ và tiện nghi Tận hưởng trên mọi hành trình",
        split_image: "/assets/territory-tech-split.png",
        split_title: "Tiện nghi thông minh",
        split_features: [
          { value: "12-inch", label: "Màn hình cảm ứng trung tâm" },
          { value: "7", label: "Chế độ lái tùy chọn" }
        ]
      };
    } else if (type === "VersionsGrid") {
      defaultData = {
        title: `Các mẫu xe Ford ${vehicle.name.replace("NEW ", "")}`,
        descriptions: [
          `Ford Territory Titanium X 2026 xe SUV 5 chỗ cao cấp của Ford gây ấn tượng mạnh với thiết kế đặc biệt sắc sảo và công nghệ tối tân. Khám phá và đăng ký lái thử ngay!`,
          `Ford Territory Titanium 2026 vượt trội cùng nhiều nét độc đáo về thiết kế, công nghệ. Một lựa chọn xe SUV 5 chỗ lý tưởng. Khám phá chi tiết và đăng ký lái thử ngay!`,
          `Ford Territory Trend 2026 với những cải tiến rõ rệt. Khám phá thông số kỹ thuật, phụ kiện, so sánh với các phiên bản khác và đăng ký lái thử.`
        ]
      };
    } else if (type === "SpecsGrid") {
      defaultData = {};
    } else if (type === "FeaturesList") {
      defaultData = {
        features: [
          {
            title: "THIẾT KẾ ĐỘC ĐÁO",
            description: "Phong cách thiết kế mạnh mẽ và tinh tế.",
            image: "/assets/territory-tech-split.png"
          },
          {
            title: "CÔNG NGHỆ TIÊN TIẾN",
            description: "Hệ thống hỗ trợ lái thông minh Ford Co-Pilot360.",
            image: "/assets/territory-promo.png"
          }
        ]
      };
    } else if (type === "AccordionFAQs") {
      defaultData = {
        faqs: [
          {
            q: "Chính sách bảo hành xe mới như thế nào?",
            a: "Bảo hành 3 năm hoặc 100.000 km tùy điều kiện nào đến trước."
          }
        ]
      };
    } else if (type === "BookingBanner") {
      defaultData = {
        title: "Kết nối ngay với chuyên viên Đồng Nai Ford",
        phone: "1800 55 68 58",
        btn_text: "Đặt lịch hẹn",
        btn_link: "/lien-he?reason=Đặt hẹn dịch vụ",
        car_image: vehicle.image_url || "/assets/booking-car.png"
      };
    }

    const newBlock = {
      type,
      data: defaultData
    };
    setCurrentBlocks([...currentBlocks, newBlock]);
  };

  const handleSaveLayout = async () => {
    setSaving(true);
    try {
      const res = await vehiclesAPI.updateLayout(id, currentBlocks);
      if (res) {
        alert("Lưu giao diện thành công!");
        setOriginalBlocks(JSON.parse(JSON.stringify(currentBlocks)));
        setIsEditMode(false);
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.delete("edit");
          window.history.replaceState({}, "", url.toString());
        }
      }
    } catch (err) {
      alert("Lỗi khi lưu giao diện: " + JSON.stringify(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setCurrentBlocks(JSON.parse(JSON.stringify(originalBlocks)));
    setIsEditMode(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("edit");
      window.history.replaceState({}, "", url.toString());
    }
  };

  useEffect(() => {
    if (!is360Active || viewType !== "interior" || threeLoaded) return;
    let isMounted = true;

    const loadThreeScripts = async () => {
      try {
        if (!(window as any).THREE) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        if (!(window as any).THREE.OrbitControls) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        if (isMounted) {
          setThreeLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load Three.js scripts from CDN", err);
      }
    };

    loadThreeScripts();
    return () => {
      isMounted = false;
    };
  }, [is360Active, viewType, threeLoaded]);

  useEffect(() => {
    if (!threeLoaded || !is360Active || viewType !== "interior" || !threeRef.current) return;
    const interiorImg = vehicle?.id === "new-territory" 
      ? "/assets/territory-interior.png" 
      : media.bannerLarge || "/assets/territory-interior.png";

    const cleanUpThree = initThreeInterior(threeRef.current, interiorImg);
    return () => {
      if (cleanUpThree) cleanUpThree();
    };
  }, [threeLoaded, is360Active, viewType, vehicle, media]);

  const renderCarPicture = () => {
    if (!vehicle) return null;
    // 28 frames rotation logic
    const frameIdx = Math.floor(((rotation % 360 + 360) % 360) / (360 / 28)) + 1;
    
    if (vehicle.id === "mustang-fastback") {
      const activeTrim = vehicle.versions[activeVersionIndex]?.id || "ecoboostfastback";
      const colorId = vehicle.colors[selectedColorIndex]?.image || "adriatic-blue-green";
      const wheelId = selectedWheel || "64f";
      
      return (
        <div className="cmp-360-image-container w-full h-full relative" id={`${activeTrim}-exterior-${colorId}-${wheelId}`} tabIndex={0}>
          {Array.from({ length: 28 }, (_, i) => {
            const currentIdx = i + 1;
            const isActive = currentIdx === frameIdx;
            
            let desktopUrl = `https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/mustang/2026/360/${activeTrim}/exterior/desktop/${colorId}/${wheelId}/00${currentIdx}-${colorId}-${wheelId}.jpeg`;
            let tabletUrl = `https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/mustang/2026/360/${activeTrim}/exterior/tablet/${colorId}/${wheelId}/00${currentIdx}-${colorId}-${wheelId}.jpeg`;
            let mobileUrl = `https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/mustang/2026/360/${activeTrim}/exterior/mobile/${colorId}/${wheelId}/00${currentIdx}-${colorId}-${wheelId}.jpeg`;
            
            // Map to downloaded local files for the EcoBoost Adriatic Blue combination
            if (activeTrim === "ecoboostfastback" && colorId === "adriatic-blue-green" && wheelId === "64f") {
              const localPath = `/images/360/mustang/${activeTrim}/exterior/desktop/${colorId}/${wheelId}/00${currentIdx}-${colorId}-${wheelId}.jpeg`;
              if (!failedImages[localPath]) {
                desktopUrl = localPath;
                tabletUrl = localPath;
                mobileUrl = localPath;
              }
            }
            
            return (
              <picture 
                key={currentIdx}
                id={`${activeTrim}-exterior-${colorId}-${wheelId}~${currentIdx}`} 
                className="cmp-360-image absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ 
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  zIndex: isActive ? 10 : 0
                }}
              >
                <source media="(min-width: 1024px)" srcSet={desktopUrl} />
                <source media="(min-width: 768px)" srcSet={tabletUrl} />
                <source media="(max-width: 767px)" srcSet={mobileUrl} />
                <img 
                  src={desktopUrl} 
                  alt={`${colorId}-${wheelId}`} 
                  className="max-h-[420px] md:max-h-[480px] w-auto object-contain select-none pointer-events-none"
                  loading="eager"
                  onError={() => {
                    const localPath = `/images/360/mustang/${activeTrim}/exterior/desktop/${colorId}/${wheelId}/00${currentIdx}-${colorId}-${wheelId}.jpeg`;
                    setFailedImages((prev) => ({ ...prev, [localPath]: true }));
                  }}
                />
              </picture>
            );
          })}
        </div>
      );
    }
    
    // Fallback for other vehicles
    return (
      <div 
        className="relative w-[700px] h-[400px] transition-transform duration-100 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${rotation}deg) rotateX(${tilt}deg) scale(0.95)`,
        }}
      >
        <Image 
          src={vehicle.id === "new-territory" ? "/assets/territory-3d.png" : vehicle.images[0]}
          alt="3D Exterior rotation fallback"
          fill
          priority
          className="object-contain pointer-events-none"
        />
        
        {/* Glossy Metallic highlight reflection sweep */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 rounded-xl"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
            transform: `translateX(${(rotation % 360) * 2 - 360}px)`,
            width: '100%',
          }}
        />
      </div>
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    if (isImageSequence) {
      setRotation((prev) => (prev + deltaX * 0.5) % 360);
      if (viewType === "exterior") {
        setTilt((prev) => Math.max(-10, Math.min(10, prev - deltaY * 0.2)));
      }
    } else {
      setPan((prev) => ({
        x: Math.max(-300, Math.min(300, prev.x + deltaX)),
        y: Math.max(-150, Math.min(150, prev.y + deltaY)),
      }));
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    if (isImageSequence) {
      setRotation((prev) => (prev + deltaX * 0.5) % 360);
      if (viewType === "exterior") {
        setTilt((prev) => Math.max(-10, Math.min(10, prev - deltaY * 0.2)));
      }
    } else {
      setPan((prev) => ({
        x: Math.max(-300, Math.min(300, prev.x + deltaX)),
        y: Math.max(-150, Math.min(150, prev.y + deltaY)),
      }));
    }
  };

  useEffect(() => {
    setRotation(0);
    setTilt(0);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, [viewType]);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "Đồng Nai",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Reset validation state when opening modals
  useEffect(() => {
    if (showDriveModal || showQuoteModal) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setErrorMessage("");
      setIsSubmitted(false);
    }
  }, [showDriveModal, showQuoteModal]);

  // Calculator states
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicle?.id || "");
  const [selectedVersionId, setSelectedVersionId] = useState(vehicle?.versions?.[0]?.id || "");
  const [selectedProvince, setSelectedProvince] = useState("Đồng Nai");
  const [drawerStep, setDrawerStep] = useState<"calculate" | "contact">("calculate");

  // Keep calculator states synced if active version changes on the page
  useEffect(() => {
    if (vehicle && vehicle.versions[activeVersionIndex]) {
      const vId = vehicle.id;
      const verId = vehicle.versions[activeVersionIndex].id;
      const timer = setTimeout(() => {
        setSelectedVehicleId(vId);
        setSelectedVersionId(verId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [vehicle, activeVersionIndex]);

  const openQuoteDrawer = (vehicleId?: string, versionId?: string) => {
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
      const veh = vehicles.find(v => v.id === vehicleId);
      if (veh) {
        if (versionId && veh.versions.some(v => v.id === versionId)) {
          setSelectedVersionId(versionId);
        } else if (veh.versions.length > 0) {
          setSelectedVersionId(veh.versions[0].id);
        }
      }
    } else {
      if (vehicle) {
        setSelectedVehicleId(vehicle.id);
        const activeVer = vehicle.versions[activeVersionIndex] || vehicle.versions[0];
        if (activeVer) {
          setSelectedVersionId(activeVer.id);
        }
      }
    }
    setDrawerStep("calculate");
    setShowQuoteModal(true);
  };

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const veh = vehicles.find((v) => v.id === vehicleId);
    if (veh && veh.versions.length > 0) {
      setSelectedVersionId(veh.versions[0].id);
    }
  };

  const getRollingCostDetails = () => {
    const selVeh = vehicles.find((v) => v.id === selectedVehicleId) || vehicle;
    if (!selVeh) {
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

    const selVer = selVeh.versions?.find((ver: any) => ver.id === selectedVersionId) || selVeh.versions?.[0];
    if (!selVer) {
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

    const basePrice = selVer.price;
    const registrationTaxRate = selVeh.type === "pickup" ? 0.06 : 0.10;
    const registrationTax = basePrice * registrationTaxRate;
    const plateFee = selectedProvince === "TP. Hồ Chí Minh" ? 20000000 : 1000000;
    const registryFee = 340000;
    const roadFee = 1560000;
    const isSevenSeats = 
      selVeh.id?.includes("everest") || 
      selVeh.id?.includes("transit") || 
      selVeh.id?.includes("tourneo") || 
      selVeh.typeName?.includes("7 Chỗ") || 
      selVeh.typeName?.includes("16 Chỗ");
    const insuranceFee = isSevenSeats ? 873400 : 480700;
    const total = basePrice + registrationTax + plateFee + registryFee + roadFee + insuranceFee;

    return {
      basePrice,
      registrationTax,
      plateFee,
      registryFee,
      roadFee,
      insuranceFee,
      total,
    };
  };

  const rollingCost = getRollingCostDetails();

  // Handle body scroll locking
  useEffect(() => {
    if (showQuoteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showQuoteModal]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Scroll Spy Observer to update active tab when scrolling
  useEffect(() => {
    const handleScrollSpy = () => {
      if (isProgrammaticScroll.current) return;

      const isDesktop = window.innerWidth >= 1024;
      const threshold = isDesktop ? 170 : 138;

      const targetIds = [
        { id: "overview", tab: "overview" },
        { id: "360-viewer", tab: "360" },
        { id: "versions-section", tab: "versions" },
        { id: "features-section", tab: "features" },
        { id: "compare-section", tab: "compare" }
      ];

      // Filter to elements that exist in the DOM
      const elements = targetIds
        .map(t => ({ tab: t.tab, element: document.getElementById(t.id) }))
        .filter(t => t.element !== null) as { tab: string; element: HTMLElement }[];

      // Sort elements by their vertical offset top in the DOM
      elements.sort((a, b) => a.element.offsetTop - b.element.offsetTop);

      let activeSectionTab: ActiveTab = "overview";

      for (let i = 0; i < elements.length; i++) {
        const rect = elements[i].element.getBoundingClientRect();
        if (rect.top <= threshold) {
          activeSectionTab = elements[i].tab as ActiveTab;
        }
      }

      setActiveTab((prev) => {
        if (prev === activeSectionTab) return prev;
        return activeSectionTab;
      });
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0562d2] mb-4" />
        <p className="text-gray-500 font-medium font-['Ford_Antenna',sans-serif]">Đang tải thông tin xe...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-600 mb-6">Mẫu xe bạn đang tìm kiếm không tồn tại hoặc đã được thay đổi đường dẫn.</p>
        <button 
          onClick={() => router.push("/")}
          className="bg-[#0562d2] hover:bg-[#044ea7] text-white px-6 py-2.5 rounded-full font-semibold transition-colors cursor-pointer"
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  const selectedColor = vehicle.colors[selectedColorIndex] || vehicle.colors[0];
  const activeVersion = vehicle.versions[activeVersionIndex] || vehicle.versions[0] || null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const compareItems = vehicle.versions.length > 1
    ? vehicle.versions.map((ver: any, idx: number) => ({
        id: ver.id,
        name: ver.name,
        price: ver.price,
        image: idx === 0 
          ? "/assets/territory-hero.png" 
          : idx === 1 
            ? "/assets/territory-tech-split.png" 
            : "/assets/territory-promo.png", 
        specs: ver.specs,
        isExternal: false
      }))
    : vehicles.slice(0, 3).map((v) => ({
        id: v.id,
        name: v.versions[0].name,
        price: v.basePrice,
        image: v.id === "new-territory" ? "/assets/territory-hero.png" : v.images[0],
        specs: v.versions[0].specs,
        isExternal: true
      }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let productTitle = "";
      let productId = "";
      let productSlug = "";
      let note = "";

      if (showDriveModal) {
        productId = vehicle.id;
        productSlug = vehicle.id;
        productTitle = `${vehicle.name} - ${activeVersion?.name || ""}`;
        note = formData.note || `Đăng ký lái thử xe ${vehicle.name} - ${activeVersion?.name || ""}`;
      } else if (showQuoteModal) {
        const selVeh = vehicles.find((v: any) => v.id === selectedVehicleId) || vehicle;
        const selVer = selVeh.versions.find((v: any) => v.id === selectedVersionId) || selVeh.versions[0];
        productId = selVeh.id;
        productSlug = selVeh.id;
        productTitle = `${selVeh.name} - ${selVer?.name}`;
        note = formData.note || `Yêu cầu báo giá lăn bánh xe ${selVeh.name} - ${selVer?.name} tại ${selectedProvince}. Tổng dự toán: ${formatPrice(rollingCost.total)}`;
      }

      const response = await contactsAPI.submit({
        contact: {
          type: "ADVISE_FORM",
          data: {
            Name: formData.fullName,
            Phone: formData.phone,
            Email: formData.email || undefined,
            Province: formData.province,
            Product: {
              id: productId,
              slug: productSlug,
              title: productTitle
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
          setShowQuoteModal(false);
          setShowDriveModal(false);
          setFormData({ fullName: "", phone: "", email: "", province: "Đồng Nai", note: "" });
        }, 2000);
      }
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error("Vehicle advise submit error:", error);
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

  const handleTabClick = (tab: ActiveTab) => {
    if (tab === "accessories") {
      // Navigate to accessories page pre-filtering by vehicle name
      router.push(`/accessories?vehicle=${encodeURIComponent(vehicle.name)}`);
      return;
    }

    setActiveTab(tab);
    isProgrammaticScroll.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const elementId = tab === "overview" ? "overview"
                   : tab === "360" ? "360-viewer"
                   : tab === "versions" ? "versions-section"
                   : tab === "features" ? "features-section"
                   : "compare-section";

    // Wait for React to toggle section visibility in case we switch from/to compare view
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const isDesktop = window.innerWidth >= 1024; // lg breakpoint
        const yOffset = isDesktop ? -160 : -128; // -104px (header) - 56px (tabs) = -160px; -72px (header) - 56px (tabs) = -128px
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });

        // Reset programmatic scroll flag after smooth scroll finishes (approx 800ms)
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 800);
      } else {
        isProgrammaticScroll.current = false;
      }
    }, 50);
  };


  // Version card gradients specific to Territory
  const versionGradients = [
    "/assets/img-gradient-1.png",
    "/assets/img-gradient-2.png",
    "/assets/img-gradient-3.png"
  ];

  const threeSixtyPropsObj = {
    selectedColorIndex, setSelectedColorIndex,
    activeVersionIndex, setActiveVersionIndex,
    viewType, setViewType,
    is360Active, setIs360Active,
    rotation, setRotation,
    tilt, setTilt,
    pan, setPan,
    isDragging, setIsDragging,
    threeLoaded, setThreeLoaded,
    threeRef,
    isTrimDropdownOpen, setIsTrimDropdownOpen,
    isMobileColorOpen, setIsMobileColorOpen,
    isMobileInteriorColorOpen, setIsMobileInteriorColorOpen,
    isMobileWheelOpen, setIsMobileWheelOpen,
    selectedInteriorColorIndex, setSelectedInteriorColorIndex,
    failedImages, setFailedImages,
    selectedWheel, setSelectedWheel,
    renderCarPicture,
    handleMouseDown, handleMouseMove, handleMouseUpOrLeave, handleTouchStart, handleTouchMove,
    media, versionGradients
  };

  // Generate block items with dynamic, unique anchor IDs
  const assigned = {
    overview: false,
    threeSixty: false,
    versions: false,
    features: false,
    compare: false
  };

  const blocksWithAnchors = currentBlocks.map((block) => {
    let anchorId: string | undefined = undefined;

    if (block.type === "HeroBanner" || block.type === "Promotions") {
      if (!assigned.overview) {
        anchorId = "overview";
        assigned.overview = true;
      }
    } else if (block.type === "ThreeSixtyViewer") {
      if (!assigned.threeSixty) {
        anchorId = "360-viewer";
        assigned.threeSixty = true;
      }
    } else if (block.type === "VersionsGrid") {
      if (!assigned.versions) {
        anchorId = "versions-section";
        assigned.versions = true;
      }
    } else if (block.type === "FeaturesGrid" || block.type === "FeaturesList") {
      if (!assigned.features) {
        anchorId = "features-section";
        assigned.features = true;
      }
    } else if (block.type === "SpecsGrid") {
      if (!assigned.compare) {
        anchorId = "compare-section";
        assigned.compare = true;
      }
    }

    return {
      ...block,
      anchorId
    };
  });

  // Dynamically build navigation tabs based on existing blocks on the page
  const navigationTabs: { id: ActiveTab; label: string }[] = [
    { id: "overview", label: "Tổng quan" }
  ];

  if (currentBlocks.some(b => b.type === "ThreeSixtyViewer")) {
    navigationTabs.push({ id: "360", label: "360 Viewer" });
  }
  if (currentBlocks.some(b => b.type === "VersionsGrid")) {
    navigationTabs.push({ id: "versions", label: "Phiên bản" });
  }
  if (currentBlocks.some(b => b.type === "FeaturesGrid" || b.type === "FeaturesList")) {
    navigationTabs.push({ id: "features", label: "Tính năng" });
  }
  if (currentBlocks.some(b => b.type === "SpecsGrid")) {
    navigationTabs.push({ id: "compare", label: "So sánh" });
  }
  navigationTabs.push({ id: "accessories", label: "Phụ kiện" });

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans pb-16">
      
      {/* 1. Breadcrumbs Header Navigation */}
      <div className="bg-[#fafafa] border-b border-[#e5e5e5] py-4">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm font-semibold cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
          <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <span>Trang chủ</span>
            <div className="w-[3px] h-[3px] rounded-full bg-[#333] opacity-60 mx-1" />
            <span>Sản phẩm</span>
            <div className="w-[3px] h-[3px] rounded-full bg-[#333] opacity-60 mx-1" />
            <span className="text-black font-semibold uppercase">{vehicle.name}</span>
          </div>
        </div>
      </div>

      <>
          {/* If the first block is HeroBanner, render it first */}
          {blocksWithAnchors[0]?.type === "HeroBanner" && (
            <Blocks
              layout={[blocksWithAnchors[0]]}
              vehicle={vehicle}
              openQuoteDrawer={openQuoteDrawer}
              openDriveModal={() => setShowDriveModal(true)}
              isEditMode={isEditMode}
              onChangeBlock={(idx, data) => handleBlockChange(0, data)}
              onMoveBlock={(idx, dir) => handleBlockMove(0, dir)}
              onDeleteBlock={(idx) => handleBlockDelete(0)}
              threeSixtyProps={threeSixtyPropsObj}
              startIndex={0}
              totalBlocks={blocksWithAnchors.length}
            />
          )}

          {/* 3. Sticky Tab Navigation Bar */}
          <div className="sticky-tabs bg-white border-b border-[#e5e5e5] shadow-xs">
            <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex items-center gap-[32px] justify-between sm:justify-start">
              <p className="font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[14px] whitespace-nowrap hidden sm:block">
                {vehicle.name}
              </p>
              <div className="h-[24px] w-[1px] bg-[#e5e5e5] hidden sm:block" />
              
              <div className="flex items-center overflow-x-auto scrollbar-none gap-[16px] sm:gap-[24px] py-1">
                {navigationTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`py-[16px] px-[8px] text-[16px] font-medium leading-[1.5] cursor-pointer text-center relative whitespace-nowrap bg-transparent border-0 flex-shrink-0 transition-colors
                        ${isActive ? "text-[#0562d2]" : "text-[#424242] hover:text-[#0562d2]"}`}
                    >
                      <span>{tab.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0562d2]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Render remaining blocks */}
          <div className="space-y-16">
            <Blocks
              layout={blocksWithAnchors[0]?.type === "HeroBanner" ? blocksWithAnchors.slice(1) : blocksWithAnchors}
              vehicle={vehicle}
              openQuoteDrawer={openQuoteDrawer}
              openDriveModal={() => setShowDriveModal(true)}
              isEditMode={isEditMode}
              onChangeBlock={(idx, data) => handleBlockChange(blocksWithAnchors[0]?.type === "HeroBanner" ? idx + 1 : idx, data)}
              onMoveBlock={(idx, dir) => handleBlockMove(blocksWithAnchors[0]?.type === "HeroBanner" ? idx + 1 : idx, dir)}
              onDeleteBlock={(idx) => handleBlockDelete(blocksWithAnchors[0]?.type === "HeroBanner" ? idx + 1 : idx)}
              threeSixtyProps={threeSixtyPropsObj}
              startIndex={blocksWithAnchors[0]?.type === "HeroBanner" ? 1 : 0}
              totalBlocks={blocksWithAnchors.length}
            />
            {!currentBlocks.some(b => b.type === "BookingBanner") && <BookingBanner />}
          </div>
      </>

      {/* 11. Booking / Quote Modals */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 relative">
            
            {/* Modal Header */}
            <div className="bg-[#00095b] text-white p-6 relative">
              <h3 className="text-lg font-bold uppercase tracking-wide font-display">
                Đăng Ký Lái Thử Xe
              </h3>
              <p className="text-xs text-white/70 mt-1">
                Dòng xe: <span className="text-white font-bold">{vehicle.name}{activeVersion ? ` - ${activeVersion.name}` : ""}</span>
              </p>
              <button 
                onClick={() => setShowDriveModal(false)}
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
                  <p className="text-xs text-gray-500">Đội ngũ tư vấn bán hàng sẽ liên hệ lại với bạn trong vòng 15 phút.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-sm text-xs text-center font-semibold">
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
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
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
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
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
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Khu vực sinh sống</label>
                    <select 
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0562d2] cursor-pointer text-black"
                    >
                      <option value="Đồng Nai">Đồng Nai</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Bình Dương">Bình Dương</option>
                      <option value="Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                      <option value="Khác">Khu vực khác</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Ghi chú yêu cầu thêm</label>
                    <textarea 
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Nhập yêu cầu chi tiết (ví dụ: cần lái thử lúc 9h sáng, cần tư vấn trả góp,...)"
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white resize-none text-black"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0562d2] hover:bg-[#044ea7] disabled:bg-gray-400 text-white py-3 rounded-[800px] font-bold uppercase text-xs tracking-wider shadow-sm transition-colors cursor-pointer border-0 mt-2"
                  >
                    {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu ngay"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quote sliding drawer */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setShowQuoteModal(false)}
            className="absolute inset-0 bg-black/40 transition-opacity duration-300"
          />
          
          {/* Drawer Panel */}
          <div className="relative bg-white w-full max-w-[637px] h-full flex flex-col p-8 overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            {/* Close button */}
            <button 
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100/80 rounded-full transition-colors bg-transparent border-0 cursor-pointer z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header info */}
            <div className="flex flex-col gap-3 items-start w-full mb-8">
              <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] text-[32px] leading-[1.2]">
                Dự toán chi phí lăn bánh
              </h2>
              <p className="font-['Ford_Antenna',sans-serif] font-normal text-[#424242] text-[16px] leading-[1.5]">
                Nhập thông tin để tính chi phí lăn bánh dự kiến
              </p>
            </div>

            {isSubmitted ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Gửi yêu cầu thành công!</h4>
                <p className="text-sm text-gray-500 max-w-sm">Đội ngũ tư vấn bán hàng của Đồng Nai Ford sẽ liên hệ lại với bạn trong vòng 15 phút để báo giá chính xác.</p>
              </div>
            ) : drawerStep === "calculate" ? (
              <div className="flex-1 flex flex-col gap-6 w-full">
                {/* Inputs block */}
                <div className="flex flex-col gap-6 w-full">
                  {/* Select Mẫu xe */}
                  <div className="flex flex-col gap-[6px] items-start w-full relative">
                    <label className="font-['Ford_Antenna',sans-serif] font-medium leading-[1.5] text-[#424242] text-[16px] text-left">
                      Mẫu xe
                    </label>
                    <div className="relative w-full">
                      <select
                        value={selectedVehicleId}
                        onChange={(e) => handleVehicleChange(e.target.value)}
                        className="w-full bg-white border border-[#d6d6d6] border-solid px-[14px] py-[10px] pr-[40px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-black text-[16px] leading-[1.5] appearance-none cursor-pointer focus:outline-none focus:border-[#0562d2]"
                      >
                        {vehicles.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute top-1/2 right-[14px] transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Select Phiên bản */}
                  <div className="flex flex-col gap-[6px] items-start w-full relative">
                    <label className="font-['Ford_Antenna',sans-serif] font-medium leading-[1.5] text-[#424242] text-[16px] text-left">
                      Phiên bản
                    </label>
                    <div className="relative w-full">
                      <select
                        value={selectedVersionId}
                        onChange={(e) => setSelectedVersionId(e.target.value)}
                        className="w-full bg-white border border-[#d6d6d6] border-solid px-[14px] py-[10px] pr-[40px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-black text-[16px] leading-[1.5] appearance-none cursor-pointer focus:outline-none focus:border-[#0562d2]"
                      >
                        {vehicles.find(v => v.id === selectedVehicleId)?.versions.map((ver) => (
                          <option key={ver.id} value={ver.id}>
                            {ver.name} - {formatPrice(ver.price)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute top-1/2 right-[14px] transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Select Tỉnh/Thành phố */}
                  <div className="flex flex-col gap-[6px] items-start w-full relative">
                    <label className="font-['Ford_Antenna',sans-serif] font-medium leading-[1.5] text-[#424242] text-[16px] text-left">
                      Tỉnh/ Thành phố
                    </label>
                    <div className="relative w-full">
                      <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="w-full bg-white border border-[#d6d6d6] border-solid px-[14px] py-[10px] pr-[40px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-black text-[16px] leading-[1.5] appearance-none cursor-pointer focus:outline-none focus:border-[#0562d2]"
                      >
                        <option value="Đồng Nai">Đồng Nai</option>
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Bình Dương">Bình Dương</option>
                        <option value="Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                        <option value="Khác">Khu vực khác</option>
                      </select>
                      <div className="absolute top-1/2 right-[14px] transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation results card block */}
                <div className="bg-[#edf6ff] flex flex-col gap-6 items-start p-6 rounded-[12px] w-full border border-blue-100">
                  <div className="flex gap-3 items-start justify-between w-full">
                    <div className="flex flex-col gap-2 items-start">
                      <p className="font-['Ford_Antenna',sans-serif] font-normal leading-[1.5] text-[#424242] text-[16px]">
                        Chi phí lăn bánh dự kiến
                      </p>
                      <p className="font-['Ford_Antenna',sans-serif] font-semibold leading-[1.2] text-[#0562d2] text-[32px]">
                        {formatPrice(rollingCost.total)}
                      </p>
                    </div>
                    {/* Reset button inside card */}
                    <button 
                      onClick={() => {
                        setSelectedVehicleId(vehicle.id);
                        setSelectedVersionId(activeVersion?.id || "");
                        setSelectedProvince("Đồng Nai");
                      }}
                      title="Đặt lại"
                      className="bg-[#fcfcfc] flex items-center justify-center p-[10px] rounded-full w-11 h-11 border border-gray-200 hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
                    >
                      <RotateCcw className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Dynamic cost rows */}
                  <div className="flex flex-col font-['Ford_Antenna',sans-serif] font-medium gap-3 items-start leading-[1.5] text-[#333] text-[16px] w-full">
                    <div className="border-[#d6d6d6] border-b border-solid flex gap-3 items-start pb-3 w-full">
                      <p className="flex-1 min-w-px text-left text-gray-700">Giá bán khuyến nghị</p>
                      <p className="shrink-0 font-semibold">{formatPrice(rollingCost.basePrice)}</p>
                    </div>
                    <div className="border-[#d6d6d6] border-b border-solid flex gap-3 items-start pb-3 w-full">
                      <p className="flex-1 min-w-px text-left text-gray-700">Lệ phí trước bạ</p>
                      <p className="shrink-0 font-semibold">{formatPrice(rollingCost.registrationTax)}</p>
                    </div>
                    <div className="border-[#d6d6d6] border-b border-solid flex gap-3 items-start pb-3 w-full">
                      <p className="flex-1 min-w-px text-left text-gray-700">Bảo hiểm trách nhiệm dân sự (1 năm)</p>
                      <p className="shrink-0 font-semibold">{formatPrice(rollingCost.insuranceFee)}</p>
                    </div>
                    <div className="border-[#d6d6d6] border-b border-solid flex gap-3 items-start pb-3 w-full">
                      <p className="flex-1 min-w-px text-left text-gray-700">Phí bảo trì đường bộ (1 năm)</p>
                      <p className="shrink-0 font-semibold">{formatPrice(rollingCost.roadFee)}</p>
                    </div>
                    <div className="border-[#d6d6d6] border-b border-solid flex gap-3 items-start pb-3 w-full">
                      <p className="flex-1 min-w-px text-left text-gray-700">Phí đăng kiểm</p>
                      <p className="shrink-0 font-semibold">{formatPrice(rollingCost.registryFee)}</p>
                    </div>
                    <div className="border-[#d6d6d6] border-b border-solid flex gap-3 items-start pb-3 w-full">
                      <p className="flex-1 min-w-px text-left text-gray-700">Phí biển số</p>
                      <p className="shrink-0 font-semibold">{formatPrice(rollingCost.plateFee)}</p>
                    </div>
                  </div>

                  {/* Form Action buttons */}
                  <div className="flex gap-4 items-center w-full mt-4">
                    <button 
                      onClick={() => {
                        setSelectedVehicleId(vehicle.id);
                        setSelectedVersionId(activeVersion?.id || "");
                        setSelectedProvince("Đồng Nai");
                      }}
                      className="bg-white hover:bg-gray-50 border border-[#d6d6d6] border-solid flex flex-1 gap-2 items-center justify-center py-2.5 rounded-[800px] text-[#424242] text-[16px] font-semibold transition-all cursor-pointer shadow-xs h-11"
                    >
                      Chọn lại mẫu xe
                    </button>
                    <button 
                      onClick={() => {
                        // Prefill contact form values
                        const selVeh = vehicles.find((v: any) => v.id === selectedVehicleId) || vehicle;
                        const selVer = selVeh.versions.find((v: any) => v.id === selectedVersionId) || selVeh.versions[0];
                        setFormData(prev => ({
                          ...prev,
                          province: selectedProvince,
                          note: `Yêu cầu báo giá lăn bánh dự kiến cho xe ${selVeh.name} - ${selVer?.name} tại ${selectedProvince}.`
                        }));
                        setDrawerStep("contact");
                      }}
                      className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex flex-1 gap-2 items-center justify-center py-2.5 rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer shadow-xs h-11"
                    >
                      Báo giá
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-6 w-full">
                {/* Back button */}
                <button
                  onClick={() => setDrawerStep("calculate")}
                  className="flex items-center gap-2 text-[#0562d2] hover:text-[#044ea7] font-semibold cursor-pointer border-0 bg-transparent text-left"
                >
                  <ArrowLeft className="w-4 h-4" /> Quay lại bảng dự toán
                </button>

                {/* Subtitle details */}
                <div className="p-4 bg-[#edf6ff] rounded-[8px] border border-blue-100 text-xs text-[#00095b] space-y-1">
                  <p><strong>Xe đã chọn:</strong> {vehicles.find(v => v.id === selectedVehicleId)?.name} - {vehicles.find(v => v.id === selectedVehicleId)?.versions.find(ver => ver.id === selectedVersionId)?.name}</p>
                  <p><strong>Khu vực đăng ký:</strong> {selectedProvince}</p>
                  <p><strong>Dự toán chi phí lăn bánh:</strong> <strong className="text-[14px]">{formatPrice(rollingCost.total)}</strong></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-sm text-xs text-center font-semibold">
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
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
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
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
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
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Khu vực sinh sống</label>
                    <select 
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0562d2] cursor-pointer text-black"
                    >
                      <option value="Đồng Nai">Đồng Nai</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Bình Dương">Bình Dương</option>
                      <option value="Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                      <option value="Khác">Khu vực khác</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-left">Ghi chú yêu cầu thêm</label>
                    <textarea 
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Nhập yêu cầu chi tiết (ví dụ: cần lái thử lúc 9h sáng, cần tư vấn trả góp,...)"
                      className="w-full px-4 py-2.5 rounded-[4px] border border-gray-200 text-xs focus:outline-none focus:border-[#0562d2] bg-white resize-none text-black"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0562d2] hover:bg-[#044ea7] disabled:bg-gray-400 text-white py-3 rounded-[800px] font-bold uppercase text-xs tracking-wider shadow-sm transition-colors cursor-pointer border-0 mt-2"
                  >
                    {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu ngay"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating builder toolbar for reordering and saving */}
      {isEditMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center gap-4 min-w-[320px] max-w-[90vw] md:max-w-2xl">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Trình Dựng Trang Trực Quan</span>
            <span className="text-xs font-semibold">Đang chỉnh sửa dòng xe: <strong className="text-white font-bold">{vehicle?.name}</strong></span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:ml-auto">
            {/* Add block selector */}
            <select 
              onChange={(e) => {
                if (e.target.value) {
                  handleAddBlock(e.target.value);
                  e.target.value = "";
                }
              }}
              className="bg-[#2b2b2b] text-white text-xs border border-white/10 rounded-full px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="">+ Thêm Khối</option>
              <option value="HeroBanner">Banner lớn</option>
              <option value="Promotions">Khuyến mãi lớn</option>
              <option value="ThreeSixtyViewer">Xoay 360 độ</option>
              <option value="FeaturesGrid">Lưới tính năng</option>
              <option value="VersionsGrid">Danh sách phiên bản</option>
              <option value="SpecsGrid">Bảng Thông số</option>
              <option value="FeaturesList">Các tính năng (Dọc)</option>
              <option value="AccordionFAQs">Khối FAQs</option>
              <option value="BookingBanner">Khối Tư vấn / Đặt lịch</option>
            </select>

            <button 
              type="button"
              onClick={handleSaveLayout}
              disabled={saving}
              className="bg-[#0562d2] hover:bg-[#044ea7] disabled:bg-gray-500 text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition-colors shadow-sm border-0"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            
            <button 
              type="button"
              onClick={handleCancelEdit}
              className="bg-transparent hover:bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-colors border border-solid border-white/30"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

      {!isEditMode && (
        <button 
          type="button"
          onClick={() => {
            setIsEditMode(true);
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.set("edit", "true");
              window.history.replaceState({}, "", url.toString());
            }
          }}
          className="fixed bottom-6 right-6 z-45 bg-[#0562d2] hover:bg-[#044ea7] text-white rounded-full p-4 shadow-xl border-0 cursor-pointer flex items-center gap-2 font-bold hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-wider"
          title="Bật chế độ chỉnh sửa trực quan"
        >
          ⚙️ Dựng trang trực quan
        </button>
      )}

    </div>
  );
}
