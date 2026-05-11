import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid picking a parent-folder lockfile as workspace root when multiple exist.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
