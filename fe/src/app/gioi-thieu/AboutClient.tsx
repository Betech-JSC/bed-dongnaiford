"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { aboutAssets, handleImageError, resolveImageUrl } from "@/lib/site-assets";
import { jobsAPI, settingsAPI } from "@/lib/api";

// Recruitment position data
interface JobPosition {
  title: string;
  department: string;
  location: string;
  shortDesc: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const jobPositions: JobPosition[] = [
  {
    title: "Chuyên viên Tư bán Bán hàng (Sales)",
    department: "Phòng Kinh doanh",
    location: "Showroom Amata, Biên Hòa, Đồng Nai",
    shortDesc: "Đam mê ngành ô tô, giao tiếp tốt, có kỹ năng tư vấn và chăm sóc khách hàng.",
    description: "Chúng tôi tìm kiếm những cộng sự đam mê ngành ô tô, năng động và mong muốn bứt phá thu nhập, đại diện cho hình ảnh chuyên nghiệp của Đồng Nai Ford.",
    requirements: [
      "Tốt nghiệp Cao đẳng trở lên các ngành Quản trị kinh doanh, Marketing, Kỹ thuật ô tô...",
      "Yêu thích kinh doanh, giao tiếp tốt, tác phong lịch sự, chuyên nghiệp.",
      "Có kỹ năng tư vấn, thuyết phục và chăm sóc khách hàng.",
      "Ưu tiên ứng viên có kinh nghiệm bán hàng ô tô hoặc có bằng lái xe hạng B2."
    ],
    benefits: [
      "Thu nhập hấp dẫn: Lương cơ bản + Hoa hồng doanh số vượt trội (không giới hạn).",
      "Được đào tạo bài bản quy trình bán hàng tiêu chuẩn toàn cầu của Ford.",
      "Chế độ bảo hiểm xã hội, bảo hiểm y tế đầy đủ theo quy định.",
      "Cơ hội thăng tiến lên Trưởng nhóm, Trưởng phòng kinh doanh."
    ]
  },
  {
    title: "Kỹ thuật viên Sửa chữa Chung (Máy - Gầm - Điện)",
    department: "Xưởng Dịch vụ",
    location: "Xưởng dịch vụ Đồng Nai Ford, Biên Hòa",
    shortDesc: "Đảm nhận công việc chẩn đoán, sửa chữa và bảo dưỡng các dòng xe Ford theo tiêu chuẩn.",
    description: "Đảm nhận công việc chẩn đoán, sửa chữa và bảo dưỡng các dòng xe Ford theo tiêu chuẩn kỹ thuật nghiêm ngặt nhằm mang đến sự an toàn tuyệt đối cho khách hàng.",
    requirements: [
      "Tốt nghiệp Trung cấp/Cao đẳng chuyên ngành Công nghệ kỹ thuật Ô tô hoặc tương đương.",
      "Có ít nhất 1 năm kinh nghiệm sửa chữa máy gầm điện ô tô.",
      "Sử dụng thành thạo các thiết bị chẩn đoán, đo đạc chuyên dụng.",
      "Chăm chỉ, trung thực, có tinh thần trách nhiệm cao."
    ],
    benefits: [
      "Thu nhập cạnh tranh theo năng suất và tay nghề.",
      "Môi trường làm việc chuyên nghiệp, trang bị công nghệ chẩn đoán hiện đại bậc nhất.",
      "Được đào tạo và thi chứng chỉ kỹ thuật viên cấp độ của Ford Việt Nam.",
      "Hỗ trợ cơm trưa, đồng phục và bảo hộ lao động đầy đủ."
    ]
  },
  {
    title: "Nhân viên Cố vấn Dịch vụ",
    department: "Phòng Dịch vụ",
    location: "Xưởng dịch vụ Đồng Nai Ford, Biên Hòa",
    shortDesc: "Đại diện tiếp đón khách hàng, tiếp nhận yêu cầu, tư vấn dịch vụ và bàn giao xe.",
    description: "Đại diện đại lý tiếp đón khách hàng, tiếp nhận yêu cầu sửa chữa, tư vấn dịch vụ kỹ thuật tối ưu và bàn giao xe chu đáo.",
    requirements: [
      "Tốt nghiệp Cao đẳng/Đại học chuyên ngành Công nghệ Ô tô hoặc Cơ khí động lực.",
      "Giao tiếp tự tin, khéo léo, khả năng giải quyết tình huống tốt.",
      "Am hiểu về kỹ thuật ô tô và quy trình dịch vụ sau bán hàng.",
      "Có bằng lái xe B2 là một lợi thế lớn."
    ],
    benefits: [
      "Lương cứng + Thưởng hiệu quả công việc phòng Dịch vụ.",
      "Tham gia các khóa đào tạo nâng cao nghiệp vụ Cố vấn dịch vụ do Ford Việt Nam tổ chức.",
      "Lộ trình thăng tiến rõ ràng trong hệ thống đại lý.",
      "Chế độ nghỉ mát, khám sức khỏe định kỳ hàng năm."
    ]
  },
  {
    title: "Chuyên viên Marketing & Chăm sóc Khách hàng",
    department: "Phòng Hành chính - CS",
    location: "Showroom Amata, Biên Hòa, Đồng Nai",
    shortDesc: "Lên kế hoạch, thực hiện chiến dịch truyền thông quảng cáo và quản trị trải nghiệm khách hàng.",
    description: "Lên kế hoạch, thực hiện các chiến dịch truyền thông quảng cáo trực tuyến, chăm sóc thương hiệu và nâng cao trải nghiệm khách hàng.",
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành Marketing, Quan hệ công chúng hoặc Quản trị kinh doanh.",
      "Có tối thiểu 1 năm kinh nghiệm làm Digital Marketing hoặc chăm sóc khách hàng chăm sóc thương hiệu.",
      "Kỹ năng viết content tốt, sử dụng cơ bản các công cụ thiết kế/video.",
      "Nhiệt tình, chu đáo, có kỹ năng lắng nghe và giải quyết khiếu nại."
    ],
    benefits: [
      "Lương thỏa thuận theo năng lực + Thưởng KPI chiến dịch.",
      "Môi trường trẻ trung, sáng tạo, thỏa sức thực hiện các ý tưởng mới.",
      "Hưởng đầy đủ phúc lợi BHXH, BHYT và thưởng các dịp Lễ, Tết.",
      "Được tham gia các sự kiện ra mắt xe hoành tráng của Ford."
    ]
  },
  {
    title: "Nhân viên Kế toán Tổng hợp",
    department: "Phòng Tài chính - Kế toán",
    location: "Showroom Amata, Biên Hòa, Đồng Nai",
    shortDesc: "Kiểm tra chứng từ, hạch toán doanh thu, lập báo cáo thuế và báo cáo tài chính nội bộ.",
    description: "Kiểm tra chứng từ, hạch toán doanh thu chi phí, lập báo cáo thuế và báo cáo tài chính nội bộ định kỳ đảm bảo tính chính xác và minh bạch tài chính.",
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành Kế toán, Kiểm toán hoặc Tài chính doanh nghiệp.",
      "Có ít nhất 2 năm kinh nghiệm làm kế toán tổng hợp, ưu tiên lĩnh vực thương mại dịch vụ ô tô.",
      "Sử dụng thành thạo phần mềm kế toán (Misa, Fast...) và Excel nâng cao.",
      "Cẩn thận, tỉ mỉ, trung thực và có trách nhiệm cao trong công việc."
    ],
    benefits: [
      "Thu nhập ổn định và xứng đáng với năng lực.",
      "Chế độ tăng lương định kỳ hàng năm theo đánh giá công việc.",
      "Làm việc giờ hành chính từ thứ Hai đến thứ Bảy (nghỉ Chủ Nhật).",
      "Được đóng bảo hiểm đầy đủ ngay sau khi kết thúc thử việc."
    ]
  }
];

// Featured team/vehicles list for bottom slider
interface TeamVehicle {
  id: string;
  name: string;
  image: string;
  link: string;
  quoteLink: string;
}

const teamVehicles: TeamVehicle[] = [
  {
    id: "team-le-ban-giao",
    name: "Lễ Bàn Giao Xe Mới Cho Khách Hàng",
    image: "/images/team/team_1.jpg",
    link: "/lien-he",
    quoteLink: "/lien-he"
  },
  {
    id: "team-tu-van-sales",
    name: "Đội Ngũ Tư Vấn Bán Hàng Chuyên Nghiệp",
    image: "/images/team/team_3.jpg",
    link: "/lien-he",
    quoteLink: "/lien-he"
  },
  {
    id: "team-su-kien-lai-thu",
    name: "Sự Kiện Trưng Bày & Trải Nghiệm Lái Thử Xe",
    image: "/images/team/team_2.jpg",
    link: "/dang-ky-lai-thu",
    quoteLink: "/dang-ky-lai-thu"
  }
];

interface AboutClientProps {
  initialJobs?: any[];
  teamImages?: any[];
}

export default function AboutClient({ initialJobs = [], teamImages: initialTeamImages = [] }: AboutClientProps) {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobs, setJobs] = useState<any[]>(initialJobs);
  const [teamImages, setTeamImages] = useState<any[]>(initialTeamImages);

  useEffect(() => {
    if (initialTeamImages.length > 0) return;
    let active = true;
    const fetchTeamImages = async () => {
      try {
        const res = await settingsAPI.getGeneral() as any;
        if (active && res?.data?.about_team_images && Array.isArray(res.data.about_team_images) && res.data.about_team_images.length > 0) {
          setTeamImages(res.data.about_team_images);
        }
      } catch (err) {
        console.error("Error fetching team images in AboutClient:", err);
      }
    };
    fetchTeamImages();
    return () => { active = false; };
  }, [initialTeamImages]);

  const activeTeamItems: TeamVehicle[] = useMemo(() => {
    if (Array.isArray(teamImages) && teamImages.length > 0) {
      return teamImages.map((img: any, idx: number) => {
        const rawPath = typeof img === "string" ? img : (img?.image || img?.url || img?.path || img?.src || "");
        const rawName = typeof img === "object" && img ? (img?.name || img?.title || img?.alt) : undefined;
        return {
          id: `team-cms-${idx}`,
          name: rawName || "Đội ngũ Ford Đồng Nai",
          image: resolveImageUrl(rawPath) || "/images/team/team_1.jpg",
          link: typeof img === "object" && img?.link ? img.link : "/lien-he",
          quoteLink: typeof img === "object" && img?.link ? img.link : "/lien-he"
        };
      });
    }
    return teamVehicles;
  }, [teamImages]);

  const teamRow1 = useMemo(() => {
    let items = activeTeamItems.filter((_, idx) => idx % 2 === 0);
    if (items.length === 0) items = [...activeTeamItems];
    let base = [...items];
    while (base.length < 6) {
      base = [...base, ...items];
    }
    return base;
  }, [activeTeamItems]);

  const teamRow2 = useMemo(() => {
    let items = activeTeamItems.filter((_, idx) => idx % 2 !== 0);
    if (items.length === 0) items = [...activeTeamItems];
    let base = [...items];
    while (base.length < 6) {
      base = [...base, ...items];
    }
    return base;
  }, [activeTeamItems]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialJobs.length > 0) return;
    let active = true;
    const fetchJobs = async () => {
      try {
        const res = await jobsAPI.getAll() as any;
        const items = res?.jobs || res?.data || res;
        if (active && Array.isArray(items) && items.length > 0) {
          setJobs(items);
        }
      } catch (error) {
        console.error("Error fetching jobs in AboutClient:", error);
      }
    };
    fetchJobs();
    return () => {
      active = false;
    };
  }, [initialJobs]);

  const handleJobClick = async (job: any) => {
    if (job.requirements) {
      setSelectedJob(job);
      return;
    }
    setSelectedJob({ ...job, loading: true });
    try {
      const res = await jobsAPI.getBySlug(job.slug) as any;
      const jobDetails = res?.job || res?.data || res;
      if (jobDetails) {
        setSelectedJob(jobDetails);
      } else {
        setSelectedJob(job);
      }
    } catch (err) {
      console.error("Error fetching job detail in AboutPage:", err);
      setSelectedJob(job);
    }
  };

  // Lock body scroll when Modal is active
  useEffect(() => {
    if (selectedJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedJob]);



  return (
    <div className="bg-gray-50 flex-1 min-h-screen">
      {/* SECTION 1: HERO BANNER (Frame 1000005577) */}
      <section className="relative w-full h-[480px] bg-slate-900 overflow-hidden flex items-end group">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about/banner.jpg"
            alt="Đồng Nai Ford Banner"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Rectangle 2017: Black gradient shadow overlay on bottom (170px height) */}
          <div className="absolute bottom-0 left-0 right-0 h-[170px] bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      </section>

      {/* SECTION 2: LỊCH SỬ HÌNH THÀNH (Frame 1000005584) */}
      <section id="our-story" className="py-[72px] scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col gap-20">
          {/* Paragraph intro text */}
          <p className="text-[28px] font-normal leading-[42px] text-[#1a1a1a] max-w-[1152px] font-antenna animate-fade-in-up">
            Được thành lập với mục tiêu mang lại những giá trị di chuyển đích thực, Đồng Nai Ford tự hào là đại lý ủy quyền chính thức đạt tiêu chuẩn 3S toàn cầu của Ford Việt Nam. Chúng tôi không ngừng nỗ lực để cung cấp các dòng xe chất lượng cao và dịch vụ hậu mãi hoàn hảo nhất cho khách hàng.
          </p>

          {/* Showroom Image (Rectangle 2024 - 1152x576px, rounded-24) */}
          <div className="relative w-full aspect-[2/1] rounded-[24px] overflow-hidden shadow-md group cursor-pointer">
            <img
              src="/images/about/image-introduce.jpg"
              alt="Showroom Đồng Nai Ford"
              className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </section>

      {/* SECTION 3: LỊCH SỬ CHI TIẾT - DÒNG 1 (Frame 1000005587) */}
      <section className="py-[72px]">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col lg:flex-row gap-20 items-center">
          {/* Left Text Block */}
          <div className="w-full lg:w-[536px] flex flex-col gap-6">
            <h2 className="text-[36px] font-semibold leading-[47.52px] text-[#00095b] font-antenna uppercase tracking-tight">
              ĐỒNG NAI FORD
              <br />
              ĐẠI LÝ ỦY QUYỀN FORD VIỆT NAM
            </h2>
            <p className="text-base text-gray-600 leading-6 font-antenna">
              Công ty TNHH Dịch vụ – Thương mại TẤN PHÁT ĐẠT, được thành lập vào tháng 12 năm 2006 với tên giao dịch là ĐỒNG NAI FORD, nằm trên quốc lộ 1A nối liền hai miền Nam Bắc ngay ngã tư KCN Amata, khuôn viên của Đồng Nai Ford có tổng diện tích trên 3200m2 bao gồm hệ thống phòng trưng bày và xưởng dịch vụ hiện đại đạt tiêu chuẩn Brand@Retail của Ford toàn cầu.
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-[536px] h-[349.68px] relative rounded-xl overflow-hidden shadow-sm group">
            <img
              src="/images/about/image-about-1.jpg"
              alt="Xưởng Dịch vụ Đồng Nai Ford"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: LỊCH SỬ CHI TIẾT - DÒNG 2 (Frame 1000005588) */}
      <section id="facilities" className="py-[72px] scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col lg:flex-row-reverse gap-20 items-center">
          {/* Right Text Block */}
          <div className="w-full lg:w-[536px] flex flex-col gap-6">
            <div className="text-base text-gray-600 leading-6 font-antenna space-y-4">
              <p>
                Đồng Nai Ford được trang bị các dụng cụ, thiết bị hiện đại và hoàn hảo nhất và tự hào cung cấp các dòng xe Ford chất lượng cao, các dịch vụ sửa chữa, bảo dưỡng tin cậy, phụ tùng phụ kiện chính hãng cũng như các chương trình ưu đãi hấp dẫn cho khách hàng.
              </p>
              <p>
                Với phương châm “Vui lòng khách đến, hài lòng khách đi”, Đồng Nai Ford luôn trân trọng và lắng nghe tất cả các ý kiến đóng góp của quý khách hàng, mong mang lại cho khách hàng sự hài lòng cao nhất.
              </p>
            </div>
          </div>

          {/* Left Image */}
          <div className="w-full lg:w-[536px] h-[349.68px] relative rounded-xl overflow-hidden shadow-sm group">
            <img
              src="/images/about/image-about-2.jpg"
              alt="Thiết bị sửa chữa Đồng Nai Ford"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
        </div>
      </section>

      {/* SECTION: GIẢI THƯỞNG & THÀNH TỰU (AWARDS SECTION - CLEAN WHITE THEME) */}
      <section id="awards" className="py-[72px] bg-white text-slate-900 relative overflow-hidden scroll-mt-20 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full relative z-10 flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-4 text-center max-w-[800px] mx-auto">
            <span className="inline-block bg-blue-50 text-[#066fef] border border-blue-200/80 px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-widest font-antenna w-fit mx-auto shadow-xs">
              🏆 Vinh danh & Khẳng định chất lượng tiêu chuẩn 3S
            </span>
            <h2 className="text-[32px] md:text-[40px] font-bold leading-tight font-antenna uppercase tracking-tight text-[#00095b]">
              Giải thưởng Dịch vụ Xuất sắc
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-antenna max-w-[720px] mx-auto">
              Đồng Nai Ford tự hào được Ford Việt Nam trao tặng giải thưởng danh giá, khẳng định vị thế đại lý dẫn đầu về chất lượng dịch vụ và sự hài lòng tuyệt đối của khách hàng.
            </p>
          </div>

          {/* Award Card Layout (Clean Light Theme Card) */}
          <div className="bg-slate-50/80 rounded-3xl border border-gray-200/80 p-6 md:p-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-12 shadow-lg hover:shadow-xl transition-shadow duration-500">
            {/* Award Image Container */}
            <div 
              onClick={() => setPreviewImage("/images/awards/hit-service-target-award.jpg")}
              className="w-full lg:w-[420px] h-[480px] md:h-[500px] relative rounded-2xl overflow-hidden border border-gray-200/90 bg-white group cursor-pointer shadow-md flex-shrink-0"
            >
              <img
                src="/images/awards/hit-service-target-award.jpg"
                alt="Giải thưởng Hit Service Target Thru The Year - Đồng Nai Ford"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/90 text-[#00095b] text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 shadow-lg flex items-center gap-2">
                  🔍 Click để phóng to
                </span>
              </div>
            </div>

            {/* Award Details Content */}
            <div className="flex-1 flex flex-col gap-6 text-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#00095b] text-white font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-xs">
                  ★ Ford Việt Nam Award
                </span>
                <span className="text-[#066fef] text-xs font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Năm 2024 - 2025
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#00095b] font-antenna leading-snug tracking-tight">
                HIT SERVICE TARGET THRU THE YEAR
              </h3>
              
              <p className="text-[#066fef] font-bold text-lg md:text-xl font-antenna">
                Đại Lý Hoàn Thành Xuất Sắc Mục Tiêu Dịch Vụ Trong Năm
              </p>
              
              <div className="space-y-4 text-gray-600 text-base leading-relaxed font-antenna">
                <p>
                  Giải thưởng <strong className="text-[#00095b] font-semibold">“Hit Service Target Thru The Year”</strong> do Ford Việt Nam trao tặng là minh chứng rõ nét cho sự nỗ lực không ngừng nghỉ của toàn thể đội ngũ cán bộ, kỹ thuật viên và cố vấn dịch vụ tại Đồng Nai Ford.
                </p>
                <p>
                  Đạt và vượt qua chuỗi các tiêu chí kiểm định khắt khe toàn cầu từ quy trình tiếp nhận, chất lượng sửa chữa kỹ thuật đến chỉ số hài lòng khách hàng (CVP/CSI), Đồng Nai Ford khẳng định cam kết mang lại sự an tâm tuyệt đối trên từng cây số cho Quý khách hàng.
                </p>
              </div>

              {/* Specs Box */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex flex-col bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="text-xs text-gray-400 uppercase font-antenna">Đơn vị trao giải</span>
                  <span className="text-sm font-bold text-[#00095b] mt-1">Ford Việt Nam</span>
                </div>
                <div className="flex flex-col bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="text-xs text-gray-400 uppercase font-antenna">Tiêu chuẩn</span>
                  <span className="text-sm font-bold text-[#00095b] mt-1">Global 3S Ford</span>
                </div>
                <div className="flex flex-col bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs col-span-2 md:col-span-1">
                  <span className="text-xs text-gray-400 uppercase font-antenna">Cam kết</span>
                  <span className="text-sm font-bold text-[#066fef] mt-1">100% Khách Hàng Hài Lòng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TẦM NHÌN & ĐỘI NGŨ NHÂN SỰ (Frame 1000005589) */}
      <section className="bg-[#066fef] py-[72px] text-white w-full scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col gap-10">
          {/* Header Block */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[36px] font-semibold leading-[47.52px] font-antenna uppercase tracking-tight">
              Tầm nhìn dẫn đầu dịch vụ tại Ford
            </h2>
            <p className="text-[20px] font-normal leading-[30px] text-white/90 max-w-[1152px] font-antenna">
              Mỗi quyết định, cải tiến và hành động của chúng tôi đều hướng đến một mục tiêu duy nhất: kiến tạo trải nghiệm di chuyển an toàn, tiện nghi và trọn vẹn nhất cho mọi gia đình trên mỗi hành trình.
            </p>
          </div>

          {/* Asymmetric Gallery (1152x600px container) */}
          <div className="flex flex-col md:flex-row gap-4 w-full h-auto md:h-[600px]">
            {/* Left Column (500x600px image) */}
            <div className="w-full md:w-[500px] h-[350px] md:h-full relative rounded-xl overflow-hidden shadow-md group cursor-pointer">
              <img
                src="/images/about/image-vision-1.jpg"
                alt="Vision Gallery Left"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Right Column (636x600px flex stack) */}
            <div className="flex-1 md:w-[636px] flex flex-col gap-4 h-auto md:h-full">
              {/* Top row image (636x292px) */}
              <div className="w-full h-[180px] md:h-[292px] relative rounded-xl overflow-hidden shadow-md group cursor-pointer">
                <img
                  src="/images/about/image-vision-2.jpg"
                  alt="Vision Gallery Top Right"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Bottom row (two 310x292px images) */}
              <div className="grid grid-cols-2 gap-4 h-[150px] md:h-[292px]">
                <div className="relative rounded-xl overflow-hidden shadow-md h-full group cursor-pointer">
                  <img
                    src="/images/about/image-vision-3.jpg"
                    alt="Vision Gallery Bottom Left"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-md h-full group cursor-pointer">
                  <img
                    src="/images/about/image-vision-4.jpg"
                    alt="Vision Gallery Bottom Right"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TUYỂN DỤNG NHÂN SỰ (Frame 1000005586) - CHỈ HIỂN THỊ NẾU CÓ DỮ LIỆU TỪ CMS */}
      {jobs && jobs.length > 0 && (
        <section id="recruitment" className="bg-[#f0f0f0] py-16 scroll-mt-20">
          <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full flex flex-col gap-8">
            <h2 className="text-[36px] font-semibold leading-[47.52px] text-[#1a1a1a] font-antenna uppercase text-center tracking-tight">
              TUYỂN DỤNG NHÂN SỰ
            </h2>

            {/* List of flat cards */}
            <div className="max-w-[800px] w-full mx-auto flex flex-col gap-6">
              {jobs.map((job, idx) => (
                <div
                  key={job.id || idx}
                  onClick={() => handleJobClick(job)}
                  className="w-full bg-white rounded-xl shadow-xs p-6 flex items-center gap-4 border border-gray-100 hover:border-[#066fef]/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer active:scale-[0.99]"
                >
                  {/* Logo Ford Oval */}
                  <div className="w-[85.3px] h-8 relative flex-shrink-0 flex items-center">
                    <img
                      src="/ford_logo.svg"
                      alt="Ford Logo"
                      width={85}
                      height={32}
                      className="w-[85.3px] h-8 object-contain block"
                    />
                  </div>

                  {/* Job Title and Short Description */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <h3 className="text-base font-semibold leading-6 text-[#1a1a1a] font-antenna truncate group-hover:text-[#066fef] transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm font-normal leading-[19.6px] text-gray-500 font-antenna truncate">
                      {job.description || job.shortDesc || job.working_position || job.work_address || "Xem chi tiết thông tin tuyển dụng"}
                    </p>
                  </div>

                  {/* Interactive circular toggle button */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 transition-all duration-300 flex-shrink-0 bg-white group-hover:bg-[#0562d2] group-hover:border-[#0562d2] text-[#0562d2] group-hover:text-white">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 7: SLIDER ĐỘI NGŨ (Filmstrip Infinite Stream - 2 Hàng So Le Như LongKhánh) */}
      <section id="board-of-directors" className="bg-white py-16 md:py-24 overflow-hidden scroll-mt-20 w-full border-t border-[#e5e5e5]">
        <style>{`
          @keyframes marquee-left {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          @keyframes marquee-right {
            0% { transform: translate3d(-50%, 0, 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
          .animate-marquee-l {
            display: flex;
            width: max-content;
            animation: marquee-left 40s linear infinite;
          }
          .animate-marquee-r {
            display: flex;
            width: max-content;
            animation: marquee-right 40s linear infinite;
          }
          .animate-marquee-l:hover,
          .animate-marquee-r:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="max-w-[1440px] mx-auto px-4 xl:px-[144px] w-full mb-10">
          <div className="flex justify-between items-end gap-6">
            <div>
              <div className="text-xs font-bold text-[#066fef] uppercase tracking-[0.2em] font-antenna mb-2">
                Đồng hành phát triển
              </div>
              <h2 className="text-[32px] md:text-[44px] font-bold text-[#1a1a1a] leading-tight font-antenna uppercase tracking-tight">
                Đội ngũ Ford Đồng Nai
              </h2>
            </div>
          </div>
        </div>

        {/* Carousel 2 rows container so le */}
        <div className="flex flex-col gap-6 w-full relative">
          
          {/* Row 1: Sliding Left */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-l gap-6">
              {[...teamRow1, ...teamRow1].map((card, idx) => (
                <div
                  key={`r1-${card.id}-${idx}`}
                  onClick={() => setPreviewImage(card.image)}
                  className="w-[300px] md:w-[420px] h-[200px] md:h-[260px] relative flex-shrink-0 rounded-xl overflow-hidden group cursor-pointer block border border-[#e5e5e5] bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  {/* Subtle info on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end justify-between p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex flex-col gap-1 min-w-0 pr-2">
                      <span className="text-[10px] font-extrabold text-[#066fef] tracking-widest uppercase font-antenna">
                        SỰ KIỆN & ĐỘI NGŨ
                      </span>
                      <span className="text-sm md:text-base font-bold text-white font-antenna uppercase truncate max-w-full">
                        {card.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Sliding Right */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-r gap-6">
              {[...teamRow2, ...teamRow2].map((card, idx) => (
                <div
                  key={`r2-${card.id}-${idx}`}
                  onClick={() => setPreviewImage(card.image)}
                  className="w-[300px] md:w-[420px] h-[200px] md:h-[260px] relative flex-shrink-0 rounded-xl overflow-hidden group cursor-pointer block border border-[#e5e5e5] bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  {/* Subtle info on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end justify-between p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex flex-col gap-1 min-w-0 pr-2">
                      <span className="text-[10px] font-extrabold text-[#066fef] tracking-widest uppercase font-antenna">
                        CƠ SỞ VẬT CHẤT & ĐỘI NGŨ
                      </span>
                      <span className="text-sm md:text-base font-bold text-white font-antenna uppercase truncate max-w-full">
                        {card.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)} 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-white/20">
            <img 
              src={previewImage} 
              alt="Preview Team Image" 
              className="max-h-[85vh] w-auto object-contain rounded-2xl" 
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* RECRUITMENT MODAL (Option A) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#e5e5e5] p-8 flex flex-col gap-6 scrollbar-thin animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-black hover:rotate-90 transition-all duration-300 focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col gap-2">
              <div className="w-[85.3px] h-8 relative flex items-center">
                <img
                  src="/ford_logo.svg"
                  alt="Ford Logo"
                  width={85}
                  height={32}
                  className="w-[85.3px] h-8 object-contain block"
                />
              </div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] font-antenna mt-2">
                {selectedJob.title}
              </h2>
              <p className="text-xs font-bold text-[#0562d2] uppercase tracking-wider font-antenna">
                {selectedJob.department || selectedJob.working_position || "Phòng nhân sự"} &bull; {selectedJob.location || selectedJob.work_address || "Biên Hòa, Đồng Nai"}
              </p>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-6 text-sm text-gray-700 leading-relaxed font-antenna">
              {selectedJob.loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0562d2]" />
                </div>
              ) : (
                <>
                  {selectedJob.content ? (
                    <div
                      className="prose prose-sm max-w-none text-gray-700
                        prose-headings:text-[#00095B] prose-headings:font-bold
                        prose-a:text-[#0562d2] prose-strong:text-[#1a1a1a]
                        prose-li:marker:text-[#0562d2]"
                      dangerouslySetInnerHTML={{ __html: selectedJob.content }}
                    />
                  ) : (
                    <>
                      <p className="italic text-gray-600 bg-gray-50 p-4 rounded-xl border-l-4 border-[#0562d2]">
                        {selectedJob.description}
                      </p>

                      {/* Job Requirements */}
                      {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs border-b border-gray-100 pb-2">
                            YÊU CẦU CÔNG VIỆC
                          </h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            {selectedJob.requirements.map((req: string, rIdx: number) => (
                              <li key={rIdx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Job Benefits */}
                      {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs border-b border-gray-100 pb-2">
                            QUYỀN LỢI ĐƯỢC HƯỞNG
                          </h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            {selectedJob.benefits.map((ben: string, bIdx: number) => (
                              <li key={bIdx}>{ben}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Apply Button CTA */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Link
                href={selectedJob.slug ? `/tuyen-dung/${selectedJob.slug}` : "/lien-he"}
                onClick={() => setSelectedJob(null)}
                className="w-full md:w-auto text-center px-6 py-3 bg-[#0562d2] hover:bg-[#00095b] text-white font-semibold text-sm uppercase tracking-wider rounded-full transition-colors duration-200 shadow-sm active:scale-95"
              >
                Nộp đơn ứng tuyển
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
