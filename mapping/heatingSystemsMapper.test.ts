import { FuelType } from "~/schema/api-schema.types";
import { mapEnergySupplyData, mapHeatEmittingData } from "./heatingSystemsMapper";
import type { FhsInputSchema } from "./fhsInputMapper";
import { defaultZoneName } from "./common";

const baseForm = {
	data: [],
	complete: true,
};

describe("heating systems mapper", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("maps energy supplies that include gas only", () => {
		// Arrange
		const energySupplyData: EnergySupplyData = {
			fuelType: [FuelType.mains_gas],
		};

		store.$patch({
			heatingSystems: {
				energySupply: {
					...baseForm,
					data: energySupplyData,
				}
			}
		});

		// Act
		const result = mapEnergySupplyData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'EnergySupply'> = {
			EnergySupply: {
				mains_gas: {
					fuel: FuelType.mains_gas,
				}
			},
		};

		expect(result).toEqual(expectedResult);
	});

	it("maps energy supplies that include exported electricity", () => {
		// Arrange
		const energySupplyData: EnergySupplyData = {
			fuelType: [FuelType.mains_gas, FuelType.electricity],
			exported: true
		};

		store.$patch({
			heatingSystems: {
				energySupply: {
					...baseForm,
					data: energySupplyData,
				}
			}
		});

		// Act
		const result = mapEnergySupplyData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'EnergySupply'> = {
			EnergySupply: {
				mains_gas: {
					fuel: FuelType.mains_gas,
				},
				'mains elec': {
					fuel: FuelType.electricity,
					is_export_capable: true
				}
			},
		};

		expect(result).toEqual(expectedResult); 
	});

	it("maps energy supplies that include electricity and custom fuel types", () => {
		// Arrange
		const energySupplyData: EnergySupplyData = {
			fuelType: [FuelType.electricity, FuelType.custom, FuelType.mains_gas],
			exported: true,
			co2PerKwh: 3.2,
			co2PerKwhIncludingOutOfScope: 4.8,
			kwhPerKwhDelivered: 1.0,
		};

		store.$patch({
			heatingSystems: {
				energySupply: {
					...baseForm,
					data: energySupplyData,
				}
			}
		});

		// Act
		const result = mapEnergySupplyData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'EnergySupply'> = {
			EnergySupply: {
				'mains elec': {
					fuel: FuelType.electricity,
					is_export_capable: true
				},
				custom: {
					fuel: FuelType.custom,
					factor: {
						"Emissions Factor kgCO2e/kWh": 3.2,
						"Emissions Factor kgCO2e/kWh including out-of-scope emissions": 4.8,
						"Primary Energy Factor kWh/kWh delivered": 1.0,
					}
				},
				mains_gas: {
					fuel: FuelType.mains_gas,
				}
			},
		};

		expect(result).toEqual(expectedResult);
	});

	it("maps heat emitters with wet distribution (radiator only)", () => {
		// Arrange
		const heatEmitting: HeatEmitting = {
			wetDistribution: {
				...baseForm,
				data: [
					{
						name: "Radiators",
						heatSource: "Acme heat pump",
						thermalMass: 400,
						designTempDiffAcrossEmitters: 4,
						designFlowTemp: 35,
						designFlowRate: 4,
						ecoDesignControllerClass: '2',
						minimumFlowTemp: 30,
						minOutdoorTemp: -5,
						maxOutdoorTemp: 32,
						typeOfSpaceHeater: "radiator",
						convectionFractionWet: 0.7,
						exponent: 1.3,
						constant: 0.08,
						numberOfRadiators: 2,
					}
				]
			},
			instantElectricHeater: { ...baseForm },
			electricStorageHeater: { ...baseForm },
			warmAirHeatPump: { ...baseForm }
		};

		store.$patch({
			heatingSystems: {
				heatEmitting
			}
		});

		// Act
		const result = mapHeatEmittingData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'SpaceHeatSystem'> = {
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
					Zone: defaultZoneName
				}
			}
		};

		expect(result).toEqual(expectedResult);
	});

	it("maps heat emitters with wet distribution (ufh only)", () => {
		// Arrange
		const heatEmitting: HeatEmitting = {
			wetDistribution: {
				...baseForm,
				data: [
					{
						name: "Under floor heating",
						heatSource: "Acme heat pump",
						thermalMass: 400,
						designTempDiffAcrossEmitters: 4,
						designFlowTemp: 35,
						designFlowRate: 4,
						ecoDesignControllerClass: '2',
						minimumFlowTemp: 30,
						minOutdoorTemp: -5,
						maxOutdoorTemp: 32,
						typeOfSpaceHeater: "ufh",
						emitterFloorArea: 1.5,
						equivalentThermalMass: 80,
						systemPerformanceFactor: 5,
						convectionFractionWet: 0.7,
					}
				]
			},
			instantElectricHeater: { ...baseForm },
			electricStorageHeater: { ...baseForm },
			warmAirHeatPump: { ...baseForm }
		};

		store.$patch({
			heatingSystems: {
				heatEmitting
			}
		});

		// Act
		const result = mapHeatEmittingData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'SpaceHeatSystem'> = {
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
					Zone: defaultZoneName
				}
			}
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
						name: "Acme instant electric heater",
						ratedPower: 100,
						convectionFractionInstant: 0.8,
					}
				]
			},
			electricStorageHeater: { ...baseForm },
			warmAirHeatPump: { ...baseForm }
		};

		store.$patch({
			heatingSystems: {
				heatEmitting
			}
		});

		// Act
		const result = mapHeatEmittingData(resolveState(store.$state));

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'SpaceHeatSystem'> = {
			SpaceHeatSystem: {
				"Acme instant electric heater": {
					type: "InstantElecHeater",
					rated_power: 100,
					frac_convective: 0.8,
					EnergySupply: 'mains elec'
				}
			}
		};
		expect(result).toEqual(expectedResult);
	});
});