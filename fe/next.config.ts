import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
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
  async redirects() {
    return [
      {
        source: "/accessories",
        destination: "/phu-kien",
        permanent: true,
      },
      // --- CHUYỂN HƯỚNG URL SẢN PHẨM XE CÓ CHỨA /SAN-PHAM SANG URL NGẮN ---
      {
        source: "/san-pham/ford-transit",
        destination: "/ford-transit-2024",
        permanent: true,
      },
      {
        source: "/san-pham/ford-transit/:subpath*",
        destination: "/ford-transit-2024/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/ford-mustang",
        destination: "/mustang-fastback",
        permanent: true,
      },
      {
        source: "/san-pham/ford-mustang/:subpath*",
        destination: "/mustang-fastback/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/ford-transit-2024",
        destination: "/ford-transit-2024",
        permanent: true,
      },
      {
        source: "/san-pham/ford-transit-2024/:subpath*",
        destination: "/ford-transit-2024/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/mustang-fastback",
        destination: "/mustang-fastback",
        permanent: true,
      },
      {
        source: "/san-pham/mustang-fastback/:subpath*",
        destination: "/mustang-fastback/:subpath*",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(ford-ranger|ford-everest|ford-territory|ford-explorer)",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/san-pham/:slug(ford-ranger|ford-everest|ford-territory|ford-explorer)/:subpath*",
        destination: "/:slug/:subpath*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Chuyển hướng nội bộ cho các dòng xe Ford (rút ngắn URL)
      {
        source: "/ford-transit",
        destination: "/san-pham/ford-transit-2024",
      },
      {
        source: "/ford-transit/:subpath*",
        destination: "/san-pham/ford-transit-2024/:subpath*",
      },
      {
        source: "/ford-mustang",
        destination: "/san-pham/mustang-fastback",
      },
      {
        source: "/ford-mustang/:subpath*",
        destination: "/san-pham/mustang-fastback/:subpath*",
      },
      {
        source: "/:slug(ford-ranger|ford-everest|ford-territory|ford-transit-2024|mustang-fastback|ford-explorer)",
        destination: "/san-pham/:slug",
      },
      {
        source: "/:slug(ford-ranger|ford-everest|ford-territory|ford-transit-2024|mustang-fastback|ford-explorer)/:subpath*",
        destination: "/san-pham/:slug/:subpath*",
      },
      // Chuyển hướng nội bộ đường dẫn /khuyen-mai sang trang /tin-tuc
      {
        source: "/khuyen-mai",
        destination: "/tin-tuc",
      },
      {
        // Giữ nguyên cấu trúc URL cũ /[slug].html từ WordPress
        // Next.js sẽ render trang /tin-tuc/[slug] nhưng URL trình duyệt vẫn giữ nguyên /[slug].html
        source: "/:slug.html",
        destination: "/tin-tuc/:slug",
      },
    ];
  },
};

export default nextConfig;
