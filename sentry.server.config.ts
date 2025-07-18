import * as Sentry from "@sentry/nuxt";
import dotenv from "dotenv";
 
dotenv.config();

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.NODE_ENV,
	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});