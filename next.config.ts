import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // All external packages listed here
  serverExternalPackages: ["@codesandbox/sdk", "@codesandbox/sandpack-react"],
  webpack: (config, options) => {
    if (options.nextRuntime === "edge") {
      if (!config.resolve.conditionNames) {
        config.resolve.conditionNames = ["require", "node"];
      }
      if (!config.resolve.conditionNames.includes("worker")) {
        config.resolve.conditionNames.push("worker");
      }
    }
    
    // Add fallbacks for browser APIs
    if (!options.isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
      };
    }
    
    return config;
  },
};

export default nextConfig;
