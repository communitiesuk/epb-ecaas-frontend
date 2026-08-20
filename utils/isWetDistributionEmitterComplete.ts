const hasValue = (value: unknown) =>
	value !== undefined &&
	value !== null &&
	value !== "";

export const isWetDistributionEmitterComplete = (
	emitter: Partial<WetDistributionEmitterData>,
): boolean => {
	if (!hasValue(emitter.typeOfHeatEmitter) || !hasValue(emitter.name)) {
		return false;
	}

	switch (emitter.typeOfHeatEmitter) {
		case "radiator":
			return (
				hasValue(emitter.productReference) &&
				hasValue(emitter.length) &&
				hasValue(emitter.numOfRadiators)
			);

		case "fanCoil":
			return (
				hasValue(emitter.productReference) &&
				hasValue(emitter.numOfFanCoils)
			);

		case "underFloorHeating":
			return (
				hasValue(emitter.productReference) &&
				hasValue(emitter.areaOfUnderFloorHeating)
			);

		default:
			return false;
	}
};