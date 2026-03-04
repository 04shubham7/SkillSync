/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    // Antigravity fix for Drei missing exports in three@0.181+
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "three/examples/js/libs/stats.min": false,
    };
    return config;
  },
};

export default nextConfig;
