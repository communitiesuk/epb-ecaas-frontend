import * as Sentry from "@sentry/nuxt";

Sentry.init({
	// If set up, you can use your runtime config here
	dsn: useRuntimeConfig().public.sentry.dsn,
	environment: process.env.NODE_ENV,
	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});
