import { ColdWaterSourceType, WaterPipeworkLocation } from "~/schema/api-schema.types";
import { mapDomesticHotWaterData } from "./domesticHotWaterMapper";
import type { FhsInputSchema } from "./fhsInputMapper";

describe('domestic hot water mapper', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('maps hot water cylinder input state to FHS input request', () => {
		const heatPumpName = "heat pump";
		// Arrange
		const hotWaterCylinder: HotWaterCylinderData = {
			id: "hot water cylinder",
			name: "hot water cylinder",
			heatSource: heatPumpName,
			tankVolume: 10,
			dailyEnergyLoss: 3
		};

		store.$patch({
			domesticHotWater: {
				waterHeating: {
					hotWaterCylinder: {
						data: [hotWaterCylinder]
					}
				}
			},
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [{name: heatPumpName, id: heatPumpName}]
					}
				}
			}
		});

		// Acts
		const result = mapDomesticHotWaterData(store);
		const expectedResult: Pick<FhsInputSchema, 'HotWaterSource'> = {
			HotWaterSource: {
				"hw cylinder": {
					ColdWaterSource: ColdWaterSourceType.mains_water,
					HeatSource: {
						[heatPumpName]: {
							EnergySupply: "mains elec",
							heater_position: 0.1,
							type: "HeatSourceWet",
							name: heatPumpName
						}
					},
					daily_losses: 3,
					volume: 10,
					type: "StorageTank",
				}
			}
		};

		// Assert
		expect(result["HotWaterSource"]).toEqual(expectedResult["HotWaterSource"]);
	});

	it('maps hot water outlets input state to FHS input request', () => {
		// Arrange
		const mixedShower: MixedShowerData = {
			id: "shower1",
			name: "shower1",
			flowRate: 3
		};

		const electricShower: ElectricShowerData = {
			id: "shower2",
			name: "shower2",
			ratedPower: 10,
		};

		const bath: BathData = {
			id: "bath1",
			name: "bath1",
			size: 70,
			flowRate: 1,
		};

		const other: OtherHotWaterOutletData = {
			id: "other1",
			name: "other1",
			flowRate: 4,
		};

		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					mixedShower: {
						data: [mixedShower]
					},
					electricShower: {
						data: [electricShower]
					},
					bath: {
						data: [bath]
					},
					otherOutlets: {
						data: [other]
					}
				}
			}
		});

		// Acts
		const result = mapDomesticHotWaterData(store);
		
		// Assert
		const expectedResult: Pick<FhsInputSchema, 'HotWaterDemand'> = {
			HotWaterDemand: {
				Shower: {
					"shower1": {
						type: "MixerShower",
						flowrate: 3,
						ColdWaterSource: ColdWaterSourceType.mains_water
					},
					"shower2": {
						type: "InstantElecShower",
						rated_power: 10,
						ColdWaterSource: ColdWaterSourceType.mains_water,
						EnergySupply: "mains elec"
					}
				},
				Bath: {
					"bath1": {
						ColdWaterSource: ColdWaterSourceType.mains_water,
						flowrate: 1,
						size: 70,
					}
				},
				Other: {
					"other1": {
						ColdWaterSource: ColdWaterSourceType.mains_water,
						flowrate: 4,
					}
				},
				Distribution: []
			}
		};
		
		expect(result["HotWaterDemand"]).toEqual(expectedResult["HotWaterDemand"]);
	});

	it('maps secondary pipework input state to FHS input request', () => {
		// Arrange
		const pipework: Pipework = {
			primaryPipework: {
				data: []
			},
			secondaryPipework: {
				data: [{
					name: "secondaryPipework1",
					length: 111, 
					location: WaterPipeworkLocation.internal,
					internalDiameter: 6
				}]
			}
		};

		store.$patch({
			domesticHotWater: {
				pipework: 
					pipework
			}
		});

		// Acts
		const result = mapDomesticHotWaterData(store);
		const expectedResult: Pick<FhsInputSchema, 'HotWaterDemand'> = {
			HotWaterDemand: {
				Distribution: [{
					internal_diameter_mm: 6,
					length: 111,
					location: WaterPipeworkLocation.internal
				}],
				Bath: {},
				Other: {},
				Shower: {}
			}
		};

		// Assert
		expect(result["HotWaterDemand"]).toEqual(expectedResult["HotWaterDemand"]);
	});
});