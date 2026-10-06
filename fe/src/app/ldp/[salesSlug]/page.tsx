import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ldpAPI, bannersAPI, vehiclesAPI, servicesAPI, customerHandoversAPI, postsAPI } from "@/lib/api";
import LdpHomeClient from "@/components/vehicle/LdpHomeClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{
    salesSlug: string;
  }>;
};

const resolveFileUrl = (file: any): string => {
  if (!file) return "";
  if (typeof file === "string") {
    if (file.startsWith("http://") || file.startsWith("https://") || file.startsWith("/")) {
      return encodeURI(file);
    }
    const cleanPath = file.startsWith("uploads/") ? file.replace("uploads/", "") : file;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    let apiHost = "http://localhost:8000";
    try {
      apiHost = new URL(apiBase).origin;
    } catch (e) { }
    return encodeURI(`${apiHost}/static/${cleanPath}`);
  }
  if (typeof file === "object") {
    if (file.url && typeof file.url === "string") return encodeURI(file.url);
    if (file.static_url && typeof file.static_url === "string") return encodeURI(file.static_url);
    if (file.path && typeof file.path === "string") {
      const cleanPath = file.path.startsWith("uploads/") ? file.path.replace("uploads/", "") : file.path;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      let apiHost = "http://localhost:8000";
      try {
        apiHost = new URL(apiBase).origin;
      } catch (e) { }
      return encodeURI(`${apiHost}/static/${cleanPath}`);
    }
  }
  return "";
};

const safeArray = (arr: any) => {
  if (!arr) return [];
  if (Array.isArray(arr)) return arr;
  try {
    if (typeof arr === "string") {
      const parsed = JSON.parse(arr);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) { }
  return [];
};

const parseSpecsArray = (specsArray: any): Record<string, string> => {
  const result: Record<string, string> = {
    engine: "",
    power: "",
    torque: "",
    transmission: "",
    drivetrain: "",
    dimensions: "",
    clearance: "",
    fuelEconomy: ""
  };

  if (!Array.isArray(specsArray)) return result;

  specsArray.forEach((group: any) => {
    const htmlContent = group.content || "";
    const items = htmlContent.split(/<\/li>|<li>|<br\s*\/?>|\n/).map((item: string) => {
      return item.replace(/<[^>]*>/g, "").trim();
    }).filter(Boolean);

    items.forEach((item: string) => {
      const colonIndex = item.indexOf(":");
      if (colonIndex > -1) {
        const key = item.substring(0, colonIndex).trim().toLowerCase();
        const val = item.substring(colonIndex + 1).trim();

        if (key.includes("động cơ") || key.includes("dong co") || key.includes("engine")) {
          result.engine = val;
        } else if (key.includes("công suất") || key.includes("cong suat") || key.includes("power")) {
          result.power = val;
        } else if (key.includes("mô-men xoắn") || key.includes("mô men xoắn") || key.includes("mo-men xoan") || key.includes("torque")) {
          result.torque = val;
        } else if (key.includes("hộp số") || key.includes("hop so") || key.includes("transmission")) {
          result.transmission = val;
        } else if (key.includes("dẫn động") || key.includes("dan dong") || key.includes("drivetrain")) {
          result.drivetrain = val;
        } else if (key.includes("kích thước") || key.includes("kich thuoc") || key.includes("dimensions")) {
          result.dimensions = val;
        } else if (key.includes("khoảng sáng gầm") || key.includes("khoang sang gam") || key.includes("clearance")) {
          result.clearance = val;
        } else if (key.includes("tiêu hao nhiên liệu") || key.includes("tieu hao nhien lieu") || key.includes("nhiên liệu") || key.includes("fuel")) {
          result.fuelEconomy = val;
        }
      }
    });
  });

  return result;
};

function normalizeVehicle(apiVehicle: any) {
  if (!apiVehicle) return null;
  return {
    ...apiVehicle,
    id: apiVehicle.slug || String(apiVehicle.id),
    name: apiVehicle.title || apiVehicle.name,
    typeName: apiVehicle.type_name || apiVehicle.typeName || (
      apiVehicle.type === "suv"
        ? (apiVehicle.title?.toLowerCase().includes("everest") ? "SUV 7 Chỗ" : apiVehicle.title?.toLowerCase().includes("territory") ? "SUV 5 Chỗ" : "SUV")
        : apiVehicle.type === "pickup"
          ? "Bán tải"
          : (apiVehicle.title?.toLowerCase().includes("transit") ? "Xe Thương Mại 16 Chỗ" : apiVehicle.title?.toLowerCase().includes("tourneo") ? "Thương Mại 7 Chỗ" : "Thương mại")
    ),
    basePrice: typeof apiVehicle.base_price === "string" ? parseFloat(apiVehicle.base_price) : apiVehicle.base_price,
    image_url: apiVehicle.image_url || resolveFileUrl(apiVehicle.image),
    colors: apiVehicle.colors ? safeArray(apiVehicle.colors).map((c: any) => ({
      name: c.name || c.color_name || "",
      hex: c.hex || c.color_code || "",
      image: resolveFileUrl(c.image_path || c.image),
      images_360: safeArray(c.images_360).map((img: any) => resolveFileUrl(img)).filter(Boolean),
      image_360_internal: c.image_360_internal ? resolveFileUrl(c.image_360_internal) : null,
      images_360_internal: safeArray(c.images_360_internal).map((img: any) => resolveFileUrl(img)).filter(Boolean)
    })) : [],
    images: (apiVehicle.images && Array.isArray(apiVehicle.images) && apiVehicle.images.length > 0)
      ? apiVehicle.images.map((img: any) => resolveFileUrl(img)).filter(Boolean)
      : [apiVehicle.image_url || resolveFileUrl(apiVehicle.image)].filter(Boolean),
    versions: apiVehicle.versions ? safeArray(apiVehicle.versions).map((v: any) => {
      const parsedSpecs = parseSpecsArray(v.specs);
      return {
        id: String(v.id),
        name: v.name,
        price: typeof v.price === "string" ? parseFloat(v.price) : v.price,
        image_url: v.image_url || resolveFileUrl(v.image) || null,
        image_thumbnail_url: v.image_thumbnail_url || resolveFileUrl(v.image_thumbnail) || null,
        colors: v.colors ? safeArray(v.colors).map((c: any) => ({
          name: c.name || c.color_name || "",
          hex: c.hex || c.color_code || "",
          image: resolveFileUrl(c.image_path || c.image),
          images_360: safeArray(c.images_360).map((img: any) => resolveFileUrl(img)).filter(Boolean),
          image_360_internal: c.image_360_internal ? resolveFileUrl(c.image_360_internal) : null,
          images_360_internal: safeArray(c.images_360_internal).map((img: any) => resolveFileUrl(img)).filter(Boolean)
        })) : [],
        specs: {
          detailed_specs: Array.isArray(v.specs) ? v.specs : [],
          engine: parsedSpecs.engine || v.specs?.engine || "",
          power: parsedSpecs.power || v.specs?.power || "",
          torque: parsedSpecs.torque || v.specs?.torque || "",
          transmission: parsedSpecs.transmission || v.specs?.transmission || "",
          drivetrain: parsedSpecs.drivetrain || v.specs?.drivetrain || "",
          dimensions: parsedSpecs.dimensions || v.specs?.dimensions || "",
          clearance: parsedSpecs.clearance || v.specs?.clearance || "",
          fuelEconomy: parsedSpecs.fuelEconomy || v.specs?.fuelEconomy || v.specs?.fuel_guide || v.specs?.fuel_economy || "",
        }
      };
    }) : [],
    layout_blocks: apiVehicle.layout_blocks || [],
    video_url: apiVehicle.video_url || "",
    video: apiVehicle.video ? resolveFileUrl(apiVehicle.video) : null,
    images_360_external: safeArray(apiVehicle.images_360_external).map((img: any) => resolveFileUrl(img)).filter(Boolean),
    images_360_internal: safeArray(apiVehicle.images_360_internal).map((img: any) => resolveFileUrl(img)).filter(Boolean),
    image_360_internal_url: apiVehicle.image_360_internal_url || ""
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { salesSlug } = await params;
    const res = await ldpAPI.getBySalesSlug(salesSlug).catch(() => null);
    const ldp = res?.data;

    if (!ldp) return {};

    const consultantName = ldp.sales_consultant?.name || "Cố Vấn Bán Hàng";
    const title = ldp.seo?.meta_title || `${consultantName} - Cố Vấn Bán Hàng | Đồng Nai Ford`;
    const description = ldp.seo?.meta_description || `Landing Page giới thiệu các dòng xe Ford và ưu đãi đặc quyền từ cố vấn ${consultantName} tại Đồng Nai Ford.`;
    const keywords = ldp.seo?.meta_keywords || `Đồng Nai Ford, Cố vấn bán hàng ${consultantName}, bảng giá xe Ford`;

    const robotsStr = ldp.seo?.meta_robots || "index, follow";
    const noIndex = robotsStr.includes("noindex");
    const noFollow = robotsStr.includes("nofollow");

    const rawImage = ldp.seo?.image || ldp.sales_consultant?.avatar || ldp.sales_consultant?.avatar_url;
    const resolvedImageUrl = resolveFileUrl(rawImage);

    return {
      title,
      description,
      keywords,
      robots: {
        index: !noIndex,
        follow: !noFollow,
      },
      alternates: {
        canonical: `https://dongnaiford.com.vn/ldp/${salesSlug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "vi_VN",
        url: `https://dongnaiford.com.vn/ldp/${salesSlug}`,
        // Đảm bảo url ảnh luôn là chuỗi string URL hợp lệ, tránh lỗi Server Component render
        images: resolvedImageUrl ? [{ url: resolvedImageUrl }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function Page({ params }: Props) {
  const { salesSlug } = await params;

  let ldpData: any = null;
  let initialBanners: any[] = [];
  let initialCategories: any[] = [];
  let initialServices: any[] = [];
  let initialHandovers: any[] = [];
  let initialArticles: any[] = [];

  try {
    const [ldpRes, bannersRes, categoriesRes, servicesRes, handoversRes, postsRes] = await Promise.all([
      ldpAPI.getBySalesSlug(salesSlug),
      bannersAPI.getAll().catch(() => null),
      vehiclesAPI.getCategories().catch(() => null),
      servicesAPI.getAll().catch(() => null),
      customerHandoversAPI.getAll().catch(() => null),
      postsAPI.getAll({ categories: 3 }).catch(() => null),
    ]);

    ldpData = ldpRes?.data;
    const bItems = (bannersRes as any)?.data || bannersRes;
    if (Array.isArray(bItems)) initialBanners = bItems;

    const cItems = (categoriesRes as any)?.data || categoriesRes;
    if (Array.isArray(cItems)) initialCategories = cItems;

    const sItems = (servicesRes as any)?.services || (servicesRes as any)?.data || servicesRes;
    if (Array.isArray(sItems)) initialServices = sItems;

    const hItems = (handoversRes as any)?.data || handoversRes;
    if (Array.isArray(hItems)) initialHandovers = hItems;

    const pItems = (postsRes as any)?.posts?.data || (postsRes as any)?.data || postsRes;
    if (Array.isArray(pItems)) initialArticles = pItems;
  } catch (err: any) {
    if (err?.status !== 404) {
      console.error("Error loading LDP consultant page:", err);
    }
  }

  if (!ldpData) {
    notFound();
  }

  const normalizedLeadVehicle = ldpData.vehicle ? normalizeVehicle(ldpData.vehicle) : null;
  const allVehicles = Array.isArray(ldpData.vehicles) && ldpData.vehicles.length > 0
    ? ldpData.vehicles
    : (normalizedLeadVehicle ? [normalizedLeadVehicle] : []);

  return (
    <LdpHomeClient
      salesConsultant={ldpData.sales_consultant}
      allVehicles={allVehicles}
      leadVehicle={normalizedLeadVehicle || allVehicles[0]}
      landingPageId={ldpData.id}
      salesEmail={ldpData.sales_email || ldpData.sales_consultant?.email}
      promotions={ldpData.promotions}
      initialBanners={initialBanners}
      initialCategories={initialCategories}
      initialServices={initialServices}
      initialHandovers={initialHandovers}
      initialArticles={initialArticles}
    />
  );
}
