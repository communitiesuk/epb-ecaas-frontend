export function useForm() {
	const route = useRoute();

	/**
	 * Updates EcaasForm data array with new object.
	 * If the route parameter is an index value, the existing object at that index will be replaced.
	 * If the route parameter is 'create', the object will be added to the array.
	 * @param item Object to save
	 * @param form EcaasForm instance where data is an array
	 */
	const saveToList = <T>(item: T, form: EcaasForm<T[]>) => {
		if (!form.data) {
			form.data = [];
		}

		const routeParam = route.params[Object.keys(route.params)[0]];
	
		if (routeParam && routeParam !== 'create') {
			const index = parseInt(routeParam as string);
			form.data[index] = item;
		} else {
			form.data.push(item);
		}
	
		form.complete = true;
	};

	return { saveToList };
}
