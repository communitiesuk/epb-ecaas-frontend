import type { NuxtPage } from "nuxt/schema";
import { viteStaticCopy } from "vite-plugin-static-copy";
import yn from "yn";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: {
		enabled:
			typeof process.env.DISABLE_DEVTOOLS !== "undefined"
				? !yn(process.env.DISABLE_DEVTOOLS)
				: true,
	},
	app: {
		head: {
			titleTemplate: "%s - ECaaS GOV.UK",
			meta: [
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1, viewport-fit=cover",
				},
				{ name: "theme-color", content: "#0b0c0c" },
			],
			link: [
				{
					rel: "icon",
					sizes: "48x48",
					href: "/static/assets/rebrand/images/favicon.ico",
				},
				{
					rel: "icon",
					sizes: "any",
					href: "/static/assets/rebrand/images/favicon.svg",
					type: "image/svg+xml",
				},
				{
					rel: "mask-icon",
					href: "/static/assets/rebrand/images/govuk-icon-mask.svg",
					color: "#0b0c0c",
				},
				{
					rel: "apple-touch-icon",
					href: "/static/assets/rebrand/images/govuk-icon-180.png",
				},
				{ rel: "manifest", href: "/static/assets/rebrand/manifest.json" },
			],
			bodyAttrs: {
				class: "govuk-template__body js-enabled govuk-frontend-supported",
			},
			htmlAttrs: {
				class: "govuk-template govuk-template--rebranded",
			},
		},
	},
	css: ["~/assets/scss/main.scss"],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					silenceDeprecations: [
						"mixed-decls",
						"global-builtin",
						"slash-div",
						"import",
					],
					additionalData: `
																																																																																																@use "/node_modules/govuk-frontend/dist/govuk/settings/colours-palette" as *;
																																																																																																@use "/node_modules/govuk-frontend/dist/govuk/settings/media-queries" as *;`,
				},
			},
		},
		plugins: [
			viteStaticCopy({
				targets: [
					{
						src: "node_modules/govuk-frontend/dist/govuk/assets/*",
						dest: "static/assets",
					},
				],
			}),
		],
	},
	modules: [
		"@formkit/nuxt",
		"@pinia/nuxt",
		"pinia-plugin-persistedstate/nuxt",
		"@nuxt/test-utils/module",
		"@nuxt/eslint",
		"nuxt-auth-utils",
		"@nuxtjs/robots",
		"nuxt-security",
	],
	plugins: [
		"~/plugins/xray-fetch.server",
		// '~/plugins/load-store.client',
		// '~/plugins/update-store.client',
	],
	formkit: {
		autoImport: true,
		configFile: "./formkit.config.ts",
	},
	runtimeConfig: {
		redisEndpoint: '',
		redisPassword: '',
		redisUsername: ''
	},
	nitro: process.env.BUILD_FOR_AWS_LAMBDA
		? {
			preset: "aws-lambda",
		}
		: undefined,
	typescript: {
		typeCheck: true,
	},
	experimental: {
		watcher: "parcel",
	},
	hooks: {
		"pages:extend"(pages) {
			function setAuthMiddleware(pages: NuxtPage[]) {
				for (const page of pages) {
					page.meta ||= {};
					page.meta.middleware = ["authenticated"];

					if (page.children) {
						setAuthMiddleware(page.children);
					}
				}
			}

			if (process.env.NODE_ENV === "production" && process.env.BUILD_FOR_AWS_LAMBDA) {
				setAuthMiddleware(pages);
			}
		},
	},
	site: {
		indexable: false,
	},
	ignore: ["**/*.test.ts"],
	security: {
		headers: {
			strictTransportSecurity: process.env.BUILD_FOR_AWS_LAMBDA ? {
				// TODO: Increase gradually (TBC), eventually with maxAge: 63072000 and preload: true
				maxAge: 604800, // 1 week
				includeSubdomains: true
			} : false,
			xFrameOptions: false,
			xXSSProtection: false
		}
	}
});