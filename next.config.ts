import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Accepte n'importe quel nom de domaine
      },
      {
        protocol: "http", // Optionnel : si vous avez aussi des sources non sécurisées
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;