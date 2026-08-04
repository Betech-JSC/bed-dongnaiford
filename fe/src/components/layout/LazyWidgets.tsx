"use client";

import dynamic from "next/dynamic";

const AIChatWidget = dynamic(() => import("@/components/shared/AIChatWidget"), { ssr: false });
const CompareDrawer = dynamic(() => import("@/components/shared/CompareDrawer"), { ssr: false });
const QuickAccessToolbar = dynamic(() => import("@/components/shared/QuickAccessToolbar"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/shared/CookieConsent"), { ssr: false });

export default function LazyWidgets({ isLdp }: { isLdp?: boolean }) {
  return (
    <>
      {/* Tạm thời ẩn AI Chatbot */}
      {/* {!isLdp && <AIChatWidget />} */}
      {!isLdp && <CompareDrawer />}
      {!isLdp && <QuickAccessToolbar />}
      <CookieConsent />
    </>
  );
}
