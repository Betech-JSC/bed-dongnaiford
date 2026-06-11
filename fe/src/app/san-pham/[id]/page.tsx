"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { contactsAPI, vehiclesAPI, mediaAPI, regionsAPI } from "@/lib/api";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Plus,
  Minus,
  RotateCcw,
  X,
  Monitor,
  Tablet,
  Smartphone,
  GitCompare
} from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { vehicleMediaAssets, getVehicleMediaAssets } from "@/data/vehicle-media";
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

const safeArray = (val: any): any[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { }
    if (val.trim()) {
      return val.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Compare Vehicles State
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const loadCompareIds = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("compare-vehicles");
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids)) {
            setCompareIds(ids);
            return;
          }
        } catch (e) {
          console.error("Error loading compare list:", e);
        }
      }
      setCompareIds([]);
    }
  };

  useEffect(() => {
    loadCompareIds();
    const handleUpdate = () => {
      loadCompareIds();
    };
    window.addEventListener("compare-updated", handleUpdate);
    return () => {
      window.removeEventListener("compare-updated", handleUpdate);
    };
  }, []);

  const toggleCompare = (vehicleId: string) => {
    let updated: string[];
    if (compareIds.includes(vehicleId)) {
      updated = compareIds.filter((id) => id !== vehicleId);
    } else {
      if (compareIds.length >= 3) {
        alert("Bạn chỉ có thể so sánh tối đa 3 xe cùng lúc!");
        return;
      }
      updated = [...compareIds, vehicleId];
    }
    localStorage.setItem("compare-vehicles", JSON.stringify(updated));
    setCompareIds(updated);
    window.dispatchEvent(new Event("compare-updated"));
  };

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
      image_url: apiVehicle.image_url || resolveFileUrl(apiVehicle.image),
      colors: apiVehicle.colors ? safeArray(apiVehicle.colors).map((c: any) => ({
        name: c.name || c.color_name || '',
        hex: c.hex || c.color_code || '',
        image: resolveFileUrl(c.image_path || c.image),
        images_360: safeArray(c.images_360).map((img: any) => resolveFileUrl(img)).filter(Boolean),
        image_360_internal: resolveFileUrl(c.image_360_internal) || null,
        images_360_internal: safeArray(c.images_360_internal).map((img: any) => resolveFileUrl(img)).filter(Boolean)
      })) : [],
      images: (apiVehicle.images && Array.isArray(apiVehicle.images) && apiVehicle.images.length > 0)
        ? apiVehicle.images.map((img: any) => resolveFileUrl(img)).filter(Boolean)
        : [apiVehicle.image_url || resolveFileUrl(apiVehicle.image)].filter(Boolean),
      versions: apiVehicle.versions ? safeArray(apiVehicle.versions).map((v: any) => ({
        id: v.id,
        name: v.name,
        price: typeof v.price === 'string' ? parseFloat(v.price) : v.price,
        image_url: v.image_url || resolveFileUrl(v.image) || null,
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
      layout_blocks: apiVehicle.layout_blocks || [],
      images_360_external: safeArray(apiVehicle.images_360_external).map((img: any) => resolveFileUrl(img)).filter(Boolean),
      images_360_internal: safeArray(apiVehicle.images_360_internal).map((img: any) => resolveFileUrl(img)).filter(Boolean),
      image_360_internal_url: apiVehicle.image_360_internal_url || ''
    }
    : staticVehicle;

  const media = vehicle ? getVehicleMediaAssets(vehicle.id) : getVehicleMediaAssets("new-territory");

  // Scroll references for programmatic scrolling
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // States
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [viewType, setViewType] = useState<"exterior" | "interior">("exterior");
  const currentColorObj = vehicle?.colors?.[selectedColorIndex];
  const hasInteriorSeq = (currentColorObj && (currentColorObj as any).images_360_internal && (currentColorObj as any).images_360_internal.length > 0)
    || (vehicle && (vehicle as any).images_360_internal && (vehicle as any).images_360_internal.length > 0);
  const hasExteriorSeq = (currentColorObj && (currentColorObj as any).images_360 && (currentColorObj as any).images_360.length > 0)
    || (vehicle && (vehicle as any).images_360_external && (vehicle as any).images_360_external.length > 0);
  const isImageSequence = (viewType === "exterior" && (hasExteriorSeq || vehicle?.id === "mustang-fastback"))
    || (viewType === "interior" && (hasInteriorSeq || vehicle?.id === "mustang-fastback"));

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
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [originalBlocks, setOriginalBlocks] = useState<any[]>([]);
  const [currentBlocks, setCurrentBlocks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // visual page builder states
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [builderTab, setBuilderTab] = useState<"sections" | "library">("sections");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  // responsive preview & drag resize states
  const [previewViewport, setPreviewViewport] = useState<"pc" | "tablet" | "mobile" | "custom">("pc");
  const [previewWidth, setPreviewWidth] = useState<number | string>("100%");
  const [isPreviewResizing, setIsPreviewResizing] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

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

  // Check if ?edit=true or ?embed=true in URL to auto-enable modes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("edit") === "true") {
        setIsEditMode(true);
      }
      if (params.get("embed") === "true") {
        setIsEmbedded(true);
      }
    }
  }, []);

  // Synchronize layout blocks with the parent window (CMS) when in iframe/embedded mode
  const syncBlocksToCMS = (blocks: any[], newActiveIndex?: number | null) => {
    if (typeof window !== "undefined" && window.parent) {
      window.parent.postMessage({
        type: 'SYNC_BLOCKS_FROM_IFRAME',
        blocks: blocks,
        activeIndex: newActiveIndex !== undefined ? newActiveIndex : activeIndex
      }, '*');
    }
  };

  const handleSelectBlock = (idx: number) => {
    setActiveIndex(idx);
    if (isEmbedded && typeof window !== "undefined" && window.parent) {
      window.parent.postMessage({
        type: 'SELECT_BLOCK',
        index: idx
      }, '*');
    }
  };

  // Set up message event listener for parent/CMS postMessages
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'INIT_PREVIEW':
          if (data.vehicle) {
            setApiVehicle(data.vehicle);
          }
          if (data.blocks) {
            setCurrentBlocks(data.blocks);
          }
          if (data.activeIndex !== undefined) {
            setActiveIndex(data.activeIndex);
          }
          setIsEditMode(true);
          setLoading(false);
          break;
        case 'UPDATE_VEHICLE':
          if (data.vehicle) {
            setApiVehicle(data.vehicle);
          }
          break;
        case 'UPDATE_BLOCKS':
          if (data.blocks) {
            setCurrentBlocks(data.blocks);
          }
          if (data.activeIndex !== undefined) {
            setActiveIndex(data.activeIndex);
          }
          break;
        case 'UPDATE_ACTIVE_INDEX':
          if (data.activeIndex !== undefined) {
            setActiveIndex(data.activeIndex);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [activeIndex, isEmbedded]);

  const handleBlockChange = (index: number, updatedData: any) => {
    const updated = [...currentBlocks];
    updated[index] = { ...updated[index], data: updatedData };
    setCurrentBlocks(updated);
    if (isEmbedded) {
      syncBlocksToCMS(updated);
    }
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

    let newActiveIndex = activeIndex;
    if (activeIndex === index) {
      newActiveIndex = targetIndex;
      setActiveIndex(targetIndex);
    } else if (activeIndex === targetIndex) {
      newActiveIndex = index;
      setActiveIndex(index);
    }

    if (isEmbedded) {
      syncBlocksToCMS(updated, newActiveIndex);
    }
  };

  const handleBlockDelete = (index: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa khối nội dung này không?")) {
      const updated = currentBlocks.filter((_, i) => i !== index);
      setCurrentBlocks(updated);
      let newActiveIndex = activeIndex;
      if (activeIndex === index) {
        newActiveIndex = null;
        setActiveIndex(null);
      } else if (activeIndex !== null && activeIndex > index) {
        newActiveIndex = activeIndex - 1;
        setActiveIndex(activeIndex - 1);
      }

      if (isEmbedded) {
        syncBlocksToCMS(updated, newActiveIndex);
      }
    }
  };

  const handleDuplicateBlock = (index: number) => {
    const blockCopy = JSON.parse(JSON.stringify(currentBlocks[index]));
    const updated = [...currentBlocks];
    updated.splice(index + 1, 0, blockCopy);
    setCurrentBlocks(updated);
    setActiveIndex(index + 1);

    if (isEmbedded) {
      syncBlocksToCMS(updated, index + 1);
    }
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData("text/plain");
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const updated = [...currentBlocks];
    const [draggedBlock] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, draggedBlock);

    setCurrentBlocks(updated);

    let newActiveIndex = activeIndex;
    if (activeIndex === sourceIndex) {
      newActiveIndex = targetIndex;
      setActiveIndex(targetIndex);
    } else if (activeIndex !== null) {
      if (sourceIndex < activeIndex && targetIndex >= activeIndex) {
        newActiveIndex = activeIndex - 1;
        setActiveIndex(activeIndex - 1);
      } else if (sourceIndex > activeIndex && targetIndex <= activeIndex) {
        newActiveIndex = activeIndex + 1;
        setActiveIndex(activeIndex + 1);
      }
    }

    setDraggedIndex(null);
    setDraggedOverIndex(null);

    if (isEmbedded) {
      syncBlocksToCMS(updated, newActiveIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  // Resize Preview Event Handlers
  const handleResizeStart = (e: React.MouseEvent, direction: "left" | "right") => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    setIsPreviewResizing(true);

    const container = previewContainerRef.current;
    if (!container) return;

    const startWidth = container.getBoundingClientRect().width;
    const startX = e.clientX;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const deltaX = moveEvent.clientX - startX;

      let newWidth: number;
      if (direction === "right") {
        newWidth = startWidth + deltaX * 2;
      } else {
        newWidth = startWidth - deltaX * 2;
      }

      const parentWidth = container.parentElement?.getBoundingClientRect().width || 1200;
      const maxWidth = Math.max(1000, parentWidth - 48); // cap at parent width minus paddings
      const finalWidth = Math.max(320, Math.min(maxWidth, newWidth));

      setPreviewWidth(finalWidth);
      setPreviewViewport("custom");
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      setIsPreviewResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeTouchStart = (e: React.TouchEvent, direction: "left" | "right") => {
    isResizingRef.current = true;
    setIsPreviewResizing(true);

    const container = previewContainerRef.current;
    if (!container) return;

    const startWidth = container.getBoundingClientRect().width;
    const startX = e.touches[0].clientX;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!isResizingRef.current) return;
      const deltaX = moveEvent.touches[0].clientX - startX;

      let newWidth: number;
      if (direction === "right") {
        newWidth = startWidth + deltaX * 2;
      } else {
        newWidth = startWidth - deltaX * 2;
      }

      const parentWidth = container.parentElement?.getBoundingClientRect().width || 1200;
      const maxWidth = Math.max(1000, parentWidth - 48);
      const finalWidth = Math.max(320, Math.min(maxWidth, newWidth));

      setPreviewWidth(finalWidth);
      setPreviewViewport("custom");
    };

    const handleTouchEnd = () => {
      isResizingRef.current = false;
      setIsPreviewResizing(false);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
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
    const updated = [...currentBlocks, newBlock];
    setCurrentBlocks(updated);
    setActiveIndex(updated.length - 1);
    setBuilderTab("sections");
    if (isEmbedded) {
      syncBlocksToCMS(updated, updated.length - 1);
    }
  };

  const handleSaveLayout = async () => {
    setSaving(true);
    try {
      const res = await vehiclesAPI.updateLayout(id, currentBlocks);
      if (res) {
        alert("Lưu giao diện thành công!");
        setOriginalBlocks(JSON.parse(JSON.stringify(currentBlocks)));
        setIsEditMode(false);
        setActiveIndex(null);
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
    setActiveIndex(null);
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
    const currentColor = vehicle?.colors?.[selectedColorIndex];

    // Skip Three.js initialization if we have a sequence of interior images
    if (
      (currentColor && (currentColor as any).images_360_internal && (currentColor as any).images_360_internal.length > 0)
      || (vehicle && (vehicle as any).images_360_internal && (vehicle as any).images_360_internal.length > 0)
    ) {
      return;
    }

    const interiorImg = (vehicle?.id === "mustang-fastback" || vehicle?.id === "ford-mustang")
      ? (selectedInteriorColorIndex === 1
        ? (vehicle?.images_360_internal?.[1] || "/storage/vehicles/mustang/360/interior/001-space-gray.jpeg")
        : (vehicle?.images_360_internal?.[0] || "/storage/vehicles/mustang/360/interior/001-black-onyx.jpeg"))
      : ((currentColor as any)?.image_360_internal
        || vehicle?.image_360_internal_url
        || (vehicle?.id === "new-territory"
          ? "/assets/territory-interior.png"
          : (media.bannerLarge || "/assets/territory-interior.png")));

    const cleanUpThree = initThreeInterior(threeRef.current, interiorImg);
    return () => {
      if (cleanUpThree) cleanUpThree();
    };
  }, [threeLoaded, is360Active, viewType, vehicle, media, selectedColorIndex, selectedInteriorColorIndex]);

  const renderCarPicture = () => {
    if (!vehicle) return null;

    const currentColor = vehicle.colors[selectedColorIndex];

    // 1. Dynamic 360 External Image Sequence uploaded from CMS (Color level or Vehicle level fallback)
    const images360 = (currentColor && (currentColor as any).images_360 && (currentColor as any).images_360.length > 0)
      ? (currentColor as any).images_360
      : ((vehicle as any).images_360_external && (vehicle as any).images_360_external.length > 0)
        ? (vehicle as any).images_360_external
        : null;

    if (images360 && images360.length > 0) {
      const imagesCount = images360.length;
      const frameIdx = Math.floor(((rotation % 360 + 360) % 360) / (360 / imagesCount)) % imagesCount;

      return (
        <div className="cmp-360-image-container w-full h-full relative" tabIndex={0}>
          {images360.map((imgUrl: string, idx: number) => {
            const isActive = idx === frameIdx;
            return (
              <picture
                key={idx}
                className="cmp-360-image absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  zIndex: isActive ? 10 : 0
                }}
              >
                <img
                  src={imgUrl}
                  alt={`${currentColor?.name || vehicle.name} - 360 Frame ${idx}`}
                  className="max-h-[420px] md:max-h-[480px] w-auto object-contain select-none pointer-events-none"
                  loading="eager"
                />
              </picture>
            );
          })}
        </div>
      );
    }

    // 2. Legacy / Special Mustang Hardcoded 360 Sequence
    if (vehicle.id === "mustang-fastback") {
      const activeTrim = vehicle.versions[activeVersionIndex]?.id || "ecoboostfastback";
      const colorId = vehicle.colors[selectedColorIndex]?.image || "adriatic-blue-green";
      const wheelId = selectedWheel || "64f";
      const frameIdx = Math.floor(((rotation % 360 + 360) % 360) / (360 / 28)) + 1;

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

    // 3. Fallback for other vehicles with single static image (CSS 3D rotate simulation)
    const fallbackImage = currentColor?.image || (vehicle.images && vehicle.images[0]) || "/assets/car-everest.png";
    return (
      <div
        className="relative w-[700px] h-[400px] transition-transform duration-100 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${rotation}deg) rotateX(${tilt}deg) scale(0.95)`,
        }}
      >
        <Image
          src={fallbackImage}
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

  const renderInteriorCarPicture = () => {
    if (!vehicle) return null;

    const currentColor = vehicle.colors[selectedColorIndex];

    const images360 = (currentColor && (currentColor as any).images_360_internal && (currentColor as any).images_360_internal.length > 0)
      ? (currentColor as any).images_360_internal
      : ((vehicle as any).images_360_internal && (vehicle as any).images_360_internal.length > 0)
        ? (vehicle as any).images_360_internal
        : null;

    if (images360 && images360.length > 0) {
      const imagesCount = images360.length;
      const frameIdx = Math.floor(((rotation % 360 + 360) % 360) / (360 / imagesCount)) % imagesCount;

      return (
        <div className="cmp-360-image-container w-full h-full relative" tabIndex={0}>
          {images360.map((imgUrl: string, idx: number) => {
            const isActive = idx === frameIdx;
            return (
              <picture
                key={idx}
                className="cmp-360-image absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  zIndex: isActive ? 10 : 0
                }}
              >
                <img
                  src={imgUrl}
                  alt={`${currentColor?.name || vehicle.name} - 360 Interior Frame ${idx}`}
                  className="max-h-[420px] md:max-h-[480px] w-auto object-contain select-none pointer-events-none"
                  loading="eager"
                />
              </picture>
            );
          })}
        </div>
      );
    }
    return null;
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
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [drawerStep, setDrawerStep] = useState<"calculate" | "contact">("calculate");

  // Fetch provinces from API
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

    const bigCities = ["Hà Nội", "Hồ Chí Minh", "Hải Phòng", "Đà Nẵng", "Cần Thơ", "Huế"];
    const isBigCity = bigCities.some(city => selectedProvince.toLowerCase().includes(city.toLowerCase()));
    const plateFee = isBigCity ? 20000000 : 1000000;

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
      router.push(`/phu-kien?vehicle=${encodeURIComponent(vehicle.name)}`);
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
    renderInteriorCarPicture,
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

  const has360Content = vehicle ? (
    vehicle.id === "mustang-fastback" ||
    (vehicle.images_360_external && vehicle.images_360_external.length > 0) ||
    (vehicle.images_360_internal && vehicle.images_360_internal.length > 0) ||
    (vehicle.image_360_internal_url && vehicle.image_360_internal_url.trim() !== "") ||
    (vehicle.colors && vehicle.colors.some((color: any) =>
      (color.images_360 && color.images_360.length > 0) ||
      (color.images_360_internal && color.images_360_internal.length > 0) ||
      (color.image_360_internal && color.image_360_internal.trim() !== "")
    ))
  ) : false;

  const filteredBlocks = isEditMode
    ? currentBlocks
    : currentBlocks.filter((b: any) => b.type !== "ThreeSixtyViewer" || has360Content);

  const blocksWithAnchors = filteredBlocks.map((block) => {
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

  if (blocksWithAnchors.some(b => b.type === "ThreeSixtyViewer")) {
    navigationTabs.push({ id: "360", label: "360 Viewer" });
  }
  if (blocksWithAnchors.some(b => b.type === "VersionsGrid")) {
    navigationTabs.push({ id: "versions", label: "Phiên bản" });
  }
  if (blocksWithAnchors.some(b => b.type === "FeaturesGrid" || b.type === "FeaturesList")) {
    navigationTabs.push({ id: "features", label: "Tính năng" });
  }
  if (blocksWithAnchors.some(b => b.type === "SpecsGrid")) {
    navigationTabs.push({ id: "compare", label: "So sánh" });
  }
  navigationTabs.push({ id: "accessories", label: "Phụ kiện" });

  if (isEditMode && !isEmbedded) {
    const activeBlock = activeIndex !== null ? currentBlocks[activeIndex] : null;

    const updateActiveBlockData = (key: string, value: any) => {
      if (activeIndex === null) return;
      const updatedData = { ...currentBlocks[activeIndex].data, [key]: value };
      handleBlockChange(activeIndex, updatedData);
    };

    const addSplitFeature = () => {
      if (activeIndex === null) return;
      const list = currentBlocks[activeIndex].data.split_features || [];
      updateActiveBlockData("split_features", [...list, { value: "", label: "" }]);
    };
    const removeSplitFeature = (idx: number) => {
      if (activeIndex === null) return;
      const list = currentBlocks[activeIndex].data.split_features || [];
      updateActiveBlockData("split_features", list.filter((_: any, i: number) => i !== idx));
    };
    const updateSplitFeature = (idx: number, key: string, val: string) => {
      if (activeIndex === null) return;
      const list = [...(currentBlocks[activeIndex].data.split_features || [])];
      list[idx] = { ...list[idx], [key]: val };
      updateActiveBlockData("split_features", list);
    };

    const updateVersionDesc = (idx: number, val: string) => {
      if (activeIndex === null) return;
      const descs = [...(currentBlocks[activeIndex].data.descriptions || [])];
      while (descs.length <= idx) {
        descs.push("");
      }
      descs[idx] = val;
      updateActiveBlockData("descriptions", descs);
    };

    const addFeature = () => {
      if (activeIndex === null) return;
      const list = currentBlocks[activeIndex].data.features || [];
      updateActiveBlockData("features", [...list, { title: "", description: "", image: "" }]);
    };
    const removeFeature = (idx: number) => {
      if (activeIndex === null) return;
      const list = currentBlocks[activeIndex].data.features || [];
      updateActiveBlockData("features", list.filter((_: any, i: number) => i !== idx));
    };
    const updateFeature = (idx: number, key: string, val: any) => {
      if (activeIndex === null) return;
      const list = [...(currentBlocks[activeIndex].data.features || [])];
      list[idx] = { ...list[idx], [key]: val };
      updateActiveBlockData("features", list);
    };

    const addFaq = () => {
      if (activeIndex === null) return;
      const list = currentBlocks[activeIndex].data.faqs || [];
      updateActiveBlockData("faqs", [...list, { q: "", a: "" }]);
    };
    const removeFaq = (idx: number) => {
      if (activeIndex === null) return;
      const list = currentBlocks[activeIndex].data.faqs || [];
      updateActiveBlockData("faqs", list.filter((_: any, i: number) => i !== idx));
    };
    const updateFaq = (idx: number, key: string, val: string) => {
      if (activeIndex === null) return;
      const list = [...(currentBlocks[activeIndex].data.faqs || [])];
      list[idx] = { ...list[idx], [key]: val };
      updateActiveBlockData("faqs", list);
    };

    const getBlockLabel = (type: string) => {
      switch (type) {
        case "HeroBanner": return "Banner lớn (Hero Banner)";
        case "Promotions": return "Khuyến mãi lớn (Promotions)";
        case "ThreeSixtyViewer": return "Xoay 360 độ (360 Viewer)";
        case "FeaturesGrid": return "Khung lưới tính năng (Features Grid)";
        case "VersionsGrid": return "Danh sách các phiên bản (Versions Grid)";
        case "SpecsGrid": return "Bảng so sánh thông số (Specs Grid)";
        case "FeaturesList": return "Danh sách công nghệ (Features List)";
        case "AccordionFAQs": return "Câu hỏi thường gặp (Accordion FAQs)";
        case "BookingBanner": return "Tư vấn & Đặt lịch (Booking Banner)";
        default: return type;
      }
    };

    const getBlockIcon = (type: string) => {
      switch (type) {
        case "HeroBanner": return "📢";
        case "Promotions": return "🎁";
        case "ThreeSixtyViewer": return "🔄";
        case "FeaturesGrid": return "🔲";
        case "VersionsGrid": return "🚗";
        case "SpecsGrid": return "📊";
        case "FeaturesList": return "✨";
        case "AccordionFAQs": return "❓";
        case "BookingBanner": return "📞";
        default: return "📦";
      }
    };

    const libraryBlocks = [
      { type: 'HeroBanner', icon: '📢', name: 'Banner lớn (Hero)', desc: 'Banner trần viền ấn tượng, có chữ và nút bấm hành động' },
      { type: 'Promotions', icon: '🎁', name: 'Ưu đãi khuyến mãi', desc: 'Thông tin quà tặng tiền mặt, bảo hiểm và quà độc quyền' },
      { type: 'ThreeSixtyViewer', icon: '🔄', name: 'Trình xem xoay 360°', desc: 'Mô phỏng đổi màu ngoại thất xe và tự do xoay góc nhìn' },
      { type: 'FeaturesGrid', icon: '🔲', name: 'Khung lưới tính năng', desc: 'Bố cục ghép ảnh dạng lưới cho Thiết kế, Nội thất, Công nghệ' },
      { type: 'VersionsGrid', icon: '🚗', name: 'Danh sách các phiên bản', desc: 'So sánh ngắn và hiển thị các phiên bản cùng mức giá' },
      { type: 'SpecsGrid', icon: '📊', name: 'Bảng so sánh thông số', desc: 'So sánh song song thông số chi tiết động cơ, hộp số...' },
      { type: 'FeaturesList', icon: '✨', name: 'Danh sách công nghệ', desc: 'Liệt kê so le các tính năng lái an toàn chủ động' },
      { type: 'AccordionFAQs', icon: '❓', name: 'Câu hỏi thường gặp', desc: 'Các thắc mắc xếp gập về bảo dưỡng, giá lăn bánh' },
      { type: 'BookingBanner', icon: '📞', name: 'Tư vấn & Đặt lịch', desc: 'Khối liên hệ hotline và liên kết đặt lịch hẹn bảo dưỡng' },
    ];

    return (
      <div className="page-builder-container flex flex-col lg:flex-row h-screen w-screen bg-slate-900 border-t border-slate-800 overflow-hidden font-sans text-slate-200 select-none">

        {/* LEFT PANEL: Sidebar Settings */}
        <div className="w-full lg:w-[420px] flex flex-col bg-slate-950 border-r border-slate-800 h-full overflow-hidden shrink-0 select-none">
          {/* Sidebar Header */}
          <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 select-none">
            <div className="flex items-center space-x-2">
              <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse"></span>
              <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Cấu hình giao diện</h3>
            </div>
            {activeIndex !== null && (
              <button
                type="button"
                className="flex items-center text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                onClick={() => setActiveIndex(null)}
              >
                <span className="mr-1">←</span> Danh sách
              </button>
            )}
          </div>

          {/* Tab Buttons (Only shown when not editing a specific block) */}
          {activeIndex === null && (
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 select-none">
              <button
                type="button"
                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${builderTab === 'sections' ? 'bg-[#0562D2] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
                onClick={() => setBuilderTab('sections')}
              >
                📁 Khối hiển thị ({currentBlocks.length})
              </button>
              <button
                type="button"
                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${builderTab === 'library' ? 'bg-[#0562D2] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
                onClick={() => setBuilderTab('library')}
              >
                ✨ Thêm khối mới
              </button>
            </div>
          )}

          {/* Scrollable Content of Left Sidebar */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
            {/* SCENE A: ACTIVE BLOCK DETAILS EDITOR */}
            {activeIndex !== null && activeBlock ? (
              <div className="space-y-5">
                <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-blue-400 mb-1">Đang chỉnh sửa</div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <span>{getBlockIcon(activeBlock.type)}</span>
                    <span>{getBlockLabel(activeBlock.type)}</span>
                  </h4>
                </div>

                <div className="space-y-4">
                  {/* HeroBanner Fields */}
                  {activeBlock.type === "HeroBanner" && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Tiêu đề lớn</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={activeBlock.data.title || ""}
                          onChange={(e) => updateActiveBlockData("title", e.target.value)}
                          placeholder="vd: FORD EVEREST MỚI"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Tagline / Slogan</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={activeBlock.data.tagline || ""}
                          onChange={(e) => updateActiveBlockData("tagline", e.target.value)}
                          placeholder="vd: Dấn bước. Dẫn đầu."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase">Nhãn nút</label>
                          <input
                            type="text"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={activeBlock.data.button_text || ""}
                            onChange={(e) => updateActiveBlockData("button_text", e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase">Liên kết</label>
                          <input
                            type="text"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={activeBlock.data.button_link || ""}
                            onChange={(e) => updateActiveBlockData("button_link", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Ảnh nền Banner</label>
                        {activeBlock.data.background_image && (
                          <img src={activeBlock.data.background_image} className="w-full h-32 object-cover rounded-lg border border-slate-800 mb-2" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const res = await mediaAPI.upload(file);
                              if (res && res.url) updateActiveBlockData("background_image", res.url);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Promotions Fields */}
                  {activeBlock.type === "Promotions" && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Tiêu đề khuyến mãi</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={activeBlock.data.title || ""}
                          onChange={(e) => updateActiveBlockData("title", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Mô tả ngắn</label>
                        <textarea
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none"
                          value={activeBlock.data.description || ""}
                          onChange={(e) => updateActiveBlockData("description", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Nhãn nút</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={activeBlock.data.button_text || ""}
                          onChange={(e) => updateActiveBlockData("button_text", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Ảnh khuyến mãi</label>
                        {activeBlock.data.image && (
                          <img src={activeBlock.data.image} className="w-full h-32 object-cover rounded-lg border border-slate-800 mb-2" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const res = await mediaAPI.upload(file);
                              if (res && res.url) updateActiveBlockData("image", res.url);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ThreeSixtyViewer Fields */}
                  {activeBlock.type === "ThreeSixtyViewer" && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Tiêu đề khối 360</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={activeBlock.data.title || ""}
                          onChange={(e) => updateActiveBlockData("title", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Mô tả ngắn</label>
                        <textarea
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none"
                          value={activeBlock.data.description || ""}
                          onChange={(e) => updateActiveBlockData("description", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* FeaturesGrid Fields */}
                  {activeBlock.type === "FeaturesGrid" && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-800 pb-3 mb-3">
                        <span className="text-xs font-bold text-blue-400"># PHẦN 1: THIẾT KẾ</span>
                        <div className="mt-2 space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Tiêu đề nhóm 1</label>
                            <input
                              type="text"
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none"
                              value={activeBlock.data.title_1 || ""}
                              onChange={(e) => updateActiveBlockData("title_1", e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Ảnh 1 (Ảnh lớn trên)</label>
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full text-xs text-slate-400"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const res = await mediaAPI.upload(file);
                                  if (res && res.url) updateActiveBlockData("image_1", res.url);
                                }
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-400">Ảnh 2 (dưới trái)</label>
                              <input
                                type="file"
                                accept="image/*"
                                className="w-full text-xs text-slate-400"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const res = await mediaAPI.upload(file);
                                    if (res && res.url) updateActiveBlockData("image_2", res.url);
                                  }
                                }}
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-400">Ảnh 3 (dưới phải)</label>
                              <input
                                type="file"
                                accept="image/*"
                                className="w-full text-xs text-slate-400"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const res = await mediaAPI.upload(file);
                                    if (res && res.url) updateActiveBlockData("image_3", res.url);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-b border-slate-800 pb-3 mb-3">
                        <span className="text-xs font-bold text-blue-400"># PHẦN 2: NỘI THẤT</span>
                        <div className="mt-2 space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Tiêu đề nhóm 2</label>
                            <input
                              type="text"
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none"
                              value={activeBlock.data.title_2 || ""}
                              onChange={(e) => updateActiveBlockData("title_2", e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Ảnh nội thất lớn</label>
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full text-xs text-slate-400"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const res = await mediaAPI.upload(file);
                                  if (res && res.url) updateActiveBlockData("image_large", res.url);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-blue-400"># PHẦN 3: ĐỘNG CƠ & CÔNG NGHỆ</span>
                        <div className="mt-2 space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Tiêu đề nhóm 3</label>
                            <input
                              type="text"
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none"
                              value={activeBlock.data.title_3 || ""}
                              onChange={(e) => updateActiveBlockData("title_3", e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Ảnh công nghệ (Trái)</label>
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full text-xs text-slate-400"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const res = await mediaAPI.upload(file);
                                  if (res && res.url) updateActiveBlockData("split_image", res.url);
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Tiêu đề cột thông số (Phải)</label>
                            <input
                              type="text"
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none"
                              value={activeBlock.data.split_title || ""}
                              onChange={(e) => updateActiveBlockData("split_title", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold text-slate-400">Các chỉ số nổi bật:</label>
                              <button
                                type="button"
                                className="text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                                onClick={addSplitFeature}
                              >
                                + Thêm chỉ số
                              </button>
                            </div>
                            {(activeBlock.data.split_features || []).map((feat: any, idx: number) => (
                              <div key={idx} className="flex gap-2 items-center bg-slate-900 border border-slate-855 p-2 rounded-lg relative">
                                <input
                                  type="text"
                                  value={feat.value || ""}
                                  onChange={(e) => updateSplitFeature(idx, "value", e.target.value)}
                                  className="w-1/3 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                  placeholder="vd: 12-inch"
                                />
                                <input
                                  type="text"
                                  value={feat.label || ""}
                                  onChange={(e) => updateSplitFeature(idx, "label", e.target.value)}
                                  className="w-2/3 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                  placeholder="vd: Màn hình"
                                />
                                <button
                                  type="button"
                                  className="text-red-400 hover:text-red-500 font-bold ml-1 text-xs bg-slate-950/60 w-5 h-5 flex items-center justify-center rounded cursor-pointer"
                                  onClick={() => removeSplitFeature(idx)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VersionsGrid Fields */}
                  {activeBlock.type === "VersionsGrid" && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Tiêu đề danh sách phiên bản</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                          value={activeBlock.data.title || ""}
                          onChange={(e) => updateActiveBlockData("title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-300 block">Mô tả ngắn từng phiên bản:</label>
                        {vehicle.versions.map((ver: any, idx: number) => (
                          <div key={ver.id} className="space-y-1 bg-slate-900/50 p-3 border border-slate-800 rounded-xl">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">{ver.name}</span>
                            <textarea
                              value={activeBlock.data.descriptions?.[idx] || ""}
                              onChange={(e) => updateVersionDesc(idx, e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white resize-none h-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder={`Nhập thông tin giới thiệu cho phiên bản ${ver.name}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SpecsGrid Info */}
                  {activeBlock.type === "SpecsGrid" && (
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs leading-relaxed">
                      💡 **Bảng so sánh thông số:** Khối này tự động đồng bộ và lấy dữ liệu các phiên bản của xe để hiển thị trực tiếp. Không cần cấu hình dữ liệu thủ công.
                    </div>
                  )}

                  {/* FeaturesList Fields */}
                  {activeBlock.type === "FeaturesList" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-300">Danh sách tính năng:</label>
                        <button
                          type="button"
                          className="text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                          onClick={addFeature}
                        >
                          + Thêm tính năng
                        </button>
                      </div>
                      {(activeBlock.data.features || []).map((feat: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                          <button
                            type="button"
                            className="absolute top-2.5 right-2.5 text-red-400 hover:text-red-500 font-bold text-xs cursor-pointer"
                            onClick={() => removeFeature(idx)}
                          >
                            ✕ Xóa
                          </button>
                          <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Tính năng #{idx + 1}</span>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Tên tính năng</label>
                            <input
                              type="text"
                              value={feat.title || ""}
                              onChange={(e) => updateFeature(idx, "title", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Mô tả ngắn</label>
                            <textarea
                              value={feat.description || ""}
                              onChange={(e) => updateFeature(idx, "description", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white h-16 resize-none focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Ảnh minh họa</label>
                            {feat.image && (
                              <img src={feat.image} className="w-full h-20 object-cover rounded border border-slate-800 mb-1" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full text-xs text-slate-400"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const res = await mediaAPI.upload(file);
                                  if (res && res.url) updateFeature(idx, "image", res.url);
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AccordionFAQs Fields */}
                  {activeBlock.type === "AccordionFAQs" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-300">Danh sách câu hỏi:</label>
                        <button
                          type="button"
                          className="text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                          onClick={addFaq}
                        >
                          + Thêm câu hỏi
                        </button>
                      </div>
                      {(activeBlock.data.faqs || []).map((faq: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                          <button
                            type="button"
                            className="absolute top-2.5 right-2.5 text-red-400 hover:text-red-500 font-bold text-xs cursor-pointer"
                            onClick={() => removeFaq(idx)}
                          >
                            ✕ Xóa
                          </button>
                          <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Câu hỏi #{idx + 1}</span>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Câu hỏi (Question)</label>
                            <input
                              type="text"
                              value={faq.q || ""}
                              onChange={(e) => updateFaq(idx, "q", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400">Câu trả lời (Answer)</label>
                            <textarea
                              value={faq.a || ""}
                              onChange={(e) => updateFaq(idx, "a", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white h-20 resize-none focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* BookingBanner Fields */}
                  {activeBlock.type === "BookingBanner" && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Tiêu đề Banner</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                          value={activeBlock.data.title || ""}
                          onChange={(e) => updateActiveBlockData("title", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase">Số điện thoại</label>
                          <input
                            type="text"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                            value={activeBlock.data.phone || ""}
                            onChange={(e) => updateActiveBlockData("phone", e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase">Nhãn nút đặt lịch</label>
                          <input
                            type="text"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                            value={activeBlock.data.btn_text || ""}
                            onChange={(e) => updateActiveBlockData("btn_text", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Liên kết đặt lịch</label>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                          value={activeBlock.data.btn_link || ""}
                          onChange={(e) => updateActiveBlockData("btn_link", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Ảnh xe đè</label>
                        {activeBlock.data.car_image && (
                          <img src={activeBlock.data.car_image} className="w-full h-24 object-contain rounded border border-slate-800 mb-1" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-xs text-slate-400"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const res = await mediaAPI.upload(file);
                              if (res && res.url) updateActiveBlockData("car_image", res.url);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : builderTab === 'sections' ? (
              /* SCENE B1: SECTIONS LIST */
              <div className="space-y-3">
                {currentBlocks && currentBlocks.length > 0 ? (
                  currentBlocks.map((block, index) => (
                    <div
                      key={`sidebar-item-${index}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setActiveIndex(index)}
                      className={`flex items-center justify-between bg-slate-900 border p-3.5 rounded-xl cursor-pointer transition select-none group
                        ${activeIndex === index ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'}
                        ${draggedIndex === index ? 'opacity-30 border-dashed border-gray-500' : ''}
                        ${draggedOverIndex === index ? 'border-amber-400 bg-amber-500/5' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="cursor-move p-1 text-slate-500 hover:text-slate-300 transition">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Khối số {index + 1}</span>
                          <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                            <span>{getBlockIcon(block.type)}</span>
                            <span>{getBlockLabel(block.type)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          className="text-xs text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg border border-slate-700 cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          ⚙️
                        </button>
                        <button
                          type="button"
                          className="text-xs text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg border border-slate-700 cursor-pointer"
                          title="Nhân bản"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateBlock(index);
                          }}
                        >
                          ➕
                        </button>
                        <button
                          type="button"
                          className="text-xs text-red-400 hover:text-red-300 bg-slate-800 p-1.5 rounded-lg border border-slate-700 cursor-pointer"
                          title="Xóa"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockDelete(index);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 italic text-xs">
                    Chưa có khối giao diện nào được thêm vào trang xe này. Hãy chọn tab "Thêm khối mới" để bắt đầu thiết kế.
                  </div>
                )}
              </div>
            ) : (
              /* SCENE B2: LIBRARY TABS */
              <div className="grid grid-cols-1 gap-3">
                {libraryBlocks.map((tpl) => (
                  <div
                    key={tpl.type}
                    className="flex items-center p-3.5 bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-900/60 rounded-xl cursor-pointer transition select-none group"
                    onClick={() => handleAddBlock(tpl.type)}
                  >
                    <div className="h-10 w-10 flex items-center justify-center bg-slate-950 border border-slate-850 rounded-lg text-lg group-hover:bg-[#0562D2]/10 group-hover:border-[#0562D2] transition">
                      {tpl.icon}
                    </div>
                    <div className="ml-3.5 flex-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition">{tpl.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{tpl.desc}</p>
                    </div>
                    <span className="text-slate-600 group-hover:text-blue-400 text-xs font-black transition">＋</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Bottom Actions inside left panel */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2 select-none">
            <button
              type="button"
              onClick={handleSaveLayout}
              disabled={saving}
              className="bg-[#0562d2] hover:bg-[#044ea7] disabled:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors shadow-md border-0 h-10 flex items-center justify-center"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-transparent hover:bg-white/5 text-slate-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-lg cursor-pointer transition-colors border border-solid border-slate-800 h-10 flex items-center justify-center"
            >
              Hủy bỏ
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview Container */}
        <div className="flex-1 flex flex-col bg-slate-950 h-full overflow-hidden relative select-none">
          {/* Address Bar Mockup */}
          <div className="flex items-center px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0 select-none">
            <div className="flex space-x-1.5 mr-4 select-none">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            </div>
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-1 px-4 text-slate-500 text-xs font-mono truncate select-all flex items-center space-x-2">
              <span className="text-slate-600">🌐 https://dongnaiford.com.vn/san-pham/{id}</span>
            </div>

            {/* Viewport controls */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 ml-4 select-none shrink-0 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setPreviewViewport("pc");
                  setPreviewWidth("100%");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${previewViewport === 'pc' ? 'bg-[#0562D2] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Màn hình PC (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PC</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewViewport("tablet");
                  setPreviewWidth(768);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${previewViewport === 'tablet' ? 'bg-[#0562D2] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Màn hình Tablet (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewViewport("mobile");
                  setPreviewWidth(375);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${previewViewport === 'mobile' ? 'bg-[#0562D2] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Màn hình Mobile (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Current width badge */}
            {typeof previewWidth === 'number' && (
              <span className="text-[10px] text-blue-400 font-mono font-bold uppercase ml-3 select-none tracking-widest bg-blue-950/80 border border-blue-900 px-2.5 py-1.5 rounded-lg shadow-sm">
                {previewWidth}px
              </span>
            )}

            <span className="text-[10px] text-blue-400 font-bold uppercase ml-4 select-none tracking-widest bg-blue-950/80 border border-blue-900 px-2 py-0.5 rounded hidden xl:inline-block">
              Live Preview
            </span>
          </div>

          {/* Web preview body area */}
          <div className="flex-1 overflow-y-auto bg-slate-900 p-6 scrollbar-thin select-text flex flex-col items-center">
            <div
              ref={previewContainerRef}
              style={{ width: typeof previewWidth === 'number' ? `${previewWidth}px` : previewWidth }}
              className={`relative w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800 text-[#1a1a1a] flex flex-col shrink-0 min-h-full ${isPreviewResizing ? 'duration-0' : 'transition-all duration-300 ease-out'}`}
            >
              {/* Symmetrical resize indicator guide lines */}
              {isPreviewResizing && (
                <>
                  <div className="absolute inset-y-0 -left-[1px] w-[1px] bg-blue-500/50 border-l border-dashed border-blue-500 pointer-events-none z-50 animate-pulse"></div>
                  <div className="absolute inset-y-0 -right-[1px] w-[1px] bg-blue-500/50 border-r border-dashed border-blue-500 pointer-events-none z-50 animate-pulse"></div>
                </>
              )}

              {/* Left Resize Handle */}
              <div
                onMouseDown={(e) => handleResizeStart(e, "left")}
                onTouchStart={(e) => handleResizeTouchStart(e, "left")}
                className="absolute top-0 bottom-0 -left-6 w-6 flex items-center justify-end cursor-col-resize group z-40 select-none"
                title="Kéo để thay đổi kích thước"
              >
                <div className="w-1.5 h-16 rounded-full bg-slate-600/70 group-hover:bg-blue-500 group-hover:h-24 group-active:bg-blue-400 group-active:h-28 transition-all duration-200 shadow-md flex flex-col justify-center gap-1 items-center mr-1">
                  <span className="w-0.5 h-1.5 bg-slate-300 rounded-full"></span>
                  <span className="w-0.5 h-1.5 bg-slate-300 rounded-full"></span>
                  <span className="w-0.5 h-1.5 bg-slate-300 rounded-full"></span>
                </div>
              </div>

              {/* Right Resize Handle */}
              <div
                onMouseDown={(e) => handleResizeStart(e, "right")}
                onTouchStart={(e) => handleResizeTouchStart(e, "right")}
                className="absolute top-0 bottom-0 -right-6 w-6 flex items-center justify-start cursor-col-resize group z-40 select-none"
                title="Kéo để thay đổi kích thước"
              >
                <div className="w-1.5 h-16 rounded-full bg-slate-600/70 group-hover:bg-blue-500 group-hover:h-24 group-active:bg-blue-400 group-active:h-28 transition-all duration-200 shadow-md flex flex-col justify-center gap-1 items-center ml-1">
                  <span className="w-0.5 h-1.5 bg-slate-300 rounded-full"></span>
                  <span className="w-0.5 h-1.5 bg-slate-300 rounded-full"></span>
                  <span className="w-0.5 h-1.5 bg-slate-300 rounded-full"></span>
                </div>
              </div>

              {/* Simulated Navigation Bar */}
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center select-none shrink-0">
                <span className="text-[#00095b] font-black text-sm tracking-tight">DONGNAI <span className="text-[#0562d2]">FORD</span></span>
                <div className="flex space-x-4 text-xs font-bold text-gray-500">
                  <span>Sản phẩm</span>
                  <span>Dịch vụ</span>
                  <span>Bảng giá</span>
                  <span>Liên hệ</span>
                </div>
                <span className="bg-[#0562d2] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full select-none">Đăng ký lái thử</span>
              </div>

              {/* Live Blocks rendered inside preview */}
              <div className="bg-[#fafafa]">
                {blocksWithAnchors[0]?.type === "HeroBanner" && (
                  <Blocks
                    layout={[blocksWithAnchors[0]]}
                    vehicle={vehicle}
                    openQuoteDrawer={openQuoteDrawer}
                    openDriveModal={() => setShowDriveModal(true)}
                    isEditMode={true}
                    onChangeBlock={(idx, data) => handleBlockChange(0, data)}
                    onMoveBlock={(idx, dir) => handleBlockMove(0, dir)}
                    onDeleteBlock={(idx) => handleBlockDelete(0)}
                    threeSixtyProps={threeSixtyPropsObj}
                    startIndex={0}
                    totalBlocks={blocksWithAnchors.length}
                    activeIndex={activeIndex}
                    onSelectBlock={(idx) => setActiveIndex(idx)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    draggedIndex={draggedIndex}
                    draggedOverIndex={draggedOverIndex}
                  />
                )}

                <div className="bg-white border-b border-[#e5e5e5] shadow-xs select-none">
                  <div className="mx-auto px-6 w-full flex items-center gap-[32px]">
                    <p className="font-semibold text-[#1a1a1a] text-[13px] uppercase">
                      {vehicle.name}
                    </p>
                    <div className="h-[20px] w-[1px] bg-[#e5e5e5]" />
                    <div className="flex items-center gap-[18px] py-0.5 text-xs text-gray-550 font-medium font-sans">
                      {navigationTabs.map((tab) => (
                        <span key={tab.id} className={`py-3 border-b-2 ${activeTab === tab.id ? 'text-[#0562d2] border-[#0562d2]' : 'border-transparent'}`}>{tab.label}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-12 pb-12">
                  <Blocks
                    layout={blocksWithAnchors[0]?.type === "HeroBanner" ? blocksWithAnchors.slice(1) : blocksWithAnchors}
                    vehicle={vehicle}
                    openQuoteDrawer={openQuoteDrawer}
                    openDriveModal={() => setShowDriveModal(true)}
                    isEditMode={true}
                    onChangeBlock={(idx, data) => handleBlockChange(blocksWithAnchors[0]?.type === "HeroBanner" ? idx + 1 : idx, data)}
                    onMoveBlock={(idx, dir) => handleBlockMove(blocksWithAnchors[0]?.type === "HeroBanner" ? idx + 1 : idx, dir)}
                    onDeleteBlock={(idx) => handleBlockDelete(blocksWithAnchors[0]?.type === "HeroBanner" ? idx + 1 : idx)}
                    threeSixtyProps={threeSixtyPropsObj}
                    startIndex={blocksWithAnchors[0]?.type === "HeroBanner" ? 1 : 0}
                    totalBlocks={blocksWithAnchors.length}
                    activeIndex={activeIndex}
                    onSelectBlock={(idx) => setActiveIndex(idx)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    draggedIndex={draggedIndex}
                    draggedOverIndex={draggedOverIndex}
                  />
                  {!currentBlocks.some(b => b.type === "BookingBanner") && <BookingBanner />}
                </div>

              </div>

              <div className="bg-[#111] text-gray-400 py-6 px-6 text-center text-[10px] select-none">
                <p>© 2026 DONG NAI FORD. All rights reserved. Trình xem trước giao diện trực quan.</p>
              </div>

            </div>
          </div>
        </div>

        {/* Root level modals rendered inside split screen too */}
        {showDriveModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-black rounded-lg w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 relative">
              <div className="bg-[#00095b] text-white p-6 relative">
                <h3 className="text-lg font-bold uppercase tracking-wide">Đăng Ký Lái Thử Xe</h3>
                <button onClick={() => setShowDriveModal(false)} className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer bg-transparent border-0">✕</button>
              </div>
              <div className="p-6">Form lái thử giả lập hoạt động bình thường...</div>
            </div>
          </div>
        )}
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-black rounded-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 relative p-6">
              <h3 className="text-lg font-bold text-[#0562d2] mb-4">Dự toán lăn bánh</h3>
              <p className="text-sm">Bảng tính chi phí lăn bánh giả lập hoạt động bình thường...</p>
              <button onClick={() => setShowQuoteModal(false)} className="mt-4 bg-[#0562d2] text-white px-4 py-2 rounded font-semibold cursor-pointer">Đóng</button>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans">

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
            activeIndex={activeIndex}
            onSelectBlock={handleSelectBlock}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            draggedIndex={draggedIndex}
            draggedOverIndex={draggedOverIndex}
          />
        )}

        {/* 3. Sticky Tab Navigation Bar */}
        <div className="sticky-tabs bg-white border-b border-[#e5e5e5] shadow-xs">
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-[32px] overflow-hidden">
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

            {/* Compare Toggle Button */}
            <button
              onClick={() => toggleCompare(vehicle.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 border cursor-pointer select-none shrink-0 ${compareIds.includes(vehicle.id)
                ? "bg-[#0562D2] text-white border-[#0562D2] shadow-sm animate-pulse"
                : "bg-white text-gray-700 hover:text-[#0562D2] border-gray-250 hover:bg-gray-50"
                }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {compareIds.includes(vehicle.id) ? "Đã thêm so sánh" : "So sánh xe"}
              </span>
            </button>
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
            activeIndex={activeIndex}
            onSelectBlock={handleSelectBlock}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            draggedIndex={draggedIndex}
            draggedOverIndex={draggedOverIndex}
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
                          <option value="Khác">Khu vực khác</option>
                        </>
                      )}
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
                            <option value="Khác">Khu vực khác</option>
                          </>
                        )}
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
                          <option value="Khác">Khu vực khác</option>
                        </>
                      )}
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
      {isEditMode && !isEmbedded && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center gap-4 min-w-[320px] max-w-[90vw] md:max-w-2xl text-left select-none">
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

      {!isEditMode && !isEmbedded && (
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
