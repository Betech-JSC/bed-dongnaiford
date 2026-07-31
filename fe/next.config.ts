import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3-alpha-sig.figma.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ford.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.dnf.betech-digital.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "cms.dnf.betech-digital.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.dongnaiford.com.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "cms.dongnaiford.com.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
      // Cache Next.js static assets aggressively (hashed filenames = immutable)
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache images: 1 day + stale-while-revalidate 7 days
      {
        source: "/:path*.(jpg|jpeg|png|webp|svg|ico|gif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      // Cache fonts
      {
        source: "/:path*.(woff|woff2|ttf|otf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Chuyển hướng 301 dịch vụ WordPress cũ duy nhất sang cấu trúc mới
      {
        source: "/nhan-va-giao-xe-tan-noi",
        destination: "/dich-vu/nhan-va-giao-xe-tan-noi",
        permanent: true,
      },
      {
        source: "/accessories",
        destination: "/phu-kien",
        permanent: true,
      },
      // --- SEO CLEANUP: Redirect xe đã ngừng bán + nội dung trùng lặp ---
      // EcoSport (đã ngừng bán tại VN)
      {
        source: "/bang-gia-xe-ford-ecosport-2017",
        destination: "/bang-gia",
        permanent: true,
      },
      {
        source: "/bang-gia-xe-ford-ecosport-2019",
        destination: "/bang-gia",
        permanent: true,
      },
      {
        source: "/bang-gia-xe-ford-ecosport",
        destination: "/bang-gia",
        permanent: true,
      },
      {
        source: "/co-nen-mua-xe-ford-ecosport",
        destination: "/tin-tuc",
        permanent: true,
      },
      // Bài trùng nội dung (suffix -2, -3)
      {
        source: "/chuong-trinh-sua-chua-luu-dong-2",
        destination: "/chuong-trinh-sua-chua-luu-dong",
        permanent: true,
      },
      {
        source: "/chuong-trinh-tri-an-khach-hang-2",
        destination: "/chuong-trinh-tri-an-khach-hang",
        permanent: true,
      },
      {
        source: "/chuong-trinh-tri-an-khach-hang-3",
        destination: "/chuong-trinh-tri-an-khach-hang",
        permanent: true,
      },
      // Bảo hành trùng
      {
        source: "/chinh-sach-bao-hanh-xe-ford-2023",
        destination: "/chinh-sach-bao-hanh-xe-ford",
        permanent: true,
      },
      // Redirect các link 404 phát hiện từ Google Search Console (Migration fixes)
      {
        source: "/bao-hiem-than-vo-o-to.html/feed",
        destination: "/tin-tuc",
        permanent: true,
      },
      {
        source: "/tinh-nang-chieu-sang-thong-minh-tren-ford-",
        destination: "/tin-tuc",
        permanent: true,
      },
      {
        source: "/dai-ly-ford-vung-tau",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dai-ly-ford-tphcm",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dongnaiford.com.vn",
        destination: "/",
        permanent: true,
      },
      {
        source: "/sbz/app.js",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ford-escape-gia-bao-nhieu.html",
        destination: "/bang-gia",
        permanent: true,
      },
      {
        source: "/tu-van-mua-xe-5-cho-tai-dong-nai",
        destination: "/tin-tuc",
        permanent: true,
      },
      {
        source: "/kich-thuoc-xe-ford-transit-2",
        destination: "/ford-transit",
        permanent: true,
      },
      {
        source: "/phu-kien-xe-ford",
        destination: "/phu-kien",
        permanent: true,
      },
      // --- CHUYỂN HƯỚNG URL SẢN PHẨM XE CÓ CHỨA /SAN-PHAM SANG URL NGẮN ---
      // Redirects từ slug xe cũ không có tiền tố "ford-" sang có tiền tố "ford-"
      {
        source: "/:slug(everest|territory|explorer)",
        destination: "/ford-:slug",
        permanent: true,
      },
      {
        source: "/:slug(everest|territory|explorer)/:subpath*",
        destination: "/ford-:slug/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(everest|territory|explorer)",
        destination: "/ford-:slug",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(everest|territory|explorer)/:subpath*",
        destination: "/ford-:slug/:subpath*",
        permanent: true,
      },
      // Redirects cho transit alias cũ
      {
        source: "/ford-transit-2024",
        destination: "/ford-transit",
        permanent: true,
      },
      {
        source: "/ford-transit-2024/:subpath*",
        destination: "/ford-transit/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/ford-transit-2024",
        destination: "/ford-transit",
        permanent: true,
      },
      {
        source: "/san-pham/ford-transit-2024/:subpath*",
        destination: "/ford-transit/:subpath*",
        permanent: true,
      },
      // Redirects cho mustang alias cũ
      {
        source: "/mustang-fastback",
        destination: "/ford-mustang-mach-e",
        permanent: true,
      },
      {
        source: "/mustang-fastback/:subpath*",
        destination: "/ford-mustang-mach-e/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/mustang-fastback",
        destination: "/ford-mustang-mach-e",
        permanent: true,
      },
      {
        source: "/san-pham/mustang-fastback/:subpath*",
        destination: "/ford-mustang-mach-e/:subpath*",
        permanent: true,
      },
      {
        source: "/ford-mustang",
        destination: "/ford-mustang-mach-e",
        permanent: true,
      },
      {
        source: "/ford-mustang/:subpath*",
        destination: "/ford-mustang-mach-e/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/ford-mustang",
        destination: "/ford-mustang-mach-e",
        permanent: true,
      },
      {
        source: "/san-pham/ford-mustang/:subpath*",
        destination: "/ford-mustang-mach-e/:subpath*",
        permanent: true,
      },
      // Chuyển hướng chuẩn từ /san-pham/[slug-dung] sang /[slug-dung]
      {
        source: "/san-pham/:slug(ford-ranger|ford-everest|ford-territory|ford-explorer|ford-transit|ford-mustang-mach-e)",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(ford-ranger|ford-everest|ford-territory|ford-explorer|ford-transit|ford-mustang-mach-e)/:subpath*",
        destination: "/:slug/:subpath*",
        permanent: true,
      },
      // Tự động Redirect 301 từ URL cũ có .html sang URL mới không có .html
      {
        source: "/:slug.html",
        destination: "/:slug",
        permanent: true,
      },
      // Tự động Redirect 301 từ /category/ sang chuyên mục tiếng Việt /chuyen-muc/
      {
        source: "/category/:slug",
        destination: "/chuyen-muc/:slug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Chuyển hướng nội bộ cho các dòng xe Ford (rút ngắn URL)
      {
        source: "/:slug(ford-ranger|ford-everest|ford-territory|ford-transit|ford-mustang-mach-e|ford-explorer)",
        destination: "/san-pham/:slug",
      },
      {
        source: "/:slug(ford-ranger|ford-everest|ford-territory|ford-transit|ford-mustang-mach-e|ford-explorer)/:subpath*",
        destination: "/san-pham/:slug/:subpath*",
      },
      // Chuyển hướng nội bộ đường dẫn /khuyen-mai sang trang /tin-tuc
      {
        source: "/khuyen-mai",
        destination: "/tin-tuc",
      },
      // Giữ nguyên cấu trúc danh mục bài viết từ WordPress cũ
      {
        source: "/chuyen-muc/:slug",
        destination: "/tin-tuc",
      },
      // Định tuyến chung cho các bài viết không có /tin-tuc (loại trừ các đường dẫn tĩnh hệ thống)
      {
        source: "/:slug((?!tin-tuc$|khuyen-mai$|chuyen-muc$|category$|san-pham$|admin$|api$|lien-he$|gioi-thieu$|bang-gia$|dang-ky-lai-thu$|tim-kiem$|thu-vien-media$|xe-da-qua-su-dung$|phu-kien$|tuyen-dung$|dich-vu$)[^/]+)",
        destination: "/tin-tuc/:slug",
      },
    ];
  },
};

export default nextConfig;
