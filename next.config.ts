import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactCompiler: true,
  experimental: {
    // Native Rust port of the React Compiler, run inside Turbopack instead of
    // through Babel. Same output, no babel-plugin-react-compiler needed.
    turbopackRustReactCompiler: true,
    // The root layout sits under [lang], so unmatched addresses need a 404
    // that brings its own document: app/global-not-found.tsx
    globalNotFound: true,
  },
};

export default nextConfig;
