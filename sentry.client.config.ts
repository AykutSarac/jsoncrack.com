// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: process.env.NODE_ENV === "development",
  dsn: "https://d3345591295d4dd1b8c579b62003d939@o1284435.ingest.sentry.io/6495191",
  tracesSampleRate: 0.2,
  debug: false,
  release: `${process.env.SENTRY_RELEASE || "production"}`,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
