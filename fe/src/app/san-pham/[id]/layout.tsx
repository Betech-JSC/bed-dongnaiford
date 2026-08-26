import { notFound } from "next/navigation";
import { vehiclesAPI } from "@/lib/api";
import VehicleLayoutClient from "@/components/vehicle/VehicleLayoutClient";

// Re-export client parts so children can import them from "../layout"
export { useVehicle, VehicleTabBar } from "@/components/vehicle/VehicleLayoutClient";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    id: string; // The URL slug of the vehicle
  }>;
};

const resolveFileUrl = (file: any): string => {
  if (!file) return "";
  if (typeof file === "string") {
    if (file.startsWith("http://") || file.startsWith("https://") || file.startsWith("/")) {
      return file;
    }
    const cleanPath = file.startsWith("uploads/") ? file.replace("uploads/", "") : file;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    let apiHost = "http://localhost:8080";
    try {
      apiHost = new URL(apiBase).origin;
    } catch (e) { }
    return `${apiHost}/static/${cleanPath}`;
  }
  if (typeof file === "object") {
    if (file.url) return file.url;
    if (file.path) {
      const cleanPath = file.path.startsWith("uploads/") ? file.path.replace("uploads/", "") : file.path;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      let apiHost = "http://localhost:8080";
      try {
        apiHost = new URL(apiBase).origin;
      } catch (e) { }
      return `${apiHost}/static/${cleanPath}`;
    }
  }
  return "";
};

const safeArray = (arr: any) => {
  if (!arr) return [];
  if (Array.isArray(arr)) return arr;
  try {
    if (typeof arr === 'string') {
      const parsed = JSON.parse(arr);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) { }
  return [];
};

const parseSpecsArray = (specsArray: any): Record<string, string> => {
  const result: Record<string, string> = {
    engine: '',
    power: '',
    torque: '',
    transmission: '',
    drivetrain: '',
    dimensions: '',
    clearance: '',
    fuelEconomy: ''
  };

  if (!Array.isArray(specsArray)) return result;

  specsArray.forEach((group: any) => {
    const htmlContent = group.content || '';
    const items = htmlContent.split(/<\/li>|<li>|<br\s*\/?>|\n/).map((item: string) => {
      return item.replace(/<[^>]*>/g, '').trim();
    }).filter(Boolean);

    items.forEach((item: string) => {
      const colonIndex = item.indexOf(':');
      if (colonIndex > -1) {
        const key = item.substring(0, colonIndex).trim().toLowerCase();
        const val = item.substring(colonIndex + 1).trim();

        if (key.includes('động cơ') || key.includes('dong co') || key.includes('engine')) {
          result.engine = val;
        } else if (key.includes('công suất') || key.includes('cong suat') || key.includes('power')) {
          result.power = val;
        } else if (key.includes('mô-men xoắn') || key.includes('mô men xoắn') || key.includes('mo-men xoan') || key.includes('torque')) {
          result.torque = val;
        } else if (key.includes('hộp số') || key.includes('hop so') || key.includes('transmission')) {
          result.transmission = val;
        } else if (key.includes('dẫn động') || key.includes('dan dong') || key.includes('drivetrain')) {
          result.drivetrain = val;
        } else if (key.includes('kích thước') || key.includes('kich thuoc') || key.includes('dimensions')) {
          result.dimensions = val;
        } else if (key.includes('khoảng sáng gầm') || key.includes('khoang sang gam') || key.includes('clearance')) {
          result.clearance = val;
        } else if (key.includes('tiêu hao nhiên liệu') || key.includes('tieu hao nhien lieu') || key.includes('nhiên liệu') || key.includes('fuel')) {
          result.fuelEconomy = val;
        }
      }
    });
  });

  return result;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await vehiclesAPI.getBySlug(id).catch(() => null);
    const apiVehicle = res?.data;

    if (!apiVehicle) return {};

    const title = `${apiVehicle.title} | Giá & Thông số | Đồng Nai Ford`;
    
    // Build meaningful meta description with price + USP (120-160 chars target)
    const basePrice = apiVehicle.base_price 
      ? `Giá từ ${Number(apiVehicle.base_price).toLocaleString('vi-VN')} triệu.`
      : '';
    const vehicleType = apiVehicle.type === 'suv' ? 'SUV' : apiVehicle.type === 'pickup' ? 'Bán tải' : 'Xe thương mại';
    const description = apiVehicle.seo_description 
      || `${apiVehicle.title} ${vehicleType} chính hãng tại Đồng Nai Ford. ${basePrice} Xem thông số kỹ thuật, màu sắc, phiên bản. Hỗ trợ trả góp 80%, giao xe tận nơi.`
      || apiVehicle.tagline;
    
    // Resolve OG image to main domain
    let ogImage = apiVehicle.image_url || '';
    if (ogImage && !ogImage.startsWith('https://dongnaiford.com.vn')) {
      // Keep CMS image URL as-is since it's a different server
      // but prefer site-hosted images when available
    }

    return {
      title,
      description,
      alternates: {
        canonical: `/${id}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "vi_VN",
        images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: `${apiVehicle.title} - Đồng Nai Ford` }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for product layout:", error);
    return {};
  }
}

export default async function VehicleDetailLayout({
  children,
  params
}: Props) {
  const { id } = await params;
  let apiVehicle = null;
  let rawAllVehicles = [];

  try {
    const [detailRes, allRes] = await Promise.all([
      vehiclesAPI.getBySlug(id).catch(() => null),
      vehiclesAPI.getAll({ with_versions: true }).catch(() => null),
    ]) as [any, any];

    if (detailRes && detailRes.data) {
      apiVehicle = detailRes.data;
    }
    rawAllVehicles = allRes?.data || allRes || [];
  } catch (err) {
    console.error("Error loading vehicle details on server layout:", err);
  }

  if (!apiVehicle) {
    notFound();
  }

  // Normalize initial vehicle
  const normalizedVehicle = {
    ...apiVehicle,
    id: apiVehicle.slug || String(apiVehicle.id),
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
        price: typeof v.price === 'string' ? parseFloat(v.price) : v.price,
        image_url: v.image_url || resolveFileUrl(v.image) || null,
        image_thumbnail_url: v.image_thumbnail_url || resolveFileUrl(v.image_thumbnail) || null,
        colors: v.colors ? safeArray(v.colors).map((c: any) => ({
          name: c.name || c.color_name || '',
          hex: c.hex || c.color_code || '',
          image: resolveFileUrl(c.image_path || c.image),
          images_360: safeArray(c.images_360).map((img: any) => resolveFileUrl(img)).filter(Boolean),
          image_360_internal: c.image_360_internal ? resolveFileUrl(c.image_360_internal) : null,
          images_360_internal: safeArray(c.images_360_internal).map((img: any) => resolveFileUrl(img)).filter(Boolean)
        })) : [],
        specs: {
          detailed_specs: Array.isArray(v.specs) ? v.specs : [],
          engine: parsedSpecs.engine || v.specs?.engine || '',
          power: parsedSpecs.power || v.specs?.power || '',
          torque: parsedSpecs.torque || v.specs?.torque || '',
          transmission: parsedSpecs.transmission || v.specs?.transmission || '',
          drivetrain: parsedSpecs.drivetrain || v.specs?.drivetrain || '',
          dimensions: parsedSpecs.dimensions || v.specs?.dimensions || '',
          clearance: parsedSpecs.clearance || v.specs?.clearance || '',
          fuelEconomy: parsedSpecs.fuelEconomy || v.specs?.fuelEconomy || v.specs?.fuel_guide || v.specs?.fuel_economy || '',
        }
      };
    }) : [],
    layout_blocks: apiVehicle.layout_blocks || [],
    images_360_external: safeArray(apiVehicle.images_360_external).map((img: any) => resolveFileUrl(img)).filter(Boolean),
    images_360_internal: safeArray(apiVehicle.images_360_internal).map((img: any) => resolveFileUrl(img)).filter(Boolean),
    image_360_internal_url: apiVehicle.image_360_internal_url || ''
  };

  // Normalize all vehicles list
  let normalizedAllVehicles = [];
  if (Array.isArray(rawAllVehicles) && rawAllVehicles.length > 0) {
    normalizedAllVehicles = rawAllVehicles.map((v: any) => {
      const vId = v.slug || v.id;
      const name = v.title || v.name;
      const image = v.image_thumbnail_url || v.image_url || v.images?.[0] || "";
      const price = typeof v.base_price === 'string' ? parseFloat(v.base_price) : (v.base_price || 0);
      return {
        ...v,
        id: vId,
        name,
        basePrice: price,
        images: [image],
        typeName: v.type_name || (v.type === 'suv' ? 'SUV' : v.type === 'pickup' ? 'Bán tải' : 'Thương mại'),
        versions: v.versions ? v.versions.map((ver: any) => ({
          id: String(ver.id),
          name: ver.name,
          price: typeof ver.price === 'string' ? parseFloat(ver.price) : (ver.price || 0),
          image_url: ver.image_url || resolveFileUrl(ver.image) || null,
          image_thumbnail_url: ver.image_thumbnail_url || resolveFileUrl(ver.image_thumbnail) || null,
          specs: {
            detailed_specs: Array.isArray(ver.specs) ? ver.specs : [],
            engine: ver.specs?.engine || ver.specs?.engine_type || '',
            power: ver.specs?.power || '',
            torque: ver.specs?.torque || '',
            transmission: ver.specs?.transmission || '',
            drivetrain: ver.specs?.drivetrain || '',
            dimensions: ver.specs?.dimensions || '',
            clearance: ver.specs?.clearance || '',
            fuelEconomy: ver.specs?.fuelEconomy || ver.specs?.fuel_guide || ver.specs?.fuel_economy || '',
          }
        })) : []
      };
    });
  }

  // ===== JSON-LD Schema: Vehicle + BreadcrumbList =====
  const siteUrl = "https://dongnaiford.com.vn";
  const vehicleSlug = apiVehicle.slug || id;
  const vehicleUrl = `${siteUrl}/${vehicleSlug}`;
  const vehicleImage = apiVehicle.image_url || resolveFileUrl(apiVehicle.image) || '';
  const lowestPrice = normalizedVehicle.versions?.length
    ? Math.min(...normalizedVehicle.versions.map((v: any) => v.price).filter(Boolean))
    : normalizedVehicle.basePrice;
  const highestPrice = normalizedVehicle.versions?.length
    ? Math.max(...normalizedVehicle.versions.map((v: any) => v.price).filter(Boolean))
    : normalizedVehicle.basePrice;

  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: apiVehicle.title,
    description: apiVehicle.tagline || `Xe Ford ${apiVehicle.title} chính hãng tại Đồng Nai Ford`,
    brand: { "@type": "Brand", name: "Ford" },
    manufacturer: { "@type": "Organization", name: "Ford Motor Company" },
    model: apiVehicle.title?.replace(/^FORD\s+/i, '') || apiVehicle.title,
    vehicleConfiguration: normalizedVehicle.versions?.map((v: any) => v.name).join(', ') || undefined,
    image: vehicleImage || undefined,
    url: vehicleUrl,
    offers: lowestPrice ? {
      "@type": "AggregateOffer",
      priceCurrency: "VND",
      lowPrice: lowestPrice * 1000000,
      highPrice: highestPrice ? highestPrice * 1000000 : undefined,
      offerCount: normalizedVehicle.versions?.length || 1,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: "Ford Đồng Nai (Đại lý Tấn Phát Đạt)",
        url: siteUrl,
      },
    } : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${siteUrl}/san-pham` },
      { "@type": "ListItem", position: 3, name: apiVehicle.title, item: vehicleUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <VehicleLayoutClient 
        initialVehicle={normalizedVehicle} 
        allVehicles={normalizedAllVehicles}
      >
        {children}
      </VehicleLayoutClient>
    </>
  );
}
