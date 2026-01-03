import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    LOGIN_FULL_URL: process.env.LOGIN_FULL_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL
  },
};

export default nextConfig;
