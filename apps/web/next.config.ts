import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Set to the bucket's public hostname once S3 media is live, e.g.
// "my-bucket.s3.us-east-1.amazonaws.com" (see apps/cms S3_BUCKET/S3_REGION).
const mediaHostname = process.env.NEXT_PUBLIC_MEDIA_HOSTNAME;

const nextConfig: NextConfig = {
  // Standalone output for Docker (apps/web/Dockerfile) - traces only the
  // node_modules this app actually needs into .next/standalone.
  output: "standalone",
  // Monorepo root, so file tracing correctly resolves hoisted workspace deps.
  outputFileTracingRoot: path.resolve(dirname, "../.."),
  transpilePackages: ["@distrodb/types"],
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: mediaHostname ? [{ protocol: "https", hostname: mediaHostname }] : [],

    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
