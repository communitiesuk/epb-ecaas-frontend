/**
 * Find item to edit from list by index route parameter
 * @param indexParam Route parameter name containing index
 * @param list List of objects
 * @returns List item
 */
export function useItemToEdit<T>(indexRouteParam: string, list?: Array<T>): T | undefined {
	const route = useRoute();

	if (route.params[indexRouteParam] && route.params[indexRouteParam] !== "create") {
		const index = parseInt(route.params[indexRouteParam] as string);
		const item = list?.[index];

		// TODO: Remove check for import.meta.client when using server session storage
		if (!item && import.meta.client) {
			throw createError({
				statusCode: 404,
				statusMessage: `Page not found: ${route.path}`
			});
		}

		return item ? { ...item } : undefined;
	}
}