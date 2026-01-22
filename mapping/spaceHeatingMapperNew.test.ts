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
} from "./spaceHeatingMapperNew";
import type { SchemaHeatSourceWetHeatPump } from "../schema/api-schema.types";
import { defaultElectricityEnergySupplyName, defaultZoneName, maxOutdoorTemp, minOutdoorTemp } from "./common";

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
					spaceHeatingNew: {
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
					spaceHeatingNew: {
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
					spaceHeatingNew: {
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
					spaceHeatingNew: {
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
			typeOfHeatBattery: "pcm",
			productReference: "1234",
			numberOfUnits: 1,
			energySupply: "electricity",
		};

		const heatBattery2: HeatSourceData = {
			id: "heatBatteryId2",
			name: "Dry core heat battery",
			typeOfHeatSource: "heatBattery",
			typeOfHeatBattery: "dryCore",
			productReference: "5678",
			numberOfUnits: 2,
			energySupply: "LPG_bottled",
		};

		test("maps stored pcm heat battery data to fit schema", () => {
			store.$patch({
				spaceHeatingNew: {
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
				spaceHeatingNew: {
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
				spaceHeatingNew: {
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
	const ufh: HeatEmittingData = {
		id: "ufh1",
		name: "UFH System",
		typeOfHeatEmitter: "underfloorHeating",
		productReference: "UFH-123",
		areaOfUnderfloorHeating: 50,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "1",
		designFlowTemp: 40,
		minFlowTemp: 30,
		designTempDiffAcrossEmitters: 5,
		hasVariableFlowRate: false,
		designFlowRate: 200,
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
	const standardRadiator: HeatEmittingData = {
		id: "rad1",
		name: "Standard Radiator",
		typeOfHeatEmitter: "radiator",
		typeOfRadiator: "standard",
		productReference: "RAD-123",
		numOfRadiators: 2,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "1",
		designFlowTemp: 55,
		minFlowTemp: 45,
		designTempDiffAcrossEmitters: 10,
		hasVariableFlowRate: false,
		designFlowRate: 100,
		length: 1000,
	};
	const towelRadiator: HeatEmittingData = {
		id: "rad2",
		name: "Towel Radiator",
		typeOfHeatEmitter: "radiator",
		typeOfRadiator: "towel",
		productReference: "RAD-456",
		numOfRadiators: 2,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "1",
		designFlowTemp: 60,
		minFlowTemp: 50,
		designTempDiffAcrossEmitters: 12,
		hasVariableFlowRate: false,
		designFlowRate: 80,
	};
	const fanCoil: HeatEmittingData = {
		id: "fc1",
		name: "Fan Coil 1",
		typeOfHeatEmitter: "fanCoil",
		productReference: "FC-123",
		numOfFanCoils: 3,
		heatSource: heatPump.id!,
		ecoDesignControllerClass: "1",
		designFlowTemp: 45,
		minFlowTemp: 35,
		designTempDiffAcrossEmitters: 7,
		hasVariableFlowRate: false,
		designFlowRate: 150,
	};
	const instantElectricHeater: HeatEmittingData = {
		id: "ieh1",
		name: "Instant Electric Heater 1",
		typeOfHeatEmitter: "instantElectricHeater",
		convectionFractionForHeating: 0.7,
		numOfHeatersWithThisSpec: 3,
		ratedPower: 2000,
	};
	const electricStorageHeater: HeatEmittingData = {
		id: "ieh1",
		name: "Instant Electric Heater 1",
		typeOfHeatEmitter: "electricStorageHeater",
		productReference: "IEH-123",
		numOfStorageHeaters: 4,
	};
	describe("mapRadiators", () => {
		const store = useEcaasStore();
		test("maps stored standard radiator data to fit schema", () => {
			store.$patch({
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [{ data: standardRadiator, complete: true }],
						complete: true,
					},
				},
			});
			const expectedForSchema = {
				[standardRadiator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: standardRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
						{
							product_reference: standardRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
					],
					design_flow_rate: standardRadiator.designFlowRate,
					variable_flow: standardRadiator.hasVariableFlowRate,
					design_flow_temp: standardRadiator.designFlowTemp,
					temp_diff_emit_dsgn: standardRadiator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +standardRadiator.ecoDesignControllerClass,
						max_outdoor_temp: maxOutdoorTemp,
						min_outdoor_temp: minOutdoorTemp,
						min_flow_temp: standardRadiator.minFlowTemp,
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
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: towelRadiator, complete: true }],
						complete: true,
					},
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
				},
			});
			const expectedForSchema = {
				[towelRadiator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: towelRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
						{
							product_reference: towelRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
					],
					design_flow_rate: towelRadiator.designFlowRate,
					variable_flow: towelRadiator.hasVariableFlowRate,
					design_flow_temp: towelRadiator.designFlowTemp,
					temp_diff_emit_dsgn: towelRadiator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +towelRadiator.ecoDesignControllerClass,
						max_outdoor_temp: maxOutdoorTemp,
						min_outdoor_temp: minOutdoorTemp,
						min_flow_temp: towelRadiator.minFlowTemp,
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
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [
							{ data: standardRadiator, complete: true },
							{ data: towelRadiator, complete: true },
						],
						complete: true,
					},
				},
			});
			const expectedForSchema = {
				[standardRadiator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: standardRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
						{
							product_reference: standardRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
					],
					design_flow_rate: standardRadiator.designFlowRate,
					variable_flow: standardRadiator.hasVariableFlowRate,
					design_flow_temp: standardRadiator.designFlowTemp,
					temp_diff_emit_dsgn: standardRadiator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +standardRadiator.ecoDesignControllerClass,
						max_outdoor_temp: maxOutdoorTemp,
						min_outdoor_temp: minOutdoorTemp,
						min_flow_temp: standardRadiator.minFlowTemp,
					},
					Zone: defaultZoneName,
				}, [towelRadiator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: towelRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
						{
							product_reference: towelRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "towel",
						},
					],
					design_flow_rate: towelRadiator.designFlowRate,
					variable_flow: towelRadiator.hasVariableFlowRate,
					design_flow_temp: towelRadiator.designFlowTemp,
					temp_diff_emit_dsgn: towelRadiator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +towelRadiator.ecoDesignControllerClass,
						max_outdoor_temp: maxOutdoorTemp,
						min_outdoor_temp: minOutdoorTemp,
						min_flow_temp: towelRadiator.minFlowTemp,
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
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: ufh, complete: true }],
						complete: true,
					},
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[ufh.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: ufh.productReference,
							wet_emitter_type: "ufh",
						},

					],
					design_flow_rate: ufh.designFlowRate,
					variable_flow: ufh.hasVariableFlowRate,
					design_flow_temp: ufh.designFlowTemp,
					temp_diff_emit_dsgn: ufh.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +ufh.ecoDesignControllerClass,
						max_outdoor_temp: maxOutdoorTemp,
						min_outdoor_temp: minOutdoorTemp,
						min_flow_temp: ufh.minFlowTemp,
					},
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
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: fanCoil, complete: true }],
						complete: true,
					},
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[fanCoil.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: fanCoil.productReference,
							wet_emitter_type: "fancoil",
						},
						{
							product_reference: fanCoil.productReference,
							wet_emitter_type: "fancoil",
						},
						{
							product_reference: fanCoil.productReference,
							wet_emitter_type: "fancoil",
						},
					],
					design_flow_rate: fanCoil.designFlowRate,
					variable_flow: fanCoil.hasVariableFlowRate,
					design_flow_temp: fanCoil.designFlowTemp,
					temp_diff_emit_dsgn: fanCoil.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +fanCoil.ecoDesignControllerClass,
						max_outdoor_temp: maxOutdoorTemp,
						min_outdoor_temp: minOutdoorTemp,
						min_flow_temp: fanCoil.minFlowTemp,
					},
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
				spaceHeatingNew: {
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
				spaceHeatingNew: {
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
				spaceHeatingNew: {
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
				spaceHeatingNew: {
					heatSource: {
						data: [{ data: heatPump as HeatSourceData, complete: true }],
						complete: true,
					},
					heatEmitters: {
						data: [
							{ data: standardRadiator, complete: true },
							{ data: ufh, complete: true },
							{ data: warmAirHeater, complete: true },
							{ data: electricStorageHeater, complete: true },
						],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[standardRadiator.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: standardRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
						{
							product_reference: standardRadiator.productReference,
							wet_emitter_type: "radiator",
							radiator_type: "standard",
							length: 1000,
						},
					],
					design_flow_rate: standardRadiator.designFlowRate,
					variable_flow: standardRadiator.hasVariableFlowRate,
					design_flow_temp: standardRadiator.designFlowTemp,
					temp_diff_emit_dsgn: standardRadiator.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +standardRadiator.ecoDesignControllerClass,
						max_outdoor_temp: maxOutdoorTemp,
						min_outdoor_temp: minOutdoorTemp,
						min_flow_temp: standardRadiator.minFlowTemp,
					},
					Zone: defaultZoneName,
				},
				[ufh.name]: {
					type: "WetDistribution",
					EnergySupply: defaultElectricityEnergySupplyName,
					emitters: [
						{
							product_reference: ufh.productReference,
							wet_emitter_type: "ufh",
						},

					],
					design_flow_rate: ufh.designFlowRate,
					variable_flow: ufh.hasVariableFlowRate,
					design_flow_temp: ufh.designFlowTemp,
					temp_diff_emit_dsgn: ufh.designTempDiffAcrossEmitters,
					HeatSource: {
						name: heatPump.name,
					},
					ecodesign_controller: {
						ecodesign_control_class: +ufh.ecoDesignControllerClass,
						max_outdoor_temp: maxOutdoorTemp,
						min_outdoor_temp: minOutdoorTemp,
						min_flow_temp: ufh.minFlowTemp,
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
			};
			const resolvedState = resolveState(store.$state);

			const actual = mapSpaceHeatSystem(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
	});
});