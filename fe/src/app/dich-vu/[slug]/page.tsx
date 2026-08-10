import { notFound, redirect } from "next/navigation";
import dynamic from "next/dynamic";

const PeriodicMaintenanceLayout = dynamic(() => import("@/components/services/layouts/PeriodicMaintenance"));
const ExpressMaintenanceLayout = dynamic(() => import("@/components/services/layouts/ExpressMaintenance"));
const PickupDeliveryLayout = dynamic(() => import("@/components/services/layouts/PickupDelivery"));
const CustomerCareLayout = dynamic(() => import("@/components/services/layouts/CustomerCare"));
const GeneralRepairLayout = dynamic(() => import("@/components/services/layouts/GeneralRepair"));
const RoadsideAssistanceLayout = dynamic(() => import("@/components/services/layouts/RoadsideAssistance"));
const UsedCarsLayout = dynamic(() => import("@/components/services/layouts/UsedCars"));
const VehicleUpgradeLayout = dynamic(() => import("@/components/services/layouts/VehicleUpgrade"));
const FordSyncLayout = dynamic(() => import("@/components/services/layouts/FordSync"));
const FordAppLayout = dynamic(() => import("@/components/services/layouts/FordApp"));
const FordEnsureLayout = dynamic(() => import("@/components/services/layouts/FordEnsure"));
const IntelligentOilLifeMonitorLayout = dynamic(() => import("@/components/services/layouts/IntelligentOilLifeMonitor"));
const GenericServiceLayout = dynamic(() => import("@/components/services/layouts/GenericService"));

const serviceRedirects: Record<string, string> = {
  "sua-chua-xe": "dich-vu-sua-chua",
  "dich-vu-bao-duong": "bao-duong-dinh-ky",
  "dich-vu-bao-duong-nhanh": "bao-duong-nhanh",
  "giao-nhan-xe-tan-noi": "nhan-giao-xe-mien-phi",
  "dich-vu-giao-nhan-xe-tan-noi": "nhan-giao-xe-mien-phi",
  "nhan-va-giao-xe-tan-noi": "nhan-giao-xe-mien-phi",
  "dich-vu-nhan-giao-xe-mien-phi": "nhan-giao-xe-mien-phi",
  "nhan-giao-xe-tan-noi-mien-phi": "nhan-giao-xe-mien-phi",
  "dich-vu-cham-soc-xe": "cham-soc-khach-hang",
  "cuu-ho-247": "dich-vu-cuu-ho-247",
  "cuu-ho-giao-thong": "dich-vu-cuu-ho-247",
  "xe-da-qua-su-dung": "dich-vu-xe-da-qua-su-dung",
  "nang-cap-xe": "dich-vu-nang-cap-xe",
  "phu-kien-nang-cap": "dich-vu-nang-cap-xe",
  "sync": "ford-sync",
  "fordpass": "ung-dung-ford",
  "ensure": "ford-ensure",
  "intelligent-oil-life-monitoring": "intelligent-oil-life-monitor",
  "canh-bao-thay-dau-iolm": "intelligent-oil-life-monitor"
};

const SERVICE_SEO_MAP: Record<string, { title: string; desc: string }> = {
  "bao-duong-dinh-ky": {
    title: "Dịch Vụ Bảo Dưỡng Định Kỳ Ô Tô Tiêu Chuẩn Ford | Đồng Nai Ford",
    desc: "Quy trình bảo dưỡng định kỳ xe ô tô Ford tiêu chuẩn 167 điểm. Đặt lịch bảo dưỡng trực tuyến nhanh chóng tại Đồng Nai Ford.",
  },
  "bao-duong-nhanh": {
    title: "Dịch Vụ Bảo Dưỡng Nhanh 60 Phút Ford Express Service | Đồng Nai Ford",
    desc: "Bảo dưỡng xe ô tô Ford nhanh chóng chỉ 60 phút. Tiết kiệm thời gian, quy trình chuyên nghiệp tại Đồng Nai Ford.",
  },
  "nhan-giao-xe-mien-phi": {
    title: "Dịch Vụ Giao Nhận Xe Tận Nơi Miễn Phí | Đồng Nai Ford",
    desc: "Đồng Nai Ford cung cấp dịch vụ nhận và giao xe tận nhà miễn phí cho khách hàng bảo dưỡng & sửa chữa ô tô.",
  },
  "cham-soc-khach-hang": {
    title: "Dịch Vụ Chăm Sóc Xe & Detailing Chính Hãng Ford | Đồng Nai Ford",
    desc: "Gói chăm sóc xe ô tô toàn diện, phủ ceramic, vệ sinh nội thất, đánh bóng sơn xe ô tô Ford chuyên nghiệp.",
  },
  "dich-vu-sua-chua": {
    title: "Dịch Vụ Sửa Chữa Chẩn Đoán & Đồng Sơn 3S Ford | Đồng Nai Ford",
    desc: "Xưởng dịch vụ đồng sơn và sửa chữa ô tô lớn nhất Đồng Nai. Máy chẩn đoán Ford IDS chuyên dụng.",
  },
  "dich-vu-cuu-ho-247": {
    title: "Dịch Vụ Cứu Hộ Giao Thông 24/7 Khẩn Cấp | Đồng Nai Ford",
    desc: "Hotline cứu hộ ô tô 24/7 Đồng Nai Ford: 1800 55 68 58. Hỗ trợ kéo xe và xử lý sự cố tận nơi toàn tỉnh Đồng Nai.",
  },
  "dich-vu-xe-da-qua-su-dung": {
    title: "Dịch Vụ Xe Đã Qua Sử Dụng Chính Hãng Ford Assured | Đồng Nai Ford",
    desc: "Mua bán và thu mua xe Ford đã qua sử dụng chính hãng kiểm định 167 điểm khắt khe. Bảo hành chính hãng.",
  },
  "dich-vu-nang-cap-xe": {
    title: "Dịch Vụ Nâng Cấp Xe & Phụ Kiện Chính Hãng Ford | Đồng Nai Ford",
    desc: "Nâng cấp đồ chơi xe Ford, dán phim cách nhiệt, nắp thùng bán tải, camera hành trình chính hãng.",
  },
  "ford-sync": {
    title: "Công Nghệ Kết Nối Thông Minh Ford SYNC® | Đồng Nai Ford",
    desc: "Khám phá công nghệ giải trí, bản đồ vị trí và điều khiển bằng giọng nói tiếng Việt Ford SYNC®.",
  },
  "ung-dung-ford": {
    title: "Ứng Dụng Kết Nối Thông Minh FordPass™ | Đồng Nai Ford",
    desc: "Quản lý và định vị, khởi động xe từ xa, kiểm tra tình trạng xe qua ứng dụng thông minh FordPass™.",
  },
  "ford-ensure": {
    title: "Chương Trình Bảo Hiểm & Bảo Hành Mở Rộng Ford Ensure | Đồng Nai Ford",
    desc: "Bảo hiểm thân xe và gia hạn bảo hành chính hãng Ford Ensure cho sự an tâm tuyệt đối trên mọi hành trình.",
  },
  "intelligent-oil-life-monitor": {
    title: "Hệ Thống Cảnh Báo Thay Dầu Thông Minh (IOLM) | Đồng Nai Ford",
    desc: "Công nghệ tính toán thời điểm thay dầu động cơ thông minh dựa trên điều kiện vận hành thực tế.",
  },
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const targetSlug = serviceRedirects[slug] || slug;
    const staticSeo = SERVICE_SEO_MAP[targetSlug] || {
      title: "Dịch Vụ Chăm Sóc Xe Ford Chính Hãng | Đồng Nai Ford",
      desc: "Xưởng dịch vụ lớn nhất khu vực Đồng Nai của đại lý Đồng Nai Ford. Cung cấp các gói bảo dưỡng định kỳ, bảo dưỡng nhanh 60 phút, sửa chữa chung và giao nhận xe tận nhà."
    };

    return {
      title: staticSeo.title,
      description: staticSeo.desc,
      alternates: {
        canonical: `/dich-vu/${targetSlug}`,
      },
      openGraph: {
        title: staticSeo.title,
        description: staticSeo.desc,
        images: [{ url: "/images-services/service-maintenance-banner.webp" }],
      },
    };
  } catch {
    return {};
  }
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  if (serviceRedirects[slug]) {
    redirect(`/dich-vu/${serviceRedirects[slug]}`);
  }

  const targetSlug = slug;
  const staticSeo = SERVICE_SEO_MAP[targetSlug] || {
    title: "Dịch Vụ Chăm Sóc Xe Ford Chính Hãng",
    desc: "Xưởng dịch vụ lớn nhất khu vực Đồng Nai của đại lý Đồng Nai Ford."
  };

  const serviceData = {
    title: staticSeo.title.split("|")[0].trim(),
    slug: targetSlug,
    description: staticSeo.desc,
  };

  // Render static LDP layouts instantly in 0ms without waiting for CMS API
  if (slug === "bao-duong-dinh-ky" || slug === "dich-vu-bao-duong") {
    return <PeriodicMaintenanceLayout service={serviceData} displaySchedules={[]} />;
  }

  if (slug === "bao-duong-nhanh" || slug === "dich-vu-bao-duong-nhanh") {
    return <ExpressMaintenanceLayout service={serviceData} />;
  }

  if (slug === "nhan-giao-xe-mien-phi" || slug === "giao-nhan-xe-tan-noi" || slug === "dich-vu-giao-nhan-xe-tan-noi" || slug === "nhan-va-giao-xe-tan-noi" || slug === "dich-vu-nhan-giao-xe-mien-phi" || slug === "nhan-giao-xe-tan-noi-mien-phi") {
    return <PickupDeliveryLayout service={serviceData} />;
  }

  if (slug === "cham-soc-khach-hang" || slug === "dich-vu-cham-soc-xe") {
    return <CustomerCareLayout service={serviceData} />;
  }

  if (slug === "dich-vu-sua-chua" || slug === "sua-chua-xe") {
    return <GeneralRepairLayout service={serviceData} />;
  }

  if (slug === "dich-vu-cuu-ho-247" || slug === "cuu-ho-247" || slug === "cuu-ho-giao-thong") {
    return <RoadsideAssistanceLayout service={serviceData} />;
  }

  if (slug === "dich-vu-xe-da-qua-su-dung" || slug === "xe-da-qua-su-dung") {
    return <UsedCarsLayout service={serviceData} />;
  }

  if (slug === "dich-vu-nang-cap-xe" || slug === "nang-cap-xe" || slug === "phu-kien-nang-cap") {
    return <VehicleUpgradeLayout service={serviceData} />;
  }

  if (slug === "ford-sync" || slug === "sync") {
    return <FordSyncLayout service={serviceData} />;
  }

  if (slug === "ung-dung-ford" || slug === "fordpass") {
    return <FordAppLayout service={serviceData} />;
  }

  if (slug === "ford-ensure" || slug === "ensure") {
    return <FordEnsureLayout service={serviceData} />;
  }

  if (slug === "intelligent-oil-life-monitor" || slug === "intelligent-oil-life-monitoring" || slug === "canh-bao-thay-dau-iolm") {
    return <IntelligentOilLifeMonitorLayout service={serviceData} />;
  }

  return <GenericServiceLayout service={serviceData} />;
}
