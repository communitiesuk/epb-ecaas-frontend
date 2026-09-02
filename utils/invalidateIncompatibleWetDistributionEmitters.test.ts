import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import type { FanCoilProduct } from "~/pcdb/pcdb.types";
import { invalidateIncompatibleWetDistributionEmitters } from "./invalidateIncompatibleWetDistributionEmitters";

const { mockFetch } = vi.hoisted(() => ({
	mockFetch: vi.fn(),
}));

mockNuxtImport("useFetch", () => mockFetch);

describe("invalidateIncompatibleWetDistributionEmitters", async () => {
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

		await invalidateIncompatibleWetDistributionEmitters(state, ["electricity"]);

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

		await invalidateIncompatibleWetDistributionEmitters(state,["LPG_bulk", "electricity"]);

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

		await invalidateIncompatibleWetDistributionEmitters(state,["electricity"]);

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

		await invalidateIncompatibleWetDistributionEmitters(state,["electricity"]);

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

		await invalidateIncompatibleWetDistributionEmitters(state,["electricity"]);

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

		await invalidateIncompatibleWetDistributionEmitters(state, ["electricity"]);

		expect(state.spaceHeating.heatEmitters.data[0]?.complete).toBe(true);
		expect(mockFetch).not.toHaveBeenCalled();
	});
});