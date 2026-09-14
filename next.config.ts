import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { serverComponentsHmrCache: false },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", port: "", pathname: `/images/${process.env.SANITY_STUDIO_PROJECT_ID || "x7trmz7f"}/${process.env.SANITY_STUDIO_DATASET || "production"}/**` }],
  },
};

export default nextConfig;
