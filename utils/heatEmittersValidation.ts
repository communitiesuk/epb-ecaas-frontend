import type { WetDistributionEmitterData } from "~/stores/ecaasStore.schema";

export const getIncompleteEmitterErrors = (
	emitter: Partial<WetDistributionEmitterData>,
) => {
	const errors: string[] = [];

	if (!emitter.name) {
		errors.push("Name is required.");
	}

	switch (emitter.typeOfHeatEmitter) {
		case "radiator":
			if (!emitter.productReference) {
				errors.push("Product reference is required.");
			}
			if (!emitter.length) {
				errors.push("Length of radiator is required.");
			}
			if (!emitter.numOfRadiators) {
				errors.push("Number of radiators is required.");
			}
			break;

		case "fanCoil":
			if (!emitter.productReference) {
				errors.push("Product reference is required.");
			}
			if (!emitter.numOfFanCoils) {
				errors.push("Number of fan coils is required.");
			}
			break;

		case "underFloorHeating":
			if (!emitter.productReference) {
				errors.push("Product reference is required.");
			}
			if (!emitter.areaOfUnderFloorHeating) {
				errors.push("Area of underfloor heating is required.");
			}
			break;
	}

	return errors;
};