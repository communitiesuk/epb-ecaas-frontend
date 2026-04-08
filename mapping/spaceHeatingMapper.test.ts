import {
	mapBoilers,
	mapHeatBatteries,
	mapHeatPumps,
	mapElectricStorageHeaters,
	mapWarmAirHeater,
	mapInstantElectricHeaters,
	mapWetDistributions,
	mapSpaceHeatSystem,
} from "./spaceHeatingMapper";
import type { SchemaHeatSourceWetHeatPump, SchemaWetDistribution } from "../schema/api-schema.types";
import { defaultElectricityEnergySupplyName, defaultZoneName } from "./common";
import type { HeatEmittingData, WetDistributionEmitterData } from "~/stores/ecaasStore.schema";
import type { SchemaBoilerWithProductReference } from "~/schema/aliases";
import { celsius } from "~/utils/units/temperature";


describe("Space heating - heat sources", () => {
	describe("mapHeatPumps", () => {
		const heatPumpWithProductReference1: HeatSourceData = {
			id: "heatPump1Id",
			name: "Air source heat pump",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "airSource",
			productReference: "1234",
		};

		const heatPumpWithProductReference2: HeatSourceData = {
			id: "heatPump2Id",
			name: "Booster heat pump",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "booster",
			productReference: "5678",
		};
		const store = useEcaasStore();
		describe("with product references", () => {
			test("maps stored heatpump data to fit schema", () => {
				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [{ data: heatPumpWithProductReference1, complete: true }],
							complete: true,
						},
					},
				});
				const expectedHeatPump: SchemaHeatSourceWetHeatPump = {
					type: "HeatPump",
					product_reference: heatPumpWithProductReference1.productReference,
					EnergySupply: "",
				};
				const expectedForSchema = {
					[heatPumpWithProductReference1.name]: expectedHeatPump,
				};
				const resolvedState = resolveState(store.$state);

				const actual = mapHeatPumps(resolvedState);
				expect(actual).toEqual(expectedForSchema);
			});

			test("handles multiple heat pumps", () => {
				const expectedHeatPump1: SchemaHeatSourceWetHeatPump = {
					type: "HeatPump",
					product_reference: heatPumpWithProductReference1.productReference,
					EnergySupply: "",
				};
				const expectedHeatPump2: SchemaHeatSourceWetHeatPump = {
					type: "HeatPump",
					product_reference: heatPumpWithProductReference2.productReference,
					EnergySupply: "",
				};
				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [
								{ data: heatPumpWithProductReference1, complete: true },
								{ data: heatPumpWithProductReference2, complete: true },
							],
							complete: true,
						},
					},
				});

				const expectedForSchema = {
					[heatPumpWithProductReference1.name]: expectedHeatPump1,
					[heatPumpWithProductReference2.name]: expectedHeatPump2,
				};


				const resolvedState = resolveState(store.$state);

				const actual = mapHeatPumps(resolvedState);
				expect(actual).toEqual(expectedForSchema);
			});
		});
	});
	describe("mapBoilers", () => {
		describe("with product references", () => {
			const store = useEcaasStore();

			const boiler1: HeatSourceData = {
				id: "boilerId1",
				name: "Combi boiler",
				typeOfHeatSource: "boiler",
				typeOfBoiler: "combiBoiler",
				productReference: "1234",
				needsSpecifiedLocation: true,
				specifiedLocation: "internal",
				maxFlowTemp: unitValue(22, celsius),
			};

			const boiler2: HeatSourceData = {
				id: "boilerId2",
				name: "Regular boiler",
				typeOfHeatSource: "boiler",
				typeOfBoiler: "regularBoiler",
				productReference: "5678",
				needsSpecifiedLocation: false,
				maxFlowTemp: unitValue(18, celsius),
			};
			test("maps stored boiler data to fit schema", () => {
				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [{ data: boiler1, complete: true }],
							complete: true,
						},
					},
				});

				const expectedForSchema = {
					[boiler1.name]: {
						type: "Boiler",
						product_reference: boiler1.productReference,
						specified_location: "internal",
					} as const satisfies SchemaBoilerWithProductReference,
				};
				const resolvedState = resolveState(store.$state);

				const actual = mapBoilers(resolvedState);
				expect(actual).toEqual(expectedForSchema);
			});

			test("handles multiple boilers", () => {
				store.$patch({
					spaceHeating: {
						heatSource: {
							data: [
								{ data: boiler1, complete: true },
								{ data: boiler2, complete: true },
							],
							complete: true,
						},
					},
				});

				const expectedForSchema = {
					[boiler1.name]: {
						type: "Boiler",
						product_reference: boiler1.productReference,
						specified_location: "internal",
					} as const satisfies SchemaBoilerWithProductReference,
					[boiler2.name]: {
						type: "Boiler",
						product_reference: boiler2.productReference,
					} as const satisfies SchemaBoilerWithProductReference,
				};

				const resolvedState = resolveState(store.$state);

				const actual = mapBoilers(resolvedState);
				expect(actual).toEqual(expectedForSchema);
			});
		});
		const store = useEcaasStore();

		const heatBattery1: HeatSourceData = {
			id: "heatBatteryId1",
			name: "Pcm heat battery",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryPcm",
			productReference: "1234",
			maxFlowTemp: unitValue(32, celsius),
			numberOfUnits: 1,
			energySupply: "electricity",
		};

		const heatBattery2: HeatSourceData = {
			id: "heatBatteryId2",
			name: "Dry core heat battery",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "heatBatteryDryCore",
			productReference: "5678",
			numberOfUnits: 2,
			energySupply: "LPG_bottled",
		};

		test("maps stored pcm heat battery data to fit schema", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatBattery1, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[heatBattery1.name]: {
					type: "HeatBattery",
					battery_type: "pcm",
					number_of_units: 1,
					product_reference: heatBattery1.productReference,
					EnergySupply: "electricity",
				},
			};
			const resolvedState = resolveState(store.$state);

			const actual = mapHeatBatteries(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});

		test("maps stored dry core heat battery data to fit schema", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatBattery2, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[heatBattery2.name]: {
					type: "HeatBattery",
					battery_type: "dry_core",
					number_of_units: 2,
					EnergySupply: "LPG_bottled",
					product_reference: heatBattery2.productReference,
				},
			};

			const resolvedState = resolveState(store.$state);

			const actual = mapHeatBatteries(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});

		test("handles multiple heat batteries", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: heatBattery1, complete: true },
							{ data: heatBattery2, complete: true },
						],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[heatBattery1.name]: {
					type: "HeatBattery",
					battery_type: "pcm",
					number_of_units: 1,
					product_reference: heatBattery1.productReference,
					EnergySupply: "electricity",
				},
				[heatBattery2.name]: {
					type: "HeatBattery",
					battery_type: "dry_core",
					number_of_units: 2,
					EnergySupply: "LPG_bottled",
					product_reference: heatBattery2.productReference,
				},
			};

			const resolvedState = resolveState(store.$state);
			const actual = mapHeatBatteries(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});

	});
});


describe("Space heating - emitters", () => {
	const heatPump: Partial<HeatSourceData> = {
		typeOfHeatPump: "airSource",
		id: "hp1",
		name: "Heat Pump 1",
		maxFlowTemp: unitValue(14, celsius),
	};
	const heatBattery: Partial<HeatSourceData> = {
		typeOfHeatBattery: "heatBatteryPcm",
		id: "hb1",
		name: "Heat Battery 1",
		maxFlowTemp: unitValue(30, celsius),
	};

	const warmAirHeater: HeatEmittingData = {
		id: "wah1",
		name: "Warm Air Heater 1",
		typeOfHeatEmitter: "warmAirHeater",
		convectionFraction: 0.8,
		numOfWarmAirHeaters: 2,
		designTempDiffAcrossEmitters: 15,
		heatSource: heatBattery.id!,
	};

	const instantElectricHeater: HeatEmittingData = {
		id: "ieh1",
		name: "Instant Electric Heater",
		typeOfHeatEmitter: "instantElectricHeater",
		convectiveType: "Ceiling heating, radiant ceiling electric heating",
		numOfHeaters: 3,
		ratedPower: 2000,
	};
	const electricStorageHeater: HeatEmittingData = {
		id: "esh1",
		name: "Electric Storage Heater 1",
		typeOfHeatEmitter: "electricStorageHeater",
		productReference: "IEH-123",
		numOfStorageHeaters: 4,
	};
	const radiator: WetDistributionEmitterData = {
		id: "radiator1",
		name: "Radiator 1",
		typeOfHeatEmitter: "radiator",
		productReference: "RAD-123",
		length: 1000,
		numOfRadiators: 1,
	};
	const underfloorHeating: WetDistributionEmitterData = {
		id: "ufh1",
		name: "Underfloor Heating 1",
		typeOfHeatEmitter: "underfloorHeating",
		productReference: "UFH-123",
		areaOfUnderfloorHeating: 50,
	};
	const fanCoil: WetDistributionEmitterData = {
		id: "fanCoil1",
		name: "Fan Coil 1",
		typeOfHeatEmitter: "fanCoil",
		productReference: "FC-123",
		numOfFanCoils: 3,
	};
	const wetDistributionSystemBase = {
		id: "wds1",
		name: "Wet distribution system 1",
		typeOfHeatEmitter: "wetDistributionSystem" as const,
		heatSource: "hp1",
		emitters: [
			radiator,
			underfloorHeating,
			fanCoil,
		],
		percentageRecirculated: 20,
		minFlowTemp: 30,
	};
	const wetDistributionSystemEcoDesign: HeatEmittingData = {
		...wetDistributionSystemBase,
		ecoDesignControllerClass: "2",
		designFlowTemp: 55,
		maxOutdoorTemp: 25,
		minOutdoorTemp: -5,
		designTempDiffAcrossEmitters: 20,
		hasVariableFlowRate: false,
		designFlowRate: 0.1,

	};
	const wetDistributionSystemNoEcoDesign: Extract<HeatEmittingData, { hasVariableFlowRate: false }> = {
		...wetDistributionSystemBase,
		ecoDesignControllerClass: "1",
		designFlowTemp: 80,
		designTempDiffAcrossEmitters: 20,
		hasVariableFlowRate: false,
		designFlowRate: 0.1,
	};
	const wetDistributionSystemVariableFlow: Extract<HeatEmittingData, { hasVariableFlowRate: true }> = {
		...wetDistributionSystemBase,
		ecoDesignControllerClass: "1",
		designFlowTemp: 80,
		designTempDiffAcrossEmitters: 20,
		hasVariableFlowRate: true,
		minFlowRate: 0.05,
		maxFlowRate: 0.15,
	};

	describe("mapWetDistribution", () => {
		const store = useEcaasStore();
		beforeEach(() => {
			store.$reset();
		});
		it("maps stored wet distribution system data with ecodesign controller to fit schema", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: heatPump as HeatSourceData, complete: true },
							{ data: heatBattery as HeatSourceData, complete: true },
						],
						complete: true,
					},
					heatEmitters: {
						data: [{ data: wetDistributionSystemEcoDesign, complete: true }],
						complete: true,
					},
				},
			});
			const ecoDesignControllerClass = wetDistributionSystemEcoDesign.typeOfHeatEmitter === "wetDistributionSystem" ? +wetDistributionSystemEcoDesign.ecoDesignControllerClass : undefined;

			const expectedForSchema = {
				[wetDistributionSystemEcoDesign.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: radiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: radiator.length,
						},
						{
							product_reference: underfloorHeating.productReference,
							wet_emitter_type: "ufh",
							emitter_floor_area: underfloorHeating.areaOfUnderfloorHeating,
						},
						{
							product_reference: fanCoil.productReference,
							wet_emitter_type: "fancoil",
							n_units: fanCoil.numOfFanCoils,
						},
					],
					variable_flow: wetDistributionSystemEcoDesign.hasVariableFlowRate,
					design_flow_rate: wetDistributionSystemEcoDesign.designFlowRate,
					design_flow_temp: wetDistributionSystemEcoDesign.designFlowTemp,
					temp_diff_emit_dsgn: wetDistributionSystemEcoDesign.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
						temp_flow_limit_upper: heatPump.maxFlowTemp?.amount,
					},
					ecodesign_controller: {
						ecodesign_control_class: ecoDesignControllerClass,
						"max_outdoor_temp": 25,
						"min_flow_temp": 30,
						"min_outdoor_temp": - 5,
					},
					Zone: defaultZoneName,
					bypass_fraction_recirculated: wetDistributionSystemEcoDesign.percentageRecirculated / 100,
				},
			} as Record<string, SchemaWetDistribution>;
			const resolvedState = resolveState(store.$state);

			const actual = mapWetDistributions(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
		it("maps stored wet distribution system data without ecodesign controller to fit schema", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [{ data: wetDistributionSystemNoEcoDesign, complete: true }],
						complete: true,
					},
				},
			});
			const ecoDesignControllerClass = wetDistributionSystemNoEcoDesign.typeOfHeatEmitter === "wetDistributionSystem" ? +wetDistributionSystemNoEcoDesign.ecoDesignControllerClass : undefined;
			const expectedForSchema = {
				[wetDistributionSystemNoEcoDesign.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: radiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: radiator.length,
						},
						{
							product_reference: underfloorHeating.productReference,
							wet_emitter_type: "ufh",
							emitter_floor_area: underfloorHeating.areaOfUnderfloorHeating,
						},
						{
							product_reference: fanCoil.productReference,
							wet_emitter_type: "fancoil",
							n_units: fanCoil.numOfFanCoils,
						},
					],
					variable_flow: wetDistributionSystemNoEcoDesign.hasVariableFlowRate,
					design_flow_rate: wetDistributionSystemNoEcoDesign.designFlowRate,
					design_flow_temp: wetDistributionSystemNoEcoDesign.designFlowTemp,
					temp_diff_emit_dsgn: wetDistributionSystemNoEcoDesign.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
						temp_flow_limit_upper: heatPump.maxFlowTemp?.amount,
					},
					ecodesign_controller: {
						ecodesign_control_class: ecoDesignControllerClass,
					},
					Zone: defaultZoneName,
					bypass_fraction_recirculated: wetDistributionSystemNoEcoDesign.percentageRecirculated / 100,
				},
			} as Record<string, SchemaWetDistribution>;
			const resolvedState = resolveState(store.$state);

			const actual = mapWetDistributions(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
		it("maps stored wet distribution system data with variable flow to fit schema", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [{ data: wetDistributionSystemVariableFlow, complete: true }],
						complete: true,
					},
				},
			});
			const expectedForSchema = {
				[wetDistributionSystemVariableFlow.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: radiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: radiator.length,
						},
						{
							product_reference: underfloorHeating.productReference,
							wet_emitter_type: "ufh",
							emitter_floor_area: underfloorHeating.areaOfUnderfloorHeating,
						},
						{
							product_reference: fanCoil.productReference,
							wet_emitter_type: "fancoil",
							n_units: fanCoil.numOfFanCoils,
						},
					],
					variable_flow: wetDistributionSystemVariableFlow.hasVariableFlowRate,
					min_flow_rate: wetDistributionSystemVariableFlow.minFlowRate,
					max_flow_rate: wetDistributionSystemVariableFlow.maxFlowRate,
					design_flow_temp: wetDistributionSystemVariableFlow.designFlowTemp,
					temp_diff_emit_dsgn: wetDistributionSystemVariableFlow.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
						temp_flow_limit_upper: heatPump.maxFlowTemp?.amount,
					},
					ecodesign_controller: {
						ecodesign_control_class: +wetDistributionSystemVariableFlow.ecoDesignControllerClass,
					},
					Zone: defaultZoneName,
					bypass_fraction_recirculated: wetDistributionSystemVariableFlow.percentageRecirculated / 100,
				},
			} as Record<string, SchemaWetDistribution>;
			const resolvedState = resolveState(store.$state);

			const actual = mapWetDistributions(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
		it("maps multiple wet distribution systems", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: heatPump as HeatSourceData, complete: true },
							{ data: { ...heatPump, name: "Heat Pump 2", id: "2" } as HeatSourceData, complete: true },
						],
						complete: true,
					},
					heatEmitters: {
						data: [
							{ data: { ...wetDistributionSystemEcoDesign } as HeatEmittingData, complete: true },
							{ data: { ...wetDistributionSystemNoEcoDesign, heatSource: "2" } as HeatEmittingData, complete: true },
						],
						complete: true,
					},
				},
			});
			const expectedForSchema = {
				[wetDistributionSystemEcoDesign.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: radiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: radiator.length,
						},
						{
							product_reference: underfloorHeating.productReference,
							wet_emitter_type: "ufh",
							emitter_floor_area: underfloorHeating.areaOfUnderfloorHeating,
						},
						{
							product_reference: fanCoil.productReference,
							wet_emitter_type: "fancoil",
							n_units: fanCoil.numOfFanCoils,
						},
					],
					variable_flow: wetDistributionSystemEcoDesign.hasVariableFlowRate,
					design_flow_rate: wetDistributionSystemEcoDesign.designFlowRate,
					design_flow_temp: wetDistributionSystemEcoDesign.designFlowTemp,
					temp_diff_emit_dsgn: wetDistributionSystemEcoDesign.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
						temp_flow_limit_upper: heatPump.maxFlowTemp,
					},
					ecodesign_controller: {
						ecodesign_control_class: +wetDistributionSystemEcoDesign.ecoDesignControllerClass,
						"max_outdoor_temp": 25,
						"min_flow_temp": 30,
						"min_outdoor_temp": - 5,
					},
					Zone: defaultZoneName,
					bypass_fraction_recirculated: wetDistributionSystemEcoDesign.percentageRecirculated / 100,
				},
				[wetDistributionSystemNoEcoDesign.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: radiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: radiator.length,
						},
						{
							product_reference: underfloorHeating.productReference,
							wet_emitter_type: "ufh",
							emitter_floor_area: underfloorHeating.areaOfUnderfloorHeating,
						},
						{
							product_reference: fanCoil.productReference,
							wet_emitter_type: "fancoil",
							n_units: fanCoil.numOfFanCoils,
						},
					],
					variable_flow: wetDistributionSystemNoEcoDesign.hasVariableFlowRate,
					design_flow_rate: wetDistributionSystemNoEcoDesign.designFlowRate,
					design_flow_temp: wetDistributionSystemNoEcoDesign.designFlowTemp,
					temp_diff_emit_dsgn: wetDistributionSystemNoEcoDesign.designTempDiffAcrossEmitters,
					HeatSource: {
						name: "Heat Pump 2",
						temp_flow_limit_upper: heatPump.maxFlowTemp?.amount,
					},
					ecodesign_controller: {
						ecodesign_control_class: +wetDistributionSystemNoEcoDesign.ecoDesignControllerClass,
					},
					Zone: defaultZoneName,
					bypass_fraction_recirculated: wetDistributionSystemNoEcoDesign.percentageRecirculated / 100,
				},
			} as Record<string, SchemaWetDistribution>;
			const resolvedState = resolveState(store.$state);

			const actual = mapWetDistributions(resolvedState);
			expect(actual).toEqual(expectedForSchema);

		});
		it("expands multiple radiators into separate emitter entries", () => {
			const multipleRadiators: WetDistributionEmitterData = {
				id: "radiator2",
				name: "Radiator 2",
				typeOfHeatEmitter: "radiator",
				productReference: "RAD-456",
				length: 500,
				numOfRadiators: 3,
			};
			const wetDistributionWithMultipleRadiators: HeatEmittingData = {
				...wetDistributionSystemBase,
				emitters: [multipleRadiators],
				ecoDesignControllerClass: "1",
				designFlowTemp: 80,
				designTempDiffAcrossEmitters: 20,
				hasVariableFlowRate: false,
				designFlowRate: 0.1,
			};
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [{ data: wetDistributionWithMultipleRadiators, complete: true }],
						complete: true,
					},
				},
			});
			const resolvedState = resolveState(store.$state);
			const actual = mapWetDistributions(resolvedState);

			const emitters = actual[wetDistributionWithMultipleRadiators.name]?.emitters;
			expect(emitters).toHaveLength(3);
			expect(emitters).toEqual([
				{
					product_reference: "RAD-456",
					wet_emitter_type: "radiator",
					radiator_type: "standard",
					length: 500,
				},
				{
					product_reference: "RAD-456",
					wet_emitter_type: "radiator",
					radiator_type: "standard",
					length: 500,
				},
				{
					product_reference: "RAD-456",
					wet_emitter_type: "radiator",
					radiator_type: "standard",
					length: 500,
				},
			]);
		});
	});
	describe("instantElectricHeaters", () => {
		const store = useEcaasStore();
		beforeEach(() => {
			store.$reset();
		});

		test("maps stored instant electric heater data", () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: instantElectricHeater, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[`${instantElectricHeater.name} 1`]: {
					type: "InstantElecHeater",
					rated_power: instantElectricHeater.ratedPower,
					convective_type: "Ceiling heating, radiant ceiling electric heating",
					EnergySupply: defaultElectricityEnergySupplyName,
				},
				[`${instantElectricHeater.name} 2`]: {
					type: "InstantElecHeater",
					rated_power: instantElectricHeater.ratedPower,
					convective_type: "Ceiling heating, radiant ceiling electric heating",
					EnergySupply: defaultElectricityEnergySupplyName,
				},
				[`${instantElectricHeater.name} 3`]: {
					type: "InstantElecHeater",
					rated_power: instantElectricHeater.ratedPower,
					convective_type: "Ceiling heating, radiant ceiling electric heating",
					EnergySupply: defaultElectricityEnergySupplyName,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapInstantElectricHeaters(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
	});
	describe("electricStorageHeaters", () => {
		const store = useEcaasStore();
		beforeEach(() => {
			store.$reset();
		});

		test("maps stored electric storage heater data", () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: electricStorageHeater, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[electricStorageHeater.name]: {
					type: "ElecStorageHeater",
					product_reference: electricStorageHeater.productReference,
					n_units: electricStorageHeater.numOfStorageHeaters,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapElectricStorageHeaters(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
	});
	describe("warmAirHeater", () => {
		const store = useEcaasStore();
		beforeEach(() => {
			store.$reset();
		});

		test("maps stored warm air heater data", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: heatPump as HeatSourceData, complete: true },
							{ data: heatBattery as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [{ data: warmAirHeater, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[warmAirHeater.name]: {
					type: "WarmAir",
					temp_diff_emit_dsgn: warmAirHeater.designTempDiffAcrossEmitters,
					frac_convective: warmAirHeater.convectionFraction,
					HeatSource: {
						name: "Heat Battery 1",
						temp_flow_limit_upper: 30,
					},
				},
			};
			const resolvedState = resolveState(store.$state);

			const actual = mapWarmAirHeater(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
	});



	describe("mapSpaceHeatSystem", () => {
		const store = useEcaasStore();
		beforeEach(() => {
			store.$reset();
		});

		test("maps a combination of wet distribution, warm air heater, and instant electric heater", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [
							{ data: heatPump as HeatSourceData, complete: true },
							{ data: heatBattery as HeatSourceData, complete: true },
						],
						complete: true,
					},
					heatEmitters: {
						data: [
							{ data: wetDistributionSystemEcoDesign, complete: true },
							{ data: warmAirHeater, complete: true },
							{ data: instantElectricHeater, complete: true },
						],
						complete: true,
					},
				},
			});

			const resolvedState = resolveState(store.$state);
			const actual = mapSpaceHeatSystem(resolvedState);

			expect(actual.SpaceHeatSystem).toHaveProperty(wetDistributionSystemEcoDesign.name);
			expect(actual.SpaceHeatSystem[wetDistributionSystemEcoDesign.name]).toEqual(
				expect.objectContaining({ type: "WetDistribution" }),
			);

			expect(actual.SpaceHeatSystem).toHaveProperty(warmAirHeater.name);
			expect(actual.SpaceHeatSystem[warmAirHeater.name]).toEqual(
				expect.objectContaining({ type: "WarmAir" }),
			);

			expect(actual.SpaceHeatSystem).toHaveProperty(`${instantElectricHeater.name} 1`);
			expect(actual.SpaceHeatSystem[`${instantElectricHeater.name} 1`]).toEqual(
				expect.objectContaining({ type: "InstantElecHeater" }),
			);
			expect(actual.SpaceHeatSystem).toHaveProperty(`${instantElectricHeater.name} 2`);
			expect(actual.SpaceHeatSystem).toHaveProperty(`${instantElectricHeater.name} 3`);
		});
	});
});