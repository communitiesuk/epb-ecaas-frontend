export const removeTaggedItemReferences = <T extends Record<string, unknown>>(
	sectionItems: EcaasFormList<T>,
	idToRemove: string | undefined,
	keyToCheck: keyof T,
) => {
	const store = useEcaasStore();

	for(const item of sectionItems.data){
		const idOfTaggedItem = (item.data as Partial<T>)[keyToCheck];
		if (idOfTaggedItem === idToRemove) {
			store.$patch(() => {
				(item.data as Partial<T>)[keyToCheck] = undefined;
				item.complete = false;
				sectionItems.complete = false;
			});
		}
	}
};
