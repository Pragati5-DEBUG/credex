import path from "path";
import type { NextConfig } from "next";

// Keep tracing root and Turbopack root identical (Next warns if they differ when both are set).
const appRoot = path.join(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: appRoot,
  // Avoid picking a parent-folder lockfile as workspace root when multiple exist.
  turbopack: {
    root: appRoot,
  },
};

export default nextConfig;
