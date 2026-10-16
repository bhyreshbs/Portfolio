import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Dev server only: let phones/tablets on the same Wi-Fi load the site by IP (e.g. 192.168.0.128:3000).
  // Without this Next.js blocks their requests for /_next/* assets and HMR.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
  experimental: {
    // Barrel-heavy packages: only compile the icons / helpers actually used
    optimizePackageImports: ["react-icons/si", "react-icons/fa", "react-icons/vsc", "lucide-react", "framer-motion"],
  },
};

export default nextConfig;
