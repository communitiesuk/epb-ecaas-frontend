/**
 * Find item to edit from list by index route parameter
 * @param indexParam Route parameter name containing index
 * @param list List of objects
 * @returns List item
 */
export function useItemToEdit<T>(indexRouteParam: string, list?: Array<T>): T | undefined {
	const route = useRoute();

	if (route.params[indexRouteParam] && route.params[indexRouteParam] !== 'create') {
		const index = parseInt(route.params[indexRouteParam] as string);
		const item = list?.[index];

		return item ? { ...item } : undefined;
	}
}