import type { RouterConfig } from "@nuxt/schema";

export default {
	scrollBehavior: (to, from) => {
		if (from.query.page !== to.query.page && import.meta.client) {
			window.scrollTo(0, 0);
		}
	},
} satisfies RouterConfig;
