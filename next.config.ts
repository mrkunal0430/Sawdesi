import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/shipping",
        destination: "/shipping-policy",
        permanent: true,
      },
      {
        source: "/returns",
        destination: "/refund-policy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
