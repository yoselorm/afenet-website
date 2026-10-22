import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages read live CMS data from MySQL on every request, so Cache Components is off
  cacheComponents: false,
};

export default nextConfig;
