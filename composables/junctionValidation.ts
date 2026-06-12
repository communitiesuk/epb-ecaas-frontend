
export function useJunctionValidation(): boolean {
	const store = useEcaasStore();

	const { dwellingSpaceGroundFloor, dwellingSpaceFloorAboveUnheatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
	const linearThermalBridges = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data;

	const validateJunctions = (type: "E5" | "E6", data: EcaasForm<GroundFloorData | FloorAboveUnheatedBasementData>[]) => {
		const groupedByAssociatedItem = Object.groupBy(linearThermalBridges, x => {
			const bridge = x.data as LinearThermalBridgeData;
			
			if (bridge.typeOfThermalBridge === type) {
				return bridge.associatedItemId;
			}

			return "ungrouped";
		});

		const associatedItemIds = Object.keys(groupedByAssociatedItem);

		if (associatedItemIds.some(x => x === "undefined")) {
			return false;
		}

		return associatedItemIds
			.filter(x => x !== "ungrouped")
			.every(associatedItemId => {
				const associatedFloor = data.find(x => x.data.id === associatedItemId);

				const totalLength = groupedByAssociatedItem[associatedItemId]?.map(x => x.data.length)
					.reduce((acc, curr) => (acc ?? 0) + (curr ?? 0), 0);

				return (totalLength ?? 0) <= (associatedFloor?.data.perimeter ?? 0);
			});
	};

	return [
		validateJunctions("E5", dwellingSpaceGroundFloor.data as EcaasForm<GroundFloorData>[]),
		validateJunctions("E6", dwellingSpaceFloorAboveUnheatedBasement.data as EcaasForm<FloorAboveUnheatedBasementData>[]),
	].every(isValid => isValid);
}