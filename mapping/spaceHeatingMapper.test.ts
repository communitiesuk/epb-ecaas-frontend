import {
	mapBoilers,
	mapHeatBatteries,
	mapHeatPumps,
	mapRadiators,
	mapUnderfloorHeating,
	mapFanCoils,
	mapElectricStorageHeaters,
	mapWarmAirHeater,
	mapInstantElectricHeaters,
	mapSpaceHeatSystem,
} from "./spaceHeatingMapper";
import type { SchemaHeatSourceWetHeatPump } from "../schema/api-schema.types";
import { defaultElectricityEnergySupplyName, defaultZoneName } from "./common";
import type { HeatEmittingData } from "~/stores/ecaasStore.schema";

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
				locationOfBoiler: "heatedSpace",
			};

			const boiler2: HeatSourceData = {
				id: "boilerId2",
				name: "Regular boiler",
				typeOfHeatSource: "boiler",
				typeOfBoiler: "regularBoiler",
				productReference: "5678",
				locationOfBoiler: "unheatedSpace",
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
						boiler_location: "internal",
					},
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
						boiler_location: "internal",
					},
					[boiler2.name]: {
						type: "Boiler",
						product_reference: boiler2.productReference,
						boiler_location: "external",
					},
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
					EnergySupply: {
						type: "LPG_bottled",
					},
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
				},
				[heatBattery2.name]: {
					type: "HeatBattery",
					battery_type: "dry_core",
					number_of_units: 2,
					EnergySupply: {
						type: "LPG_bottled",
					},
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
	};
	const ufhNoWeatherCompensator: HeatEmittingData = {
		id: "ufh1",
		name: "UFH System",
		typeOfHeatEmitter: "underfloorHeating",
		productReference: "UFH-123",
		areaOfUnderfloorHeating: 50,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "1",
		designFlowTemp: 40,
		designTempDiffAcrossEmitters: 5,
		hasVariableFlowRate: false,
		designFlowRate: 200,
	};
	const ufhWithWeatherCompensator: HeatEmittingData = {
		id: "ufh2",
		name: "UFH System Class 2",
		typeOfHeatEmitter: "underfloorHeating",
		productReference: "UFH-456",
		areaOfUnderfloorHeating: 70,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "2",
		designFlowTemp: 45,
		designTempDiffAcrossEmitters: 6,
		hasVariableFlowRate: true,
		maxFlowRate: 300,
		minFlowRate: 100,
		maxOutdoorTemp: 18,
		minOutdoorTemp: 2,
		minFlowTemp: 35,
	};

	const warmAirHeater: HeatEmittingData = {
		id: "wah1",
		name: "Warm Air Heater 1",
		typeOfHeatEmitter: "warmAirHeater",
		convectionFraction: 0.8,
		numOfWarmAirHeaters: 2,
		designTempDiffAcrossEmitters: 15,
		heatSource: heatPump.id!,
	};
	const standardRadiatorNoWeatherCompensator: HeatEmittingData = {
		id: "rad1",
		name: "Standard Radiator",
		typeOfHeatEmitter: "radiator",
		typeOfRadiator: "standard",
		productReference: "RAD-123",
		numOfRadiators: 2,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "1",
		designFlowTemp: 55,
		designTempDiffAcrossEmitters: 10,
		hasVariableFlowRate: false,
		designFlowRate: 100,
		length: 1000,
	};
	const towelRadiatorNoWeatherCompensator: HeatEmittingData = {
		id: "rad2",
		name: "Towel Radiator",
		typeOfHeatEmitter: "radiator",
		typeOfRadiator: "towel",
		productReference: "RAD-456",
		numOfRadiators: 2,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "1",
		designFlowTemp: 60,
		designTempDiffAcrossEmitters: 12,
		hasVariableFlowRate: false,
		designFlowRate: 80,
	};
	const towelRadiatorWithWeatherCompensator: HeatEmittingData = {
		id: "rad3",
		name: "Towel Radiator Eco Class 2",
		typeOfHeatEmitter: "radiator",
		typeOfRadiator: "towel",
		productReference: "RAD-789",
		numOfRadiators: 2,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "2",
		designFlowTemp: 60,
		designTempDiffAcrossEmitters: 12,
		hasVariableFlowRate: false,
		designFlowRate: 80,
		maxOutdoorTemp: 20,
		minOutdoorTemp: 0,
		minFlowTemp: 30,
	};

	const fanCoilNoWeatherCompensator: HeatEmittingData = {
		id: "fc1",
		name: "Fan Coil 1",
		typeOfHeatEmitter: "fanCoil",
		productReference: "FC-123",
		numOfFanCoils: 3,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "1",
		designFlowTemp: 45,
		designTempDiffAcrossEmitters: 7,
		hasVariableFlowRate: false,
		designFlowRate: 150,
	};
	const fanCoilWithWeatherCompensator: HeatEmittingData = {
		id: "fc2",
		name: "Fan Coil 2",
		typeOfHeatEmitter: "fanCoil",
		productReference: "FC-456",
		numOfFanCoils: 2,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "2",
		designFlowTemp: 50,
		designTempDiffAcrossEmitters: 8,
		hasVariableFlowRate: true,
		maxFlowRate: 250,
		maxOutdoorTemp: 16,
		minOutdoorTemp: 4,
		minFlowTemp: 40,
		minFlowRate: 120,
	};

	const instantElectricHeater: HeatEmittingData = {
		id: "ieh1",
		name: "Instant Electric Heater 1",
		typeOfHeatEmitter: "instantElectricHeater",
		convectionFractionForHeating: 0.7,
		numOfHeaters: 3,
		ratedPower: 2000,
		productReference: "IEH-SMALL",
	};
	const electricStorageHeater: HeatEmittingData = {
		id: "esh1",
		name: "Instant Electric Heater 1",
		typeOfHeatEmitter: "electricStorageHeater",
		productReference: "IEH-123",
		numOfStorageHeaters: 4,
	};
	describe("mapRadiators", () => {
		const store = useEcaasStore();
		test("maps stored standard radiator data to fit schema", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [{ data: standardRadiatorNoWeatherCompensator, complete: true }],
						complete: true,
					},
				},
			});
			const expectedForSchema = {
				[standardRadiatorNoWeatherCompensator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: standardRadiatorNoWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
						{
							product_reference: standardRadiatorNoWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
					],
					design_flow_rate: standardRadiatorNoWeatherCompensator.designFlowRate,
					variable_flow: standardRadiatorNoWeatherCompensator.hasVariableFlowRate,
					design_flow_temp: standardRadiatorNoWeatherCompensator.designFlowTemp,
					temp_diff_emit_dsgn: standardRadiatorNoWeatherCompensator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +standardRadiatorNoWeatherCompensator.ecoDesignControllerClass,
					},
					Zone: defaultZoneName,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapRadiators(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});

		test("maps stored towel radiator data to fit schema", () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: towelRadiatorNoWeatherCompensator, complete: true }],
						complete: true,
					},
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
				},
			});
			const expectedForSchema = {
				[towelRadiatorNoWeatherCompensator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: towelRadiatorNoWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
						{
							product_reference: towelRadiatorNoWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
					],
					design_flow_rate: towelRadiatorNoWeatherCompensator.designFlowRate,
					variable_flow: towelRadiatorNoWeatherCompensator.hasVariableFlowRate,
					design_flow_temp: towelRadiatorNoWeatherCompensator.designFlowTemp,
					temp_diff_emit_dsgn: towelRadiatorNoWeatherCompensator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +towelRadiatorNoWeatherCompensator.ecoDesignControllerClass,
					},
					Zone: defaultZoneName,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapRadiators(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
		test("handles combination of radiators", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [
							{ data: standardRadiatorNoWeatherCompensator, complete: true },
							{ data: towelRadiatorNoWeatherCompensator, complete: true },
						],
						complete: true,
					},
				},
			});
			const expectedForSchema = {
				[standardRadiatorNoWeatherCompensator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: standardRadiatorNoWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
						{
							product_reference: standardRadiatorNoWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
					],
					design_flow_rate: standardRadiatorNoWeatherCompensator.designFlowRate,
					variable_flow: standardRadiatorNoWeatherCompensator.hasVariableFlowRate,
					design_flow_temp: standardRadiatorNoWeatherCompensator.designFlowTemp,
					temp_diff_emit_dsgn: standardRadiatorNoWeatherCompensator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +standardRadiatorNoWeatherCompensator.ecoDesignControllerClass,
					},
					Zone: defaultZoneName,
				}, [towelRadiatorNoWeatherCompensator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: towelRadiatorNoWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
						{
							product_reference: towelRadiatorNoWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
					],
					design_flow_rate: towelRadiatorNoWeatherCompensator.designFlowRate,
					variable_flow: towelRadiatorNoWeatherCompensator.hasVariableFlowRate,
					design_flow_temp: towelRadiatorNoWeatherCompensator.designFlowTemp,
					temp_diff_emit_dsgn: towelRadiatorNoWeatherCompensator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +towelRadiatorNoWeatherCompensator.ecoDesignControllerClass,
					},
					Zone: defaultZoneName,
				},

			};
			const resolvedState = resolveState(store.$state);
			const actual = mapRadiators(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
		test("handles radiator with eco class 2 specific temps", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [{ data: towelRadiatorWithWeatherCompensator, complete: true }],
						complete: true,
					},
				},
			});
			const expectedForSchema = {
				[towelRadiatorWithWeatherCompensator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: towelRadiatorWithWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
						{
							product_reference: towelRadiatorWithWeatherCompensator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
					],
					design_flow_rate: towelRadiatorWithWeatherCompensator.designFlowRate,
					variable_flow: towelRadiatorWithWeatherCompensator.hasVariableFlowRate,
					design_flow_temp: towelRadiatorWithWeatherCompensator.designFlowTemp,
					temp_diff_emit_dsgn: towelRadiatorWithWeatherCompensator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +towelRadiatorWithWeatherCompensator.ecoDesignControllerClass,
						max_outdoor_temp: towelRadiatorWithWeatherCompensator.maxOutdoorTemp,
						min_outdoor_temp: towelRadiatorWithWeatherCompensator.minOutdoorTemp,
						min_flow_temp: towelRadiatorWithWeatherCompensator.minFlowTemp,
					},
					Zone: defaultZoneName,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapRadiators(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
	});

	describe("mapUnderfloorHeating", () => {
		const store = useEcaasStore();
		test("maps stored ufh data", () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: ufhNoWeatherCompensator, complete: true }],
						complete: true,
					},
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[ufhNoWeatherCompensator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: ufhNoWeatherCompensator.productReference,
							wet_emitter_type: "ufh",
						},

					],
					design_flow_rate: ufhNoWeatherCompensator.designFlowRate,
					variable_flow: ufhNoWeatherCompensator.hasVariableFlowRate,
					design_flow_temp: ufhNoWeatherCompensator.designFlowTemp,
					temp_diff_emit_dsgn: ufhNoWeatherCompensator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +ufhNoWeatherCompensator.ecoDesignControllerClass,
					},
					Zone: defaultZoneName,

				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapUnderfloorHeating(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
		test("maps stored ufh data with eco class 2", () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: ufhWithWeatherCompensator, complete: true }],
						complete: true,
					},
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[ufhWithWeatherCompensator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: ufhWithWeatherCompensator.productReference,
							wet_emitter_type: "ufh",
						},

					],
					variable_flow: ufhWithWeatherCompensator.hasVariableFlowRate,
					design_flow_temp: ufhWithWeatherCompensator.designFlowTemp,
					temp_diff_emit_dsgn: ufhWithWeatherCompensator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +ufhWithWeatherCompensator.ecoDesignControllerClass,
						max_outdoor_temp: ufhWithWeatherCompensator.maxOutdoorTemp,
						min_outdoor_temp: ufhWithWeatherCompensator.minOutdoorTemp,
						min_flow_temp: ufhWithWeatherCompensator.minFlowTemp,
					},
					max_flow_rate: ufhWithWeatherCompensator.maxFlowRate,
					min_flow_rate: ufhWithWeatherCompensator.minFlowRate,
					Zone: defaultZoneName,

				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapUnderfloorHeating(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
	});


	describe("mapFanCoils", () => {
		const store = useEcaasStore();

		test("maps stored fan coil data", () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: fanCoilNoWeatherCompensator, complete: true }],
						complete: true,
					},
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[fanCoilNoWeatherCompensator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: fanCoilNoWeatherCompensator.productReference,
							wet_emitter_type: "fancoil",
						},
						{
							product_reference: fanCoilNoWeatherCompensator.productReference,
							wet_emitter_type: "fancoil",
						},
						{
							product_reference: fanCoilNoWeatherCompensator.productReference,
							wet_emitter_type: "fancoil",
						},
					],
					design_flow_rate: fanCoilNoWeatherCompensator.designFlowRate,
					variable_flow: fanCoilNoWeatherCompensator.hasVariableFlowRate,
					design_flow_temp: fanCoilNoWeatherCompensator.designFlowTemp,
					temp_diff_emit_dsgn: fanCoilNoWeatherCompensator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +fanCoilNoWeatherCompensator.ecoDesignControllerClass,
					},
					Zone: defaultZoneName,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapFanCoils(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
		test("maps stored fan coil data with eco class 2", () => {
			store.$patch({
				spaceHeating: {
					heatEmitters: {
						data: [{ data: fanCoilWithWeatherCompensator, complete: true }],
						complete: true,
					},
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[fanCoilWithWeatherCompensator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: fanCoilWithWeatherCompensator.productReference,
							wet_emitter_type: "fancoil",
						},
						{
							product_reference: fanCoilWithWeatherCompensator.productReference,
							wet_emitter_type: "fancoil",
						},
					],
					variable_flow: fanCoilWithWeatherCompensator.hasVariableFlowRate,
					design_flow_temp: fanCoilWithWeatherCompensator.designFlowTemp,
					temp_diff_emit_dsgn: fanCoilWithWeatherCompensator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +fanCoilWithWeatherCompensator.ecoDesignControllerClass,
						max_outdoor_temp: fanCoilWithWeatherCompensator.maxOutdoorTemp,
						min_outdoor_temp: fanCoilWithWeatherCompensator.minOutdoorTemp,
						min_flow_temp: fanCoilWithWeatherCompensator.minFlowTemp,
					},
					max_flow_rate: fanCoilWithWeatherCompensator.maxFlowRate,
					min_flow_rate: fanCoilWithWeatherCompensator.minFlowRate,
					Zone: defaultZoneName,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapFanCoils(resolvedState);
			expect(actual).toEqual(expectedForSchema);
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
				[instantElectricHeater.name]: {
					type: "InstantElecHeater",
					rated_power: instantElectricHeater.ratedPower,
					// placeholders
					convective_type: "Air heating (convectors, fan coils etc.)",
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
						data: [{ data: heatPump as HeatSourceData, complete: true }],
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
						name: "Heat Pump 1",
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
		test("combines all emitter mappings", () => {
			store.$patch({
				spaceHeating: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [
							{ data: standardRadiatorNoWeatherCompensator, complete: true },
							{ data: ufhNoWeatherCompensator, complete: true },
							{ data: warmAirHeater, complete: true },
							{ data: electricStorageHeater, complete: true },
						],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				SpaceHeatSystem: {
					[standardRadiatorNoWeatherCompensator.name]: {
						type: "WetDistribution",
						EnergySupply: defaultElectricityEnergySupplyName,
						emitters: [
							{
								product_reference: standardRadiatorNoWeatherCompensator.productReference,
								wet_emitter_type: "radiator",
								radiator_type: "standard",
								length: 1000,
							},
							{
								product_reference: standardRadiatorNoWeatherCompensator.productReference,
								wet_emitter_type: "radiator",
								radiator_type: "standard",
								length: 1000,
							},
						],
						design_flow_rate: standardRadiatorNoWeatherCompensator.designFlowRate,
						variable_flow: standardRadiatorNoWeatherCompensator.hasVariableFlowRate,
						design_flow_temp: standardRadiatorNoWeatherCompensator.designFlowTemp,
						temp_diff_emit_dsgn: standardRadiatorNoWeatherCompensator.designTempDiffAcrossEmitters,
						HeatSource: {
							name: heatPump.name,
						},
						ecodesign_controller: {
							ecodesign_control_class: +standardRadiatorNoWeatherCompensator.ecoDesignControllerClass,
						},
						Zone: defaultZoneName,
					},
					[ufhNoWeatherCompensator.name]: {
						type: "WetDistribution",
						EnergySupply: defaultElectricityEnergySupplyName,
						emitters: [
							{
								product_reference: ufhNoWeatherCompensator.productReference,
								wet_emitter_type: "ufh",
							},

						],
						design_flow_rate: ufhNoWeatherCompensator.designFlowRate,
						variable_flow: ufhNoWeatherCompensator.hasVariableFlowRate,
						design_flow_temp: ufhNoWeatherCompensator.designFlowTemp,
						temp_diff_emit_dsgn: ufhNoWeatherCompensator.designTempDiffAcrossEmitters,
						HeatSource: {
							name: heatPump.name,
						},
						ecodesign_controller: {
							ecodesign_control_class: +ufhNoWeatherCompensator.ecoDesignControllerClass,
						},
						Zone: defaultZoneName,
					},
					[warmAirHeater.name]: {
						type: "WarmAir",
						temp_diff_emit_dsgn: warmAirHeater.designTempDiffAcrossEmitters,
						frac_convective: warmAirHeater.convectionFraction,
						HeatSource: {
							name: "Heat Pump 1",
						},
					},
					[electricStorageHeater.name]: {
						type: "ElecStorageHeater",
						product_reference: electricStorageHeater.productReference,
						n_units: electricStorageHeater.numOfStorageHeaters,
					},
				},
			};
			const resolvedState = resolveState(store.$state);

			const actual = mapSpaceHeatSystem(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
	});
});