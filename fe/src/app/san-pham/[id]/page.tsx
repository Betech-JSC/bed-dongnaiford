import VehicleDetailClient from "@/components/vehicle/VehicleDetailClient";

export const revalidate = 60;

export default function Page() {
  return <VehicleDetailClient />;
}
