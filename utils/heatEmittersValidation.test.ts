import { describe, expect, test } from "vitest";
import type { WetDistributionEmitterData } from "~/stores/ecaasStore.schema";

describe("getIncompleteEmitterErrors", () => {
	test("returns no errors for a complete radiator", () => {
		const emitter: WetDistributionEmitterData = {
			id: "radiator-1",
			name: "Living room radiator",
			typeOfHeatEmitter: "radiator",
			productReference: "radiator-product",
			length: {
				amount: 1000,
				unit: "millimetres",
			},
			numOfRadiators: 2,
		};

		expect(getIncompleteEmitterErrors(emitter)).toEqual([]);
	});

	test("returns all missing errors for an incomplete radiator", () => {
		const emitter: Partial<WetDistributionEmitterData> = {
			id: "radiator-1",
			name: "",
			typeOfHeatEmitter: "radiator",
			productReference: "",
		};

		expect(
			getIncompleteEmitterErrors(emitter)).toEqual([
			"Name is required.",
			"Product reference is required.",
			"Length of radiator is required.",
			"Number of radiators is required.",
		]);
	});

	test("returns only the missing radiator fields", () => {
		const emitter: Partial<WetDistributionEmitterData> = {
			id: "radiator-1",
			name: "Living room radiator",
			typeOfHeatEmitter: "radiator",
			productReference: "radiator-product",
			length: undefined,
			numOfRadiators: 2,
		};

		expect(
			getIncompleteEmitterErrors(emitter),
		).toEqual(["Length of radiator is required."]);
	});

	test("returns all missing errors for an incomplete fan coil", () => {
		const emitter: Partial<WetDistributionEmitterData> = {
			id: "fan-coil-1",
			name: "",
			typeOfHeatEmitter: "fanCoil",
			productReference: "",
			numOfFanCoils: undefined,
		};

		expect(
			getIncompleteEmitterErrors(emitter)).toEqual([
			"Name is required.",
			"Product reference is required.",
			"Number of fan coils is required.",
		]);
	});

	test("returns no errors for a complete fan coil", () => {
		const emitter: WetDistributionEmitterData = {
			id: "fan-coil-1",
			name: "Living room fan coil",
			typeOfHeatEmitter: "fanCoil",
			productReference: "fan-coil-product",
			numOfFanCoils: 2,
		};

		expect(getIncompleteEmitterErrors(emitter)).toEqual([]);
	});

	test("returns all missing errors for incomplete underfloor heating", () => {
		const emitter: Partial<WetDistributionEmitterData> = {
			id: "ufh-1",
			name: "",
			typeOfHeatEmitter: "underFloorHeating",
			productReference: "",
			areaOfUnderFloorHeating: undefined,
		};

		expect(
			getIncompleteEmitterErrors(emitter)).toEqual([
			"Name is required.",
			"Product reference is required.",
			"Area of underfloor heating is required.",
		]);
	});

	test("returns no errors for complete underfloor heating", () => {
		const emitter: WetDistributionEmitterData = {
			id: "ufh-1",
			name: "Downstairs underfloor heating",
			typeOfHeatEmitter: "underFloorHeating",
			productReference: "ufh-product",
			areaOfUnderFloorHeating: 50,
		};

		expect(getIncompleteEmitterErrors(emitter)).toEqual([]);
	});
});