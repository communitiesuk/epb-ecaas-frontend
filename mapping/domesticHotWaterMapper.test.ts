import type { BathData, DomesticHotWaterHeatSourceData, EcaasForm } from "~/stores/ecaasStore.schema";
import { mapDomesticHotWaterData, mapHotWaterSourcesData } from "./domesticHotWaterMapper";
import type { FhsInputSchema } from "./fhsInputMapper";
import { litre } from "../utils/units/volume";
import type { SchemaMixerShower } from "~/schema/api-schema.types";

const baseForm = {
	data: [],
	complete: true as const,
};

describe("domestic hot water mapper", () => {
	const store = useEcaasStore();

	const heatSourceId = "efa1b2c3-d4e5-6789-0123-456789abcdef";

	const heatPump = {
		data: {
			id: heatSourceId,
			heatSourceId: "NEW_HEAT_SOURCE",
			name: "heatPump1",
			typeOfHeatSource: "heatPump",
			coldWaterSource: "mainsWater",
			isExistingHeatSource: false,
			productReference: "HP-12345",
			typeOfHeatPump: "airSource",
		},
		complete: true,
	} as const satisfies EcaasForm<DomesticHotWaterHeatSourceData>;

	describe("water storage", () => {

		it("maps hot water cylinder input state to FHS input request", () => {
			// Arrange
			const hotWaterCylinder: EcaasForm<WaterStorageData> = {
				...baseForm,
				data: {
					id: "hot water cylinder",
					typeOfWaterStorage: "hotWaterCylinder",
					name: "hot water cylinder",
					storageCylinderVolume: unitValue(90, litre),
					initialTemperature: 65,
					dailyEnergyLoss: 5,
					dhwHeatSourceId: heatSourceId,
					areaOfHeatExchanger: 2,
					heaterPosition: 0.3,
					thermostatPosition: 0.5,
				},
			};
		
			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [hotWaterCylinder],
						complete: true,
					},
					heatSources: {
						data: [heatPump],
						complete: true,
					},
					pipework: {
						data: [],
						complete: true,
					},
				},
			});
		
			// Acts
			const result = mapHotWaterSourcesData(resolveState(store.$state))[0]!;
			const expectedResult: Partial<FhsInputSchema["HotWaterSource"]["hw cylinder"]> = {
				ColdWaterSource: "mains water",
				HeatSource: {
					[heatPump.data.name]: {
						EnergySupply: "mains elec",
						heater_position: 0.3,
						type: "HeatSourceWet",
						name: heatPump.data.name,
						temp_flow_limit_upper: 65,
						thermostat_position: 0.5,
					},
				},
				daily_losses: 5,
				volume: 90,
				type: "StorageTank",
				init_temp: 65,
			};
		
			// Assert
			expect(result).toEqual(expectedResult);
		});

		it("maps smart hot water tank input state to FHS input request", () => {
			// Arrange		
			const smartHotWaterTank: EcaasForm<WaterStorageData> = {
				...baseForm,
				data: {
					id: "smart hot water tank",
					typeOfWaterStorage: "smartHotWaterTank",
					name: "smart hot water tank",
					dhwHeatSourceId: heatSourceId,
					heaterPosition: 0.3,
					productReference: "SWT-12345",
				},
			};
		
			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [smartHotWaterTank],
						complete: true,
					},
					heatSources: {
						data: [heatPump],
						complete: true,
					},
					pipework: {
						data: [],
						complete: true,
					},
				},
			});
		
			// Acts
			const result = mapHotWaterSourcesData(resolveState(store.$state))[0]!;
			const expectedResult: Partial<FhsInputSchema["HotWaterSource"]["hw cylinder"]> = {
				ColdWaterSource: "mains water",
				product_reference: "SWT-12345",
				EnergySupply_pump: "mains elec",
				HeatSource: {
					[heatPump.data.name]: {
						EnergySupply: "mains elec",
						heater_position: 0.3,
						type: "HeatSourceWet",
						name: heatPump.data.name,
					},
				},
				type: "SmartHotWaterTank",
			};
		
			// Assert
			expect(result).toEqual(expectedResult);
		});
	});

	describe("outlets", () => {
		const store = useEcaasStore();

		afterEach(() => {
			store.$reset();
		});

		it("maps hot water outlets input state to FHS input request", () => {
			// Arrange
			const mixedShower: EcaasForm<MixedShowerData> = {
				...baseForm,
				data: {
					id: "shower1",
					name: "shower1",
					flowRate: 3,
					dhwHeatSourceId: heatSourceId,
					typeOfHotWaterOutlet: "mixedShower",
					wwhrs: false,
				},
			};

			const electricShower: EcaasForm<ElectricShowerData> = {
				...baseForm,
				data: {
					id: "shower2",
					name: "shower2",
					ratedPower: 10,
					typeOfHotWaterOutlet: "electricShower",
					wwhrs: false,
				},
			};

			const bath: EcaasForm<BathData> = {
				...baseForm,
				data: {
					id: "bath1",
					name: "bath1",
					size: 70,
					typeOfHotWaterOutlet: "bath",

				},
			};

			const other: EcaasForm<OtherHotWaterOutletData> = {
				...baseForm,
				data: {
					id: "other1",
					name: "other1",
					flowRate: 4,
					typeOfHotWaterOutlet: "otherHotWaterOutlet",
				},
			};

			store.$patch({
				domesticHotWater: {
					waterStorage: {
						data: [],
						complete: true,
					},
					hotWaterOutlets: { data: [mixedShower, electricShower, bath, other], complete: true },
					pipework: {
						data: [],
						complete: true,
					},
					heatSources: {
						data: [heatPump],
						complete: true,
					},
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
							allow_low_flowrate: false,
							ColdWaterSource: "mains water",
							HotWaterSource: heatSourceId,
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
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-a",
						name: "shower-wwhrs-a",
						flowRate: 8,
						wwhrs: true,
						wwhrsType: "instantaneousSystemA",
						wwhrsProductReference: "WW-A-123",
						dhwHeatSourceId: "heatPump1",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				const hwSource1: EcaasForm<DomesticHotWaterHeatSourceData> = {
					...baseForm,
					data: {
						id: "heatPump1",
						isExistingHeatSource: true,
						heatSourceId: "heatPump1",
						coldWaterSource: "mainsWater",
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [hwSource1], complete: true },
						waterStorage: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const expectedShower: SchemaMixerShower = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 8,
					allow_low_flowrate: false,
					HotWaterSource: "heatPump1",
					WWHRS: "WW-A-123",
					WWHRS_configuration: "A",
				};

				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-a"]).toEqual(expectedShower);
			});

			it("maps WWHRS configuration type B", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-b",
						name: "shower-wwhrs-b",
						flowRate: 9,
						wwhrs: true,
						wwhrsType: "instantaneousSystemB",
						wwhrsProductReference: "WW-B-456",
						dhwHeatSourceId: "cylinder1",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};
				const hwSource1: EcaasForm<DomesticHotWaterHeatSourceData> = {
					...baseForm,
					data: {
						id: "cylinder1",
						isExistingHeatSource: true,
						heatSourceId: "cylinder1",
						coldWaterSource: "mainsWater",
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [hwSource1], complete: true },
						waterStorage: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const expectedShowerWwhrsB = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 9,
					allow_low_flowrate: false,
					HotWaterSource: "cylinder1",
					WWHRS: "WW-B-456",
					WWHRS_configuration: "B",
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-b"]).toEqual(expectedShowerWwhrsB);
			});

			it("maps WWHRS configuration type C", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-wwhrs-c",
						name: "shower-wwhrs-c",
						flowRate: 10,
						wwhrs: true,
						wwhrsType: "instantaneousSystemC",
						wwhrsProductReference: "WW-C-789",
						dhwHeatSourceId: "boiler1",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				const hwSource1: EcaasForm<DomesticHotWaterHeatSourceData> = {
					...baseForm,
					data: {
						id: "boiler1",
						isExistingHeatSource: true,
						heatSourceId: "boiler1",
						coldWaterSource: "mainsWater",
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [hwSource1], complete: true },
						waterStorage: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const expectedShowerWwhrsC = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 10,
					allow_low_flowrate: false,
					HotWaterSource: "boiler1",
					WWHRS: "WW-C-789",
					WWHRS_configuration: "C",
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower-wwhrs-c"]).toEqual(expectedShowerWwhrsC);
			});
		});

		describe("mixed showers without WWHRS", () => {
			it("maps mixed shower with hotWaterSource but no WWHRS", () => {
				const mixedShower: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower-no-wwhrs",
						name: "shower-no-wwhrs",
						flowRate: 7,
						wwhrs: false,
						dhwHeatSourceId: "cylinder2",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				const hwSource1: EcaasForm<DomesticHotWaterHeatSourceData> = {
					...baseForm,
					data: {
						id: "cylinder2",
						isExistingHeatSource: true,
						heatSourceId: "cylinder2",
						coldWaterSource: "mainsWater",
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [mixedShower], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [hwSource1], complete: true },
						waterStorage: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const shower = result.HotWaterDemand?.Shower?.["shower-no-wwhrs"];
				const expectedShowerNoWwhrs = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 7,
					allow_low_flowrate: false,
					HotWaterSource: "cylinder2",
				} as const satisfies SchemaMixerShower;
				expect(shower).toEqual(expectedShowerNoWwhrs);
				expect(shower).not.toHaveProperty("WWHRS");
				expect(shower).not.toHaveProperty("WWHRS_configuration");
			});
		});

		describe("edge cases", () => {
			it("handles empty outlet arrays", () => {
				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: { data: [], complete: true },
						pipework: { data: [], complete: true },
						heatSources: { data: [], complete: true },
						waterStorage: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				expect(result.HotWaterDemand?.Shower).toEqual({});
				expect(result.HotWaterDemand?.Bath).toEqual({});
				expect(result.HotWaterDemand?.Other).toEqual({});
			});

			it("handles multiple outlets with varied configurations", () => {
				const mixedShowerWithWwhrs: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower1",
						name: "shower1",
						flowRate: 8,
						wwhrs: true,
						wwhrsType: "instantaneousSystemA",
						wwhrsProductReference: "WW123",
						dhwHeatSourceId: "dhwsource1",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				const mixedShowerNoWwhrs: EcaasForm<MixedShowerData> = {
					...baseForm,
					data: {
						id: "shower2",
						name: "shower2",
						flowRate: 6,
						wwhrs: false,
						dhwHeatSourceId: "source2",
						typeOfHotWaterOutlet: "mixedShower",
					},
				};

				const electricShower: EcaasForm<ElectricShowerData> = {
					...baseForm,
					data: {
						id: "elec1",
						name: "elec1",
						ratedPower: 9.5,
						typeOfHotWaterOutlet: "electricShower",
						wwhrs: false,
					},
				};

				const hwSource1: EcaasForm<DomesticHotWaterHeatSourceData> = {
					...baseForm,
					data: {
						id: "dhwsource1",
						isExistingHeatSource: true,
						heatSourceId: "source1",
						coldWaterSource: "mainsWater",
					},
				};

				const hwSource2: EcaasForm<DomesticHotWaterHeatSourceData> = {
					...baseForm,
					data: {
						id: "source2",
						isExistingHeatSource: false,
						heatSourceId: "NEW_HEAT_SOURCE",
						coldWaterSource: "mainsWater",
						typeOfHeatSource: "heatPump",
						name: "source2",
						productReference: "HP-67890",
						typeOfHeatPump: "groundSource",
					},
				};

				store.$patch({
					domesticHotWater: {
						hotWaterOutlets: {
							data: [mixedShowerWithWwhrs, mixedShowerNoWwhrs, electricShower],
							complete: true,
						},
						pipework: { data: [], complete: true },
						heatSources: { data: [hwSource1, hwSource2], complete: true },
						waterStorage: { data: [], complete: true },
					},
				});

				const result = mapDomesticHotWaterData(resolveState(store.$state));

				const expectedShower1 = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 8,
					allow_low_flowrate: false,
					HotWaterSource: "source1",
					WWHRS: "WW123",
					WWHRS_configuration: "A",
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower1"]).toEqual(expectedShower1);

				const expectedShower2 = {
					type: "MixerShower",
					ColdWaterSource: "mains water",
					flowrate: 6,
					allow_low_flowrate: false,
					HotWaterSource: "source2",
				} as const satisfies SchemaMixerShower;
				expect(result.HotWaterDemand?.Shower?.["shower2"]).toEqual(expectedShower2);

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