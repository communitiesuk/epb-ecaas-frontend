import { ColdWaterSourceType } from "~/schema/api-schema.types";
import { mapDomesticHotWaterData } from "./domesticHotWaterMapper";
import type { FhsInputSchema } from "./fhsInputMapper";

describe('domestic hot water mapper', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('maps hot water cylinder input state to FHS input request', () => {
		// Arrange
		const hotWaterCylinder: HotWaterCylinderData = {
			id: "hot water cylinder",
			name: "hot water cylinder",
			heatSource: "heat pump",
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
			}
		});

		// Acts
		const fhsInputData = mapDomesticHotWaterData(store);

		// Assert
		expect(fhsInputData).toBeDefined();
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
				}
			}
		};
		
		expect(result).toEqual(expectedResult);
	});
});