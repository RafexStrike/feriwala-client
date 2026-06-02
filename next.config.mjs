/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "@react-three/drei", "@react-three/fiber"],
  },
};

export default nextConfig;
