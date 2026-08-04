import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
        destination: "/dich-vu/giao-nhan-xe-tan-noi",
        permanent: true,
      },
      {
        source: "/bao-duong-xe-ford-dinh-ky",
        destination: "/dich-vu/bao-duong-dinh-ky",
        permanent: true,
      },
      {
        source: "/tien-bam-lung-lui-bam-bung",
        destination: "/tin-tuc",
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
      // --- MIGRATION FIXES: Chuyển hướng cấu trúc WordPress cũ sang cấu trúc mới ---
      // 1. Bài viết cũ dạng Ngày/Tháng/Năm (/%year%/%month%/%day%/:slug)
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug",
        destination: "/:slug",
        permanent: true,
      },
      // 2. Bài viết cũ dạng Năm/Tháng (/%year%/%month%/:slug)
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:slug",
        destination: "/:slug",
        permanent: true,
      },
      // 3. Trang lưu trữ theo năm/tháng về trang tin tức
      {
        source: "/:year(\\d{4})/:path*",
        destination: "/tin-tuc",
        permanent: true,
      },
      // 4. Các trang Thẻ (Tag) cũ về trang tin tức
      {
        source: "/tag/:slug*",
        destination: "/tin-tuc",
        permanent: true,
      },
      // 5. Trang Tác giả (Author) cũ về trang giới thiệu
      {
        source: "/author/:slug*",
        destination: "/gioi-thieu",
        permanent: true,
      },
      // 6. Phân trang cũ /page/2, /page/3... về /tin-tuc
      {
        source: "/page/:num*",
        destination: "/tin-tuc",
        permanent: true,
      },
      // 7. RSS Feed cũ về /tin-tuc
      {
        source: "/feed",
        destination: "/tin-tuc",
        permanent: true,
      },
      {
        source: "/:path*/feed",
        destination: "/tin-tuc",
        permanent: true,
      },
      // 8. index.php cũ
      {
        source: "/index.php/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Chuyển hướng nội bộ đường dẫn /khuyen-mai sang trang /tin-tuc
      {
        source: "/khuyen-mai",
        destination: "/tin-tuc",
      },
      {
        source: "/khuyen-mai/:slug*",
        destination: "/tin-tuc/:slug*",
      },
      // Giữ nguyên cấu trúc danh mục bài viết từ WordPress cũ
      {
        source: "/chuyen-muc/:slug",
        destination: "/tin-tuc",
      },
      // Proxy CMS images to inject Cache-Control headers
      {
        source: "/cms-storage/:path*",
        destination: "https://cms.dongnaiford.com.vn/storage/:path*",
      },
      {
        source: "/cms-uploads/:path*",
        destination: "https://cms.dongnaiford.com.vn/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
