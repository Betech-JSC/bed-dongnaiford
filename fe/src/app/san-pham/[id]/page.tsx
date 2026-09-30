import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = searchParams ? await searchParams : {};
  const query = new URLSearchParams();
  Object.entries(sp).forEach(([k, v]) => {
    if (typeof v === "string") {
      query.set(k, v);
    } else if (Array.isArray(v)) {
      v.forEach((item) => query.append(k, item));
    }
  });
  const queryString = query.toString();
  redirect(`/${id}${queryString ? `?${queryString}` : ""}`);
}
