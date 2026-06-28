import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/manifest.json", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
      { source: "/icons/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "public, max-age=0, no-cache" }] },
    ];
  },
};

export default nextConfig;
