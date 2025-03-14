import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during build
  },
  images: {
    remotePatterns: [
      {
        protocol: "https", // Specify the protocol
        hostname: "img.clerk.com", // The hostname you're using
        port: "", // Leave empty unless a specific port is required
        pathname: "/**", // Allows all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
