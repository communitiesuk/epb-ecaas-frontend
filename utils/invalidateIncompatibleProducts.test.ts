import { invalidateIncompatibleProducts } from "#imports";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import type { BoilerProduct, ElectricStorageHeaterProduct, FanCoilProduct, HeatBatteryDryCoreProduct, HeatPumpProduct } from "~/pcdb/pcdb.types";

const { mockFetch } = vi.hoisted(() => ({
	mockFetch: vi.fn(),
}));

mockNuxtImport("useFetch", () => mockFetch);

describe("invalidateIncompatibleProducts", async () => {
	const store = useEcaasStore();

	beforeEach(() => {
		mockFetch.mockReturnValue({
			data: ref(fanCoilProductWithFuelType),
		});
	});

	afterEach(() => {
		store.$reset();
		mockFetch.mockReset();
	});
        
	const wetDistributionSystem: HeatEmittingData = {
		id: "1234",
		name: "Wet Distribution System 1",
		typeOfHeatEmitter: "wetDistributionSystem",
		heatSource: "heat-pump-id",
		ecoDesignControllerClass: "1",
		designFlowTemp: 55,
		designTempDiffAcrossEmitters: 10,
		hasVariableFlowRate: false,
		designFlowRate: 100,
		percentageRecirculated: 20,
		emitters: [],
	};

	const fanCoilProductWithFuelType: Partial<FanCoilProduct> = {
		id: "1001",
		brandName: "Test",
		modelName: "Fan Coil with Fuel Type",
		technologyType: "FanCoils",
		fuel: "LPG_bulk",
	};

	const fanCoilProductWithElectricity: Partial<FanCoilProduct> = {
		id: "1002",
		brandName: "Test",
		modelName: "Electric Fan Coil",
		technologyType: "FanCoils",
		fuel: "electricity",
	};

	const boilerProductWithLpg: Partial<BoilerProduct> = {
		id: "2001",
		brandName: "Test Boiler",
		modelName: "LPG Combi Boiler",
		technologyType: "CombiBoiler",
		fuel: "LPG_bulk",
	};

	const heatPumpProductWithMainsGas: Partial<HeatPumpProduct> = {
		id: "2002",
		brandName: "Test Heat Pump",
		modelName: "Hybrid Heat Pump",
		technologyType: "AirSourceHeatPump",
		fuel: "mains_gas",
	};

	const heatBatteryDryCoreProductWithFuelType: Partial<HeatBatteryDryCoreProduct> = {
		id: "1001",
		brandName: "Heat Battery Dry Core Product",
		modelName: "Heat Battery Dry Core Model",
		technologyType: "HeatBatteryDryCore",
		fuel: "LPG_condition_11F",
	};

	const storageHeaterWithFuel: Partial<ElectricStorageHeaterProduct> = {
		id: "3001",
		brandName: "Storage Heater Co",
		modelName: "Non-Electric Storage Heater",
		technologyType: "StorageHeater",
		fuel: "LPG_bulk",
	};

	test("marks a completed wet distribution system incomplete when its fan coil fuel is removed", async () => {
		const state = {
			spaceHeating: {
				heatEmitters: {
					data: [
						{
							data: {
								...wetDistributionSystem,
								emitters: [
									{
										id: "emitter1",
										name: "Fan Coil",
										typeOfHeatEmitter: "fanCoil",
										numOfFanCoils: 3,
										productReference: "1001",
									},
								],
							},
							complete: true,
						},
					],
				},
			},
		} as EcaasState;

		await invalidateIncompatibleProducts(state, ["electricity"]);

		expect(state.spaceHeating.heatEmitters.data[0]?.complete).toBe(false);
	});

	test("keeps a completed wet distribution system complete when the fan coil fuel is still present", async () => {
		const state = {
			spaceHeating: {
				heatEmitters: {
					data: [
						{
							data: {
								...wetDistributionSystem,
								emitters: [
									{
										id: "emitter1",
										name: "Fan Coil",
										typeOfHeatEmitter: "fanCoil",
										numOfFanCoils: 3,
										productReference: "1001",
									},
								],
							},
							complete: true,
						},
					],
				},
			},
		} as EcaasState;

		await invalidateIncompatibleProducts(state,["LPG_bulk", "electricity"]);

		expect(state.spaceHeating.heatEmitters.data[0]?.complete).toBe(true);
	});

	test("does not invalidate a wet distribution system for an electricity fan coil", async () => {
		const state = {
			spaceHeating: {
				heatEmitters: {
					data: [
						{
							data: {
								...wetDistributionSystem,
								emitters: [
									{
										id: "emitter1",
										name: "Fan Coil",
										typeOfHeatEmitter: "fanCoil",
										numOfFanCoils: 3,
										productReference: "1002",
									},
								],
							},
							complete: true,
						},
					],
				},
			},
		} as EcaasState;

		mockFetch.mockReturnValue({
			data: ref(fanCoilProductWithElectricity),
		});

		await invalidateIncompatibleProducts(state,["electricity"]);

		expect(state.spaceHeating.heatEmitters.data[0]?.complete).toBe(true);
	});

	test("does not change an already incomplete wet distribution system", async () => {
		const state = {
			spaceHeating: {
				heatEmitters: {
					data: [
						{
							data: {
								...wetDistributionSystem,
								emitters: [
									{
										id: "emitter1",
										name: "Fan Coil",
										typeOfHeatEmitter: "fanCoil",
										numOfFanCoils: 3,
										productReference: "1001",
									},
								],
							},
							complete: false,
						},
					],
				},
			},
		} as unknown as EcaasState;

		await invalidateIncompatibleProducts(state,["electricity"]);

		expect(state.spaceHeating.heatEmitters.data[0]?.complete).toBe(false);
	});

	test("marks all affected wet distribution systems incomplete", async () => {
		const firstWetDistribution = {
			data: {
				...wetDistributionSystem,
				emitters: [
					{
						id: "emitter1",
						name: "Fan Coil 1",
						typeOfHeatEmitter: "fanCoil",
						numOfFanCoils: 3,
						productReference: "1001",
					},
				],
			},
			complete: true,
		};

		const secondWetDistribution = {
			data: {
				...wetDistributionSystem,
				emitters: [
					{
						id: "emitter2",
						name: "Fan Coil 2",
						typeOfHeatEmitter: "fanCoil",
						numOfFanCoils: 2,
						productReference: "1001",
					},
				],
			},
			complete: true,
		};

		const state = {
			spaceHeating: {
				heatEmitters: {
					data: [firstWetDistribution, secondWetDistribution],
				},
			},
		} as EcaasState;

		await invalidateIncompatibleProducts(state,["electricity"]);

		expect(state.spaceHeating.heatEmitters.data[0]?.complete).toBe(false);

		expect(state.spaceHeating.heatEmitters.data[1]?.complete).toBe(false);
	});

	test("does not invalidate a wet distribution system for a non-fan-coil emitter", async () => {
		const state = {
			spaceHeating: {
				heatEmitters: {
					data: [
						{
							data: {
								...wetDistributionSystem,
								emitters: [
									{
										id: "emitter1",
										name: "Radiator",
										typeOfHeatEmitter: "radiator",
										numOfRadiators: 3,
										productReference: "1001",
										length: 1000,
									},
								],
							},
							complete: true,
						},
					],
				},
			},
		} as unknown as EcaasState;

		await invalidateIncompatibleProducts(state, ["electricity"]);

		expect(state.spaceHeating.heatEmitters.data[0]?.complete).toBe(true);
		expect(mockFetch).not.toHaveBeenCalled();
	});

	test("marks a space heating boiler incomplete when its required fuel is removed and invalidates heat source section", async () => {
		mockFetch.mockReturnValue({
			data: ref(boilerProductWithLpg),
		});

		const state = {
			spaceHeating: {
				heatSource: {
					data: [
						{
							data: {
								id: "heat_source_1",
								name: "Combi Boiler",
								typeOfHeatSource: "boiler",
								typeOfBoiler: "combiBoiler",
								productReference: "2001",
							},
							complete: true,
						},
					],
					complete: true,
				},
				heatEmitters: {
					data: [],
					complete: true,
				},
			},
		} as unknown as EcaasState;

		await invalidateIncompatibleProducts(state, ["electricity"]);

		expect(state.spaceHeating.heatSource.data[0]?.complete).toBe(false);
		expect(state.spaceHeating.heatSource.complete).toBe(false);
	});

	test("marks a space heating heat battery incomplete when its required fuel is removed and invalidates heat source section", async () => {
		mockFetch.mockReturnValue({
			data: ref(heatBatteryDryCoreProductWithFuelType),
		});

		const state = {
			spaceHeating: {
				heatSource: {
					data: [
						{
							data: {
								id: "heat_source_1",
								name: "PCM Heat Battery",
								typeOfHeatSource: "heatBattery",
								typeOfHeatBattery: "heatBatteryPcm",
								productReference: "2002",
							},
							complete: true,
						},
					],
					complete: true,
				},
				heatEmitters: {
					data: [],
					complete: true,
				},
			},
		} as unknown as EcaasState;

		await invalidateIncompatibleProducts(state, ["electricity"]);

		expect(state.spaceHeating.heatSource.data[0]?.complete).toBe(false);
		expect(state.spaceHeating.heatSource.complete).toBe(false);
	});

	test("marks a space heating electric storage heater incomplete when its required fuel is removed and invalidates heat emitter section", async () => {
		mockFetch.mockReturnValue({
			data: ref(storageHeaterWithFuel),
		});

		const state = {
			spaceHeating: {
				heatSource: {
					data: [],
					complete: true,
				},
				heatEmitters: {
					data: [
						{
							data: {
								id: "heat_emitter_1",
								name: "Electric Storage Heater",
								typeOfHeatEmitter: "electricStorageHeater",
								productReference: "3001",
								numOfStorageHeaters: 2,
							},
							complete: true,
						},
					],
					complete: true,
				},
			},
		} as unknown as EcaasState;

		await invalidateIncompatibleProducts(state, ["electricity"]);

		expect(state.spaceHeating.heatEmitters.data[0]?.complete).toBe(false);
		expect(state.spaceHeating.heatEmitters.complete).toBe(false);
	});

	test("correctly evaluates and invalidates multiple heat sources and emitters in the same run", async () => {
		mockFetch.mockImplementation((url: string) => {
			if (url.includes("2001")) {
				return { data: ref(boilerProductWithLpg) };
			}
			if (url.includes("2002")) {
				return { data: ref(heatPumpProductWithMainsGas) };
			}
			if (url.includes("1001")) {
				return { data: ref(fanCoilProductWithFuelType) };
			}
			return { data: ref(null) };
		});

		const state = {
			spaceHeating: {
				heatSource: {
					data: [
						{
							data: {
								id: "heat_source_1",
								name: "Boiler",
								typeOfHeatSource: "boiler",
								productReference: "2001",
							},
							complete: true,
						},
						{
							data: {
								id: "heat_source_2",
								name: "Air Source Heat Pump",
								typeOfHeatSource: "heatPump",
								productReference: "2002",
							},
							complete: true,
						},
					],
					complete: true,
				},
				heatEmitters: {
					data: [
						{
							data: {
								...wetDistributionSystem,
								emitters: [
									{
										id: "emitter_1",
										name: "Fan Coil",
										typeOfHeatEmitter: "fanCoil",
										productReference: "1001",
									},
								],
							},
							complete: true,
						},
					],
					complete: true,
				},
			},
		} as unknown as EcaasState;

		await invalidateIncompatibleProducts(state, ["mains_gas", "electricity"]);

		expect(state.spaceHeating.heatSource.data[0]?.complete).toBe(false);

		expect(state.spaceHeating.heatSource.data[1]?.complete).toBe(true);

		expect(state.spaceHeating.heatSource.complete).toBe(false);

		expect(state.spaceHeating.heatEmitters.data[0]?.complete).toBe(false);
		expect(state.spaceHeating.heatEmitters.complete).toBe(false);
	});
});