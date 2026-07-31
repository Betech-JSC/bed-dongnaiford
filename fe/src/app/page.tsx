import { vehiclesAPI } from "@/lib/api";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  // Server-side fetch: vehicles available immediately (no skeleton loading)
  let initialVehicles: any[] = [];

  try {
    const vehiclesData = await vehiclesAPI.getAll().catch(() => null);
    const vehiclesItems = (vehiclesData as any)?.data || vehiclesData;
    if (Array.isArray(vehiclesItems)) {
      initialVehicles = vehiclesItems;
    }
  } catch (error) {
    console.error("Error pre-fetching vehicles for homepage SSR:", error);
  }

  return <HomeClient initialVehicles={initialVehicles} />;
}
