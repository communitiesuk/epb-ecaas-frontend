export const calculateResolvedNetSurfaceArea = (
	mainItem: EcaasTagItem,
	sectionsWithTaggedItems: EcaasTaggedItem[][],
): number | undefined => {
	const grossSurfaceArea = mainItem.grossSurfaceArea;
	let totalTaggedArea = 0;

	const taggedItems = sectionsWithTaggedItems
		.filter((section) => section && section.length > 0)
		.flat();

	if (taggedItems.length) {
		for (const item of taggedItems) {
			if (
				item["associatedItemId" as keyof EcaasTaggedItem] === mainItem.id ||
        item["taggedItem" as keyof EcaasTaggedItem] === mainItem.id
			) {
				totalTaggedArea += getAreaOfResolvedItem(item);
			}
		}
		return grossSurfaceArea - totalTaggedArea;
	}
};

const getAreaOfResolvedItem = (item: EcaasTaggedItem) => {
	if ("surfaceArea" in item) {
		return item.surfaceArea;
	} else {
		const height = item["height" as keyof EcaasTaggedItem];
		const width = item["width" as keyof EcaasTaggedItem];

		return Number(height) * Number(width);
	}
};
