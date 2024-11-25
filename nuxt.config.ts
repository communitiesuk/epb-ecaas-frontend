import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	app: {
		head: {
			titleTemplate: '%s - ECaaS GOV.UK',
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
				{ name: 'theme-color', content: '#0b0c0c' }
			],
			link: [
				{ rel: 'icon', sizes: '48x48', href: '/assets/images/favicon.ico' },
				{ rel: 'icon', sizes: 'any', href: '/assets/images/favicon.svg', type: 'image/svg+xml' },
				{ rel: 'mask-icon', href: '/assets/images/govuk-icon-mask.svg', color: '#0b0c0c' },
				{ rel: 'apple-touch-icon', href: '/assets/images/govuk-icon-180.png' },
				{ rel: 'manifest', href: '/assets/manifest.json' }
			],
			bodyAttrs: {
				class: 'govuk-template__body js-enabled govuk-frontend-supported'
			}
		}
	},
	css: ['~/assets/scss/main.scss'],
	vite: {
		plugins: [
			viteStaticCopy({
				targets: [{
					src: 'node_modules/govuk-frontend/dist/govuk/assets/*',
					dest: 'assets'
				}]
			})
		]
	},
	modules: [
		'@formkit/nuxt',
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt'
	],
	formkit: {
		autoImport: true,
		configFile: './formkit.config.ts'
	}
});
