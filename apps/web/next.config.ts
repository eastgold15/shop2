import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "img.poripori.top" },
      { hostname: "img.dongqifootwear.com" },
    ],
  },
  transpilePackages: ["@repo/contract"],
};

export default nextConfig;
