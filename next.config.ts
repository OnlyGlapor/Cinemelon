import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "image.tmdb.org",
      "img.youtube.com"
    ], // Add the hostname here
  },
};

export default nextConfig;

