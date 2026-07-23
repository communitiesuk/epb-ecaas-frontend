import type { RuntimeNuxtHooks } from "#app";
import { celsius } from "~/utils/units/temperature";

describe("water storage events", () => {
	const nuxtApp = useNuxtApp();
	const store = useEcaasStore();

	const heatPump: EcaasForm<DomesticHotWaterHeatSourceData> = {
		data: {
			isExistingHeatSource: false,
			heatSourceId: "NEW_HEAT_SOURCE",
			id: "463c94f6-566c-49b2-af27-57e5c68b5c11",
			name: "Heat pump 1",
			typeOfHeatSource: "heatPump",
			typeOfHeatPump: "airSource",
			productReference: "HEATPUMP-SMALL",
			maxFlowTemp: unitValue(7, celsius),
			energySupply: "electricity",
		},
	};

	const wwhrs1: EcaasForm<WwhrsData> = {
		data: {
			id: "baae7e60-7158-4e13-a14c-2d1c228766de",
			name: "WWHRS 1",
			coldWaterSource: "mainsWater",
			productReference: "1000",
		},
	};

	const preheatedStorage1: EcaasForm<PreheatedWaterStorageData> = {
		data: {
			name: "Preheated water cylinder",
			id: "0f3f13fe-6200-49f2-9e4f-91125ae974f3",
			storageCylinderVolume: {
				amount: 100,
				unit: "litres" as const,
			},
			dailyEnergyLoss: 69,
			typeOfWaterStorage: "hotWaterCylinder",
			heaterPosition: 0.8,
			coldWaterSource: wwhrs1.data.id,
			heatSourceId: heatPump.data.id,
		},
		complete: true,
	};

	const hwStorage1: EcaasForm<WaterStorageData> = {
		data: {
			name: "Hot water cylinder",
			id: "b060be25-c32b-4e9e-89ec-b6c5d8a826b4",
			storageCylinderVolume: {
				amount: 100,
				unit: "litres" as const,
			},
			dailyEnergyLoss: 69,
			typeOfWaterStorage: "hotWaterCylinder",
			areaOfHeatExchanger: 2.5,
			heaterPosition: 0.8,
			thermostatPosition: 0.5,
			coldWaterSource: preheatedStorage1.data.id,
		},
		complete: true,
	};

	beforeEach(() => {
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: [heatPump],
				},
				wwhrs: {
					data: [wwhrs1],
				},
				preheatedWaterStorage: {
					data: [preheatedStorage1],
					complete: true,
				},
				waterStorage: {
					data: [hwStorage1],
					complete: true,
				},
			},
		});
	});

	afterEach(() => {
		store.$reset();
	});

	it("app:wwhrs:removed sets pre-heated water cylinder to incomplete when removed WWHRS is the selected cold water source", () => {
		nuxtApp.callHook("app:wwhrs:removed", wwhrs1.data.id);

		setTimeout(() => {
			const { preheatedWaterStorage } = store.domesticHotWater;

			expect(preheatedWaterStorage.complete).toBe(false);
			expect(preheatedWaterStorage.data[0]?.complete).toBe(false);
			expect(preheatedWaterStorage.data[0]?.data.coldWaterSource).toBeUndefined();
		}, 100);
	});

	const waterStorageHooks: [keyof RuntimeNuxtHooks, string][] = [
		["app:wwhrs:removed", wwhrs1.data.id],
		["app:preheatedWaterCylinder:removed", preheatedStorage1.data.id],
	];

	waterStorageHooks.forEach(t => {
		it(`${t[0]} sets hot water cylinder to incomplete when removed element is the selected cold water source`, () => {
			nuxtApp.callHook(t[0], t[1]);

			setTimeout(() => {
				const { waterStorage } = store.domesticHotWater;

				expect(waterStorage.complete).toBe(false);
				expect(waterStorage.data[0]?.complete).toBe(false);
				expect(waterStorage.data[0]?.data.coldWaterSource).toBeUndefined();
			}, 100);
		});
	});

	it("app:hotWaterHeatSource:removed resets heat source field of pre-heated water cylinder if linked heat source is removed", () => {
		nuxtApp.callHook("app:hotWaterHeatSource:removed", heatPump.data.id);

		setTimeout(() => {
			const { preheatedWaterStorage } = store.domesticHotWater;

			expect(preheatedWaterStorage.complete).toBe(false);
			expect(preheatedWaterStorage.data[0]?.complete).toBe(false);
			expect(preheatedWaterStorage.data[0]?.data.heatSourceId).toBeUndefined();
		}, 100);
	});
});