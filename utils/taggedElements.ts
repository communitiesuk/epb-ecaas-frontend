type EcaasSectionWithTagging =
	| WindowData
	| ExternalWallData
	| InternalWallData
	| WallsToUnheatedSpaceData
	| PartyWallData
	| RoofData
	| CeilingData;

export function getInheritedPitchAndOrientation(
	sections: EcaasSectionWithTagging[][],
	id: string,
): { pitch: number, orientation: number } | undefined {
	const item = getResolvedTaggedItem(sections, id);
	if (!item) {
		return undefined;
	}

	const pitch = extractPitch(item);

	let orientation: number;

	const itemOrientation = item.orientation;

	if (typeof itemOrientation === "undefined") {
		if (pitch === 180 || pitch === 0) {
			orientation = 0; // pitch is flat so orientation makes no difference to solar incidence
		} else {
			return undefined;
		}
	} else {
		orientation = itemOrientation;
	}
	
	return { pitch, orientation };
}

export function getInheritedPitch(
	sections: EcaasSectionWithTagging[][],
	id: string): number | undefined {
	const item = getResolvedTaggedItem(sections, id);
	if (!item) {
		return undefined;
	}

	return extractPitch(item);
}

export const getResolvedTaggedItem = (
	sections: EcaasSectionWithTagging[][],
	id: string,
): AssociatedItemValues | undefined => {
	const topLevelTaggedItem = getResolvedTopLevelTaggedItem(sections, id);
	
	if (topLevelTaggedItem) return topLevelTaggedItem;

	const nestedTaggedItem = getResolvedNestedTaggedItem(sections, id);
	if (nestedTaggedItem && "associatedItemId" in nestedTaggedItem && nestedTaggedItem.associatedItemId && typeof nestedTaggedItem.associatedItemId === "string") {
		return getResolvedTaggedItem(sections, nestedTaggedItem.associatedItemId);
	}
};

function extractResolvedSectionItems<T extends Record<string, unknown>>(
	section: T[],
): AssociatedItemValues[] {
	return (
		section?.map((x) => {
			return {
				id: x.id!,
				pitch: x.pitchOption === undefined ? x.pitch : extractPitch(x),
				...("orientation" in x && { orientation: x.orientation }),
			} as AssociatedItemValues;
		}) ?? []
	);
}

function getResolvedTopLevelTaggedItem(
	sections: EcaasSectionWithTagging[][],
	id: string | undefined,
): AssociatedItemValues | undefined {
	const items: AssociatedItemValues[][] = [];
	const sectionsWithoutNestedTaggedItems = sections?.filter(
		(s) => s !== undefined && s.some((x) => !("associatedItemId" in x) || x.associatedItemId === "none"),
	);

	for (const section of sectionsWithoutNestedTaggedItems) {
		items.push(extractResolvedSectionItems(section));
	}
	const taggedItem = items.flat().find((item) => item.id === id);
	return taggedItem;
}


function getResolvedNestedTaggedItem(
	sections: EcaasSectionWithTagging[][],
	id: string | undefined,
) {
	const sectionsWithNestedTaggedItems = sections.filter(
		(s) => s !== undefined && s.some((x) => "associatedItemId" in x),
	);
	for (const section of sectionsWithNestedTaggedItems) {
		const taggedItem = section.find((x) => "id" in x && x.id === id);

		if (taggedItem) {
			return taggedItem;
		}
	}
}
