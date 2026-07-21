import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://finvistaca-backend-ebon.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
