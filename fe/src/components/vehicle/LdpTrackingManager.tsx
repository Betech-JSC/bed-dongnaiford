"use client";

import { useEffect, useRef } from "react";
import { contactsAPI } from "@/lib/api";

export interface SalesTrackingConfig {
  google_ads_id?: string;
  google_ads_form_label?: string;
  google_ads_call_label?: string;
  google_ads_zalo_label?: string;
  gtm_id?: string;
  facebook_pixel_id?: string;
  tiktok_pixel_id?: string;
  inject_head?: string;
  inject_body_start?: string;
  inject_body_end?: string;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    ttq?: any;
  }
}

export function parseTrackingConfig(
  raw?: SalesTrackingConfig | string | null
): SalesTrackingConfig {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") {
    return raw;
  }
  return {};
}

export interface FireLdpFormConversionParams {
  salesConsultant?: any;
  isTestDrive?: boolean;
  targetVehicleName?: string;
  customerPhone?: string;
}

export function fireLdpFormConversion({
  salesConsultant,
  isTestDrive = false,
  targetVehicleName = "",
  customerPhone = "",
}: FireLdpFormConversionParams) {
  if (typeof window === "undefined" || !salesConsultant) return;

  const config = parseTrackingConfig(salesConsultant.tracking_config);
  const googleAdsId = config.google_ads_id?.trim();
  const googleAdsFormLabel = config.google_ads_form_label?.trim();
  const fbPixelId = config.facebook_pixel_id?.trim();
  const tiktokPixelId = config.tiktok_pixel_id?.trim();

  // 1. Google Ads Form Conversion
  if (googleAdsId && googleAdsFormLabel && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${googleAdsFormLabel}`,
      value: 1.0,
      currency: "VND",
    });
  }

  // 2. GTM / dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "ldp_form_submit",
    form_type: isTestDrive ? "TEST_DRIVE" : "ADVISE_FORM",
    sale_id: salesConsultant.id,
    sale_name: salesConsultant.name,
    sale_slug: salesConsultant.slug,
    sale_phone: salesConsultant.phone,
    vehicle_name: targetVehicleName,
    customer_phone: customerPhone,
    page_url: window.location.href,
  });

  // 3. Facebook Pixel
  if (fbPixelId && typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      content_name: targetVehicleName,
      content_category: isTestDrive ? "Test Drive" : "Quote",
      sale_name: salesConsultant.name,
    });
  }

  // 4. TikTok Pixel
  if (tiktokPixelId && window.ttq && typeof window.ttq.track === "function") {
    window.ttq.track("SubmitForm", {
      content_name: targetVehicleName,
    });
  }
}

function detectButtonLocation(anchor: HTMLAnchorElement): string {
  const rawText = (anchor.textContent || "").replace(/\s+/g, " ").trim();

  // Walk up ancestors to inspect layout positioning classes
  let current: HTMLElement | null = anchor;
  while (current && current !== document.body) {
    const cls = typeof current.className === "string" ? current.className : "";
    if (cls.includes("fixed")) {
      if (cls.includes("bottom-0")) {
        return "Thanh ghim đáy Mobile (Sticky Bottom Bar)";
      }
      if (
        cls.includes("right-4") ||
        cls.includes("right-6") ||
        cls.includes("bottom-20") ||
        cls.includes("bottom-24") ||
        cls.includes("z-[99]")
      ) {
        return "Nút nổi góc phải (Floating Action Button)";
      }
    }
    current = current.parentElement;
  }

  if (anchor.closest("#consultation")) {
    return "Mục Tư vấn miễn phí (#consultation)";
  }

  if (rawText.includes("Gọi điện tư vấn")) {
    return "Khối Thông tin Cố vấn bán hàng";
  }

  const section = anchor.closest("section");
  if (
    section &&
    (section.querySelector('img[alt="Ford Booking Vehicle"]') ||
      section.innerHTML.includes("from-[#00095B] via-[#02337A] to-[#0562D2]"))
  ) {
    return "Banner Đặt lịch hẹn";
  }

  return rawText ? `Nút: ${rawText}` : "Nút liên hệ trên LDP";
}

function injectCustomHtml(
  html: string,
  container: HTMLElement,
  position: "append" | "prepend",
  marker: string
): Element[] {
  const inserted: Element[] = [];
  if (!html || !html.trim()) return inserted;

  const temp = document.createElement("div");
  temp.innerHTML = html;

  const nodes = Array.from(temp.children);
  const referenceNode = position === "prepend" ? container.firstChild : null;

  nodes.forEach((node) => {
    let elementToInsert: Element;
    if (node.tagName === "SCRIPT") {
      const script = document.createElement("script");
      Array.from(node.attributes).forEach((attr) => {
        script.setAttribute(attr.name, attr.value);
      });
      script.textContent = node.textContent;
      elementToInsert = script;
    } else {
      elementToInsert = node.cloneNode(true) as Element;
    }

    elementToInsert.setAttribute("data-ldp-sale-inject", marker);
    if (position === "prepend" && referenceNode) {
      container.insertBefore(elementToInsert, referenceNode);
    } else {
      container.appendChild(elementToInsert);
    }
    inserted.push(elementToInsert);
  });

  return inserted;
}

export interface LdpTrackingManagerProps {
  salesConsultant?: any;
  vehicleName?: string;
  vehicleSlug?: string;
  landingPageId?: number | null;
  salesEmail?: string | null;
}

export default function LdpTrackingManager({
  salesConsultant,
  vehicleName,
  vehicleSlug,
  landingPageId,
  salesEmail,
}: LdpTrackingManagerProps) {
  const lastClickTimeRef = useRef<Record<string, number>>({});

  // 1. Inject Sale's Advertising Pixels & Custom Scripts
  useEffect(() => {
    if (typeof window === "undefined" || !salesConsultant) return;

    const config = parseTrackingConfig(salesConsultant.tracking_config);
    const cleanupNodes: Element[] = [];

    // 1.1 Google Ads (gtag.js)
    const googleAdsId = config.google_ads_id?.trim();
    if (googleAdsId) {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== "function") {
        window.gtag = function (...args: any[]) {
          window.dataLayer!.push(args);
        };
        window.gtag("js", new Date());
      }

      const existingGtagScript = document.querySelector(
        `script[src*="googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAdsId)}"]`
      );
      if (!existingGtagScript) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAdsId)}`;
        script.setAttribute("data-ldp-sale-inject", "google-ads");
        document.head.appendChild(script);
        cleanupNodes.push(script);
      }

      window.gtag("config", googleAdsId);
    }

    // 1.2 Google Tag Manager (GTM)
    const gtmId = config.gtm_id?.trim();
    if (gtmId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      const existingGtmScript = document.querySelector(
        `script[src*="googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}"]`
      );
      if (!existingGtmScript) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
        script.setAttribute("data-ldp-sale-inject", "gtm");
        document.head.appendChild(script);
        cleanupNodes.push(script);
      }
    }

    // 1.3 Facebook Pixel
    const fbPixelId = config.facebook_pixel_id?.trim();
    if (fbPixelId) {
      if (typeof window.fbq !== "function") {
        const n: any = (window.fbq = function (...args: any[]) {
          if (n.callMethod) {
            n.callMethod.apply(n, args);
          } else {
            n.queue.push(args);
          }
        });
        if (!window._fbq) window._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];

        const existingFbScript = document.querySelector(
          'script[src*="connect.facebook.net/en_US/fbevents.js"]'
        );
        if (!existingFbScript) {
          const script = document.createElement("script");
          script.async = true;
          script.src = "https://connect.facebook.net/en_US/fbevents.js";
          script.setAttribute("data-ldp-sale-inject", "fb-pixel");
          document.head.appendChild(script);
          cleanupNodes.push(script);
        }
      }

      window.fbq("init", fbPixelId);
      window.fbq("track", "PageView");
    }

    // 1.4 TikTok Pixel
    const tiktokPixelId = config.tiktok_pixel_id?.trim();
    if (tiktokPixelId) {
      if (!window.ttq) {
        const ttq: any = (window.ttq = []);
        ttq.methods = [
          "page",
          "track",
          "identify",
          "instances",
          "debug",
          "on",
          "off",
          "once",
          "ready",
          "alias",
          "group",
          "enableCookie",
          "disableCookie",
        ];
        ttq.setAndDefer = function (t: any, e: string) {
          t[e] = function (...args: any[]) {
            t.push([e, ...args]);
          };
        };
        for (let i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        ttq.load = function (e: string, n?: any) {
          const r = "https://analytics.tiktok.com/i18n/pixel/events.js";
          ttq._i = ttq._i || {};
          ttq._i[e] = [];
          ttq._i[e]._u = r;
          ttq._t = ttq._t || {};
          ttq._t[e] = +new Date();
          ttq._o = ttq._o || {};
          ttq._o[e] = n || {};
          const o = document.createElement("script");
          o.type = "text/javascript";
          o.async = true;
          o.src = `${r}?sdkid=${encodeURIComponent(e)}&lib=ttq`;
          o.setAttribute("data-ldp-sale-inject", "tiktok-pixel");
          document.head.appendChild(o);
          cleanupNodes.push(o);
        };
      }

      if (typeof window.ttq.load === "function") {
        window.ttq.load(tiktokPixelId);
      }
      if (typeof window.ttq.page === "function") {
        window.ttq.page();
      }
    }

    // 1.5 Custom Head / Body Start / Body End HTML & Scripts
    if (config.inject_head) {
      cleanupNodes.push(
        ...injectCustomHtml(config.inject_head, document.head, "append", "head")
      );
    }
    if (config.inject_body_start) {
      cleanupNodes.push(
        ...injectCustomHtml(
          config.inject_body_start,
          document.body,
          "prepend",
          "body-start"
        )
      );
    }
    if (config.inject_body_end) {
      cleanupNodes.push(
        ...injectCustomHtml(
          config.inject_body_end,
          document.body,
          "append",
          "body-end"
        )
      );
    }

    return () => {
      cleanupNodes.forEach((node) => {
        if (node && node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
    };
  }, [salesConsultant]);

  // 2. Global Event Delegation for Click-to-Call (tel:) and Click-to-Zalo (zalo.me)
  useEffect(() => {
    if (typeof window === "undefined" || !salesConsultant) return;

    const config = parseTrackingConfig(salesConsultant.tracking_config);
    const googleAdsId = config.google_ads_id?.trim();
    const googleAdsCallLabel = config.google_ads_call_label?.trim();
    const googleAdsZaloLabel = config.google_ads_zalo_label?.trim();
    const fbPixelId = config.facebook_pixel_id?.trim();
    const tiktokPixelId = config.tiktok_pixel_id?.trim();

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || typeof target.closest !== "function") return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = (anchor.getAttribute("href") || "").trim();
      if (!href) return;

      const isTelClick = href.toLowerCase().startsWith("tel:");
      const isZaloClick = href.toLowerCase().includes("zalo.me");

      if (!isTelClick && !isZaloClick) return;

      const buttonLocation = detectButtonLocation(anchor);
      const clickKey = `${isTelClick ? "call" : "zalo"}:${href}:${buttonLocation}`;
      const now = Date.now();
      const lastTime = lastClickTimeRef.current[clickKey] || 0;

      // Chống spam lặp click trong 3 giây
      if (now - lastTime < 3000) {
        return;
      }
      lastClickTimeRef.current[clickKey] = now;

      if (isTelClick) {
        // 1. Bắn chuyển đổi về TKQC của Sale
        if (
          googleAdsId &&
          googleAdsCallLabel &&
          typeof window.gtag === "function"
        ) {
          window.gtag("event", "conversion", {
            send_to: `${googleAdsId}/${googleAdsCallLabel}`,
            value: 1.0,
            currency: "VND",
            transport_type: "beacon",
          });
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "ldp_click_call",
          sale_id: salesConsultant.id,
          sale_name: salesConsultant.name,
          sale_slug: salesConsultant.slug,
          sale_phone: salesConsultant.phone,
          vehicle_name: vehicleName || "Showroom tổng",
          vehicle_slug: vehicleSlug || "all",
          button_location: buttonLocation,
          page_url: window.location.href,
        });

        if (fbPixelId && typeof window.fbq === "function") {
          window.fbq("track", "Contact", {
            content_category: "LDP Phone Call",
            content_name: vehicleName || "Showroom tổng",
            sale_name: salesConsultant.name,
          });
          window.fbq("trackCustom", "LdpClickCall", {
            sale_id: salesConsultant.id,
            sale_name: salesConsultant.name,
            sale_phone: salesConsultant.phone,
            vehicle_name: vehicleName || "Showroom tổng",
            button_location: buttonLocation,
          });
        }

        if (
          tiktokPixelId &&
          window.ttq &&
          typeof window.ttq.track === "function"
        ) {
          window.ttq.track("Contact", {
            content_type: "phone_call",
            content_name: vehicleName || "Showroom tổng",
          });
        }

        // 2. Gửi log ngầm (keepalive: true) về Backend
        contactsAPI
          .submit(
            {
              type: "LDP_CLICK_CALL",
              sales_consultant_id: salesConsultant.id,
              landing_page_id: landingPageId || null,
              sales_email: salesEmail || salesConsultant.email || null,
              data: {
                Name: "Khách bấm Gọi điện trên LDP",
                Phone: `Gọi tới Sale: ${salesConsultant.phone}`,
                "Loại chuyển đổi LDP":
                  "📞 Khách bấm nút Gọi điện trực tiếp cho Sale",
                "Cố vấn phụ trách": `${salesConsultant.name} (SĐT: ${salesConsultant.phone})`,
                "SĐT Cố vấn nhận liên hệ": salesConsultant.phone,
                "Dòng xe khách đang xem":
                  vehicleName || "Trang Showroom tổng của Sale",
                "Vị trí nút bấm trên trang": buttonLocation,
                "Đường dẫn trang (URL)": window.location.href,
              },
            },
            { keepalive: true }
          )
          .catch(() => {});
      } else if (isZaloClick) {
        // 1. Bắn chuyển đổi về TKQC của Sale
        if (
          googleAdsId &&
          googleAdsZaloLabel &&
          typeof window.gtag === "function"
        ) {
          window.gtag("event", "conversion", {
            send_to: `${googleAdsId}/${googleAdsZaloLabel}`,
            value: 1.0,
            currency: "VND",
            transport_type: "beacon",
          });
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "ldp_click_zalo",
          sale_id: salesConsultant.id,
          sale_name: salesConsultant.name,
          sale_slug: salesConsultant.slug,
          sale_phone: salesConsultant.phone,
          zalo_url: href,
          vehicle_name: vehicleName || "Showroom tổng",
          vehicle_slug: vehicleSlug || "all",
          button_location: buttonLocation,
          page_url: window.location.href,
        });

        if (fbPixelId && typeof window.fbq === "function") {
          window.fbq("track", "Contact", {
            content_category: "LDP Zalo Chat",
            content_name: vehicleName || "Showroom tổng",
            sale_name: salesConsultant.name,
          });
          window.fbq("trackCustom", "LdpClickZalo", {
            sale_id: salesConsultant.id,
            sale_name: salesConsultant.name,
            sale_phone: salesConsultant.phone,
            zalo_url: href,
            vehicle_name: vehicleName || "Showroom tổng",
            button_location: buttonLocation,
          });
        }

        if (
          tiktokPixelId &&
          window.ttq &&
          typeof window.ttq.track === "function"
        ) {
          window.ttq.track("Contact", {
            content_type: "zalo_chat",
            content_name: vehicleName || "Showroom tổng",
          });
        }

        // 2. Gửi log ngầm (keepalive: true) về Backend
        contactsAPI
          .submit(
            {
              type: "LDP_CLICK_ZALO",
              sales_consultant_id: salesConsultant.id,
              landing_page_id: landingPageId || null,
              sales_email: salesEmail || salesConsultant.email || null,
              data: {
                Name: "Khách bấm Chat Zalo trên LDP",
                Phone: `Zalo tới Sale: ${salesConsultant.phone}`,
                "Loại chuyển đổi LDP":
                  "💬 Khách bấm nút Chat Zalo trực tiếp với Sale",
                "Cố vấn phụ trách": `${salesConsultant.name} (SĐT: ${salesConsultant.phone})`,
                "SĐT Cố vấn nhận liên hệ": salesConsultant.phone,
                "Link Zalo": href,
                "Dòng xe khách đang xem":
                  vehicleName || "Trang Showroom tổng của Sale",
                "Vị trí nút bấm trên trang": buttonLocation,
                "Đường dẫn trang (URL)": window.location.href,
              },
            },
            { keepalive: true }
          )
          .catch(() => {});
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [salesConsultant, vehicleName, vehicleSlug, landingPageId, salesEmail]);

  return null;
}
