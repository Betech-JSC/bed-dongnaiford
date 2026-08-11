import type { Metadata } from "next";
import { vehiclesAPI } from "@/lib/api";
import VehicleDetailClient from "@/components/vehicle/VehicleDetailClient";

export const revalidate = 300; // ISR: Revalidate vehicle detail page every 5 minutes

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    if (!id || id.includes('.') || id.startsWith('_')) return {};
    const res = await vehiclesAPI.getBySlug(id).catch(() => null);
    const vehicle = res?.data || (res?.id ? res : null);
    if (!vehicle) return {};

    const name = vehicle.title || vehicle.name || "Ford";
    return {
      title: `${name} | Bảng Giá & Khuyến Mãi Mới Nhất | Đồng Nai Ford`,
      description:
        vehicle.description ||
        `Đại lý Đồng Nai Ford phân phối dòng xe ${name} chính hãng. Hỗ trợ trả góp 80%, giao xe tận nhà, ưu đãi quà tặng cao cấp.`,
      alternates: {
        canonical: `/${id}`,
      },
      openGraph: {
        title: `${name} | Đồng Nai Ford`,
        description: vehicle.description,
        images: vehicle.image_url ? [{ url: vehicle.image_url }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default function Page() {
  return <VehicleDetailClient />;
}
