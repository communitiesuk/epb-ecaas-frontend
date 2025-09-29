export const removeTaggedItemReference = <T extends Record<string, unknown>>(
	storeItems: EcaasFormList<T>,
	id: string | undefined,
	taggedValue: keyof T,
) => {
	const store = useEcaasStore();

	storeItems.data.forEach((x, index) => {
		const data = x.data as Partial<T>;
		if (data[taggedValue] === id) {
			store.$patch(() => {
				(storeItems.data[index]!.data as Partial<T>)[taggedValue] = undefined;
				storeItems.data[index]!.complete = false;
				storeItems.complete = false;
			});
		}
	});
};
