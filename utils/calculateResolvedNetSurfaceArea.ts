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

export const calculateResolvedNetSurfaceArea = (
  mainItem: EcaasItemWithGrossSurfaceArea,
  sectionsWithTaggedItems: TaggedEcaasItem[][]
): number | undefined => {
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
        if ("surfaceArea" in item) {
          totalTaggedArea += item.surfaceArea;
        } else {
          const height = item["height" as keyof TaggedEcaasItem];
          const width = item["width" as keyof TaggedEcaasItem];

          totalTaggedArea += Number(height) * Number(width);
        }
      }
    }
    return grossSurfaceArea - totalTaggedArea;
  }
};
