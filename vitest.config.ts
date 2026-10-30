import { defineVitestConfig } from "@nuxt/test-utils/config";
import { resolve } from "node:path";

export default defineVitestConfig({
	resolve: {
		alias: {
			// trick Vite into resolving bun:test to an existing file
			"bun:test": resolve("./vitest.config.ts"),
		},
	},
	test: {
		environment: "nuxt",
		globals: true,
		exclude: ["**/node_modules/**", "e2e-tests/**"],
		clearMocks: false,
	},
});