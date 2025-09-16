export function useForm() {
	const route = useRoute();
	const store = useEcaasStore();

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

		const routeParam = route.params[Object.keys(route.params)[0]!];
	
		if (routeParam && routeParam !== "create") {
			const index = parseInt(routeParam as string);
			form.data[index] = item;
		} else {
			form.data.push(item);
		}
	};

	/**
	 * Return the index of the item or the index of the next item if the route param is 'create'
	 * @param data Array of EcaasForm objects
	 * @returns Index
	 */
	const getStoreIndex = <T>(data: EcaasForm<T>[]): number => {
		const routeParam = route.params[Object.keys(route.params)[0]!];
		return routeParam === "create" ? data.length : Number(routeParam);
	};

	/**
	 * Watches for changes on a form model and calls onPatch with new data
	 * @param model Form model
	 * @param onPatch Callback with new data
	 */
	const autoSaveForm = <T extends object>(
		model: Ref<T>,
		onPatch: (state: EcaasState, newData: EcaasForm<T>) => void,
	) => {
		watch(model, async (newData: T, initialData: T) => {
			if (!hasChangedFields(newData, initialData)) {
				return;
			}

			store.$patch((state) => {
				onPatch(state, {
					data: newData,
					complete: false,
				});
			});
		});
	};

	interface AutoSaveElementFormOptions<T> {
		model: Ref<T | undefined>;
		storeData: EcaasForm<EcaasForm<T>[]>;
		defaultName: string;
		onPatch: (state: EcaasState, newData: EcaasForm<T>, index: number) => void;
	}

	/**
	 * Watches for changes on an element form model, creating or updating the store accordingly
	 * @param options
	 */
	const autoSaveElementForm = <T extends object>({
		model,
		storeData,
		defaultName,
		onPatch,
	}: AutoSaveElementFormOptions<T>) => {
		watch(model, async (newData: T | undefined, initialData: T | undefined) => {
			const routeParam = route.params[Object.keys(route.params)[0]!];
			if (initialData === undefined || newData === undefined || routeParam === undefined) {
				return;
			}

			if (!hasChangedFields(newData, initialData)) {
				return;
			}
			
			const index = getStoreIndex(storeData.data);
			if (routeParam === "create") {
				// we're about to save, so set the route parameter to the new index
				// we only expect this to trigger on the first change 
				// (after that, routeParam is no longer "create")
				route.params[Object.keys(route.params)[0]!] = index.toString();

				// change the url to reflect this
				const editItemPath = route.fullPath.replace("create", index.toString());
				history.replaceState({}, "", editItemPath);
			}

			store.$patch((state) => {
				const storeElementData = storeData.data[index]?.data;
				const name = getOrGenerateName(storeData.data, storeElementData, newData, defaultName);

				const elementData: EcaasForm<T> = {
					data: { ...newData, name },
				};

				onPatch(state, elementData, index);
			});
		});
	};

	/**
	 * Checks if there are any properties which have changed, between two objects
	 * @param newData 
	 * @param initialData 
	 * @returns Boolean
	 */
	const hasChangedFields = <T extends object>(newData: T, initialData: T) => {
		const initialDataKeys = Object.keys(initialData) as (keyof typeof initialData)[];
		return initialDataKeys.some(x => initialData[x] !== newData[x]);
	};

	return { saveToList, getStoreIndex, autoSaveForm, autoSaveElementForm };
}

/**
	 * Return the name of this item or generates a unique default name
	 * @returns Name
	 */
export const getOrGenerateName = <T extends object>(allItems: EcaasForm<T>[], storedItem: T | undefined, updatedItem: T, defaultName: string): string => {
	
	const duplicates = allItems.filter(x => {
		if ("name" in x.data && typeof x.data.name === "string") {
			const result = x.data.name.match(duplicateNamePattern(defaultName)); 
			console.log({ result });
			return x.data.name.match(duplicateNamePattern(defaultName));
		}
		return false;
	});
	
	let name = (duplicates.length ? `${defaultName} (${duplicates.length})` : defaultName);

	if ("name" in updatedItem && typeof updatedItem.name === "string") {
		name = updatedItem.name.trim() || name;
	}
	else if (storedItem && "name" in storedItem && typeof storedItem.name === "string") {
		name = storedItem.name.trim() || name;
	}

	return name;
};

