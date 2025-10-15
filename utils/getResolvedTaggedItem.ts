type EcaasSectionWithTagging =
  | WindowData
  | ExternalWallData
  | InternalWallData
  | RoofData
  | CeilingData;

export const getResolvedTaggedItem = (
	sections: EcaasSectionWithTagging[][],
	id: string,
): AssociatedItemValues | undefined => {
	const topLevelTaggedItem = getResolvedTopLevelTaggedItem(sections, id);
	if (topLevelTaggedItem) return topLevelTaggedItem;

	const nestedTaggedItem = getResolvedNestedTaggedItem(sections, id);
	if (nestedTaggedItem && "taggedItem" in nestedTaggedItem) {
		return getResolvedTaggedItem(sections, nestedTaggedItem.taggedItem);
	}
};

export const getResolvedTopLevelTaggedItem = (
	sections: EcaasSectionWithTagging[][],
	id: string | undefined,
): AssociatedItemValues | undefined => {
	const items: AssociatedItemValues[][] = [];
	const sectionsWithoutNestedTaggedItems = sections?.filter(
		(s) => s !== undefined && s.some((x) => !("taggedItem" in x)),
	);
	
	for (const section of sectionsWithoutNestedTaggedItems) {
		items.push(extractResolvedSectionItems(section));
	}
	const taggedItem = items.flat().find((item) => item.id === id);
	return taggedItem;
};

export const extractResolvedSectionItems = <T extends Record<string, unknown>>(
	section: T[],
): AssociatedItemValues[] => {
	return (
		section?.map((x) => {
			return {
				id: x.id!,
				pitch: x.pitchOption === undefined ? x.pitch : extractPitch(x),
				...("orientation" in x && { orientation: x.orientation }),
			} as AssociatedItemValues;
		}) ?? []
	);
};

export const getResolvedNestedTaggedItem = (
	sections: EcaasSectionWithTagging[][],
	id: string | undefined,
) => {
	const sectionsWithNestedTaggedItems = sections.filter(
		(s) => s !== undefined && s.some((x) => "taggedItem" in x),
	);
	for (const section of sectionsWithNestedTaggedItems) {
		const taggedItem = section.find((x) => "id" in x && x.id === id);

		if (taggedItem) {
			return taggedItem;
		}
	}
};
