import * as Sentry from "@sentry/nuxt";
import dotenv from "dotenv";
 
dotenv.config();

Sentry.init({
	dsn: process.env.SENTRY_DSN_PUBLIC,
	environment: process.env.NODE_ENV,
	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
  
	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: true,
});
