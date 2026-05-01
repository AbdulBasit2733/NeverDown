import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Fallback to your production backend if the env var isn't set
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    return [
      {
        // When frontend calls /api/backend/signin...
        source: "/api/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;