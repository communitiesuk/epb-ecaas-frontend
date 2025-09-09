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
	 * Return the index of the item or the index of the last item if the route param is 'create'
	 * @param data Array of EcaasForm objects
	 * @returns Index
	 */
	const getStoreIndex = <T>(data: EcaasForm<T>[]): number => {
		const routeParam = route.params[Object.keys(route.params)[0]!];
		return routeParam === "create" ? data.length - 1 : Number(routeParam);
	};

	/**
	 * Watches for changes on a form model and calls onPatch with new data
	 * @param model Form model
	 * @param onPatch Callback with new data
	 */
	const autoSaveForm = <T extends object>(
		model: Ref<T>,
		onPatch: (state: EcaasState, newData: EcaasForm<T>) => void
	) => {
		watch(model, async (newData: T, initialData: T) => {
			if (!hasChangedFields(newData, initialData)) {
				return;
			}

			store.$patch((state) => {
				onPatch(state, {
					data: newData,
					complete: false
				});
			});
		});
	};

	interface AutoSaveElementFormOptions<T> {
		model: Ref<T | undefined>;
		storeData: EcaasForm<EcaasForm<T>[]>;
		defaultName: string;
		onPatchCreate: (state: EcaasState, newData: EcaasForm<T>) => void;
		onPatchUpdate: (state: EcaasState, newData: EcaasForm<T>, index: number) => void;
	}

	/**
	 * Watches for changes on an element form model, creating or updating the store accordingly
	 * @param options
	 */
	const autoSaveElementForm = <T extends object>({
		model,
		storeData,
		defaultName,
		onPatchCreate,
		onPatchUpdate
	}: AutoSaveElementFormOptions<T>) => {
		watch(model, async (newData: T | undefined, initialData: T | undefined) => {
			const routeParam = route.params[Object.keys(route.params)[0]!];

			if (initialData === undefined || newData === undefined || routeParam === undefined) {
				return;
			}

			const duplicates = storeData.data.filter(x => {
				if ("name" in x.data && typeof x.data.name === "string") {
					return x.data.name.match(duplicateNamePattern(defaultName));
				}
				
				return false;
			});

			const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
				Object.values(newData).some(x => x !== undefined);
				
			if (routeParam === "create" && isFirstEdit) {
			
				const name = "name" in newData && typeof newData.name === "string" && newData.name.trim() ||
					(duplicates.length ? `${defaultName} (${duplicates.length})` : defaultName);
			
				store.$patch(state => {
					const elementData: EcaasForm<T> = {
						data: { ...newData, name }
					};

					onPatchCreate(state, elementData);
				});

				return;
			}

			store.$patch((state) => {
				if (!hasChangedFields(newData, initialData)) {
					return;
				}

				const index = getStoreIndex(storeData.data);
				const storeElementData = storeData.data[index]?.data;
				let name: string = defaultName;

				if ("name" in newData && typeof newData.name === "string") {
					name = newData.name.trim() || defaultName;
				}
				else if (storeElementData && "name" in storeElementData && typeof storeElementData.name === "string") {
					name = storeElementData.name.trim() || defaultName;
				}

				const elementData: EcaasForm<T> = {
					data: { ...newData, name }
				};

				onPatchUpdate(state, elementData, index);
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
