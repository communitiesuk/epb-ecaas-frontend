import * as Sentry from "@sentry/nuxt";
import dotenv from "dotenv";

// This project is configured to not log to Sentry for development.
// To temporarily enable Sentry for development, use this command to start the server:
// NUXT_PUBLIC_ENVIRONMENT='development' npm run dev
if (process.env.NUXT_PUBLIC_ENVIRONMENT) {
	dotenv.config();
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		environment: process.env.NUXT_PUBLIC_ENVIRONMENT ?? "development",
		debug: false,
	});
}