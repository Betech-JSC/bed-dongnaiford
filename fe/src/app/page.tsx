"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Award,
  Calendar,
  Phone,
  MessageCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  X,
  Users,
  Plus,
  Minus,
  MapPin,
  Mail
} from "lucide-react";
import { vehicles, Vehicle } from "@/data/vehicles";
import { articles } from "@/data/articles";
import { getPopularVehicleImage, siteAssets } from "@/lib/site-assets";

const homeArticles = articles.slice(0, 3);

// Custom SVG Icons matching Figma design
const WheelIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32.0001 32.0001" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15.9999 0C7.16338 0 0 7.16338 0 15.9999C0 24.8364 7.16338 32.0001 15.9999 32.0001C24.8364 32.0001 32.0001 24.8364 32.0001 15.9999C31.9901 7.16748 24.8326 0.0099609 15.9999 0ZM15.9999 3.2001C21.2716 3.18223 26.0083 6.41719 27.9103 11.3335C24.1676 9.64893 20.1041 8.79609 15.9999 8.8333C11.896 8.79609 7.83252 9.64893 4.08984 11.3335C5.9918 6.41719 10.7285 3.18223 15.9999 3.2001ZM13.3649 28.5258C7.79473 27.3363 3.67471 22.6181 3.24697 16.9383C8.025 16.9383 13.3649 23.3001 13.3649 28.5258ZM15.9999 18.3999C14.6745 18.3999 13.5999 17.3256 13.5999 15.9999C13.5999 14.6745 14.6745 13.5999 15.9999 13.5999C17.3256 13.5999 18.3999 14.6745 18.3999 15.9999C18.3999 17.3256 17.3256 18.3999 15.9999 18.3999ZM18.6352 28.5258C18.6352 23.3001 23.9751 16.9383 28.7534 16.9383C28.3254 22.6181 24.2054 27.3363 18.6352 28.5258Z" fill="currentColor" />
  </svg>
);

const CostIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 26.8182 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M26.8116 7.60629C26.7332 5.67204 25.4263 3.75087 22.8647 2.27405C17.6109 -0.758015 9.11588 -0.758015 3.89473 2.27405C1.28088 3.79008 -0.0129712 5.7766 9.80176e-05 7.76965V11.8669V11.9387V15.9706V16.0425V20.0743V20.1462V24.2369C0.0131672 26.2234 1.33316 28.2099 3.96007 29.726C6.58699 31.242 10.0242 32 13.4549 32C16.8855 32 20.3162 31.242 22.9235 29.726C25.5308 28.2099 26.8312 26.2234 26.8181 24.2369V20.1397V19.911V16.0359V15.8072V11.9322V11.7035V7.76965V7.76312V7.60629H26.8116ZM6.36481 8.0245C6.75035 7.89381 7.1555 7.76312 7.56065 7.63896C7.8547 7.54748 8.0246 7.52787 8.14876 7.59976C8.22064 7.63896 8.27945 7.71084 8.33826 7.8154C8.60618 8.31203 9.03747 8.74985 9.58638 9.15499C9.68439 9.22687 9.78241 9.29222 9.88697 9.35103C10.181 9.52093 10.5208 9.65816 10.9129 9.74311C11.9192 9.96529 12.8341 9.56667 12.723 8.94588C12.6838 8.73678 12.5792 8.52767 12.4485 8.33163C12.0957 7.82193 11.6644 7.33184 11.4291 6.796C11.0501 5.92689 11.2266 5.14274 12.4224 4.52195C13.7947 3.82275 15.3172 3.77701 16.9378 4.21483C17.5978 4.39126 17.5978 4.39779 18.101 4.10374C18.2774 3.99918 18.4473 3.90116 18.6237 3.80968C19.0093 3.59404 19.14 3.59404 19.5386 3.80315C19.5778 3.82275 19.617 3.84889 19.6562 3.86849C19.7346 3.91423 19.813 3.95998 19.8915 4.00572C19.9568 4.04493 20.0156 4.0776 20.0679 4.11027C20.7148 4.48274 20.656 4.51542 19.898 4.95324C19.3295 5.29304 19.3295 5.29304 19.813 5.67204C20.1855 5.9661 20.4796 6.2863 20.7083 6.6261C20.8324 6.8156 20.7606 6.95283 20.4534 7.05085C20.0025 7.19461 19.5582 7.3449 19.0942 7.48213C18.8132 7.56708 18.6499 7.58015 18.5257 7.50827C18.4538 7.46906 18.4016 7.40372 18.3428 7.3057C18.0552 6.8156 17.5913 6.39739 16.9705 6.04452C16.8921 5.99877 16.8137 5.95957 16.7352 5.91382C16.5392 5.81581 16.3366 5.72432 16.0883 5.66551C15.2127 5.46947 14.4481 5.7962 14.5527 6.33857C14.605 6.60649 14.7553 6.87441 14.9382 7.12926C15.2584 7.56708 15.5851 8.0049 15.8139 8.46232C16.5523 9.92608 14.9578 11.3637 12.4159 11.5075C11.501 11.5597 10.6319 11.4421 9.82162 11.1807C9.47529 11.0631 9.20737 11.0762 8.93945 11.2461C8.67153 11.416 8.38401 11.5728 8.09648 11.7296C7.84817 11.8734 7.59332 11.8799 7.33847 11.7427C7.18164 11.6577 7.03134 11.5728 6.88105 11.4813C6.73075 11.3964 6.58045 11.3049 6.43016 11.2134C6.17531 11.0566 6.20145 10.8997 6.44976 10.7494C6.65233 10.6318 6.84837 10.5077 7.05748 10.39C7.4953 10.1287 7.50837 10.109 7.1359 9.81499C6.6654 9.44252 6.24719 9.05044 5.9858 8.61262C5.77016 8.27935 5.82244 8.20094 6.36481 8.0245ZM24.9754 24.2499C24.9819 25.6157 23.8972 27.0272 22.0021 28.1315C19.7542 29.4384 16.7222 30.1572 13.4614 30.1572C10.2006 30.1572 7.1555 29.4384 4.89452 28.1315C2.97335 27.0206 1.869 25.6026 1.86246 24.2434V24.0474C2.43751 24.6159 3.13018 25.1517 3.96661 25.6353C6.59352 27.1513 10.0307 27.9093 13.4614 27.9093C16.8921 27.9093 20.3227 27.1513 22.9301 25.6353C23.7469 25.1648 24.4134 24.642 24.9754 24.0866V24.2499ZM24.9754 20.1462C24.9819 21.5119 23.8972 22.9234 22.0021 24.0278C19.7542 25.3347 16.7222 26.0535 13.4614 26.0535C10.2006 26.0535 7.1555 25.3347 4.89452 24.0278C2.97335 22.9169 1.869 21.4989 1.86246 20.1397V19.9436C2.43751 20.5122 3.13018 21.048 3.96661 21.5315C6.59352 23.0476 10.0307 23.8056 13.4614 23.8056C16.8921 23.8056 20.3227 23.0476 22.9301 21.5315C23.7469 21.0611 24.4134 20.5383 24.9754 19.9828V20.1462ZM24.9754 16.049C24.9819 17.4147 23.8972 18.8262 22.0021 19.9306C19.7542 21.2375 16.7222 21.9563 13.4614 21.9563C10.2006 21.9563 7.1555 21.2375 4.89452 19.9306C2.97335 18.8197 1.869 17.4017 1.86246 16.0425V15.8464C2.43751 16.4149 3.13018 16.9508 3.96661 17.4343C6.59352 18.9504 10.0307 19.7084 13.4614 19.7084C16.8921 19.7084 20.3227 18.9504 22.9301 17.4343C23.7469 16.9639 24.4134 16.4411 24.9754 15.8856V16.049ZM24.9754 11.9453C24.9819 13.311 23.8972 14.7225 22.0021 15.8268C19.7542 17.1338 16.7222 17.8526 13.4614 17.8526C10.2006 17.8526 7.1555 17.1338 4.89452 15.8268C2.97335 14.7159 1.869 13.2979 1.86246 11.9387V11.6708C2.43751 12.2393 3.13018 12.7752 3.96661 13.2587C9.22044 16.2908 17.7089 16.2908 22.9366 13.2587C23.7534 12.7882 24.4199 12.2655 24.9819 11.71V11.9453H24.9754Z" fill="currentColor" />
  </svg>
);

const OfferIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 22.5641" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g id="Vector">
      <path d="M13.1685 4.70667C12.7079 4.70667 12.2044 4.87214 11.8568 5.26427C11.4016 5.77778 11.2589 7.31234 11.2758 8.08677C12.0444 8.10537 13.5138 8.08499 14.1091 7.49306C14.7315 6.87405 14.9018 5.79241 14.2399 5.13415C13.9519 4.84766 13.5672 4.70667 13.1685 4.70667Z" fill="currentColor" />
      <path d="M7.30222 4.70667C7.76287 4.70667 8.26639 4.87214 8.61395 5.26427C9.06913 5.77778 9.21183 7.31234 9.19494 8.08677C8.42639 8.10537 6.95692 8.08499 6.36171 7.49306C5.73928 6.87405 5.56896 5.79241 6.23084 5.13415C6.51891 4.84766 6.90352 4.70667 7.30222 4.70667Z" fill="currentColor" />
      <path d="M15.6903 3.68096C16.8591 4.84308 17.0148 6.67473 16.214 8.08677H32V2.93039C32 1.312 30.6856 0 29.0643 0H11.2615V3.16397C12.7002 2.35214 14.5182 2.51549 15.6903 3.68096C16.3562 4.34304 14.5182 2.51549 15.6903 3.68096Z" fill="currentColor" />
      <path d="M6.95515 13.8543L5.49867 12.4072L7.76144 10.1381H0V19.6336C0 21.2521 1.31439 22.5641 2.93573 22.5641H9.20643V11.5967L6.95515 13.8543Z" fill="currentColor" />
      <path d="M12.6974 10.1381L14.9301 12.3885L13.4698 13.8318L11.2615 11.6058V22.5641H29.0643C30.6856 22.5641 32 21.2521 32 19.6337V10.1381H12.6974Z" fill="currentColor" />
      <path d="M4.25388 8.08677C3.45299 6.67453 3.60896 4.84301 4.77757 3.68096C5.94961 2.51549 7.76759 2.35221 9.20643V0H2.93573C1.31439 0 0 1.312 0 2.93039V8.08677H4.25388Z" fill="currentColor" />
    </g>
  </svg>
);

const WrenchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 31.9621 32.0002" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g id="Vector">
      <path d="M20.8561 7.11584C19.5963 2.5074 24.4395 -1.51681 28.7399 0.56213L25.6422 3.65979L26.3073 5.6549L28.3014 6.31994L31.4 3.22229C33.4781 7.5198 29.4576 12.3662 24.8463 11.1061L11.1051 24.8844C12.3648 29.493 7.52185 33.5169 3.22132 31.4381L6.31996 28.3405L5.65492 26.3453L3.6598 25.6803L0.562143 28.778C-1.51592 24.4804 2.50349 19.6349 7.11488 20.8951L20.8561 7.11584Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M24.8825 20.8942C25.3486 20.7695 25.839 20.7028 26.3444 20.7028C33.8195 20.9785 33.8208 31.7124 26.3444 31.9889C22.6889 32.0445 19.9065 28.3895 20.8932 24.8844L17.3219 21.3141L21.3073 17.318C21.9443 17.9551 24.5098 20.5215 24.8825 20.8942ZM24.8571 24.859L24.3131 26.8903L25.7994 28.3776L27.8317 27.8326L28.3756 25.8014L26.8883 24.3141L24.8571 24.859Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M5.65394 0.0123251C9.30939 -0.0432956 12.0917 3.61177 11.1051 7.11682L14.6569 10.6686L10.6725 14.6637L7.11488 11.1071C6.64884 11.2316 6.1592 11.2985 5.65394 11.2985C-1.82143 11.0228 -1.82262 0.288636 5.65394 0.0123251ZM4.16664 4.16858L3.62269 6.19983L5.10999 7.68713L7.14124 7.14221L7.68519 5.11096L6.19789 3.62365L4.16664 4.16858Z" fill="currentColor" />
    </g>
  </svg>
);

// Hero slides data
const heroSlides = [
  {
    title: "Ford Everest Mới",
    subtitle: "Dấn bước. Dẫn đầu​",
    tagline: "SUV 7 Chỗ Đích Thực Chinh Phục Mọi Địa Terrain",
    image: siteAssets.heroSlides[0],
    linkVehicleId: "new-everest"
  },
  {
    title: "Khuyến Mãi Tháng 5",
    subtitle: "Ưu Đãi Lệ Phí Trước Bạ & Quà Tặng Đặc Biệt",
    tagline: "Sở Hữu Xe Ford Yêu Thích Với Gói Ưu Đãi Tài Chính Tốt Nhất Năm",
    image: siteAssets.heroSlides[1],
    linkVehicleId: "new-territory"
  },
  {
    title: "Ford Raptor Nhập Mỹ",
    subtitle: "Chiến binh sa mạc - Độc bản hiệu năng​",
    tagline: "Động Cơ Bi-Turbo Siêu Cường Kết Hợp Hệ Thống Treo FOX Racing Đỉnh Cao",
    image: siteAssets.heroSlides[2],
    linkVehicleId: "new-raptor"
  }
];

// Testimonials Data
const testimonials = [
  {
    name: "Trần Minh",
    role: "Quản lý dự án công ty XYZ",
    avatarText: "TM",
    stars: 5,
    comment: "Chất lượng dịch vụ xuất sắc, rất hài lòng với sự hỗ trợ từ đội ngũ nhân viên. Xe giao nhanh và đúng yêu cầu."
  },
  {
    name: "Lê Văn",
    role: "Chủ doanh nghiệp nhỏ",
    avatarText: "LV",
    stars: 5,
    comment: "Mua xe lần đầu, không thất vọng. Từ tư vấn đến giao hàng đều rất chuyên nghiệp."
  },
  {
    name: "Phạm Hương",
    role: "Nhà báo tự do",
    avatarText: "PH",
    stars: 5,
    comment: "Dịch vụ khách hàng tuyệt vời, xe giao đầy đủ và đúng hẹn. Sẽ giới thiệu cho bạn bè!"
  },
  {
    name: "Ngô Bảo",
    role: "Kỹ sư phần mềm",
    avatarText: "NB",
    stars: 4,
    comment: "Trải nghiệm mua xe rất tốt. Nhân viên hỗ trợ nhiệt tình và cung cấp thông tin rõ ràng."
  },
  {
    name: "Đặng Thái",
    role: "Giáo viên trung học",
    avatarText: "DT",
    stars: 5,
    comment: "Thời gian giao xe nhanh chóng, chất lượng xe đảm bảo. Tôi hoàn toàn hài lòng với dịch vụ."
  }
];

// FAQs Data
const faqs = [
  {
    q: "Điều gì tạo nên sự nổi bật thương hiệu Dongnaiford?",
    a: "Đồng Nai Ford tự hào là đại lý ủy quyền chính thức của Ford Việt Nam với cơ sở vật chất 3S hiện đại bậc nhất, đội ngũ nhân sự chuyên nghiệp và quy trình dịch vụ đạt tiêu chuẩn toàn cầu, mang đến trải nghiệm hài lòng tối đa cho khách hàng."
  },
  {
    q: "Sự sáng tạo trong thiết kế sản phẩm",
    a: "Các dòng xe Ford thế hệ mới sở hữu ngôn ngữ thiết kế thông minh, mạnh mẽ và khí động học cao. Thiết kế khoang nội thất tối ưu không gian đi kèm hệ thống giải trí SYNC 4 hiện đại giúp nâng tầm trải nghiệm lái xe."
  },
  {
    q: "Chất lượng dịch vụ khách hàng xuất sắc",
    a: "Chúng tôi cam kết đồng hành cùng khách hàng trong suốt vòng đời sử dụng xe với các dịch vụ chăm sóc tận tâm: cứu hộ 24/7, hotline hỗ trợ kỹ thuật miễn phí, dịch vụ nhận và giao xe tận nhà, cùng phòng chờ VIP đầy đủ tiện nghi."
  },
  {
    q: "Cam kết bảo vệ môi trường",
    a: "Đồng Nai Ford ứng dụng các công nghệ sơn và sửa chữa thân vỏ thân thiện với môi trường, sử dụng hệ thống xử lý chất thải đạt chuẩn và tích cực thúc đẩy các dòng xe tiết kiệm nhiên liệu thế hệ mới từ Ford."
  },
  {
    q: "Chiến lược marketing hiệu quả",
    a: "Chúng tôi luôn mang đến các chương trình ưu đãi minh bạch, ngày hội lái thử xe trải nghiệm thực tế, và cung cấp thông tin hữu ích giúp khách hàng dễ dàng đưa ra quyết định mua sắm xe phù hợp với nhu cầu."
  },
  {
    q: "Đội ngũ nhân viên chuyên nghiệp và tận tâm",
    a: "Tất cả kỹ thuật viên và tư vấn bán hàng của chúng tôi đều trải qua các khóa đào tạo khắt khe và đạt chứng chỉ từ Ford Việt Nam, sẵn sàng lắng nghe và giải đáp mọi yêu cầu của quý khách hàng."
  }
];



const quickActions = [
  {
    title: "Đăng ký lái thử",
    reason: "Đăng ký lái thử",
    note: "Tôi muốn đặt lịch đăng ký lái thử xe Ford.",
    icon: WheelIcon,
  },
  {
    title: "Dự toán chi phí",
    reason: "Dự toán chi phí",
    note: "Tôi muốn dự toán chi phí lăn bánh cho các dòng xe Ford tại Đồng Nai.",
    icon: CostIcon,
  },
  {
    title: "Ưu đãi",
    reason: "Nhận chương trình ưu đãi",
    note: "Tôi muốn đăng ký nhận danh sách ưu đãi và quà tặng hiện có.",
    icon: OfferIcon,
  },
  {
    title: "Đặt hẹn bảo dưỡng",
    reason: "Đặt lịch hẹn bảo dưỡng",
    note: "Tôi muốn đặt hẹn bảo dưỡng xe Ford.",
    icon: WrenchIcon,
  },
];

export default function Home() {
  const router = useRouter();
  // Hero Banner Active Slide
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Showroom Filter State
  const [selectedCategory, setSelectedCategory] = useState<"all" | "best-seller" | "suv" | "commercial">("all");

  // Testimonials Carousel Slide State
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTestimonialInteracted, setIsTestimonialInteracted] = useState(false);

  // Popular Fleet Carousel State (Infinite Loop support)
  const [activePopularIndex, setActivePopularIndex] = useState(vehicles.length);
  const [isPopularTransitioning, setIsPopularTransitioning] = useState(true);
  const [isPopularHovered, setIsPopularHovered] = useState(false);
  const [isPopularInteracted, setIsPopularInteracted] = useState(false);

  // News & Offers Carousel State
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const [isNewsHovered, setIsNewsHovered] = useState(false);

  // FAQ Accordion Open States (Single active index, null if all closed)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Monitor scroll height to show/hide Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Auto-play hero slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeHeroIndex]);

  // Auto-play testimonials every 3.5 seconds, pause on hover or if interacted
  useEffect(() => {
    if (isHovered || isTestimonialInteracted) return;
    const timer = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, isTestimonialInteracted]);

  // Reset testimonial interacted flag after 5 seconds of inactivity to resume auto-play
  useEffect(() => {
    if (isTestimonialInteracted) {
      const timer = setTimeout(() => {
        setIsTestimonialInteracted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isTestimonialInteracted]);

  // Auto-play popular fleet every 4.0 seconds, pause on hover or if interacted (with infinite loop support)
  useEffect(() => {
    if (isPopularHovered || isPopularInteracted) return;
    const timer = setInterval(() => {
      setIsPopularTransitioning(true);
      setActivePopularIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPopularHovered, isPopularInteracted]);

  // Reset popular fleet interacted flag after 5 seconds of inactivity to resume auto-play
  useEffect(() => {
    if (isPopularInteracted) {
      const timer = setTimeout(() => {
        setIsPopularInteracted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPopularInteracted]);

  // Auto-play news/offers every 4.5 seconds, pause on hover
  useEffect(() => {
    if (isNewsHovered) return;
    const timer = setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % homeArticles.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isNewsHovered]);

  // Filter vehicles based on active showroom category
  const getFilteredVehicles = () => {
    switch (selectedCategory) {
      case "best-seller":
        return vehicles.filter(v => v.isBestSeller);
      case "suv":
        return vehicles.filter(v => v.type === "suv");
      case "commercial":
        return vehicles.filter(v => v.type === "commercial");
      default:
        return vehicles;
    }
  };

  const handlePrevHero = () => {
    setActiveHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextHero = () => {
    setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };



  // Pre-fill form details on quick actions click - redirect to /contact
  const triggerQuickAction = (reason: string, noteText: string) => {
    router.push(`/contact?reason=${encodeURIComponent(reason)}&note=${encodeURIComponent(noteText)}`);
  };

  // Pre-fill form when clicking get price - redirect to /contact
  const triggerGetQuote = (vehicleId: string, vehicleName: string) => {
    router.push(`/contact?vehicle=${encodeURIComponent(vehicleId)}&reason=${encodeURIComponent("Nhận báo giá lăn bánh")}&note=${encodeURIComponent(`Tôi cần nhận báo giá lăn bánh cho dòng xe ${vehicleName}.`)}`);
  };



  // Close toast helper
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price) + "đ";
  };

  const handlePopularTransitionEnd = () => {
    if (activePopularIndex >= vehicles.length * 2) {
      setIsPopularTransitioning(false);
      setActivePopularIndex(activePopularIndex - vehicles.length);
    } else if (activePopularIndex < vehicles.length) {
      setIsPopularTransitioning(false);
      setActivePopularIndex(activePopularIndex + vehicles.length);
    }
  };

  const getPopularVehicleImageForSlide = (vehicle: Vehicle) =>
    getPopularVehicleImage(vehicle.id, vehicle.images[0]);

  return (
    <div className="relative min-h-screen bg-light overflow-x-hidden font-sans">

      {/* 1. HERO BANNER SECTION (WITH INTERACTIVE TABS & PREV/NEXT ARROWS) */}
      <section className="relative lg:h-[746px] min-h-[600px] flex flex-col justify-end bg-black text-white overflow-hidden pt-12 md:pt-16 pb-0">

        {/* Absolute Background Slides (with fade transitions) */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${activeHeroIndex === idx ? "opacity-95 scale-100" : "opacity-0 scale-105"
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              className="object-cover object-center transform transition-transform duration-10000"
            />
            {/* Linear dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ))}

        {/* Main Content Area */}
        <div className="max-w-[1440px] mx-auto w-full px-4 xl:px-[144px] flex flex-col items-center justify-end text-center relative z-10 mt-auto pt-32 pb-[16px] md:pb-[24px]">
          {/* Slide Text Block */}
          <div key={activeHeroIndex} className="max-w-3xl flex flex-col items-center text-center reveal-on-scroll">
            <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-bold tracking-[-0.96px] leading-[1.2] text-white">
              {heroSlides[activeHeroIndex].title}
            </h1>
            <p className="mt-[4px] text-lg sm:text-xl md:text-[24px] font-medium text-white/80 leading-[1.25]">
              {heroSlides[activeHeroIndex].subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-row justify-center gap-[12px] pt-[24px]">
              <button
                onClick={() => triggerQuickAction("Đăng ký lái thử", "Tôi muốn đăng ký lái thử xe thông qua chương trình khuyến mãi.")}
                className="bg-[#0562d2] hover:bg-[#066FEF] text-white px-[24px] py-[10px] rounded-full text-base font-semibold tracking-[0.16px] transition-all duration-300 cursor-pointer shadow-md"
              >
                Book Lái thử
              </button>
              <button
                onClick={() => {
                  router.push(`/products/${heroSlides[activeHeroIndex].linkVehicleId}`);
                }}
                className="bg-transparent hover:bg-white/10 border border-white text-white px-[24px] py-[10px] rounded-full text-base font-semibold tracking-[0.16px] transition-all duration-300 cursor-pointer"
              >
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Arrows */}
        <button
          onClick={handlePrevHero}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white z-20 cursor-pointer hidden md:flex items-center justify-center"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextHero}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white z-20 cursor-pointer hidden md:flex items-center justify-center"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Tab Controls Bar (Dynamic switching banner) */}
        <div className="w-full flex justify-center items-start relative z-10 pb-0">
          <div className="flex flex-row justify-center items-start gap-0 max-w-[960px] w-full">
            {heroSlides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHeroIndex(idx)}
                className={`w-[320px] text-center transition-all duration-300 tracking-[0.18px] text-[18px] font-semibold cursor-pointer ${activeHeroIndex === idx
                  ? "border-t-[3px] border-white text-white opacity-100 pt-[8px] pb-[16px]"
                  : "border-t-[1px] border-white/30 text-white opacity-60 hover:opacity-100 pt-[10px] pb-[16px]"
                  }`}
              >
                {slide.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTION GRID */}
      <section className="bg-white border-y border-gray-200 py-8 relative z-20 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => triggerQuickAction(action.reason, action.note)}
                  className="flex flex-col gap-[16px] items-center justify-center text-center p-[20px_24px] rounded-[12px] h-[140px] w-full bg-[#f0f0f0] text-[#1a1a1a] hover:bg-[#0562d2] hover:text-white hover:shadow-[2px_6px_12px_-1px_rgba(16,24,40,0.12),0px_4px_6px_-2px_rgba(16,24,40,0.05)] transition-all duration-300 group cursor-pointer border border-transparent"
                >
                  <Icon className="h-[32px] text-[#0562D2] group-hover:text-white transition-colors duration-300 shrink-0" />
                  <h3 className="text-sm font-bold transition-colors duration-300 leading-snug uppercase">
                    {action.title}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VEHICLES SHOWROOM CATALOG (WITH FILTER TABS) */}
      <section id="showroom" className="w-full py-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
          {/* Centered title block */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-[#00095B] tracking-tight">
              Dòng xe Ford Đồng Nai
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Đa dạng lựa chọn từ SUV, bán tải đến xe thương mại — tất cả đều có sẵn tại showroom Đồng Nai.
            </p>
          </div>

          {/* Underline tab switcher — centered */}
          <div className="flex justify-center mb-12 border-b border-gray-200 w-full">
            <div className="flex gap-8 md:gap-12">
              {(["all", "best-seller", "suv", "commercial"] as const).map((cat) => {
                const label = cat === "all" ? "Tất cả" : cat === "best-seller" ? "Bán chạy" : cat === "suv" ? "SUV" : "Thương mại";
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`pb-4 text-sm md:text-base font-semibold transition-all duration-300 relative cursor-pointer ${isActive
                      ? "text-[#0562D2] border-b-2 border-[#0562D2] -mb-[2px]"
                      : "text-gray-500 hover:text-[#0562D2] border-b-2 border-transparent -mb-[2px]"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredVehicles().map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/products/${vehicle.id}`}
                className="bg-white border border-[#EAECF0] rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group cursor-pointer h-full"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full bg-white overflow-hidden mb-6 flex items-center justify-center">
                  <Image
                    src={getPopularVehicleImage(vehicle.id, vehicle.images[0])}
                    alt={vehicle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Title & Price */}
                <div className="space-y-2 mt-auto">
                  <h3 className={`text-base font-bold tracking-tight uppercase ${vehicle.id === "new-mustang-mach-e" ? "text-[#0562D2]" : "text-[#1A1A1A]"
                    }`}>
                    {vehicle.name}
                  </h3>
                  <div className="text-xs text-gray-500 font-medium">
                    <span>Giá khởi điểm: </span>
                    <span className="text-sm font-bold text-[#0562D2]">{formatPrice(vehicle.basePrice)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR FLEET SECTION + TEST DRIVE BANNER (inside same section per Figma) */}
      <section className="bg-white py-[72px] px-0 overflow-x-clip w-full">
        <div className="w-full">

          {/* Header row: title left + nav arrows right — Figma: 48px semibold, gap-24 */}
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] flex items-end justify-between mb-6 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] tracking-[-0.96px] leading-[1.2]">
                Các dòng xe phổ biến
              </h2>
              <p className="text-base text-[#424242] leading-relaxed">
                Đa dạng lựa chọn từ SUV, bán tải đến xe thương mại — tất cả đều có sẵn tại showroom Đồng Nai.
              </p>
            </div>
            {/* Nav arrows — Figma: 40px circle, black bg opacity */}
            <div className="flex gap-6 flex-shrink-0">
              <button
                onClick={() => {
                  setIsPopularTransitioning(true);
                  setActivePopularIndex((prev) => prev - 1);
                  setIsPopularInteracted(true);
                }}
                className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer text-white"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setIsPopularTransitioning(true);
                  setActivePopularIndex((prev) => prev + 1);
                  setIsPopularInteracted(true);
                }}
                className="w-10 h-10 rounded-full bg-black/80 flex items-center justify-center hover:bg-black transition-colors cursor-pointer text-white"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Vehicle cards sliding container */}
          <div className="relative w-full overflow-visible py-4 pl-4 xl:pl-[144px] min-[1440px]:pl-[calc((100vw-1152px)/2)]">
            <div
              className="flex gap-[var(--card-gap-popular)]"
              style={{
                transform: `translateX(calc(-${activePopularIndex} * (var(--card-width-popular) + var(--card-gap-popular))))`,
                transition: isPopularTransitioning ? "transform 500ms ease-in-out" : "none"
              }}
              onTransitionEnd={handlePopularTransitionEnd}
              onMouseEnter={() => setIsPopularHovered(true)}
              onMouseLeave={() => setIsPopularHovered(false)}
              onTouchStart={() => setIsPopularHovered(true)}
              onTouchEnd={() => setIsPopularHovered(false)}
            >
              {[...vehicles, ...vehicles, ...vehicles].map((vehicle, idx) => {
                return (
                  <Link
                    key={`${vehicle.id}-${idx}`}
                    href={`/products/${vehicle.id}`}
                    className="relative overflow-hidden rounded-xl h-[595px] group cursor-pointer bg-[#121824] flex-shrink-0 transition-all duration-300 block"
                    style={{
                      width: 'var(--card-width-popular)',
                    }}
                  >
                    <Image
                      src={getPopularVehicleImageForSlide(vehicle)}
                      alt={vehicle.name}
                      fill
                      sizes="var(--card-width-popular)"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay — Figma: top rgba(0,0,0,0) → bottom heavy */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Content — Figma: p-8 bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col gap-3">
                      <h3 className="text-2xl md:text-3xl font-semibold text-white leading-[1.2]">{vehicle.name}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Dots Pagination Indicators for Popular Fleet */}
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] flex justify-center gap-2 mt-4 mb-8">
            {vehicles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsPopularTransitioning(true);
                  setActivePopularIndex(idx + vehicles.length);
                  setIsPopularInteracted(true);
                }}
                className={`h-2 transition-all rounded-full cursor-pointer ${activePopularIndex % vehicles.length === idx ? "w-6 bg-[#0562d2]" : "w-2 bg-gray-300"
                  }`}
                aria-label={`Go to vehicle slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* 5. TEST DRIVE BANNER — Figma: inside Section 4, 1152x320px, bg-[#0562d2] + gradient, rounded-12px */}
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full mt-6">
            <div
              className="relative overflow-hidden rounded-xl h-[320px] p-8 flex items-center"
              style={{ backgroundColor: '#0562d2', backgroundImage: 'linear-gradient(-53.316deg, rgba(0,9,91,0) 31.896%, rgba(0,9,91,0.8) 83.827%)' }}
            >
              {/* Background wheel image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={siteAssets.heroSlides[1]}
                  alt=""
                  fill
                  className="object-cover object-right"
                />
                {/* Gradient overlay per Figma */}
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(-53.316deg, rgba(0,9,91,0) 31.896%, rgba(0,9,91,0.8) 83.827%)' }} />
              </div>
              {/* Content — Figma: max-w-480px, gap-24, z-10 */}
              <div className="relative z-10 flex flex-col gap-6 max-w-[480px]">
                {/* Figma: 36px Semibold white, lh 1.32 */}
                <h2 className="text-3xl font-semibold text-white leading-[1.32]">
                  Trực tiếp trải nghiệm các dòng xe FORD
                </h2>
                {/* Figma: white bg, border #d6d6d6, text #424242, px-24 py-10, rounded-full, 18px semibold */}
                <div>
                  <button
                    onClick={() => triggerQuickAction("Đăng ký lái thử", "Tôi đặt lịch hẹn lái thử xe.")}
                    className="px-6 py-[10px] rounded-full bg-white border border-[#d6d6d6] text-[#424242] text-lg font-semibold tracking-[0.18px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    Hẹn lái thử
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SERVICES GRID — Figma: bg-[#f0f0f0], py-72px, px-144px, cards h-480px, rounded-12px */}
      <section id="services" className="w-full bg-[#f0f0f0] py-[72px]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
          {/* Title — Figma: 48px Semibold #1a1a1a tracking -0.96px, mb-24px */}
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] tracking-[-0.96px] leading-[1.2] mb-6">
            Các dịch vụ của chúng tôi
          </h2>

          {/* Cards — Figma: flex row, gap-24, h-480 each, rounded-12 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

            {/* Card 1: Chăm sóc khách hàng */}
            <Link
              href="/services/customer-care"
              className="relative overflow-hidden rounded-xl h-[480px] group cursor-pointer bg-white block"
            >
              <Image
                src={siteAssets.serviceCustomerCare}
                alt="Chăm sóc khách hàng"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))' }} />
              <div className="absolute bottom-0 left-0 right-0 pb-8 pt-12 px-4 z-10">
                <h3 className="text-2xl font-semibold text-white leading-[1.25]">
                  Chăm sóc khách hàng
                </h3>
              </div>
            </Link>

            {/* Card 2: Bảo dưỡng Xe */}
            <Link
              href="/services/periodic-maintenance"
              className="relative overflow-hidden rounded-xl h-[480px] group cursor-pointer bg-white block"
            >
              <Image
                src={siteAssets.serviceMaintenance}
                alt="Bảo dưỡng Xe"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))' }} />
              <div className="absolute bottom-0 left-0 right-0 pb-8 pt-12 px-4 z-10">
                <h3 className="text-2xl font-semibold text-white leading-[1.25]">
                  Bảo dưỡng Xe
                </h3>
              </div>
            </Link>

            {/* Card 3: Nhận & Giao xe */}
            <Link
              href="/services/pickup-delivery"
              className="relative overflow-hidden rounded-xl h-[480px] group cursor-pointer bg-white block"
            >
              <Image
                src={siteAssets.serviceDelivery}
                alt="Nhận & Giao xe"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))' }} />
              <div className="absolute bottom-0 left-0 right-0 pb-8 pt-12 px-4 z-10">
                <h3 className="text-2xl font-semibold text-white leading-[1.25]">
                  Nhận &amp; Giao xe
                </h3>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section id="media" className="bg-gray-light border-y border-gray-200 py-20 px-0 overflow-x-clip">
        <div className="w-full">

          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-[#0562d2] uppercase tracking-wider block mb-2">
                Ý KIẾN TỪ KHÁCH HÀNG
              </span>
              <h2 className="text-[36px] font-semibold text-[#1a1a1a] leading-tight">
                Cảm nhận khách hàng
              </h2>
            </div>

            {/* Arrows controllers */}
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => {
                  setActiveTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
                  setIsTestimonialInteracted(true);
                }}
                className="p-2 border border-gray-300 hover:bg-[#0562d2] hover:text-white hover:border-[#0562d2] text-primary rounded-full transition-colors cursor-pointer bg-white"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
                  setIsTestimonialInteracted(true);
                }}
                className="p-2 border border-gray-300 hover:bg-[#0562d2] hover:text-white hover:border-[#0562d2] text-primary rounded-full transition-colors cursor-pointer bg-white"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Testimonial Active Display Card Row */}
          <div className="relative w-full overflow-visible py-4">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                gap: 'var(--card-gap-testimonial)',
                transform: `translateX(calc(50% - (var(--card-width-testimonial) / 2) - ${activeTestimonialIndex} * (var(--card-width-testimonial) + var(--card-gap-testimonial))))`
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
            >
              {testimonials.map((item, idx) => {
                const isActive = idx === activeTestimonialIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTestimonialIndex(idx)}
                    className={`h-[320px] bg-white px-6 py-8 rounded-[8px] flex-shrink-0 flex flex-col justify-between cursor-pointer transition-all ${isActive
                      ? "border-b-4 border-[#0562d2] shadow-md scale-100 opacity-100"
                      : "border-b border-[#d6d6d6] scale-95 opacity-50"
                      }`}
                    style={{
                      width: 'var(--card-width-testimonial)',
                    }}
                  >
                    {/* Comment text */}
                    <p className="text-[18px] text-[#424242] font-normal leading-[1.5]">
                      &ldquo;{item.comment}&rdquo;
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-4">
                      <div className="size-[64px] rounded-full border-[3px] border-[#0562d2] bg-[#003478] flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                        {item.avatarText}
                      </div>
                      <div>
                        <h4 className="text-[18px] font-semibold text-[#1a1a1a] tracking-[0.18px] leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-[16px] text-[#333333] mt-1">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination Indicators dots */}
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTestimonialIndex(idx);
                  setIsTestimonialInteracted(true);
                }}
                className={`h-2 transition-all rounded-full cursor-pointer ${activeTestimonialIndex === idx ? "w-6 bg-[#0562d2]" : "w-2 bg-gray-300"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 8. NEWS & PROMOTION */}
      <section id="news" className="w-full bg-[#00095b] py-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full">
          <div className="max-w-[1152px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-semibold text-[#0562d2] uppercase tracking-wider block mb-2">
                  Tin tức hữu ích
                </span>
                <h2 className="text-[36px] text-white font-semibold leading-tight">
                  Tin tức & Ưu Đãi
                </h2>
              </div>

              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="flex md:hidden gap-2">
                  <button
                    onClick={() => setActiveNewsIndex((prev) => (prev - 1 + homeArticles.length) % homeArticles.length)}
                    className="p-2 border border-white/20 hover:bg-white/10 text-white rounded-full transition-colors cursor-pointer bg-transparent"
                    aria-label="Previous article"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveNewsIndex((prev) => (prev + 1) % homeArticles.length)}
                    className="p-2 border border-white/20 hover:bg-white/10 text-white rounded-full transition-colors cursor-pointer bg-transparent"
                    aria-label="Next article"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    router.push("/news");
                  }}
                  className="w-[200px] py-2.5 bg-[#0562d2] text-white hover:bg-[#0451b0] rounded-full text-center text-sm font-semibold transition-all cursor-pointer animate-premium"
                >
                  Xem tất cả
                </button>
              </div>
            </div>

            {/* Mobile: horizontal slider container, Desktop: standard grid */}
            <div className="relative w-full overflow-hidden md:overflow-visible py-4">
              <div
                className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 transition-transform duration-500 ease-in-out news-track"
                style={{
                  '--active-news-index': activeNewsIndex,
                } as React.CSSProperties}
                onMouseEnter={() => setIsNewsHovered(true)}
                onMouseLeave={() => setIsNewsHovered(false)}
                onTouchStart={() => setIsNewsHovered(true)}
                onTouchEnd={() => setIsNewsHovered(false)}
              >
                {homeArticles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-transparent flex flex-col h-full group flex-shrink-0 md:flex-shrink w-[var(--card-width-news)] md:w-auto"
                  >
                    {/* Image */}
                    <div className="aspect-[600/400] relative rounded-[12px] overflow-hidden w-full mb-6 bg-white/5">
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        sizes="(max-width: 768px) var(--card-width-news), 30vw"
                        className="object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                    </div>

                    {/* Text info */}
                    <div className="flex flex-col flex-1 justify-between text-white">
                      <div>
                        <h3 className="text-[18px] font-semibold text-white leading-[1.45] tracking-[0.18px] mb-4 min-h-[52px] line-clamp-2">
                          {art.title}
                        </h3>
                      </div>

                      <div className="pt-4">
                        <Link
                          href={`/news/${art.id}`}
                          className="inline-block border border-white text-white hover:bg-white hover:text-[#00095b] w-[128px] py-2 rounded-full text-center text-sm font-semibold transition-all cursor-pointer"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Pagination Indicators for News & Offers on Mobile */}
            <div className="flex md:hidden justify-center gap-2 mt-6">
              {homeArticles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveNewsIndex(idx)}
                  className={`h-2 transition-all rounded-full cursor-pointer ${activeNewsIndex === idx ? "w-6 bg-[#0562d2]" : "w-2 bg-white/30"
                    }`}
                  aria-label={`Go to article slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION (FIGMA SECTION 8) */}
      <section className="w-full bg-[#F8F9FA] border-y border-gray-200 py-[72px]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Left Column: Title */}
          <div className="lg:col-span-4 space-y-2">
            <h2 className="text-3xl lg:text-[48px] font-semibold text-[#1a1a1a] leading-tight tracking-tight max-w-[341px]">
              Các câu hỏi thường gặp
            </h2>
          </div>

          {/* Right Column: Accordions list */}
          <div className="lg:col-span-8 flex flex-col gap-4 w-full">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`relative overflow-hidden border transition-all duration-300 bg-white rounded-lg p-6 ${isOpen
                    ? "border-transparent shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {/* Title Toggle trigger */}
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <span className={`text-base font-semibold transition-colors tracking-tight ${isOpen ? "text-[#0562D2]" : "text-[#1A1A1A]"
                      }`}>
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-[#0562D2] flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-[#1A1A1A] flex-shrink-0" />
                    )}
                  </button>

                  {/* Body Content with Smooth Height Transition */}
                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}>
                    <div className="overflow-hidden">
                      <p className="pt-4 text-sm text-gray-600 leading-relaxed font-normal">
                        {faq.a}
                      </p>
                    </div>
                  </div>

                  {/* Absolute Bottom Blue Underline */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-[#0562D2] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`} />
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. OUR STORY */}
      <section id="our-story" className="bg-[#00095b]">
        {/* Top Banner */}
        <div className="w-full h-[547px] relative">
          <Image
            src={siteAssets.ourStoryBanner}
            alt="Đồng Nai Ford Office"
            fill
            className="object-cover"
          />
          {/* Navy gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00095b]/35 to-[#00095b]" />
        </div>

        {/* Bottom content section */}
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full pb-20 pt-10">
          <div className="max-w-[1152px] mx-auto flex flex-col lg:flex-row gap-20 items-center justify-between">
            {/* Left Column: Bio */}
            <div className="lg:w-[457px] flex flex-col items-start gap-12 text-white">
              <div className="space-y-4">
                <span className="text-xs font-semibold text-[#0562d2] uppercase tracking-wider block">Our Story</span>
                <h2 className="text-[36px] font-semibold uppercase leading-tight tracking-tight text-white">
                  GIỚI THIỆU ĐÔI NÉT VỀ <br />
                  <span className="text-white">ĐỒNG NAI FORD</span>
                </h2>
                <p className="text-[16px] text-white/80 leading-relaxed font-normal">
                  Công ty TNHH Dịch vụ – Thương mại TẤN PHÁT ĐẠT, được thành lập vào tháng 12 năm 2006 với tên giao dịch là ĐỒNG NAI FORD, nằm trên quốc lộ 1A nối liền hai miền Nam Bắc ngay ngã tư KCN Amata. Showroom được đầu tư xây dựng hiện đại đạt tiêu chuẩn Signature toàn cầu của Ford Motor, mang lại không gian mua sắm và chăm sóc dịch vụ đẳng cấp cho khách hàng.
                </p>
              </div>

              <div>
                <button
                  onClick={() => {
                    setToastMessage("Bạn đang xem thông tin tóm tắt Về chúng tôi. Tài liệu chi tiết sẽ được cung cấp ở giai đoạn hoàn thiện.");
                    setShowToast(true);
                  }}
                  className="border border-white hover:bg-white hover:text-[#00095b] text-white text-[16px] px-8 py-2.5 rounded-full transition-colors cursor-pointer font-semibold"
                >
                  Về chúng tôi
                </button>
              </div>
            </div>

            {/* Right Column: Grid of 4 Cards */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-[615px] h-[520px]">
              {/* Card 1: Bề dày thành tích */}
              <div className="bg-white border-t-[6px] border-[#066fef] rounded-b-[4px] px-6 py-8 flex flex-col justify-between h-full shadow-sm text-[#424242]">
                <div className="space-y-2">
                  <h4 className="text-[18px] font-semibold text-[#0562d2] uppercase tracking-wider leading-tight">
                    Bề dày thành tích
                  </h4>
                  <p className="text-[14px] text-[#424242]/90 leading-relaxed font-normal">
                    Là một trong những đại lý số 1 của Công ty ô tô Ford Việt Nam với nhiều giải thưởng xuất sắc về thị phần và dịch vụ.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Award className="w-8 h-8 text-[#0562d2]" />
                </div>
              </div>

              {/* Card 2: Quy mô lớn tại VN */}
              <div className="bg-white/10 px-6 py-8 flex flex-col justify-between h-full rounded-[4px] text-white">
                <div className="space-y-2">
                  <h4 className="text-[18px] font-semibold text-white uppercase tracking-wider leading-tight">
                    Quy mô lớn tại VN
                  </h4>
                  <p className="text-[14px] text-white/90 leading-relaxed font-normal">
                    Sở hữu diện tích sàn lớn nhất vùng Đông Nam Bộ, trang thiết bị đồng bộ đạt tiêu chuẩn xưởng Signature quốc tế.
                  </p>
                </div>
                <div className="flex justify-end">
                  <ShieldCheck className="w-8 h-8 text-white/70" />
                </div>
              </div>

              {/* Card 3: Nhân sự chất lượng */}
              <div className="bg-white/10 px-6 py-8 flex flex-col justify-between h-full rounded-[4px] text-white">
                <div className="space-y-2">
                  <h4 className="text-[18px] font-semibold text-white uppercase tracking-wider leading-tight">
                    Nhân sự chất lượng
                  </h4>
                  <p className="text-[14px] text-white/90 leading-relaxed font-normal">
                    Đội ngũ kỹ sư, tư vấn viên đào tạo bài bản và được cấp chứng chỉ chuẩn chỉnh từ tập đoàn Ford Việt Nam.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Users className="w-8 h-8 text-white/70" />
                </div>
              </div>

              {/* Card 4: Hài lòng khách hàng */}
              <div className="bg-white/10 px-6 py-8 flex flex-col justify-between h-full rounded-[4px] text-white">
                <div className="space-y-2">
                  <h4 className="text-[18px] font-semibold text-white uppercase tracking-wider leading-tight">
                    Hài lòng khách hàng
                  </h4>
                  <p className="text-[14px] text-white/90 leading-relaxed font-normal">
                    Luôn cải tiến quy trình phục vụ, tối ưu thủ tục mua xe trả góp và đẩy mạnh dịch vụ giao xe tại nhà.
                  </p>
                </div>
                <div className="flex justify-end">
                  <CheckCircle className="w-8 h-8 text-white/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CONSULTATION RICH TEXT SECTION (FIGMA SECTION 10) */}
      <section id="consultation" className="relative py-20 px-0 w-full overflow-hidden bg-black text-white">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Ford Showroom background"
            className="w-full h-full object-cover blur-[6px] scale-105 opacity-40"
            src={siteAssets.showroomBg}
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full relative z-10">
          <div className="max-w-[1152px] mx-auto flex flex-col lg:flex-row gap-16 items-center justify-center">
            {/* Left Column: Title & Info */}
            <div className="w-full lg:w-[480px] flex flex-col gap-8 items-start justify-center text-white relative z-10">
              <div className="flex flex-col gap-1 items-start text-white w-full">
                <h2 className="text-3xl lg:text-[36px] font-semibold leading-[1.32] tracking-tight uppercase">
                  Tư vấn miễn phí
                </h2>
                <p className="text-[16px] text-gray-300 leading-[1.5]">
                  Để lại thông tin — chúng tôi sẽ liên hệ sớm nhất
                </p>
              </div>

              <div className="flex flex-col gap-6 items-start w-full">
                {/* Showroom Address */}
                <div className="flex gap-3 items-start w-full">
                  <span className="w-6 h-6 flex items-center justify-center text-[#0562D2] flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div className="flex flex-col gap-1 items-start text-white">
                    <span className="text-base font-semibold leading-[1.5]">Showroom</span>
                    <span className="text-sm text-white/90 leading-[1.4]">
                      Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, Thành Phố Đồng Nai
                    </span>
                  </div>
                </div>

                {/* Hotline */}
                <div className="flex gap-3 items-start w-full">
                  <span className="w-6 h-6 flex items-center justify-center text-[#0562D2] flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div className="flex flex-col gap-1 items-start text-white">
                    <span className="text-base font-semibold leading-[1.5]">Hotline</span>
                    <div className="text-sm text-white/90 leading-[1.4] space-y-0.5">
                      <p>Dv: 1800 55 68 58 - KD: 0918 90 90 60</p>
                      <p>(0251) 3857 130 – (0251) 3857 131</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-3 items-start w-full">
                  <span className="w-6 h-6 flex items-center justify-center text-[#0562D2] flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div className="flex flex-col gap-1 items-start text-white">
                    <span className="text-base font-semibold leading-[1.5]">Email</span>
                    <span className="text-sm text-white/90 leading-[1.4]">
                      marketing@dongnaiford.com.vn
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <button
                  onClick={() => router.push("/contact")}
                  className="bg-white border border-[#d6d6d6] text-[#424242] px-6 py-2.5 rounded-full text-base font-semibold tracking-[0.16px] shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Gửi yêu cầu tư vấn
                </button>
                <a
                  href="tel:0918909060"
                  className="bg-[#0562d2] border border-[#0562d2] text-white px-6 py-2.5 rounded-full text-base font-semibold tracking-[0.16px] hover:bg-[#0451b0] transition-colors cursor-pointer inline-flex items-center justify-center"
                >
                  Liên hệ ngay
                </a>
              </div>
            </div>

            {/* Right Column: Google Maps Image */}
            <div className="w-full lg:flex-1 h-[350px] lg:h-[427px] relative rounded-xl overflow-hidden border border-white/10 relative z-10">
              <iframe
                title="Bản đồ Đồng Nai Ford"
                src={siteAssets.googleMapsEmbed}
                className="absolute inset-0 w-full h-full border-0 rounded-xl"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING ACTION UTILITY SIDEBAR */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-[#e5e5e5] hover:bg-gray-300 text-[#1a1a1a] flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200 rounded-full cursor-pointer border border-gray-200/50"
            title="Lên đầu trang"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        {/* Hotline Phone Button */}
        <a
          href="tel:0918909060"
          className="group flex items-center justify-end h-10 bg-[#0562D2] hover:bg-[#003478] text-white shadow-lg rounded-full transition-all duration-300 w-10 hover:w-[160px] relative overflow-hidden cursor-pointer"
          title="Gọi Hotline 0918 90 90 60"
        >
          <span className="absolute right-10 font-semibold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-2">
            0918 90 90 60
          </span>
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 animate-pulse" />
          </div>
        </a>

        {/* Zalo Button */}
        <a
          href="https://zalo.me/0918909060"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-end h-10 bg-[#0562D2] hover:bg-[#003478] text-white shadow-lg rounded-full transition-all duration-300 w-10 hover:w-[130px] relative overflow-hidden cursor-pointer"
          title="Chat Zalo hỗ trợ nhanh"
        >
          <span className="absolute right-10 font-semibold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-2">
            Chat Zalo
          </span>
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
        </a>

        {/* Book Test Drive Button */}
        <button
          onClick={() => triggerQuickAction("Đăng ký lái thử", "Tôi đặt lịch lái thử xe Ford.")}
          className="group flex items-center justify-end h-10 bg-[#0562D2] hover:bg-[#003478] text-white shadow-lg rounded-full transition-all duration-300 w-10 hover:w-[160px] relative overflow-hidden border border-white/10 cursor-pointer"
          title="Đăng ký lái thử"
        >
          <span className="absolute right-10 font-semibold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-2">
            Đăng ký lái thử
          </span>
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>

      {/* CLIENT SIDE TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-primary/95 backdrop-blur-md border-l-4 border-vivid text-white p-4 max-w-sm rounded-lg shadow-xl flex gap-3 items-start animate-reveal-on-scroll">
          <div className="w-5 h-5 bg-vivid text-white flex items-center justify-center rounded-full mt-0.5 flex-shrink-0">
            <CheckCircle className="w-3.5 h-3.5 fill-current text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-extrabold uppercase text-xs tracking-wider text-vivid">Thông báo hệ thống</h4>
            <p className="text-xs text-gray-200 leading-normal">{toastMessage}</p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
