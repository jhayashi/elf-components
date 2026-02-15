const path = require("path");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "elf-components",
    "@evolu/common",
    "@evolu/react",
    "@evolu/react-web",
    "@evolu/web",
  ],
  outputFileTracingRoot: __dirname,
  webpack: (config) => {
    // Force a single copy of React — the library source (../../src) would
    // otherwise resolve react from the repo-root node_modules.
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    };
    return config;
  },
};

module.exports = nextConfig;
