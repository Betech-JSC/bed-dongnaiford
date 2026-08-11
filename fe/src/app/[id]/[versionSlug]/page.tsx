import { notFound, redirect } from "next/navigation";
import { vehiclesAPI } from "@/lib/api";
import VehicleVersionDetailClient from "@/components/vehicle/VehicleVersionDetailClient";

type Props = {
  params: Promise<{
    id: string; // The URL slug of the vehicle
    versionSlug: string; // The URL slug of the version
  }>;
  searchParams?: Promise<any>;
};

// Vietnamese-accent-safe URL slug generator
const getVersionSlug = (verName?: string | null, vehicleName?: string | null) => {
  let cleaned = String(verName || "").toLowerCase();
  const vName = String(vehicleName || "").toLowerCase();
  const vNameWithoutFord = vName.replace("ford", "").trim();

  let changed = true;
  while (changed) {
    changed = false;
    cleaned = cleaned.trim();
    if (cleaned.startsWith("ford")) {
      cleaned = cleaned.substring(4);
      changed = true;
      continue;
    }
    if (cleaned.startsWith(vName)) {
      cleaned = cleaned.substring(vName.length);
      changed = true;
      continue;
    }
    if (vNameWithoutFord && cleaned.startsWith(vNameWithoutFord)) {
      cleaned = cleaned.substring(vNameWithoutFord.length);
      changed = true;
      continue;
    }
    if (cleaned.startsWith("new")) {
      const temp = cleaned.substring(3).trim();
      if (temp.startsWith("ford") || temp.startsWith(vName) || (vNameWithoutFord && temp.startsWith(vNameWithoutFord))) {
        cleaned = temp;
        changed = true;
        continue;
      }
    }
  }

  if (!cleaned.trim()) {
    cleaned = String(verName || "").toLowerCase();
  }

  return cleaned.trim()
    .replace(/\+/g, "-plus")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const getLegacyVersionSlug = (verName?: string | null) => {
  return String(verName || "").toLowerCase()
    .replace(/\+/g, "-plus")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const getVersionDisplayName = (verName?: string | null, vehicleName?: string | null) => {
  let displayName = verName || "";
  const vName = String(vehicleName || "").toLowerCase();
  const vNameWithoutFord = vName.replace("ford", "").trim();
  
  let cleaned = displayName.toLowerCase();
  let changed = true;
  let cutLen = 0;
  
  while (changed) {
    changed = false;
    const trimmed = cleaned.trim();
    const offset = displayName.length - cleaned.length;
    
    if (trimmed.startsWith("ford")) {
      const len = trimmed.substring(4).search(/\S/);
      cutLen = offset + 4 + (len > -1 ? len : 0);
      cleaned = trimmed.substring(4);
      changed = true;
      continue;
    }
    if (trimmed.startsWith(vName)) {
      const len = trimmed.substring(vName.length).search(/\S/);
      cutLen = offset + vName.length + (len > -1 ? len : 0);
      cleaned = trimmed.substring(vName.length);
      changed = true;
      continue;
    }
    if (vNameWithoutFord && trimmed.startsWith(vNameWithoutFord)) {
      const len = trimmed.substring(vNameWithoutFord.length).search(/\S/);
      cutLen = offset + vNameWithoutFord.length + (len > -1 ? len : 0);
      cleaned = trimmed.substring(vNameWithoutFord.length);
      changed = true;
      continue;
    }
    if (trimmed.startsWith("new")) {
      const temp = trimmed.substring(3).trim();
      if (temp.startsWith("ford") || temp.startsWith(vName) || (vNameWithoutFord && temp.startsWith(vNameWithoutFord))) {
        const len = trimmed.substring(3).search(/\S/);
        cutLen = offset + 3 + (len > -1 ? len : 0);
        cleaned = temp;
        changed = true;
        continue;
      }
    }
  }
  
  if (cutLen > 0 && cutLen < displayName.length) {
    return displayName.substring(cutLen);
  }
  
  return displayName;
};

export async function generateMetadata({ params, searchParams }: Props) {
  try {
    const { id, versionSlug } = await params;
    const search = searchParams ? await searchParams : {};
    const isPreview = search?.preview === "true" || search?.preview === "1";

    const res = await vehiclesAPI.getBySlug(id, isPreview ? { preview: "true" } : undefined).catch(() => null);
    const vehicle = res?.data || (res?.id ? res : null);

    if (!vehicle) return {};

    const versions = vehicle.versions || [];
    const vehicleName = vehicle.title || vehicle.name || "";
    const matchedVersion = versions.find((v: any) => getVersionSlug(v.name, vehicleName) === versionSlug) || versions.find((v: any) => getLegacyVersionSlug(v.name) === versionSlug);

    if (!matchedVersion) return {};

    const versionDisplayName = getVersionDisplayName(matchedVersion.name, vehicleName);

    const title = `${vehicleName} ${versionDisplayName} | Thông số & Giá lăn bánh | Đồng Nai Ford`;
    const description = matchedVersion.description || `Khám phá chi tiết phiên bản xe Ford ${vehicleName} ${versionDisplayName} chính hãng tại Đồng Nai Ford. Xem thông số kỹ thuật, hình ảnh, trang bị và nhận báo giá lăn bánh cùng ưu đãi mới nhất.`;

    let imageUrl = "";
    if (matchedVersion.image_url) {
      imageUrl = matchedVersion.image_url;
    } else if (vehicle.image_url) {
      imageUrl = vehicle.image_url;
    }

    const cleanSlug = getVersionSlug(matchedVersion.name, vehicleName);

    return {
      title,
      description,
      alternates: {
        canonical: `/${id}/${cleanSlug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "vi_VN",
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for product version page:", error);
    return {};
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { id, versionSlug } = await params;
  const search = searchParams ? await searchParams : {};
  const isPreview = search?.preview === "true" || search?.preview === "1";

  let vehicle = null;

  try {
    const res = await vehiclesAPI.getBySlug(id, isPreview ? { preview: "true" } : undefined).catch(() => null);
    vehicle = res?.data || (res?.id ? res : null);
  } catch (error) {
    console.error("Error loading vehicle in server version page:", error);
  }

  if (!vehicle) {
    notFound();
  }

  const versions = vehicle.versions || [];
  const vehicleName = vehicle.title || vehicle.name || "";

  // Check if requested slug matches legacy slug or clean slug
  const matchedVersionByClean = versions.find((v: any) => getVersionSlug(v.name, vehicleName) === versionSlug);
  
  if (!matchedVersionByClean) {
    const matchedVersionByLegacy = versions.find((v: any) => getLegacyVersionSlug(v.name) === versionSlug);
    if (matchedVersionByLegacy) {
      const cleanSlug = getVersionSlug(matchedVersionByLegacy.name, vehicleName);
      redirect(`/${id}/${cleanSlug}`);
    } else {
      notFound();
    }
  }

  return <VehicleVersionDetailClient />;
}
