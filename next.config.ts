import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Permanently redirect old /u/:username links to root /:username.
        source: "/u/:username",
        destination: "/:username",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Org and project come from the SENTRY_ORG / SENTRY_PROJECT env vars set in
  // CI/CD — no need to hard-code them here.
  silent: !process.env.CI,

  // Upload source maps to Sentry so stack traces show original TypeScript.
  // The auth token comes from SENTRY_AUTH_TOKEN (set in the Vercel project env).
  widenClientFileUpload: true,

  // Tree-shake unused Sentry code in the client bundle.
  disableLogger: true,

  // Automatically instrument React component trees for performance monitoring.
  reactComponentAnnotation: {
    enabled: true,
  },
});
