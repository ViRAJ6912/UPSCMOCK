import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/upscmock",
  images: { unoptimized: true },
};

export default nextConfig;
