import * as Sentry from "@sentry/nuxt";
import dotenv from "dotenv";
 
if (process.env.SENTRY_ENVIRONMENT) {
	dotenv.config();
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		environment: process.env.SENTRY_ENVIRONMENT,
		debug: false,
	});
}