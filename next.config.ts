import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // Set to true if this is a permanent redirect
      },
    ];
  },
  // Add other config options here if needed
};

export default nextConfig;