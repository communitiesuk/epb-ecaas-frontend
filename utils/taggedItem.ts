export const extractSectionItems = <T extends Record<string, unknown>>(
	section: EcaasFormList<T>,
): AssociatedItemValues[] => {
	return section.data.map((x) => {
		const item = x.data as Partial<T>;

		return {
			id: item.id!,
			pitch: item.pitchOption === undefined ? item.pitch : extractPitch(item),
			...("orientation" in item && { orientation: item.orientation }),
		} as AssociatedItemValues;
	}) ?? [];
};

export const getTopLevelTaggedItem = <T extends Record<string, unknown>>(sections: EcaasFormList<T>[], id: string | undefined) :AssociatedItemValues | undefined => {
	const items: AssociatedItemValues[][] = [];
	const sectionsWithoutNestedTaggedItems = sections.filter(s => s.data !== undefined && s.data.some(x => !("taggedItem" in x.data)));
  
	for (const section of sectionsWithoutNestedTaggedItems){
		items.push(extractSectionItems(section));
	}
	const taggedItem = items.flat().find((item) => item.id === id);
	return taggedItem;
};

export const getNestedTaggedItem = <T extends Record<string, unknown>>(sections: EcaasFormList<T>[], id: string | undefined) => {
	const sectionsWithNestedTaggedItems = sections.filter(s => s.data !== undefined && s.data.some(x => "taggedItem" in x.data));
	for (const section of sectionsWithNestedTaggedItems){
		const taggedItem = section.data.find(x => "id" in x.data && x.data.id === id);
    
		if (taggedItem){
			return taggedItem.data;
		}
	}
};
