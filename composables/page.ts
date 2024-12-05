import pagesData from "~/data/pages";

export function usePage() {
	const route = useRoute();
	return pagesData.find(p => p.url === route.path);
}