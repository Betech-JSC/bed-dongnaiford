import VehicleDetailClient from "@/components/vehicle/VehicleDetailClient";

export const revalidate = 3600;

export default function Page() {
  return <VehicleDetailClient />;
}
