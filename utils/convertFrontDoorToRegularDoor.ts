export function convertFrontDoorToRegularDoor(doors: EcaasForm<ExternalGlazedDoorData | ExternalUnglazedDoorData | InternalDoorData>[], currentSection: EcaasForm<RoofData | ExternalWallData | InternalWallData | PartyWallData | WallsToUnheatedSpaceData>[], index: number) {
	for (const door of doors) {
		const currentItemId = currentSection[index]?.data.id;
		if (door.data.associatedItemId === currentItemId) {
			door.complete = false;
			door.data.isTheFrontDoor = undefined;
			if ("orientation" in door.data) {
				door.data.orientation = undefined;
			}
		}
	}
}