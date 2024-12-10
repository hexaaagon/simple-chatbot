import { NextConfig } from "next";

const nextConfig = {
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  serverExternalPackages: ["@vercel/otel"],
} satisfies NextConfig;

export default nextConfig;
