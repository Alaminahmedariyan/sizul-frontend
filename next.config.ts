import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, "");

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not configured.");
}

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;