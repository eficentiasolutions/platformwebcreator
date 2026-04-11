import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "https://preview-web-c717a0ec-0d20-431f-8e99-0763aa1fe12a.space.chatglm.site",
    "https://preview-chat-a4373f87-5452-4d2c-a436-e89101759d2a.space.z.ai",
  ],
};

export default nextConfig;
