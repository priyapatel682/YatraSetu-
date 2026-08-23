import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/admin',
      },
      {
        source: '/dashboard/:path*',
        destination: '/admin/:path*',
      }
    ];
  }
};

export default nextConfig;
