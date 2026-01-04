/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",  <--- DELETE THIS
  // output: "standalone", <--- DELETE THIS TOO (for now)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
