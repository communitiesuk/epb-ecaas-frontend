import type { EcaasForm, EcaasFormList, PartialExceptName } from "~/stores/ecaasStore.schema";

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
				} as EcaasForm<T>);
			});
		});
	};

	/**
	 * Watches for changes on an element form model, creating or updating the store accordingly
	 * @param options
	 */
	const autoSaveElementForm = <T extends { name: string }>({
		model,
		storeData,
		defaultName,
		onPatch,
	}: AutoSaveElementFormOptions<T>) => {
		watch(model, async (newData: PartialExceptName<T> | undefined, initialData: PartialExceptName<T> | undefined) => {
			const routeParam = route.params[Object.keys(route.params)[0]!];
			if (initialData === undefined || newData === undefined || routeParam === undefined) {
				return;
			}

			if (!hasChangedFields(newData, initialData)) {
				return;
			}
			
			const index = getStoreIndex(storeData.data as EcaasForm<T>[]);
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
				const name = getName(newData, defaultName);
				const dataToPatch: PartialExceptName<T> = { ...newData, name };

				const elementData: EcaasForm<T> = {
					data: dataToPatch as T,
				};

				onPatch(state, elementData, index);
			});
		});
	};

	return { saveToList, getStoreIndex, autoSaveForm, autoSaveElementForm };
}

/**
	 * Checks if there are any properties which have changed, between two objects
	 * @param newData 
	 * @param initialData 
	 * @returns Boolean
	 */
export const hasChangedFields = <T extends object>(newData: T, initialData: T) => {
	const initialDataKeys = Object.keys(initialData) as (keyof typeof initialData)[];
	return initialDataKeys.some(x => initialData[x] !== newData[x]);
};

export interface AutoSaveElementFormOptions<T extends { name: string }> {
	model: Ref<PartialExceptName<T> | undefined>;
	storeData: EcaasFormList<T>;
	defaultName: string;
	onPatch: (state: EcaasState, newData: EcaasForm<T>, index: number) => void;
}

/**
	 * Return the name of this item or default name
	 * @returns Name
	 */
export const getName = <T extends object>(updatedItem: T, defaultName: string): string => {
	
	if ("name" in updatedItem && typeof updatedItem.name === "string") {
		return updatedItem.name.trim() || defaultName;
	}

	return defaultName;
};