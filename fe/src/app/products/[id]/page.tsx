"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { contactsAPI } from "@/lib/api";
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

  // Find the vehicle based on ID
  const vehicle = vehicles.find((v) => v.id === id);
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

    const selVer = selVeh.versions?.find((ver) => ver.id === selectedVersionId) || selVeh.versions?.[0];
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
    const isSevenSeats = selVeh.id.includes("everest") || selVeh.id.includes("transit") || selVeh.typeName.includes("7 Chỗ") || selVeh.typeName.includes("16 Chỗ");
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

      const sections = [
        { id: "overview", tab: "overview" },
        { id: "360-viewer", tab: "360" },
        { id: "versions-section", tab: "versions" },
        { id: "features-section", tab: "features" }
      ];

      const isDesktop = window.innerWidth >= 1024;
      const threshold = isDesktop ? 170 : 138;

      let activeSectionTab: ActiveTab | null = null;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= threshold) {
            activeSectionTab = section.tab as ActiveTab;
          }
        }
      }

      if (activeSectionTab) {
        setActiveTab((prev) => {
          if (prev === "compare" || prev === activeSectionTab) return prev;
          return activeSectionTab;
        });
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
    };
  }, []);

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
  const activeVersion = vehicle.versions[activeVersionIndex] || vehicle.versions[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const compareItems = vehicle.versions.length > 1
    ? vehicle.versions.map((ver, idx) => ({
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
        productTitle = `${vehicle.name} - ${activeVersion.name}`;
        note = formData.note || `Đăng ký lái thử xe ${vehicle.name} - ${activeVersion.name}`;
      } else if (showQuoteModal) {
        const selVeh = vehicles.find(v => v.id === selectedVehicleId) || vehicle;
        const selVer = selVeh.versions.find(v => v.id === selectedVersionId) || selVeh.versions[0];
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

      {/* 2. Vehicle Hero Banner (14144:5566) */}
      <section className="relative h-[600px] flex items-end overflow-hidden bg-black text-white pb-[68px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={vehicle.id === "new-territory" ? "/assets/territory-hero.png" : vehicle.images[0]} 
            alt={vehicle.name}
            fill
            sizes="100vw"
            className="object-cover object-center pointer-events-none"
            priority
          />
          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent h-[170px] z-10" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full relative z-20">
          <div className="content-stretch flex flex-col gap-[24px] items-start justify-center py-[24px]">
            <h1 className="font-['Ford_Antenna',sans-serif] font-semibold text-[48px] text-white tracking-[-0.96px] leading-[1.2] uppercase">
              {vehicle.name}
            </h1>
            
            <div className="flex gap-[12px] items-start">
              <button 
                onClick={() => setShowDriveModal(true)}
                className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer shadow-md"
              >
                Book Lái thử
              </button>
              <button 
                onClick={() => openQuoteDrawer(vehicle.id, activeVersion.id)}
                className="bg-transparent hover:bg-white/10 border border-solid border-white flex gap-[8px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer"
              >
                Tải Catalogue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sticky Tab Navigation Bar */}
      <div className="sticky-tabs bg-white border-b border-[#e5e5e5] shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex items-center gap-[32px] justify-between sm:justify-start">
          <p className="font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[14px] whitespace-nowrap hidden sm:block">
            {vehicle.name}
          </p>
          <div className="h-[24px] w-[1px] bg-[#e5e5e5] hidden sm:block" />
          
          <div className="flex items-center overflow-x-auto scrollbar-none gap-[16px] sm:gap-[24px] py-1">
            {([
              { id: "overview", label: "Tổng quan" },
              { id: "360", label: "360 Viewer" },
              { id: "versions", label: "Phiên bản" },
              { id: "features", label: "Tính năng" },
              { id: "compare", label: "So sánh" },
              { id: "accessories", label: "Phụ kiện" }
            ] as { id: ActiveTab; label: string }[]).map((tab) => {
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

      {/* Main unified layout sections */}
      <div className="space-y-16">
        {activeTab !== "compare" ? (
          <>
            {/* 4. Promotions Section */}
            <section id="overview" className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-[72px]">
          <div className="flex flex-col gap-[32px] items-center">
            
            <div className="flex flex-col gap-[24px] items-start pt-[32px] w-full max-w-[1152px]">
              <div className="flex flex-col gap-[12px] items-start">
                <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
                  {media.promoTitle}
                </h2>
                <p className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[18px] leading-[1.5]">
                  {media.promoDesc}
                </p>
              </div>
              <button 
                onClick={() => openQuoteDrawer(vehicle.id, activeVersion.id)}
                className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer"
              >
                Báo giá
              </button>
            </div>

            <div className="w-full mt-4">
              <Image 
                src={media.promoImage} 
                alt="Promotion Banner"
                width={1100}
                height={600}
                className="object-cover rounded-[12px] w-full h-auto shadow-xs"
                priority
              />
            </div>

          </div>
        </section>

        {/* 5. 360-Viewer & Color Picker Section */}
        <section id="360-viewer" className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-16 border-t border-[#e5e5e5]">
          <div className="flex flex-col gap-[32px] items-start w-full">
            
            <div className="flex flex-col items-start pt-[32px] w-full max-w-[1152px] gap-[12px]">
              <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2] uppercase">
                {vehicle.id === "mustang-fastback" ? "360° Colorizer & Viewer" : "Khám phá không gian đa chiều"}
              </h2>
              <p className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[18px] leading-[1.5]">
                {vehicle.id === "mustang-fastback" 
                  ? "Tùy biến ngoại thất và nội thất theo phong cách riêng của bạn. Kéo để xoay 360 độ hoặc chọn màu sơn và mâm xe."
                  : vehicle.id === "new-territory" 
                    ? "Diện mạo mới đầy cuốn hút! Bảng màu độc đáo: Đỏ Hỏa Tinh, Xanh Biển Sâu, và Xám Ánh Trăng."
                    : `Khám phá các sắc màu ngoại thất và chi tiết phiên bản của xe ${vehicle.name}.`}
              </p>
            </div>

            {/* Official Ford 360 Colorizer wrapper */}
            <div className="cmp-360-colorizer-wrapper w-full">
              <div id="360Colorizer" aria-label="360 Viewer" className="cmp-360-colorizer">
                <div className={`model-wrapper ${viewType}`}>
                  
                  {/* Trim dropdown selector */}
                  <div className="cmp-360-colorizer__vehicle-variation-container">
                    <div 
                      className="dropdown trimAware__dropdown dropdown-trim dropdownWrapper" 
                      aria-expanded={isTrimDropdownOpen}
                    >
                      <div id="trimAware-label" className="sr-only">"Select A Trim"</div>
                      <div 
                        className="dropdown-trigger" 
                        role="combobox" 
                        tabIndex={0} 
                        aria-controls="listbox1" 
                        aria-expanded={isTrimDropdownOpen}
                        aria-haspopup="listbox"
                        onClick={() => setIsTrimDropdownOpen(!isTrimDropdownOpen)}
                        onBlur={() => setTimeout(() => setIsTrimDropdownOpen(false), 200)}
                      >
                        <div className="dropdown-activeTrim">{vehicle.versions[activeVersionIndex]?.name || vehicle.name}</div>
                        <div className="dropdown-active__icon">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="dropdown-menu-wrapper" id="dropdown-menu-wrapper" role="listbox" aria-labelledby="trimAware-label" tabIndex={-1}>
                        {vehicle.versions.map((ver, idx) => (
                          <div 
                            key={ver.id}
                            id={`option-${idx}`} 
                            className={`dropdown-item trimAware__item trimAware__item--enable ${activeVersionIndex === idx ? "active-option" : ""}`}
                            role="option" 
                            aria-selected={activeVersionIndex === idx}
                            onClick={() => {
                              setActiveVersionIndex(idx);
                              setIsTrimDropdownOpen(false);
                            }}
                          >
                            {ver.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Exterior / Interior View Toggle */}
                  <div className="toggle-wrapper">
                    <div className="model-view toggle-container">
                      <div className="toggle" role="tablist">
                        <button 
                          type="button"
                          className={`toggle-option border-0 cursor-pointer ${viewType === "exterior" ? "active" : "bg-transparent"}`} 
                          role="tab" 
                          aria-selected={viewType === "exterior"}
                          tabIndex={0} 
                          aria-label="Exterior"
                          onClick={() => setViewType("exterior")}
                        >
                          Exterior
                        </button>
                        <button 
                          type="button"
                          className={`toggle-option border-0 cursor-pointer ${viewType === "interior" ? "active" : "bg-transparent"}`} 
                          role="tab" 
                          aria-selected={viewType === "interior"}
                          tabIndex={0} 
                          aria-label="Interior"
                          onClick={() => {
                            setViewType("interior");
                            setIs360Active(true);
                          }}
                        >
                          Interior
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* View wrappers based on view type */}
                  <div>
                    {/* EXTERIOR VIEW SELECTORS */}
                    <div className={`view-wrapper ${viewType === "exterior" ? "show" : ""}`} data-toggle="exterior">
                      {/* Desktop Color Selector */}
                      <div className="exteriorPaint">
                        <div className="color-selector-container">
                          <div className="color-selector" role="radiogroup">
                            {vehicle.colors.map((color, idx) => (
                              <div 
                                key={color.name}
                                className={`color-container ${selectedColorIndex === idx ? "selected" : ""}`}
                                role="radio" 
                                aria-checked={selectedColorIndex === idx}
                                tabIndex={0}
                                onClick={() => setSelectedColorIndex(idx)}
                                title={color.name}
                              >
                                <div className="color" style={{ backgroundColor: color.hex }}></div>
                                <span className="sr-only">{color.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="paint-color">
                          Paint Color: <span className="uppercase text-[#0562D2]">{vehicle.colors[selectedColorIndex]?.name}</span>
                        </div>
                      </div>

                      {/* Mobile Color Selector trigger & popover */}
                      <div className="exterior-paint-mobile">
                        <div 
                          className="selector-small" 
                          role="button" 
                          aria-label="Expand colors" 
                          onClick={() => setIsMobileColorOpen(!isMobileColorOpen)}
                        >
                          <div className="selector-container-mobile">
                            <div className="color" style={{ backgroundColor: vehicle.colors[selectedColorIndex]?.hex }}></div>
                          </div>
                        </div>
                        <div className={`popover ${isMobileColorOpen ? "" : "closed"}`}>
                          <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                            <div>
                              <div className="paint-color-label text-[10px] font-bold text-gray-400 uppercase">Paint Color:</div>
                              <div className="paint-color-name text-xs font-semibold">{vehicle.colors[selectedColorIndex]?.name}</div>
                            </div>
                            <button 
                              type="button"
                              className="popover_cross-btn border-0 bg-transparent" 
                              onClick={() => setIsMobileColorOpen(false)}
                            >
                              <div className="popover_cross"></div>
                            </button>
                          </div>
                          <div className="color-selector flex flex-wrap gap-2 pt-2">
                            {vehicle.colors.map((color, idx) => (
                              <div 
                                key={color.name}
                                className={`color-container ${selectedColorIndex === idx ? "selected" : ""}`}
                                role="radio" 
                                aria-checked={selectedColorIndex === idx}
                                onClick={() => {
                                  setSelectedColorIndex(idx);
                                  setIsMobileColorOpen(false);
                                }}
                              >
                                <div className="color" style={{ backgroundColor: color.hex }}></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Desktop Wheel Selector */}
                      <div className="wheelTypes">
                        <div className="wheel-selector-container">
                          <div className="cmp-360-wheeltype" role="radiogroup">
                            <div 
                              className={`wheel-container ${selectedWheel === "64f" ? "selected" : ""}`}
                              role="radio" 
                              aria-checked={selectedWheel === "64f"} 
                              tabIndex={0}
                              onClick={() => setSelectedWheel("64f")}
                              title='18" Painted Shadow Silver Cast Aluminum Wheels'
                            >
                              <img 
                                className="wheel-image" 
                                src="/assets/figma_card_bg.png" 
                                alt='18" Painted Shadow Silver Cast Aluminum Wheels'
                                onError={(e) => {
                                  // fallback image if figma_card_bg doesn't load
                                  (e.target as HTMLImageElement).src = "/images/ford_placeholder.png";
                                }}
                              />
                            </div>
                          </div>
                          <div className="wheel-name text-[10px] font-bold text-gray-700">
                            18" Shadow Silver
                          </div>
                        </div>
                      </div>

                      {/* Mobile Wheel Selector trigger & popover */}
                      <div className="wheelTypesMobile">
                        <div 
                          className="selector-small" 
                          role="button" 
                          aria-label="Expand wheels" 
                          onClick={() => setIsMobileWheelOpen(!isMobileWheelOpen)}
                        >
                          <div className="selector-container-mobile">
                            <img className="wheel-image bg-white" src="/assets/figma_card_bg.png" alt="Wheel option" />
                          </div>
                        </div>
                        <div className={`popover ${isMobileWheelOpen ? "" : "closed"}`}>
                          <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                            <div>
                              <div className="wheel-label text-[10px] font-bold text-gray-400 uppercase">Wheels and Tires:</div>
                              <div className="wheel-name text-xs font-semibold">18" Painted Shadow Silver Cast Aluminum Wheels</div>
                            </div>
                            <button 
                              type="button"
                              className="popover_cross-btn border-0 bg-transparent" 
                              onClick={() => setIsMobileWheelOpen(false)}
                            >
                              <div className="popover_cross"></div>
                            </button>
                          </div>
                          <div className="cmp-360-wheeltype pt-2">
                            <div 
                              className="wheel-container selected" 
                              role="radio" 
                              aria-checked={true}
                              onClick={() => setIsMobileWheelOpen(false)}
                            >
                              <img className="wheel-image" src="/assets/figma_card_bg.png" alt='18" Wheels' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* INTERIOR VIEW SELECTORS */}
                    <div className={`view-wrapper ${viewType === "interior" ? "show" : ""}`} data-toggle="interior">
                      {/* Desktop Interior Colors */}
                      <div className="interiorColors">
                        <div className="color-selector-container">
                          <div className="color-selector interior" role="radiogroup">
                            <div 
                              className={`color-container ${selectedInteriorColorIndex === 0 ? "selected" : ""}`} 
                              role="radio" 
                              aria-checked={selectedInteriorColorIndex === 0} 
                              tabIndex={0}
                              onClick={() => setSelectedInteriorColorIndex(0)}
                              title="Black Onyx"
                            >
                              <div className="color" style={{ backgroundColor: "#1b1a1a" }}></div>
                            </div>
                            <div 
                              className={`color-container ${selectedInteriorColorIndex === 1 ? "selected" : ""}`} 
                              role="radio" 
                              aria-checked={selectedInteriorColorIndex === 1} 
                              tabIndex={0}
                              onClick={() => setSelectedInteriorColorIndex(1)}
                              title="Space Gray"
                            >
                              <div className="color" style={{ backgroundColor: "#c8c6c4" }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="paint-color interior">
                          Interior: <span className="uppercase text-[#0562D2]">{selectedInteriorColorIndex === 0 ? "Black Onyx" : "Space Gray"}</span>
                        </div>
                      </div>

                      {/* Mobile Interior Colors trigger & popover */}
                      <div className="interior-paint-mobile">
                        <div 
                          className="selector-small" 
                          role="button" 
                          aria-label="Expand interior colors" 
                          onClick={() => setIsMobileInteriorColorOpen(!isMobileInteriorColorOpen)}
                        >
                          <div className="selector-container-mobile">
                            <div className="color" style={{ backgroundColor: selectedInteriorColorIndex === 0 ? "#1b1a1a" : "#c8c6c4" }}></div>
                          </div>
                        </div>
                        <div className={`popover ${isMobileInteriorColorOpen ? "" : "closed"}`}>
                          <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                            <div>
                              <div className="paint-color-label text-[10px] font-bold text-gray-400 uppercase">Interior Cabin:</div>
                              <div className="paint-color-name text-xs font-semibold">{selectedInteriorColorIndex === 0 ? "Black Onyx" : "Space Gray"}</div>
                            </div>
                            <button 
                              type="button"
                              className="popover_cross-btn border-0 bg-transparent" 
                              onClick={() => setIsMobileInteriorColorOpen(false)}
                            >
                              <div className="popover_cross"></div>
                            </button>
                          </div>
                          <div className="color-selector flex gap-2 pt-2">
                            <div 
                              className={`color-container ${selectedInteriorColorIndex === 0 ? "selected" : ""}`}
                              onClick={() => {
                                setSelectedInteriorColorIndex(0);
                                setIsMobileInteriorColorOpen(false);
                              }}
                            >
                              <div className="color" style={{ backgroundColor: "#1b1a1a" }}></div>
                            </div>
                            <div 
                              className={`color-container ${selectedInteriorColorIndex === 1 ? "selected" : ""}`}
                              onClick={() => {
                                setSelectedInteriorColorIndex(1);
                                setIsMobileInteriorColorOpen(false);
                              }}
                            >
                              <div className="color" style={{ backgroundColor: "#c8c6c4" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Preview Canvas */}
                  <div 
                    className="car-image-container select-none cursor-grab active:cursor-grabbing w-full h-[400px] md:h-[580px] relative overflow-hidden"
                    onMouseDown={is360Active && isImageSequence ? handleMouseDown : undefined}
                    onMouseMove={is360Active && isImageSequence ? handleMouseMove : undefined}
                    onMouseUp={is360Active && isImageSequence ? handleMouseUpOrLeave : undefined}
                    onMouseLeave={is360Active && isImageSequence ? handleMouseUpOrLeave : undefined}
                    onTouchStart={is360Active && isImageSequence ? handleTouchStart : undefined}
                    onTouchMove={is360Active && isImageSequence ? handleTouchMove : undefined}
                    onTouchEnd={is360Active && isImageSequence ? handleMouseUpOrLeave : undefined}
                  >
                    {is360Active ? (
                      // 360 ACTIVE MODE
                      viewType === "exterior" ? (
                        // Exterior 360 rotation view (Loads either real Mustang frames or fallback)
                        <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-50/50">
                          
                          {/* Warped drop shadow that reacts to rotation */}
                          <div 
                            className="absolute bottom-8 w-[60%] h-6 bg-black/15 blur-md rounded-[100%] transition-transform duration-100 pointer-events-none"
                            style={{
                              transform: `scaleX(${1 - Math.abs(tilt) / 40}) scaleY(${1 - Math.abs(rotation % 180 - 90) / 180}) rotateZ(${rotation * 0.05}deg)`,
                            }}
                          />

                          {/* Responsive rotation picture tag */}
                          {renderCarPicture()}

                          {/* Glossy Metallic light reflection sweep */}
                          <div 
                            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25"
                            style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                              transform: `translateX(${(rotation % 360) * 3 - 540}px)`,
                              width: '100%',
                            }}
                          />

                        </div>
                      ) : (
                        // Interior 360 WebGL panorama (Three.js canvas) or 36-frame static sequence for Mustang
                        vehicle.id === "mustang-fastback" ? (
                          <div className="cmp-360-image-container w-full h-full relative" id={`${vehicle.versions[activeVersionIndex]?.id || "ecoboostfastback"}-interior-${selectedInteriorColorIndex === 0 ? "black-onyx" : "space-gray"}`} tabIndex={0}>
                            {Array.from({ length: 36 }, (_, i) => {
                              const currentIdx = i + 1;
                              const interiorFrameIdx = Math.floor(((rotation % 360 + 360) % 360) / (360 / 36)) + 1;
                              const isActive = currentIdx === interiorFrameIdx;
                              
                              const activeTrim = vehicle.versions[activeVersionIndex]?.id || "ecoboostfastback";
                              const colorId = selectedInteriorColorIndex === 0 ? "black-onyx" : "space-gray";
                              
                              let desktopUrl = `https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/mustang/2026/360/${activeTrim}/interior/desktop/${colorId}/00${currentIdx}-${colorId}.jpeg`;
                              let tabletUrl = `https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/mustang/2026/360/${activeTrim}/interior/tablet/${colorId}/00${currentIdx}-${colorId}.jpeg`;
                              let mobileUrl = `https://www.ford.com/acslibs/content/dam/na/ford/en_us/images/mustang/2026/360/${activeTrim}/interior/mobile/${colorId}/00${currentIdx}-${colorId}.jpeg`;
                              
                              // Use local paths for EcoBoost Fastback combination if downloaded
                              if (activeTrim === "ecoboostfastback") {
                                const localPath = `/images/360/mustang/${activeTrim}/interior/desktop/${colorId}/00${currentIdx}-${colorId}.jpeg`;
                                if (!failedImages[localPath]) {
                                  desktopUrl = localPath;
                                  tabletUrl = localPath;
                                  mobileUrl = localPath;
                                }
                              }
                              
                              return (
                                <picture 
                                  key={currentIdx}
                                  id={`${activeTrim}-interior-${colorId}~${currentIdx}`} 
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
                                    alt={`${colorId}-${currentIdx}`} 
                                    className="max-h-[420px] md:max-h-[480px] w-auto object-contain select-none pointer-events-none"
                                    loading="eager"
                                    onError={() => {
                                      const localPath = `/images/360/mustang/${activeTrim}/interior/desktop/${colorId}/00${currentIdx}-${colorId}.jpeg`;
                                      setFailedImages((prev) => ({ ...prev, [localPath]: true }));
                                    }}
                                  />
                                </picture>
                              );
                            })}
                            
                          </div>
                        ) : (
                          <div 
                            ref={threeRef}
                            className="relative w-full h-full overflow-hidden bg-black"
                          >
                            {!threeLoaded && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white gap-3 z-10">
                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs font-bold uppercase tracking-wider">Đang khởi tạo cabin 3D...</span>
                              </div>
                            )}
                            
                          </div>
                        )
                      )
                    ) : (
                      // 360 STATIC PREVIEW WITH PLAY TRIGGER
                      <>
                        <Image 
                          src={vehicle.id === "mustang-fastback"
                            ? `/images/360/mustang/ecoboostfastback/exterior/desktop/adriatic-blue-green/64f/001-adriatic-blue-green-64f.jpeg`
                            : vehicle.id === "new-territory"
                              ? (viewType === "exterior" ? "/assets/territory-3d.png" : "/assets/territory-interior.png")
                              : (viewType === "exterior" ? vehicle.images[0] : media.splitLeft)}
                          alt="3D vehicle preview"
                          fill
                          sizes="(max-width: 1440px) 100vw, 1152px"
                          className="object-cover pointer-events-none"
                        />
                        
                        {/* Play / Interactive Overlay Trigger */}
                        <button 
                          type="button"
                          onClick={() => setIs360Active(true)}
                          className="absolute bg-black/40 hover:bg-black/60 hover:scale-105 active:scale-95 transition-all p-[12px] rounded-[800px] border-0 cursor-pointer flex flex-col items-center justify-center size-[96px] z-10 text-white gap-1 group left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          aria-label="Play 3D viewer"
                        >
                          <Image src="/assets/play-icon.svg" alt="Play" width={32} height={32} className="size-[32px] brightness-0 invert" />
                          <span className="text-[10px] font-bold uppercase tracking-wider group-hover:underline">Bật 360°</span>
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/85 backdrop-blur-xs text-white text-[12px] font-semibold px-4 py-2 rounded-[4px] shadow-sm z-10 whitespace-nowrap">
                          <span>Ngoại thất: {vehicle.colors[selectedColorIndex]?.name}</span>
                          <span className="mx-2 opacity-50">|</span>
                          <span>Phiên bản: {vehicle.versions[activeVersionIndex]?.name}</span>
                        </div>
                      </>
                    )}

                    {/* 360 Control Toolbar Buttons */}
                    {is360Active && (
                      <>
                        {/* Close / Quit 360 mode button */}
                        <button
                          type="button"
                          onClick={() => {
                            setIs360Active(false);
                            setRotation(0);
                            setTilt(0);
                            setPan({ x: 0, y: 0 });
                          }}
                          className="absolute top-[80px] right-4 md:top-[28px] md:left-[368px] md:right-auto bg-black/75 hover:bg-black text-white px-4 py-2 rounded-full border-0 cursor-pointer text-xs font-bold transition-all shadow-md z-40 flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tắt 360°</span>
                        </button>

                        {/* Register drive button */}
                        <button
                          type="button"
                          onClick={() => setShowDriveModal(true)}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0562D2] hover:bg-[#044ea7] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full border-0 cursor-pointer shadow-md transition-all z-20 whitespace-nowrap"
                        >
                          Đăng ký lái thử thực tế
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 6. Features Section */}
        <section id="features-section" className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-16 border-t border-[#e5e5e5]">
          <div className="flex flex-col gap-[48px] items-center">
            
            {/* Title 1 */}
            <div className="flex flex-col items-center pt-[32px] px-[48px] w-full max-w-[1152px] text-center">
              <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
                Thiết kế hiện đại, sắc sảo, đầy cuốn hút
              </h2>
            </div>

            {/* Images Grid */}
            <div className="flex flex-col gap-[24px] items-start w-full">
              <div className="aspect-[1100/600] relative rounded-[12px] overflow-hidden w-full bg-gray-150 shadow-xs">
                <Image src={media.grid1} alt="Feature Grid Large" fill sizes="(max-width: 1440px) 100vw, 1152px" className="object-cover" />
              </div>
              <div className="flex gap-[24px] items-start w-full flex-col sm:flex-row">
                <div className="aspect-[1100/600] flex-1 relative rounded-[12px] overflow-hidden bg-gray-150 shadow-xs w-full">
                  <Image src={media.grid2} alt="Feature Grid Small 1" fill sizes="(max-width: 768px) 100vw, 564px" className="object-cover" />
                </div>
                <div className="aspect-[1100/600] flex-1 relative rounded-[12px] overflow-hidden bg-gray-150 shadow-xs w-full">
                  <Image src={media.grid3} alt="Feature Grid Small 2" fill sizes="(max-width: 768px) 100vw, 564px" className="object-cover" />
                </div>
              </div>
            </div>

            {/* Title 2 */}
            <div className="flex flex-col items-center pt-[32px] px-[48px] w-full max-w-[1152px] text-center mt-8">
              <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
                Không gian nội thất rộng rãi, tiện nghi
              </h2>
            </div>

            {/* Full Height Interior Showcase Image */}
            <div className="h-[400px] sm:h-[800px] relative rounded-[12px] overflow-hidden w-full bg-gray-150 shadow-xs">
              <Image src={media.bannerLarge} alt="Interior Showcase" fill sizes="(max-width: 1440px) 100vw, 1152px" className="object-cover" />
            </div>

            {/* Title 3 */}
            <div className="flex flex-col items-center pt-[32px] px-[48px] w-full max-w-[1152px] text-center mt-8">
              <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
                Nâng tầm công nghệ và tiện nghi <br className="hidden sm:inline" /> Tận hưởng trên mọi hành trình
              </h2>
            </div>

            {/* Technology split view: Left image, right navy specifications card */}
            <div className="flex flex-col lg:flex-row gap-[4px] h-auto lg:h-[660px] items-stretch justify-center w-full">
              <div className="flex-1 min-h-[350px] relative rounded-t-[12px] lg:rounded-t-none lg:rounded-l-[12px] overflow-hidden bg-gray-150 shadow-xs">
                <Image src={media.splitLeft} alt="Technology detail split" fill sizes="(max-width: 1024px) 100vw, 668px" className="object-cover" />
              </div>
              <div className="bg-[#0562d2] flex flex-col h-full items-start px-[24px] py-[32px] rounded-b-[12px] lg:rounded-b-none lg:rounded-r-[12px] shrink-0 w-full lg:w-[480px] text-white">
                <div className="flex flex-col justify-between h-full w-full min-h-[400px]">
                  <h3 className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] sm:text-[36px] leading-[1.32] pb-6 border-b border-white/20">
                    {media.splitTitle}
                  </h3>
                  
                  {/* Feature indicators list */}
                  <div className="flex flex-col gap-[28px] pt-8">
                    {media.features.map((feat, idx) => {
                      const splitFeat = feat.split(" ");
                      const highlightVal = splitFeat[0];
                      const remainVal = splitFeat.slice(1).join(" ");
                      
                      return (
                        <div key={idx} className="flex flex-col gap-[4px] items-start w-full">
                          <p className="font-['Ford_Antenna',sans-serif] font-semibold text-[32px] leading-[1.2]">
                            {highlightVal}
                          </p>
                          <p className="font-['Ford_Antenna',sans-serif] font-normal text-[16px] leading-[1.5] text-white/90">
                            {remainVal}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 7. Versions Grid Section */}
        <section id="versions-section" className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-16 border-t border-[#e5e5e5]">
          <div className="flex flex-col gap-[32px] items-center">
            
            <div className="flex flex-col items-center pt-[32px] w-full max-w-[1152px] text-center">
              <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
                Các mẫu xe Ford {vehicle.name.replace("NEW ", "")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] w-full">
              {vehicle.versions.map((ver, idx) => {
                const isSelected = activeVersionIndex === idx;
                
                // Get descriptions based on index/figma content
                const desc = idx === 0 
                  ? `Ford Territory ${ver.name.replace("Territory ", "")} 2026 xe SUV 5 chỗ cao cấp của Ford gây ấn tượng mạnh với thiết kế đặc biệt sắc sảo và công nghệ tối tân. Khám phá và đăng ký lái thử ngay!`
                  : idx === 1 
                    ? `Ford Territory ${ver.name.replace("Territory ", "")} 2026 vượt trội cùng nhiều nét độc đáo về thiết kế, công nghệ. Một lựa chọn xe SUV 5 chỗ lý tưởng. Khám phá chi tiết và đăng ký lái thử ngay!`
                    : `Ford Territory ${ver.name.replace("Territory ", "")} 2026 với những cải tiến rõ rệt. Khám phá thông số kỹ thuật, phụ kiện, so sánh với các phiên bản khác và đăng ký lái thử.`;

                return (
                  <button
                    key={ver.id}
                    onClick={() => {
                      setActiveVersionIndex(idx);
                      // Smooth scroll to the picker to view details
                      const element = document.getElementById("360-viewer");
                      if (element) {
                        const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                    }}
                    className={`bg-[#fafafa] flex flex-col items-center overflow-hidden rounded-[8px] text-left border-0 cursor-pointer p-0 hover:scale-[1.01] transition-transform focus:outline-none focus:ring-0 focus-visible:outline-none outline-none ${isSelected ? "ring-2 ring-[#0562d2]/40" : ""}`}
                  >
                    {/* Background Gradient representation */}
                    <div className="aspect-[272/272] relative rounded-[12px] overflow-hidden w-full bg-gray-150">
                      <Image 
                        src={versionGradients[idx] || "/assets/img-gradient-1.png"} 
                        alt={ver.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover pointer-events-none"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col items-start py-[24px] w-full">
                      <div className="flex flex-col gap-[12px] items-start w-full">
                        <p className="font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[24px] leading-[1.25]">
                          {ver.name.replace("Territory ", "")}
                        </p>
                        <p className="font-['Ford_Antenna',sans-serif] font-semibold text-[#0562d2] text-[18px]">
                          {formatPrice(ver.price)}
                        </p>
                        <p className="font-['Ford_Antenna',sans-serif] font-normal text-[#424242] text-[16px] leading-[1.5]">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>



          </div>
        </section>
          </>
        ) : (
          /* 8. Vehicle Comparison Section */
          <section id="compare-section" className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-12">
          <div className="space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0562d2] block">So sánh trực quan</span>
              <h2 className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[36px] sm:text-[48px] uppercase tracking-[-0.96px] leading-[1.2]">
                {vehicle.versions.length > 1 ? `So sánh các dòng xe ${vehicle.name.replace("NEW ", "")}` : "So sánh dòng xe Ford"}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {vehicle.versions.length > 1 
                  ? `Bảng đối chiếu thông số kỹ thuật và trang bị trực quan giữa các phiên bản xe Ford ${vehicle.name.toLowerCase().replace("new ", "")}`
                  : "Bảng đối chiếu thông số kỹ thuật và trang bị trực quan giữa các mẫu xe trong phân khúc"}
              </p>
            </div>

            {/* Comparison Cards Grid */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full overflow-x-auto pb-4 scrollbar-none">
              {compareItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-gray-200/60 drop-shadow-[0px_4px_4px_rgba(16,24,40,0.06)] flex flex-col items-stretch relative w-full md:w-[368px] min-w-[280px] md:min-w-[320px] rounded-[12px] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
                >
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                    <div className="aspect-[800/550] relative shrink-0 w-full bg-gray-50 overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 368px"
                        className="object-cover transition-transform duration-500 hover:scale-105 pointer-events-none"
                      />
                    </div>
                    <div className="content-stretch flex items-center justify-between p-[16px] relative shrink-0 w-full border-b border-gray-100 bg-white">
                      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Ford_Antenna',sans-serif] font-semibold justify-center leading-[1.3] text-[#0562d2] text-[18px] tracking-[0.18px]">
                        <p>{item.name.replace("Territory ", "")}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed specs list */}
                  {/* Động cơ */}
                  <div className="p-[16px] flex flex-col gap-[12px] items-start relative bg-white border-b border-gray-100/50">
                    <div className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[14px]">
                      <p>Động cơ & Hộp số</p>
                    </div>
                    <div className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[12px]">
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        <li>Động cơ: <strong className="text-black font-semibold">{item.specs.engine}</strong></li>
                        <li>Công suất: <strong className="text-black font-semibold">{item.specs.power}</strong></li>
                        <li>Mô-men xoắn: <strong className="text-black font-semibold">{item.specs.torque}</strong></li>
                        <li>Hộp số: <strong className="text-black font-semibold">{item.specs.transmission}</strong></li>
                      </ul>
                    </div>
                  </div>

                  {/* Kích thước */}
                  <div className="p-[16px] flex flex-col gap-[12px] items-start relative bg-[#f0f0f0]/50 border-b border-gray-100/50">
                    <div className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[14px]">
                      <p>Kích thước & Trọng lượng</p>
                    </div>
                    <div className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[12px]">
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        <li>Kích thước: <strong className="text-black font-semibold">{item.specs.dimensions}</strong></li>
                        <li>Gầm xe: <strong className="text-black font-semibold">{item.specs.clearance}</strong></li>
                      </ul>
                    </div>
                  </div>

                  {/* Dẫn động */}
                  <div className="p-[16px] flex flex-col gap-[12px] items-start relative bg-white border-b border-gray-100/50">
                    <div className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[14px]">
                      <p>Hệ thống dẫn động</p>
                    </div>
                    <div className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[12px]">
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        <li>Hệ dẫn động: <strong className="text-black font-semibold">{item.specs.drivetrain}</strong></li>
                      </ul>
                    </div>
                  </div>

                  {/* Nhiên liệu */}
                  <div className="p-[16px] flex flex-col gap-[12px] items-start relative bg-[#f0f0f0]/50 border-b border-gray-100/50 flex-grow">
                    <div className="font-['Ford_Antenna',sans-serif] font-semibold text-[#00095b] text-[14px]">
                      <p>Tiêu thụ nhiên liệu</p>
                    </div>
                    <div className="font-['Ford_Antenna',sans-serif] font-normal text-[#1a1a1a] text-[12px]">
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        <li>Kết hợp: <strong className="text-black font-semibold">{item.specs.fuelEconomy}</strong></li>
                      </ul>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="p-4 bg-white flex flex-col items-center justify-center shrink-0 w-full border-t border-gray-100/50">
                    <button 
                      onClick={() => {
                        if (item.isExternal) {
                          router.push(`/products/${item.id}`);
                        } else {
                          openQuoteDrawer(vehicle.id, item.id);
                        }
                      }}
                      className="bg-[#0562d2] hover:bg-[#044ea7] border border-[#0562d2] border-solid flex gap-[8px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[800px] text-white text-[16px] font-semibold transition-all cursor-pointer shadow-xs w-full"
                    >
                      {item.isExternal ? "Xem chi tiết" : "Báo giá"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
        )}

        <BookingBanner />

        {/* 9. Collapsible FAQs Section */}
        <section className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pt-16 border-t border-[#e5e5e5]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[80px] items-start justify-center">
            
            <p className="lg:col-span-4 font-['Ford_Antenna',sans-serif] font-semibold text-[#1a1a1a] text-[36px] sm:text-[48px] tracking-[-0.96px] leading-[1.2]">
              Các câu hỏi thường gặp
            </p>

            <div className="lg:col-span-8 flex flex-col items-start overflow-hidden rounded-[8px] border border-gray-200/50 w-full">
              {localFaqs.map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className={`w-full transition-all duration-300 px-[16px] py-[24px] bg-white
                      ${isExpanded ? "border-b-3 border-[#0562d2]" : "border-b border-[#f0f0f0] last:border-b-0"}`}
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                      className="flex items-center justify-between text-left w-full cursor-pointer border-0 bg-transparent py-1 transition-colors group"
                    >
                      <span className={`font-['Ford_Antenna',sans-serif] font-semibold text-[16px] leading-[1.5]
                        ${isExpanded ? "text-[#0562d2]" : "text-[#1a1a1a] group-hover:text-[#0562d2]"}`}
                      >
                        {faq.q}
                      </span>
                      {isExpanded ? (
                        <Minus className="w-[24px] h-[24px] text-[#0562d2] shrink-0 ml-4" />
                      ) : (
                        <Plus className="w-[24px] h-[24px] text-gray-500 group-hover:text-[#0562d2] shrink-0 ml-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="pt-4 pb-2 transition-all duration-200">
                        <p className="font-['Ford_Antenna',sans-serif] font-normal text-[#333] text-[16px] leading-[1.5]">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </div>

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
                Dòng xe: <span className="text-white font-bold">{vehicle.name} - {activeVersion.name}</span>
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
                        setSelectedVersionId(activeVersion.id);
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
                        setSelectedVersionId(activeVersion.id);
                        setSelectedProvince("Đồng Nai");
                      }}
                      className="bg-white hover:bg-gray-50 border border-[#d6d6d6] border-solid flex flex-1 gap-2 items-center justify-center py-2.5 rounded-[800px] text-[#424242] text-[16px] font-semibold transition-all cursor-pointer shadow-xs h-11"
                    >
                      Chọn lại mẫu xe
                    </button>
                    <button 
                      onClick={() => {
                        // Prefill contact form values
                        const selVeh = vehicles.find(v => v.id === selectedVehicleId) || vehicle;
                        const selVer = selVeh.versions.find(v => v.id === selectedVersionId) || selVeh.versions[0];
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

    </div>
  );
}
