import pagesData from "~/data/pages";

/**
 * Returns page object from page data based on the current route path.
 * @returns An object representing the current page.
 */
export function usePage() {
	const route = useRoute();
	return pagesData.find(p => p.url === route.path);
}