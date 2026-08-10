"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * SharedDataContext — Pre-fetched data from root layout (SSR)
 * để Navbar, Footer, và các component con không cần gọi lại API phía client.
 *
 * Giảm từ 15 API calls → 9 unique calls mỗi page load (triệt tiêu 6 trùng lắp).
 */
export type SharedData = {
  categories: any[];
  vehicles: any[];
  services: any[];
  accessories: any[];
  usedVehicles: any[];
  systemNotification?: any;
};

const defaultData: SharedData = {
  categories: [],
  vehicles: [],
  services: [],
  accessories: [],
  usedVehicles: [],
  systemNotification: null,
};

const SharedDataContext = createContext<SharedData>(defaultData);

export function SharedDataProvider({
  data,
  children,
}: {
  data: SharedData;
  children: ReactNode;
}) {
  return (
    <SharedDataContext.Provider value={data}>
      {children}
    </SharedDataContext.Provider>
  );
}

export function useSharedData() {
  return useContext(SharedDataContext);
}
