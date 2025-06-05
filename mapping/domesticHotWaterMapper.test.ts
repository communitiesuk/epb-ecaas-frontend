import { mapDomesticHotWaterData } from "./domesticHotWaterMapper";

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
});