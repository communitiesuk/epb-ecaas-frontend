import * as Sentry from "@sentry/nuxt";

Sentry.init({
	// If set up, you can use your runtime config here
	dsn: useRuntimeConfig().public.sentry.dsn,
	environment: process.env.NODE_ENV,
	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
  
	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});
