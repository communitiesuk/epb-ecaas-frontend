import type { RouterConfig } from "@nuxt/schema";

export default {
	scrollBehavior: (to, from) => {
		if (to.fullPath !== from.fullPath && import.meta.client) {
			window.scrollTo(0, 0);
		}
	},
} satisfies RouterConfig;
