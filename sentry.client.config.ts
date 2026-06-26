import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 10 % of transactions for performance monitoring.
  // Raise this once real traffic data is available.
  tracesSampleRate: 0.1,

  // Capture replays for 10 % of all sessions and 100 % of sessions with an
  // error (helps reproduce bugs from production). Disable if bundle size is a
  // concern.
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration(),
  ],

  // Do not surface Sentry errors in the browser console in development.
  debug: false,
});
