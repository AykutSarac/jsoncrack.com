// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://d3345591295d4dd1b8c579b62003d939@o1284435.ingest.sentry.io/6495191",
    tracesSampleRate: 0.2,
    debug: false,
    release: `${process.env.SENTRY_RELEASE || "production"}`,
    allowUrls: [/^https:\/\/jsoncrack\.com/],
    replaysOnErrorSampleRate: 0.5,
    replaysSessionSampleRate: 0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false, // [.sentry-mask] added to the text editor
        blockAllMedia: true,
      }),
    ],
  });
}
