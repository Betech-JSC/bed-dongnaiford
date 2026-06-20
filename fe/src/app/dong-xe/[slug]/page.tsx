"use client";

import ProductsPage from "../../san-pham/page";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <ProductsPage initialCategory={params.slug} />;
}
