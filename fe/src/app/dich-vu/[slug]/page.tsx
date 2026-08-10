import { notFound, redirect } from "next/navigation";
import { servicesAPI, maintenanceAPI } from "@/lib/api";
import PeriodicMaintenanceLayout from "@/components/services/layouts/PeriodicMaintenance";
import ExpressMaintenanceLayout from "@/components/services/layouts/ExpressMaintenance";
import PickupDeliveryLayout from "@/components/services/layouts/PickupDelivery";
import CustomerCareLayout from "@/components/services/layouts/CustomerCare";
import GeneralRepairLayout from "@/components/services/layouts/GeneralRepair";
import RoadsideAssistanceLayout from "@/components/services/layouts/RoadsideAssistance";
import UsedCarsLayout from "@/components/services/layouts/UsedCars";
import VehicleUpgradeLayout from "@/components/services/layouts/VehicleUpgrade";
import FordSyncLayout from "@/components/services/layouts/FordSync";
import FordAppLayout from "@/components/services/layouts/FordApp";
import FordEnsureLayout from "@/components/services/layouts/FordEnsure";
import IntelligentOilLifeMonitorLayout from "@/components/services/layouts/IntelligentOilLifeMonitor";
import GenericServiceLayout from "@/components/services/layouts/GenericService";

const serviceRedirects: Record<string, string> = {
  "dich-vu-bao-duong": "bao-duong-dinh-ky",
  "dich-vu-bao-duong-nhanh": "bao-duong-nhanh",
  "dich-vu-giao-nhan-xe-tan-noi": "giao-nhan-xe-tan-noi",
  "nhan-va-giao-xe-tan-noi": "giao-nhan-xe-tan-noi",
  "nhan-giao-xe-mien-phi": "giao-nhan-xe-tan-noi",
  "dich-vu-nhan-giao-xe-mien-phi": "giao-nhan-xe-tan-noi",
  "nhan-giao-xe-tan-noi-mien-phi": "giao-nhan-xe-tan-noi",
  "dich-vu-cham-soc-xe": "cham-soc-khach-hang",
  "dich-vu-sua-chua": "sua-chua-xe",
  "cuu-ho-giao-thong": "cuu-ho-247",
  "dich-vu-cuu-ho-247": "cuu-ho-247",
  "dich-vu-xe-da-qua-su-dung": "xe-da-qua-su-dung",
  "dich-vu-nang-cap-xe": "nang-cap-xe",
  "phu-kien-nang-cap": "nang-cap-xe",
  "sync": "ford-sync",
  "ung-dung-ford": "fordpass",
  "ensure": "ford-ensure",
  "intelligent-oil-life-monitoring": "intelligent-oil-life-monitor",
  "canh-bao-thay-dau-iolm": "intelligent-oil-life-monitor"
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    if (serviceRedirects[slug]) {
      return {
        alternates: {
          canonical: `/dich-vu/${serviceRedirects[slug]}`,
        },
      };
    }
    const fetchPromise = servicesAPI.getBySlug(slug) as any;
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 800));
    const response = await Promise.race([fetchPromise, timeoutPromise]) as any;
    const service = response?.service;
    const seo = response?.seo;

    if (!service) return {};

    return {
      title: seo?.title || `${service.title} | Đồng Nai Ford`,
      description: seo?.description || service.description || "",
      keywords: seo?.keywords || "",
      alternates: {
        canonical: seo?.canonical || `/dich-vu/${slug}`,
      },
      openGraph: {
        title: seo?.title || service.title,
        description: seo?.description || service.description,
        images: seo?.image ? [{ url: seo.image }] : [],
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
  let serviceData: any = null;
  
  try {
    // Timeout 800ms để tránh chờ đợi trắng màn hình khi CMS API phản hồi chậm
    const fetchPromise = servicesAPI.getBySlug(slug) as any;
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 800));
    const response = await Promise.race([fetchPromise, timeoutPromise]) as any;

    if (response && response.service) {
      serviceData = response.service;
    }
  } catch (error: any) {
    if (error && error.status === 404) {
      console.warn(`[CMS] Service '${slug}' not found in database. Using static frontend fallback.`);
    } else {
      console.error("Failed to load service from CMS API:", error);
    }
  }

  if (!serviceData) {
    const titleMap: Record<string, string> = {
      "bao-duong-dinh-ky": "Dịch vụ bảo dưỡng xe ô tô định kỳ tiêu chuẩn Ford",
      "dich-vu-bao-duong": "Dịch vụ bảo dưỡng xe ô tô định kỳ tiêu chuẩn Ford",
      "bao-duong-nhanh": "Dịch vụ bảo dưỡng nhanh 60 phút",
      "dich-vu-bao-duong-nhanh": "Dịch vụ bảo dưỡng nhanh 60 phút",
      "giao-nhan-xe-tan-noi": "Dịch vụ nhận và giao xe tận nơi",
      "dich-vu-giao-nhan-xe-tan-noi": "Dịch vụ nhận và giao xe tận nơi",
      "nhan-va-giao-xe-tan-noi": "Dịch vụ nhận và giao xe tận nơi",
      "nhan-giao-xe-mien-phi": "Dịch vụ nhận & giao xe tận nơi miễn phí",
      "nhan-giao-xe-tan-noi-mien-phi": "Dịch vụ nhận & giao xe tận nơi miễn phí",
      "dich-vu-nhan-giao-xe-mien-phi": "Dịch vụ nhận & giao xe tận nơi miễn phí",
      "cham-soc-khach-hang": "Dịch vụ chăm sóc khách hàng & Detailing",
      "dich-vu-cham-soc-xe": "Dịch vụ chăm sóc khách hàng & Detailing",
      "dich-vu-sua-chua": "Dịch vụ sửa chữa chẩn đoán & Đồng sơn 3S",
      "sua-chua-xe": "Dịch vụ sửa chữa chẩn đoán & Đồng sơn 3S",
      "dich-vu-cuu-ho-247": "Dịch vụ cứu hộ giao thông 24/7",
      "cuu-ho-247": "Dịch vụ cứu hộ giao thông 24/7",
      "dich-vu-xe-da-qua-su-dung": "Dịch vụ xe đã qua sử dụng",
      "xe-da-qua-su-dung": "Dịch vụ xe đã qua sử dụng",
      "dich-vu-nang-cap-xe": "Dịch vụ nâng cấp xe",
      "nang-cap-xe": "Dịch vụ nâng cấp xe",
      "ford-sync": "Công nghệ kết nối thông minh Ford SYNC®",
      "ung-dung-ford": "Ứng dụng kết nối thông minh FordPass™",
      "fordpass": "Ứng dụng kết nối thông minh FordPass™",
      "ford-ensure": "Chương trình bảo hiểm & bảo hành mở rộng Ford Ensure",
      "intelligent-oil-life-monitor": "Hệ thống Cảnh báo Thay dầu Thông minh (IOLM)",
      "intelligent-oil-life-monitoring": "Hệ thống Cảnh báo Thay dầu Thông minh (IOLM)",
      "canh-bao-thay-dau-iolm": "Hệ thống Cảnh báo Thay dầu Thông minh (IOLM)"
    };

    serviceData = {
      title: titleMap[slug] || "Dịch vụ chăm sóc xe Ford chính hãng",
      slug: slug,
      description: "Xưởng dịch vụ lớn nhất khu vực Đồng Nai của đại lý Đồng Nai Ford. Cung cấp các gói bảo dưỡng định kỳ, bảo dưỡng nhanh 60 phút, sửa chữa chung và giao nhận xe tận nhà."
    };
  }

  // 1. Periodic Maintenance Layout Switcher
  if (slug === "bao-duong-dinh-ky" || slug === "dich-vu-bao-duong") {
    let displaySchedules: any[] = [];
    try {
      const scheduleRes = await maintenanceAPI.getSchedules();
      if (scheduleRes && scheduleRes.success && Array.isArray(scheduleRes.data)) {
        displaySchedules = scheduleRes.data.map((item: any) => ({
          name: item.name || "",
          image: item.image || "/assets/car-placeholder.png",
          links: Array.isArray(item.links) ? item.links : [],
        }));
      }
    } catch (error) {
      console.error("Failed to load maintenance schedules for Periodic layout:", error);
    }
    return <PeriodicMaintenanceLayout service={serviceData} displaySchedules={displaySchedules} />;
  }

  // 2. Express Maintenance Layout Switcher
  if (slug === "bao-duong-nhanh" || slug === "dich-vu-bao-duong-nhanh") {
    return <ExpressMaintenanceLayout service={serviceData} />;
  }

  // 3. Pickup & Delivery Layout Switcher
  if (slug === "giao-nhan-xe-tan-noi" || slug === "dich-vu-giao-nhan-xe-tan-noi" || slug === "nhan-va-giao-xe-tan-noi" || slug === "nhan-giao-xe-mien-phi" || slug === "dich-vu-nhan-giao-xe-mien-phi" || slug === "nhan-giao-xe-tan-noi-mien-phi") {
    return <PickupDeliveryLayout service={serviceData} />;
  }

  // 4. Customer Care Layout Switcher
  if (slug === "cham-soc-khach-hang" || slug === "dich-vu-cham-soc-xe") {
    return <CustomerCareLayout service={serviceData} />;
  }

  // 5. General Repair & Body Paint Layout Switcher
  if (slug === "dich-vu-sua-chua" || slug === "sua-chua-xe") {
    return <GeneralRepairLayout service={serviceData} />;
  }

  // 6. Roadside Assistance 24/7 Rescue Layout Switcher
  if (slug === "dich-vu-cuu-ho-247" || slug === "cuu-ho-247" || slug === "cuu-ho-giao-thong") {
    return <RoadsideAssistanceLayout service={serviceData} />;
  }

  // 7. Ford Assured Certified Pre-Owned Used Cars Layout Switcher
  if (slug === "dich-vu-xe-da-qua-su-dung" || slug === "xe-da-qua-su-dung") {
    return <UsedCarsLayout service={serviceData} />;
  }

  // 8. Vehicle Accessories Upgrade Layout Switcher
  if (slug === "dich-vu-nang-cap-xe" || slug === "nang-cap-xe" || slug === "phu-kien-nang-cap") {
    return <VehicleUpgradeLayout service={serviceData} />;
  }

  // 9. Ford SYNC Technology Layout Switcher
  if (slug === "ford-sync" || slug === "sync") {
    return <FordSyncLayout service={serviceData} />;
  }

  // 10. FordPass App Layout Switcher
  if (slug === "ung-dung-ford" || slug === "fordpass") {
    return <FordAppLayout service={serviceData} />;
  }

  // 11. Ford Ensure Program Layout Switcher
  if (slug === "ford-ensure" || slug === "ensure") {
    return <FordEnsureLayout service={serviceData} />;
  }

  // 12. Intelligent Oil Life Monitor Layout Switcher
  if (slug === "intelligent-oil-life-monitor" || slug === "intelligent-oil-life-monitoring" || slug === "canh-bao-thay-dau-iolm") {
    return <IntelligentOilLifeMonitorLayout service={serviceData} />;
  }

  // 13. Default Fallback layout (Dynamic CMS Layout)
  return <GenericServiceLayout service={serviceData} />;
}
