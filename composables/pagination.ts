
/**
 * Provides data and functions for pagination
 * @returns Total pages and function for returning data for the current page
 */
export function usePagination<T>(data: Array<T>, pageSize: number) {
	const route = useRoute();
	const totalPages = Array.isArray(data) ? Math.ceil(data.length / pageSize) : 1;

	function getData() {
		const pageNumber = parseInt(route.query.page as string) || 1;
		const start = (pageNumber - 1) * pageSize;

		return data.slice(start, start + pageSize);
	}

	return { totalPages, getData };
}