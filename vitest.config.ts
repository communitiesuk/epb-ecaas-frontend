import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
	test: {
		environment: 'nuxt',
		globals: true,
		silent: true,
		exclude: ['**/node_modules/**', 'e2e-tests/**'],
	}
});