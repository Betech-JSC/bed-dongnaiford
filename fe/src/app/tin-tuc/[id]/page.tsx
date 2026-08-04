import { permanentRedirect } from "next/navigation";
import { postsAPI } from "@/lib/api";

type Props = {
  params: Promise<{
    id: string; // The URL slug of the post
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    alternates: {
      canonical: `/${id}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const res = await postsAPI.getBySlug(id).catch(() => null);
  const targetSlug = res?.redirect_to || id;
  permanentRedirect(`/${targetSlug}`);
}
