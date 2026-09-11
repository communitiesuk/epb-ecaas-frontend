import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		projects: [
			await defineVitestProject({
				test: {
					globals: true,
					name: "nuxt",
					include: ["**/*.test.ts"],
					exclude: ["**/node_modules/**", "e2e-tests/**"],
					environment: "nuxt",
				},
			}),
		],
	},
});