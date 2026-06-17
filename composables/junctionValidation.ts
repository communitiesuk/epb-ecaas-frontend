
export function useJunctionValidation() {
	const store = useEcaasStore();
	const errors: string[] = [];

	const { dwellingSpaceGroundFloor, dwellingSpaceFloorAboveUnheatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
	const linearThermalBridges = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data;

	const validateJunctions = (data: EcaasForm<GroundFloorData | FloorAboveUnheatedBasementData>[], type: "E5" | "E6") => {
		data.forEach(floor => {
			const thermalBridging = linearThermalBridges.filter(x => {
				const bridge = x.data as LinearThermalBridgeData;

				return bridge.typeOfThermalBridge === type && 
					(type === "E6" ? (bridge.associatedItemId === floor.data.id || bridge.associatedItemId === "none") :
						bridge.associatedItemId === floor.data.id);
			});

			if (!thermalBridging.length) {
				errors.push(`You must add an ${type} junction associated with the element ${floor.data.name}`);
				return;
			}

			const totalLength = thermalBridging.map(x => x.data.length).reduce((acc, curr) => (acc ?? 0) + (curr ?? 0), 0);

			if ((totalLength ?? 0) > (floor.data.perimeter ?? 0)) {
				errors.push(`The total lengths of all the thermal bridges associated with ${floor.data.name} are longer than the perimeter of the element itself.`);
			}
		});
	};

	validateJunctions(dwellingSpaceGroundFloor.data as EcaasForm<GroundFloorData>[], "E5");
	validateJunctions(dwellingSpaceFloorAboveUnheatedBasement.data as EcaasForm<FloorAboveUnheatedBasementData>[], "E6");

	return { errors };
}