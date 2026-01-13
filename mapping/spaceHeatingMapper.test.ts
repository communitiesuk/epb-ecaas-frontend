import { mapGeneralData, mapHeatEmittingData } from "./spaceHeatingMapper";

import type { FhsInputSchema } from "./fhsInputMapper";
import { defaultZoneName } from "./common";

const baseForm = {
	data: [],
	complete: true as const,
};

describe("general", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("maps general heating", () => {
		const generalData: GeneralSpaceHeating = {
			heatingControlType: "separateTemperatureControl",
			coolingRequired: true,
		};

		store.$patch({
			spaceHeating: {
				general: {
					...baseForm,
					data: generalData,
				},
			},
		});

		const result = mapGeneralData(resolveState(store.$state));

		const expectedResult: Pick<FhsInputSchema, "HeatingControlType" | "PartO_active_cooling_required"> = {
			HeatingControlType: "SeparateTempControl",
			PartO_active_cooling_required: true,
		};

		expect(result).toEqual(expectedResult);
	});
});

describe("heat emitting mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("maps heat emitters with wet distribution (radiator only)", () => {
		// Arrange
		const heatPump: HeatPumpData = {
			id: "some-heat-pump-id",
			name: "Acme heat pump",
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-LARGE",
		};

		const heatEmitting: HeatEmitting = {
			wetDistribution: {
				...baseForm,
				data: [
					{
						...baseForm,
						data: {
							name: "Radiators",
							heatSource: "some-heat-pump-id",
							thermalMass: 400,
							designTempDiffAcrossEmitters: 4,
							designFlowTemp: 35,
							designFlowRate: 4,
							ecoDesignControllerClass: "2",
							minimumFlowTemp: 30,
							minOutdoorTemp: -5,
							maxOutdoorTemp: 32,
							typeOfSpaceHeater: "radiator",
							convectionFractionWet: 0.7,
							exponent: 1.3,
							constant: 0.08,
							numberOfRadiators: 2,
						},
					},
				],
			},
			instantElectricHeater: { ...baseForm },
			electricStorageHeater: { ...baseForm },
			warmAirHeatPump: { ...baseForm },
		};

		store.$patch({
			spaceHeating: {
				heatGeneration: {
					heatPump: {
						...baseForm,
						data: [{
							...baseForm,
							data: heatPump,
						}],
					},
				},
				heatEmitting,
			},
		});

		// Act
		const result = mapHeatEmittingData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, "SpaceHeatSystem"> = {
			SpaceHeatSystem: {
				"Radiators": {
					HeatSource: {
						name: "Acme heat pump",
						temp_flow_limit_upper: 65,
					},
					design_flow_temp: 35,
					design_flow_rate: 4,
					emitters: [{
						wet_emitter_type: "radiator",
						frac_convective: 0.7,
						c: 0.08,
						n: 1.3,
					}, {
						wet_emitter_type: "radiator",
						frac_convective: 0.7,
						c: 0.08,
						n: 1.3,
					}],
					ecodesign_controller: {
						ecodesign_control_class: 2,
						min_flow_temp: 30,
						min_outdoor_temp: -5,
						max_outdoor_temp: 32,
					},
					temp_diff_emit_dsgn: 4,
					thermal_mass: 400,
					type: "WetDistribution",
					Zone: defaultZoneName,
					variable_flow: false,
				},
			},
		};

		expect(result).toEqual(expectedResult);
	});

	it("maps heat emitters with wet distribution (ufh only)", () => {
		// Arrange
		const heatPump: HeatPumpData = {
			id: "some-heat-pump-id",
			name: "Acme heat pump",
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-SMALL",
		};

		const heatEmitting: HeatEmitting = {
			wetDistribution: {
				...baseForm,
				data: [
					{
						...baseForm,
						data: {
							name: "Under floor heating",
							heatSource: "some-heat-pump-id",
							thermalMass: 400,
							designTempDiffAcrossEmitters: 4,
							designFlowTemp: 35,
							designFlowRate: 4,
							ecoDesignControllerClass: "2",
							minimumFlowTemp: 30,
							minOutdoorTemp: -5,
							maxOutdoorTemp: 32,
							typeOfSpaceHeater: "ufh",
							emitterFloorArea: 1.5,
							equivalentThermalMass: 80,
							systemPerformanceFactor: 5,
							convectionFractionWet: 0.7,
						},
					},
				],
			},
			instantElectricHeater: { ...baseForm },
			electricStorageHeater: { ...baseForm },
			warmAirHeatPump: { ...baseForm },
		};

		store.$patch({
			spaceHeating: {
				heatGeneration: {
					heatPump: {
						...baseForm,
						data: [{
							...baseForm,
							data: heatPump,
						}],
					},
				},
				heatEmitting,
			},
		});

		// Act
		const result = mapHeatEmittingData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, "SpaceHeatSystem"> = {
			SpaceHeatSystem: {
				"Under floor heating": {
					HeatSource: {
						name: "Acme heat pump",
						temp_flow_limit_upper: 65,
					},
					design_flow_temp: 35,
					design_flow_rate: 4,
					ecodesign_controller: {
						ecodesign_control_class: 2,
						min_flow_temp: 30,
						min_outdoor_temp: -5,
						max_outdoor_temp: 32,
					},
					emitters: [{
						wet_emitter_type: "ufh",
						emitter_floor_area: 1.5,
						system_performance_factor: 5,
						equivalent_specific_thermal_mass: 80,
						frac_convective: 0.7,
					}],
					temp_diff_emit_dsgn: 4,
					thermal_mass: 400,
					type: "WetDistribution",
					Zone: defaultZoneName,
					variable_flow: false,
				},
			},
		};

		expect(result).toEqual(expectedResult);
	});

	it("maps instant electric heaters", () => {
		// Arrange
		const heatEmitting: HeatEmitting = {
			wetDistribution: { ...baseForm },
			instantElectricHeater: {
				...baseForm,
				data: [
					{
						...baseForm,
						data: {
							name: "Acme instant electric heater",
							ratedPower: 100,
							convectiveType: "Air heating (convectors, fan coils etc.)",
						},
					},
				],
			},
			electricStorageHeater: { ...baseForm },
			warmAirHeatPump: { ...baseForm },
		};

		store.$patch({
			spaceHeating: {
				heatEmitting,
			},
		});

		// Act
		const result = mapHeatEmittingData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, "SpaceHeatSystem"> = {
			SpaceHeatSystem: {
				"Acme instant electric heater": {
					type: "InstantElecHeater",
					rated_power: 100,
					convective_type: "Air heating (convectors, fan coils etc.)",
					EnergySupply: "mains elec",
				},
			},
		};
		expect(result).toEqual(expectedResult);
	});
});