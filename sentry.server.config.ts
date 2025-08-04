import * as Sentry from "@sentry/nuxt";
import dotenv from "dotenv";
 
if (process.env.NUXT_PUBLIC_ENVIRONMENT) {
	dotenv.config();
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		environment: process.env.NUXT_PUBLIC_ENVIRONMENT,
		debug: false,
	});
}