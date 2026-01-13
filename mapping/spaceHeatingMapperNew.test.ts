import {
	mapBoilers,
	mapHeatBatteries,
	mapHeatPumps,
} from "./spaceHeatingMapperNew";

describe("mapHeatPump", () => {
	const baseForm = {
		data: [],
		complete: true as const,
	};
	const store = useEcaasStore();

	const heatPump1: HeatSourceData = {
		id: "heatPump1Id",
		name: "Air source heat pump",
		typeOfHeatSource: HeatSourceType.heatPump,
		typeOfHeatPump: "airSource",
		productReference: "1234",
	};

	const heatPump2: HeatSourceData = {
		id: "heatPump2Id",
		name: "Booster heat pump",
		typeOfHeatSource: HeatSourceType.heatPump,
		typeOfHeatPump: "booster",
		productReference: "5678",
	};
	test("maps stored heatpump data to fit schema", () => {
		store.$patch({
			spaceHeatingNew: {
				heatSource: {
					data: [{ data: heatPump1, complete: true }],
					complete: true,
				},
			},
		});

		const expectedForSchema = {
			[heatPump1.name]: {
				type: "HeatPump",
				product_reference: heatPump1.productReference,
			},
		};
		const resolvedState = resolveState(store.$state);

		const actual = mapHeatPumps(resolvedState);
		expect(actual).toEqual(expectedForSchema);
	});

	test("handles multiple heat pumps", () => {
		store.$patch({
			spaceHeatingNew: {
				heatSource: {
					data: [
						{ data: heatPump1, complete: true },
						{ data: heatPump2, complete: true },
					],
					complete: true,
				},
			},
		});

		const expectedForSchema = {
			[heatPump1.name]: {
				type: "HeatPump",
				product_reference: heatPump1.productReference,
			},
			[heatPump2.name]: {
				type: "HeatPump",
				product_reference: heatPump2.productReference,
			},
		};

		const resolvedState = resolveState(store.$state);

		const actual = mapHeatPumps(resolvedState);
		expect(actual).toEqual(expectedForSchema);
	});
});

describe("mapBoilers", () => {
	const baseForm = {
		data: [],
		complete: true as const,
	};
	const store = useEcaasStore();

	const boiler1: HeatSourceData = {
		id: "boilerId1",
		name: "Combi boiler",
		typeOfHeatSource: HeatSourceType.boiler,
		typeOfBoiler: "combiBoiler",
		productReference: "1234",
		locationOfBoiler: AdjacentSpaceType.heatedSpace,
	};

	const boiler2: HeatSourceData = {
		id: "boilerId2",
		name: "Regular boiler",
		typeOfHeatSource: HeatSourceType.boiler,
		typeOfBoiler: "regularBoiler",
		productReference: "5678",
		locationOfBoiler: AdjacentSpaceType.unheatedSpace,
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

describe("mapHeatBatteries", () => {
	const baseForm = {
		data: [],
		complete: true as const,
	};
	const store = useEcaasStore();

	const heatBattery1: HeatSourceData = {
		id: "heatBatteryId1",
		name: "Pcm heat battery",
		typeOfHeatSource: HeatSourceType.heatBattery,
		typeOfHeatBattery: "pcm",
		productReference: "1234",
		numberOfUnits: 1,
		energySupply: "electricity",
	};

	const heatBattery2: HeatSourceData = {
		id: "heatBatteryId2",
		name: "Dry core heat battery",
		typeOfHeatSource: HeatSourceType.heatBattery,
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

// describe("maps heat network", () => {
//   const heatNetwork1: HeatSourceData = {
//     typeOfHeatSource: HeatSourceType.heatNetwork,
//     typeOfHeatNetwork: "communal",
//     name: "Heat network 1",
//     id: "heatNetworkId1",
//     isHeatNetworkInPcdb: true,
//     energySupply: "electricity",
//     productReference: "5678",
//     usesHeatInterfaceUnits: true,
//     heatInterfaceUnitProductReference: "HI-1234",
//   };
//   test("maps a heat network that is in the PCDB", () => {
//     const store = useEcaasStore();
//     store.$patch({
//       spaceHeatingNew: {
//         heatSource: {
//           data: [{ data: heatNetwork1, complete: true }],
//           complete: true,
//         },
//       },
//     });

//     const expectedForSchema = {
//       [heatNetwork1.name]: {
//         type: "HeatNetwork",
//       },
//     };
//     const resolvedState = resolveState(store.$state);

//     const actual = mapHeatBatteries(resolvedState);
//     expect(actual).toEqual(expectedForSchema);
//   });
// });
