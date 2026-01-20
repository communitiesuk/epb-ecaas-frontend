import {
	mapBoilers,
	mapHeatBatteries,
	mapHeatPumps,
	mapRadiators,
	mapUnderfloorHeating,
	mapFanCoils,
} from "./spaceHeatingMapperNew";
import type { SchemaHeatSourceWetHeatPump } from "../schema/api-schema.types";


export const UNKNOWN = "UNKNOWN";
// THIS MAPPING IS NOT COMPLETED WAITING ON SCHEMA DECISIONS

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
					EnergySupply: UNKNOWN,
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
					EnergySupply: UNKNOWN,
				};
				const expectedHeatPump2: SchemaHeatSourceWetHeatPump = {
					type: "HeatPump",
					product_reference: heatPumpWithProductReference2.productReference,
					EnergySupply: UNKNOWN,
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
	describe("mapRadiators", () => {
		const store = useEcaasStore();
		const radiator1: HeatEmittingData = {
			id: "rad1",
			name: "Standard Radiator",
			typeOfHeatEmitter: "radiator",
			typeOfRadiator: "standard",
			productReference: "RAD-123",
			numOfRadiators: 5,
			heatSource: "hp1",
			ecoDesignControllerClass: "1",
			designFlowTemp: 55,
			minFlowTemp: 45,
			designTempDiffAcrossEmitters: 10,
			hasVariableFlowRate: false,
			designFlowRate: 100,
			length: 1000,
		};

		test("maps stored radiator data to fit schema", () => {
			store.$patch({
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: radiator1, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[radiator1.name]: {
					wet_emitter_type: "radiator",
					product_reference: radiator1.productReference,
					radiator_type: "standard",
					length: 1000,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapRadiators(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
	});

	describe("mapUnderfloorHeating", () => {
		const store = useEcaasStore();
		const ufh1: HeatEmittingData = {
			id: "ufh1",
			name: "UFH System",
			typeOfHeatEmitter: "underfloorHeating",
			productReference: "UFH-123",
			areaOfUnderfloorHeating: 50,
			heatSource: "hp1",
			ecoDesignControllerClass: "1",
			designFlowTemp: 40,
			minFlowTemp: 30,
			designTempDiffAcrossEmitters: 5,
			hasVariableFlowRate: false,
			designFlowRate: 200,
		};
		test("maps stored ufh data", () => {
			store.$patch({
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: ufh1, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[ufh1.name]: {
					wet_emitter_type: "fancoil",
					product_reference: ufh1.productReference,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapUnderfloorHeating(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});
	});

	describe("mapFanCoils", () => {
		const store = useEcaasStore();
		const fanCoil1: HeatEmittingData = {
			id: "fc1",
			name: "Fan Coil 1",
			typeOfHeatEmitter: "fanCoil",
			productReference: "FC-123",
			numOfFanCoils: 3,
			heatSource: "hp1",
			ecoDesignControllerClass: "1",
			designFlowTemp: 45,
			minFlowTemp: 35,
			designTempDiffAcrossEmitters: 7,
			hasVariableFlowRate: false,
			designFlowRate: 150,
		};

		test("maps stored fan coil data", () => {
			store.$patch({
				spaceHeatingNew: {
					heatEmitters: {
						data: [{ data: fanCoil1, complete: true }],
						complete: true,
					},
				},
			});

			const expectedForSchema = {
				[fanCoil1.name]: {
					wet_emitter_type: "fancoil",
					product_reference: fanCoil1.productReference,
				},
			};
			const resolvedState = resolveState(store.$state);
			const actual = mapFanCoils(resolvedState);
			expect(actual).toEqual(expectedForSchema);
		});

	});
});