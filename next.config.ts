import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactCompiler: true,
  experimental: {
    // Native Rust port of the React Compiler, run inside Turbopack instead of
    // through Babel. Same output, no babel-plugin-react-compiler needed.
    turbopackRustReactCompiler: true,
  },
};

export default nextConfig;
