import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverActions: {
    bodySizeLimit: "10mb",
  },
};

export default nextConfig;
