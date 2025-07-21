import * as Sentry from "@sentry/nuxt";
import dotenv from "dotenv";
 
dotenv.config();

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
	debug: false,
});