import type { RouterConfig } from "@nuxt/schema";

export default {
	scrollBehavior: (to, from) => {
		if (import.meta.client && (from.query.page !== to.query.page || from.path !== to.path)) {
			window.scrollTo(0, 0);
		}
	},
} satisfies RouterConfig;
