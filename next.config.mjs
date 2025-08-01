import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndCaching: true,
  reloadOnline: true,
  disable: false,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
  },
  runtimeCaching: [
    {
      urlPattern: /^\/api\/.*/, // Match all API routes
      handler: "StaleWhileRevalidate", // Serve cache offline, update in background
      options: {
        cacheName: "api-cache",
        expiration: {
          // maxEntries:  // Limit cache size (adjust as needed)
          maxAgeSeconds: 1.5 * 24 * 60 * 60, // Cache for 1.5 days
        },
        cacheableResponse: {
          statuses: [0, 200], // Cache successful responses
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverActions: {
    bodySizeLimit: "10mb",
  },
};

export default withPWA(nextConfig);
