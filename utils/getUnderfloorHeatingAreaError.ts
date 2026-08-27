

export const getTotalFloorArea = (floors: FloorsData) => {
	return (
		(floors.dwellingSpaceGroundFloor?.data ?? []).reduce(
			(total, floor) => total + (floor.data.surfaceArea ?? 0),
			0,
		) +
		(floors.dwellingSpaceFloorAboveUnheatedBasement?.data ?? []).reduce(
			(total, floor) => total + (floor.data.surfaceArea ?? 0),
			0,
		) +
		(floors.dwellingSpaceExposedFloor?.data ?? []).reduce(
			(total, floor) => total + (floor.data.surfaceArea ?? 0),
			0,
		) +
		(floors.dwellingSpaceFloorOfHeatedBasement?.data ?? []).reduce(
			(total, floor) => total + (floor.data.netSurfaceArea ?? 0),
			0,
		) +
		(floors.dwellingSpaceInternalFloor?.data ?? []).reduce(
			(total, floor) => total + (floor.data.surfaceAreaOfElement ?? 0),
			0,
		)
	);
};

export const getUnderfloorHeatingArea = (
	heatEmitters: SpaceHeating["heatEmitters"]["data"],
) => {
	return heatEmitters.reduce((total, heatEmitter) => {
		const data = heatEmitter.data;

		if (
			data.typeOfHeatEmitter !== "wetDistributionSystem" ||
			!("emitters" in data)
		) {
			return total;
		}

		return total + (data.emitters ?? []).reduce(
			(emitterTotal, emitter) => {
				if (emitter.typeOfHeatEmitter !== "underFloorHeating") {
					return emitterTotal;
				}

				return emitterTotal + (emitter.areaOfUnderFloorHeating ?? 0);
			},
			0,
		);
	}, 0);
};

export const getUnderfloorHeatingAreaError = (
	floors: FloorsData,
	heatEmitters: SpaceHeating["heatEmitters"]["data"],
) => {
	const totalFloorArea = getTotalFloorArea(floors);
	const underfloorHeatingArea = getUnderfloorHeatingArea(heatEmitters);

	if (underfloorHeatingArea > totalFloorArea) {
		return {
			id: "underfloorHeatingAreaError",
			detail: "The area of underfloor heating is larger than the floor area",
		};
	}

	return undefined;
};