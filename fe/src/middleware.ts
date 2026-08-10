import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Bộ nhớ đệm cache trong RAM để phản hồi chuyển hướng tức thì (0ms)
const redirectCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 60 * 1000; // Cache 1 phút trong bộ nhớ RAM Node.js

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Bỏ qua các file tĩnh chuẩn hệ thống
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Trả về 404 tức thì cho các file .json, .ico, .map không thuộc public để không lọt vào route /[id] gây 404 ở Laravel
  if (
    (pathname.endsWith(".json") && !pathname.startsWith("/manifest") && !pathname.startsWith("/sitemap")) ||
    (pathname.endsWith(".ico") && pathname !== "/favicon.ico") ||
    pathname.endsWith(".map")
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // Inject x-pathname header cho layout LDP detection
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Bỏ qua redirect lookup cho các path đã biết rõ — tiết kiệm ~100-200ms/request
  const KNOWN_PATHS = [
    '/bang-gia', '/gioi-thieu', '/lien-he', '/tin-tuc', '/dich-vu',
    '/phu-kien', '/tuyen-dung', '/cong-cu', '/dang-ky-lai-thu',
    '/chinh-sach-bao-mat', '/dieu-khoan-su-dung', '/dong-xe',
    '/san-pham', '/xe-da-qua-su-dung', '/tim-kiem', '/thu-vien-media',
    '/khao-sat-dich-vu', '/khao-sat-lai-thu', '/sitemap.xml', '/robots.txt',
    '/ford-ranger', '/ford-everest', '/ford-territory', '/ford-explorer', '/ford-transit', '/ford-mustang-mach-e',
    '/images-dynamic', '/backup-assets', '/cms-storage', '/cms-uploads', '/ldp'
  ];
  const isKnownPath = pathname === '/' || KNOWN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

  if (isKnownPath) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  // 1. Kiểm tra 301 Redirect động từ RAM cache hoặc Laravel API
  const fullPath = pathname + search;
  const now = Date.now();
  const cached = redirectCache.get(fullPath);
  
  let redirectData = null;

  if (cached && cached.expiry > now) {
    redirectData = cached.data;
  } else {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      
      const response = await fetch(`${apiBase}/redirects/lookup?url=${encodeURIComponent(fullPath)}`);

      if (response.ok) {
        const data = await response.json();
        redirectData = data.success && data.redirect ? data.redirect : null;
        
        // Lưu vào RAM cache để các lượt truy cập sau phản hồi ngay lập tức
        redirectCache.set(fullPath, {
          data: redirectData,
          expiry: now + CACHE_TTL
        });
      }
    } catch (error) {
      console.error("Next.js 301 Redirect Middleware Error:", error);
    }
  }

  if (redirectData) {
    const { new_url, status_code } = redirectData;
    const redirectUrl = new URL(new_url, request.url);
    return NextResponse.redirect(redirectUrl, status_code || 301);
  }

  // 2. Chạy logic proxy LDP cũ (gộp từ proxy.ts)

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
        next: { revalidate: 3600 } // Cache kết quả tra cứu
      });
      
      if (lookupRes.ok) {
        const resJson = await lookupRes.json();
        if (resJson.success && resJson.data?.found) {
          const salesSlug = resJson.data.sales_slug;
          let vehicleSlug = pathname.replace(/^\//, "");
          
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
