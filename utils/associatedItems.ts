
export const getAssociatedItem = <T extends Array<Record<string, unknown>>>(sections: T[], id: string): AssociatedItemValues | undefined => {
	const items: AssociatedItemValues[][] = [];
	const topLevelSections = sections?.filter(s => s !== undefined && s.some(x => !("taggedItem" in x)));

	for (const section of sections) {
		const nestedTaggedItems = section?.filter(x => "taggedItem" in x) ?? [];

		if (nestedTaggedItems.length) {
			for (const nestedTaggedItem of nestedTaggedItems) {
				const taggedItem = getAssociatedItem(topLevelSections, nestedTaggedItem.taggedItem as string);

				if (taggedItem) {
					return taggedItem;
				}
			}

			continue;
		}

		items.push(extractResolvedSectionItems(section));
	}

	return items.flat().find((item) => item.id === id);
};