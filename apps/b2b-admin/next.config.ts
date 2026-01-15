import type { NextConfig } from "next";
import "./src/env.ts";
import path from "node:path";

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
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  transpilePackages: ["@repo/contract"],
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  }
};

export default nextConfig;
