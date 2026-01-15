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
  },
  rewrites: async () => [
    {
      /**
       * 修正说明：
       * 使用 :path* 来捕获 /api/ 之后的所有路径片段。
       * 这样当你访问前端 /api/auth/login 时，
       * 它会准确转发到 后端/api/auth/login。
       */
      source: '/api/:path*',
      destination: `https://b2b-api-production-1.up.railway.app/api/:path*`,
    },
  ],
};

export default nextConfig;
