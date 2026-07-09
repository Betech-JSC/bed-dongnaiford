import { ldpAPI } from "@/lib/api";

type LayoutProps = {
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

    const hostUrl = "https://dongnaiford.com.vn";
    const canonicalPath = ldp.seo?.canonical || `/ldp/${salesSlug}/${vehicleSlug}`;
    const canonicalUrl = canonicalPath.startsWith("http") ? canonicalPath : `${hostUrl}${canonicalPath}`;

    const title = ldp.seo?.meta_title || `${ldp.title} - Cố vấn ${ldp.sales_consultant?.name}`;
    const description = ldp.seo?.meta_description || `Landing Page giới thiệu xe Ford và ưu đãi đặc quyền từ cố vấn ${ldp.sales_consultant?.name} tại Đồng Nai Ford.`;
    const keywords = ldp.seo?.meta_keywords || "";

    const robotsStr = ldp.seo?.meta_robots || "index, follow";
    const noIndex = robotsStr.includes("noindex");
    const noFollow = robotsStr.includes("nofollow");

    return {
      title,
      description,
      keywords,
      robots: {
        index: !noIndex,
        follow: !noFollow,
      },
      alternates: {
        canonical: canonicalUrl,
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
  params,
}: LayoutProps) {
  const { salesSlug, vehicleSlug } = await params;
  const res = await ldpAPI.getBySlug(salesSlug, vehicleSlug).catch(() => null);
  const ldp = res?.data;

  if (!ldp) return <>{children}</>;

  const hostUrl = "https://dongnaiford.com.vn";
  const canonicalPath = ldp.seo?.canonical || `/ldp/${salesSlug}/${vehicleSlug}`;
  const canonicalUrl = canonicalPath.startsWith("http") ? canonicalPath : `${hostUrl}${canonicalPath}`;
  const title = ldp.seo?.meta_title || `${ldp.title} - Cố vấn ${ldp.sales_consultant?.name}`;
  const description = ldp.seo?.meta_description || `Landing Page giới thiệu xe Ford và ưu đãi đặc quyền từ cố vấn ${ldp.sales_consultant?.name} tại Đồng Nai Ford.`;

  const autoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemPage",
        "@id": `${canonicalUrl}/#webpage`,
        "url": canonicalUrl,
        "name": title,
        "description": description
      },
      ldp.vehicle ? {
        "@type": "Product",
        "@id": `${canonicalUrl}/#product`,
        "name": ldp.vehicle.title,
        "image": ldp.vehicle.image_url || ldp.seo?.image,
        "description": ldp.vehicle.description || description,
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "VND",
          "price": ldp.vehicle.price || "0",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "AutoDealer",
            "name": "Đồng Nai Ford",
            "url": hostUrl
          }
        }
      } : null,
      ldp.sales_consultant ? {
        "@type": "Person",
        "@id": `${canonicalUrl}/#sales-consultant`,
        "name": ldp.sales_consultant.name,
        "jobTitle": "Cố vấn bán hàng",
        "telephone": ldp.sales_consultant.phone,
        "image": ldp.sales_consultant.avatar_url,
        "worksFor": {
          "@type": "AutoDealer",
          "name": "Đồng Nai Ford",
          "url": hostUrl
        }
      } : null
    ].filter(Boolean)
  };

  const customSchema = ldp.seo?.seo_schemas;
  let customSchemaHtml = null;
  if (customSchema) {
    if (customSchema.trim().startsWith("<script")) {
      customSchemaHtml = customSchema;
    } else {
      try {
        JSON.parse(customSchema);
        customSchemaHtml = `<script type="application/ld+json">${customSchema}</script>`;
      } catch (e) {
        customSchemaHtml = customSchema;
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoSchema) }}
      />
      {customSchemaHtml && (
        <div
          dangerouslySetInnerHTML={{ __html: customSchemaHtml }}
          style={{ display: "none" }}
        />
      )}
      {children}
    </>
  );
}
