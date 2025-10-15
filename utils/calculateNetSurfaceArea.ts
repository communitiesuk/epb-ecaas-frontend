export type EcaasItemWithGrossSurfaceArea =
  | ExternalWallData
  | InternalWallData
  | WallsToUnheatedSpaceData
  | PartyWallData
  | RoofData
  | CeilingData;

type TaggedEcaasItem =
  | WindowData
  | InternalDoorData
  | ExternalGlazedDoorData
  | ExternalUnglazedDoorData;

export const calculateNetSurfaceArea = (
	mainItem: EcaasItemWithGrossSurfaceArea,
	sectionsWithTaggedItems: TaggedEcaasItem[][]) : number | undefined => {
	const grossSurfaceArea = mainItem.grossSurfaceArea;
	let totalTaggedArea = 0;

	const taggedItems = sectionsWithTaggedItems
		.filter((section) => section && section.length > 0)
		.flat();

	if (taggedItems.length) {
		for (const item of taggedItems) {
			if (
				item["associatedItemId" as keyof TaggedEcaasItem] === mainItem.id ||
        item["taggedItem" as keyof TaggedEcaasItem] === mainItem.id
			) {
				totalTaggedArea += item.surfaceArea;
			}
		}
		return grossSurfaceArea - totalTaggedArea;
	}
};
