import pagesData from "~/data/pages/pages";

/**
 * Returns page object from page data based on the current route path.
 * @returns An object representing the current page.
 */
export function usePage() {
	const route = useRoute();
	const page = pagesData.find(p => p.url === route.path);
	if (!page) {
		throw createError({ statusCode: 404, statusMessage: `Page not found: ${route.path}` });
	}
	return page;
}