import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const host = request.headers.get("host") || "";
  const cleanHost = host.split(":")[0];
  
  // Danh sách domain chính không cần rewrite
  const systemDomains = [
    "dongnaiford.com.vn",
    "cms.dongnaiford.com.vn",
    "localhost",
    "127.0.0.1"
  ];

  const isSystemDomain = systemDomains.some(d => cleanHost === d || cleanHost.endsWith(d));

  if (!isSystemDomain) {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      
      // Gọi API tra cứu chủ sở hữu domain
      const lookupRes = await fetch(`${apiBase}/ldp/lookup-domain?domain=${cleanHost}`, {
        next: { revalidate: 3600 } // Cache kết quả tra cứu để tránh tải nặng API
      });
      
      if (lookupRes.ok) {
        const resJson = await lookupRes.json();
        if (resJson.success && resJson.data?.found) {
          const salesSlug = resJson.data.sales_slug;
          let vehicleSlug = request.nextUrl.pathname.replace(/^\//, "");
          
          // Mặc định nếu truy cập trang chủ của domain vệ tinh thì trỏ về dòng xe chủ lực của cố vấn
          if (!vehicleSlug) {
            vehicleSlug = resJson.data.default_vehicle_slug || "ford-territory";
          }

          const url = request.nextUrl.clone();
          url.pathname = `/ldp/${salesSlug}/${vehicleSlug}`;
          
          return NextResponse.rewrite(url, {
            request: {
              headers: requestHeaders,
            }
          });
        }
      }
    } catch (err) {
      console.error("Proxy domain lookup error:", err);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|static|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
