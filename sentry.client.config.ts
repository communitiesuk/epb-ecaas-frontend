import * as Sentry from "@sentry/nuxt";

Sentry.init({
	dsn: useRuntimeConfig().public.sentry.dsn,
	environment: useRuntimeConfig().public.sentry.environment,
	debug: false,
});
