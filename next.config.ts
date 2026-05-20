import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/UPSCMOCK",
  images: { unoptimized: true },
};

export default nextConfig;
