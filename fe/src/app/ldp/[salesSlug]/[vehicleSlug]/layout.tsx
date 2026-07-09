import { ldpAPI } from "@/lib/api";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    salesSlug: string;
    vehicleSlug: string;
  }>;
};

export async function generateMetadata({ params }: { params: Promise<{ salesSlug: string; vehicleSlug: string }> }) {
  try {
    const { salesSlug, vehicleSlug } = await params;
    const res = await ldpAPI.getBySlug(salesSlug, vehicleSlug).catch(() => null);
    const ldp = res?.data;

    if (!ldp) return {};

    const title = ldp.seo?.meta_title || `${ldp.title} - Cố vấn ${ldp.sales_consultant?.name}`;
    const description = ldp.seo?.meta_description || `Landing Page giới thiệu xe Ford và ưu đãi đặc quyền từ cố vấn ${ldp.sales_consultant?.name} tại Đồng Nai Ford.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/ldp/${salesSlug}/${vehicleSlug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "vi_VN",
        images: ldp.seo?.image ? [{ url: ldp.seo.image }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for LDP layout:", error);
    return {};
  }
}

export default async function LdpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
