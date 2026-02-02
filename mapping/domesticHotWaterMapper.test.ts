import type { BathDataNew } from "~/stores/ecaasStore.schema";
import { mapDomesticHotWaterData } from "./domesticHotWaterMapper";
import type { FhsInputSchema } from "./fhsInputMapper";

const baseForm = {
	data: [],
	complete: true as const,
};

describe("domestic hot water mapper", () => {
	describe("outlets", () => {
		const store = useEcaasStore();

		afterEach(() => {
			store.$reset();
		});

		it("maps hot water outlets input state to FHS input request", () => {
			// Arrange
			const mixedShower: EcaasForm<MixedShowerDataNew> = {
				...baseForm,
				data: {
					id: "shower1",
					name: "shower1",
					flowRate: 3,
					hotWaterSource: "heatPump1",
					typeOfHotWaterOutlet: "mixedShower",
					wwhrs: false,
				},
			};

			const electricShower: EcaasForm<ElectricShowerDataNew> = {
				...baseForm,
				data: {
					id: "shower2",
					name: "shower2",
					ratedPower: 10,
					typeOfHotWaterOutlet: "electricShower",
					wwhrs: false,
				},
			};

			const bath: EcaasForm<BathDataNew> = {
				...baseForm,
				data: {
					id: "bath1",
					name: "bath1",
					size: 70,
					typeOfHotWaterOutlet: "bath",

				},
			};

			const other: EcaasForm<OtherHotWaterOutletDataNew> = {
				...baseForm,
				data: {
					id: "other1",
					name: "other1",
					flowRate: 4,
					typeOfHotWaterOutlet: "otherHotWaterOutlet",
				},
			};

			store.$patch({
				domesticHotWaterNew: {
					hotWaterOutlets: { data: [mixedShower, electricShower, bath, other], complete: true },
					pipework: {
						data: [],
						complete: true,
					},
					heatSources: {
						data: [],
						complete: true,
					},
				},
			});

			store.$patch({
				domesticHotWaterNew: {
					heatSources: { data: [], complete: true },
				},
			});

			// Acts
			const result = mapDomesticHotWaterData(resolveState(store.$state));

			// Assert
			const expectedResult: Pick<FhsInputSchema, "HotWaterDemand"> = {
				HotWaterDemand: {
					Shower: {
						"shower1": {
							type: "MixerShower",
							flowrate: 3,
							ColdWaterSource: "mains water",
							HotWaterSource: "heatPump1",
						},
						"shower2": {
							type: "InstantElecShower",
							rated_power: 10,
							ColdWaterSource: "mains water",
							EnergySupply: "mains elec",
						},
					},
					Bath: {
						"bath1": {
							ColdWaterSource: "mains water",
							size: 70,
						},
					},
					Other: {
						"other1": {
							ColdWaterSource: "mains water",
							flowrate: 4,
						},
					},
				},
			};

			expect(result["HotWaterDemand"]).toEqual(expectedResult["HotWaterDemand"]);
		});

		describe("mixed showers with WWHRS", () => {
			it("maps WWHRS configuration type A", () => {
				const mixedShower: EcaasForm<MixedShowerDataNew> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-a",
						name: "shower-wwhrs-a",
						flowRate: 8,
						wwhrs: true,
						wwhrsType: "instantaneousSystemA",
						wwhrsProductReference: "WW-A-123",
						hotWaterSource: "heatPump1",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				store.$patch({
					domesticHotWaterNew: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-a"]).toEqual({
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 8,
					HotWaterSource: "heatPump1",
					WWHRS: "WW-A-123",
					WWHRS_configuration: "A",
				});
			});

			it("maps WWHRS configuration type B", () => {
				const mixedShower: EcaasForm<MixedShowerDataNew> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-b",
						name: "shower-wwhrs-b",
						flowRate: 9,
						wwhrs: true,
						wwhrsType: "instantaneousSystemB",
						wwhrsProductReference: "WW-B-456",
						hotWaterSource: "cylinder1",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				store.$patch({
					domesticHotWaterNew: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-b"]).toEqual({
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 9,
					HotWaterSource: "cylinder1",
					WWHRS: "WW-B-456",
					WWHRS_configuration: "B",
				});
			});

			it("maps WWHRS configuration type C", () => {
				const mixedShower: EcaasForm<MixedShowerDataNew> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-c",
						name: "shower-wwhrs-c",
						flowRate: 10,
						wwhrs: true,
						wwhrsType: "instantaneousSystemC",
						wwhrsProductReference: "WW-C-789",
						hotWaterSource: "boiler1",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				store.$patch({
					domesticHotWaterNew: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-c"]).toEqual({
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 10,
					HotWaterSource: "boiler1",
					WWHRS: "WW-C-789",
					WWHRS_configuration: "C",
				});
			});
		});

		describe("mixed showers without WWHRS", () => {
			it("maps mixed shower with hotWaterSource but no WWHRS", () => {
				const mixedShower: EcaasForm<MixedShowerDataNew> = {
					...baseForm,
					data: {
						id: "shower-no-wwhrs",
						name: "shower-no-wwhrs",
						flowRate: 7,
						wwhrs: false,
						hotWaterSource: "cylinder2",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				store.$patch({
					domesticHotWaterNew: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const shower = result.HotWaterDemand?.Shower?.["shower-no-wwhrs"];
				expect(shower).toEqual({
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 7,
					HotWaterSource: "cylinder2",
				});
				expect(shower).not.toHaveProperty("WWHRS");
				expect(shower).not.toHaveProperty("WWHRS_configuration");
			});
		});

		describe("edge cases", () => {
			it("handles empty outlet arrays", () => {
				store.$patch({
					domesticHotWaterNew: {
						hotWaterOutlets: { data: [], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				expect(result.HotWaterDemand?.Shower).toEqual({});
				expect(result.HotWaterDemand?.Bath).toEqual({});
				expect(result.HotWaterDemand?.Other).toEqual({});
			});

			it("handles multiple outlets with varied configurations", () => {
				const mixedShowerWithWwhrs: EcaasForm<MixedShowerDataNew> = {
					...baseForm,
					data: {
						id: "shower1",
						name: "shower1",
						flowRate: 8,
						wwhrs: true,
						wwhrsType: "instantaneousSystemA",
						wwhrsProductReference: "WW123",
						hotWaterSource: "source1",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				const mixedShowerNoWwhrs: EcaasForm<MixedShowerDataNew> = {
					...baseForm,
					data: {
						id: "shower2",
						name: "shower2",
						flowRate: 6,
						wwhrs: false,
						hotWaterSource: "source2",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				const electricShower: EcaasForm<ElectricShowerDataNew> = {
					...baseForm,
					data: {
						id: "elec1",
						name: "elec1",
						ratedPower: 9.5,
						typeOfHotWaterOutlet: "electricShower",
						wwhrs: false,
					},
				};

				store.$patch({
					domesticHotWaterNew: {
						hotWaterOutlets: {
							data: [mixedShowerWithWwhrs, mixedShowerNoWwhrs, electricShower],
							complete: true,
						},
						pipework: { data: [], complete: true },
						heatSources: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				expect(result.HotWaterDemand?.Shower?.["shower1"]).toEqual({
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 8,
					HotWaterSource: "source1",
					WWHRS: "WW123",
					WWHRS_configuration: "A",
				});

				expect(result.HotWaterDemand?.Shower?.["shower2"]).toEqual({
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 6,
					HotWaterSource: "source2",
				});

				expect(result.HotWaterDemand?.Shower?.["elec1"]).toEqual({
					type: "InstantElecShower",
					ColdWaterSource: "mains water",
					rated_power: 9.5,
					EnergySupply: "mains elec",
				});
			});
		});
	});
});