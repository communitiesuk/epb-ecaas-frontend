import * as Sentry from "@sentry/nuxt";

// This project is configured to not log to Sentry for development.
// To temporarily enable Sentry for development, use this command to start the server:
// NUXT_PUBLIC_ENVIRONMENT='development' npm run dev
// and also define a NUXT_PUBLIC_SENTRY_DSN environment variable
const { public: { environment, sentryDsn } } = useRuntimeConfig();

if (environment && sentryDsn) {
	Sentry.init({
		dsn: sentryDsn,
		environment: `cpl-frontend-${environment ?? "development"}`,
		debug: false,
		tunnel: "/api/tunnel",
	});
}