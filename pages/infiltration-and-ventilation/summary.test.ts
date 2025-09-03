import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from '@testing-library/vue';
import Summary from "./summary.vue";
import MechanicalVentilationOverview from "../infiltration-and-ventilation/mechanical-ventilation/index.vue";
import userEvent from "@testing-library/user-event";
import { DuctShape, DuctType, MVHRLocation } from "~/schema/api-schema.types";
import { pascal } from "~/utils/units/pressure";
import { cubicMetrePerHourPerSquareMetre, litrePerSecond } from "~/utils/units/flowRate";
import { centimetresSquare, metresSquare } from "~/utils/units/area";
import { metre, millimetre } from "~/utils/units/length";
import { degrees } from "~/utils/units/angle";
import { wattsPerMeterKelvin } from "~/utils/units/thermalConductivity";
import { VentType } from "~/schema/aliases";


vi.mock('uuid');

const mechanicalVentilationData: MechanicalVentilationData = {
	id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506g",
	name: "Mechanical name 1",
	typeOfMechanicalVentilationOptions: VentType.MVHR,
	airFlowRate: 12,
	mvhrLocation: MVHRLocation.inside,
	mvhrEfficiency: 0.2
};

const ductworkData: DuctworkData = {
	name: "Ducktwork 1",
	mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506g",
	ductworkCrossSectionalShape: DuctShape.circular,
	ductType: DuctType.intake,
	internalDiameterOfDuctwork: 300,
	externalDiameterOfDuctwork: 1000,
	insulationThickness: 100,
	lengthOfDuctwork: 100,
	thermalInsulationConductivityOfDuctwork: 10,
	surfaceReflectivity: true,
};

const ventData: VentData = {
	name: 'Vent 1',
	typeOfVent: 'trickle',
	effectiveVentilationArea: 10,
	openingRatio: 1,
	midHeightOfZone: 1,
	orientation: 0,
	pitch: 0
};

const ventilationData: VentilationData = {
	dwellingElevationalLevelAtBase: 1,
	crossVentilationPossible: true,
	maxRequiredAirChangeRate: 1,
	ventilationZoneHeight: 1,
	dwellingEnvelopeArea: 1
};

const airPermeabilityData: AirPermeabilityData = {
	testPressure: 1,
	airTightnessTestResult: 1
};

// const openFireplaceData: CombustionApplianceData = {
// 	name: 'Open fireplace 1',
// 	airSupplyToAppliance: CombustionAirSupplySituation.room_air,
// 	exhaustMethodFromAppliance: FlueGasExhaustSituation.into_separate_duct,
// 	typeOfFuel: CombustionFuelType.coal
// };

// const closedFireplaceWithFanData: CombustionApplianceData = {
// 	name: 'Closed fireplace',
// 	airSupplyToAppliance: CombustionAirSupplySituation.room_air,
// 	exhaustMethodFromAppliance: FlueGasExhaustSituation.into_separate_duct,
// 	typeOfFuel: CombustionFuelType.wood
// };

// const openGasFlueBalancerData: CombustionApplianceData = {
// 	name: 'Open gas flue balancer 1',
// 	airSupplyToAppliance: CombustionAirSupplySituation.outside,
// 	exhaustMethodFromAppliance: FlueGasExhaustSituation.into_room,
// 	typeOfFuel: CombustionFuelType.gas
// };

// const openGasKitchenStoveData: CombustionApplianceData = {
// 	name: 'Open gas kitchen stove 1',
// 	airSupplyToAppliance: CombustionAirSupplySituation.outside,
// 	exhaustMethodFromAppliance: FlueGasExhaustSituation.into_room,
// 	typeOfFuel: CombustionFuelType.oil,
// };

// const openGasFireData: CombustionApplianceData = {
// 	name: 'Open gas fire 1',
// 	airSupplyToAppliance: CombustionAirSupplySituation.outside,
// 	exhaustMethodFromAppliance: FlueGasExhaustSituation.into_mech_vent,
// 	typeOfFuel: CombustionFuelType.oil
// };

// const closedFireData: CombustionApplianceData = {
// 	name: 'Closed fire 1',
// 	airSupplyToAppliance: CombustionAirSupplySituation.outside,
// 	exhaustMethodFromAppliance: FlueGasExhaustSituation.into_mech_vent,
// 	typeOfFuel: CombustionFuelType.coal
// };

describe('Infiltration and ventilation summary', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('should contain the correct tabs for infiltration and ventilation', async () => {
		await renderSuspended(Summary);
	
		expect(screen.getByRole('link', {name: 'Mechanical ventilation'}));
		expect(screen.getByRole('link', {name: 'Ductwork'}));
		expect(screen.getByRole('link', {name: 'Vents'}));
		expect(screen.getByRole('link', {name: 'Natural ventilation'}));
		expect(screen.getByRole('link', {name: 'Air permeability'}));
		// expect(screen.getByRole('link', {name: 'Combustion appliances'}));
	});

	it('should display the correct data for the mechanical ventilation section', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilationData]
				}
			}
		});

		await renderSuspended(Summary);
		const expectedResult = {
			"Name": "Mechanical name 1",
			"Type of mechanical ventilation": "MVHR",
			"Air flow rate": `12 ${litrePerSecond.suffix}`,
			"MVHR location": "Inside",
			"MVHR efficiency": "0.2"
		};
		

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-mechanicalVentilation-${hyphenate(key)}`));
			expect((lineResult).querySelector("dt")?.textContent).toBe(key);
			expect((lineResult).querySelector("dd")?.textContent).toBe(value);
		}
	});

	it('should display the correct data for the ductwork section', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data:[mechanicalVentilationData]
				},
				ductwork: {
					data: [ductworkData]
				}
			}
		});

		await renderSuspended(Summary);
		const expectedResult = {
			"Name": "Ducktwork 1",
			"MVHR unit": 'Mechanical name 1',
			"Ductwork cross sectional shape": 'Circular',
			"Duct type": 'Intake',
			"Internal diameter of ductwork": `300 ${millimetre.suffix}`,
			"External diameter of ductwork": `1000 ${millimetre.suffix}`,
			"Length of ductwork": `100 ${metre.suffix}`,
			"Insulation thickness": `100 ${millimetre.suffix}`,
			"Thermal conductivity of ductwork insulation": `10 ${wattsPerMeterKelvin.suffix}`,
			"Surface reflectivity": 'Reflective'
		};

		for(const [key, value] of Object.entries(expectedResult)){

			const lineResult = (await screen.findByTestId(`summary-ductwork-${hyphenate(key)}`));

			expect((lineResult).querySelector("dt")?.textContent).toBe(key);
			expect((lineResult).querySelector("dd")?.textContent).toBe(value);
		}
	});

	it('should not display the ductwork section when there are no mechanical ventilations created of type mvhr', async () => {
		const user = userEvent.setup();
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data:[mechanicalVentilationData]
				},
				ductwork: {
					data: [ductworkData]
				}
			}
		});
    
		await renderSuspended(MechanicalVentilationOverview);
		await user.click(screen.getByTestId("mechanicalVentilation_remove_0"));
		await renderSuspended(Summary);
		expect(screen.getByText("No ductwork added")).toBeDefined();
	});

	it('should display the correct data for the vents section', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [ventData]
				}
			}
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Vent 1",
			"Type of vent": "Trickle",
			"Effective ventilation area": `10 ${centimetresSquare.suffix}`,
			"Vent opening ratio": "1",
			"Mid height of zone": `1 ${metre.suffix}`,
			"Orientation": `0 ${degrees.suffix}`,
			"Pitch": `0 ${degrees.suffix}`
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-vents-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it('should display the correct data for the ventilation section', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				naturalVentilation: {
					data: ventilationData
				}
			}
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Ventilation zone height": `1 ${metre.suffix}`,
			"Dwelling envelope area": `1 ${metresSquare.suffix}`,
			"Elevational height of dwelling at its base": `1 ${metre.suffix}`,
			"Cross ventilation possible": 'Yes'
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-ventilation-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it('should display the correct data for the air permeability section', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				airPermeability: {
					data: airPermeabilityData
				}
			}
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Test pressure": `1 ${pascal.suffix}`,
			"Air tightness test result": `1 ${cubicMetrePerHourPerSquareMetre.suffix}`
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-airPermeability-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	// describe('Combustion appliances', () => {

	// 	it('should display the correct data for the open fireplace', async () => {
	// 		store.$patch({
	// 			infiltrationAndVentilation: {
	// 				combustionAppliances: {
	// 					[CombustionApplianceType.open_fireplace]: {
	// 						data: [openFireplaceData]
	// 					}
	// 				}
	// 			}
	// 		});
	
	// 		await renderSuspended(Summary);
	
	// 		const expectedResult = {
	// 			"Type": "Open fireplace",
	// 			"Name": "Open fireplace 1",
	// 			"Air supply to appliance": "Room air",
	// 			"Exhaust method from appliance": "Into separate duct",
	// 			"Type of fuel": "Coal"

	// 		};
	
	// 		for (const [key, value] of Object.entries(expectedResult)) {
	// 			const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
	// 			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
	// 			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
	// 		}
	// 	});

	// 	it('should display the correct data for closed fireplace with fan', async () => {
	// 		store.$patch({
	// 			infiltrationAndVentilation: {
	// 				combustionAppliances: {
	// 					[CombustionApplianceType.closed_with_fan]: {
	// 						data: [closedFireplaceWithFanData]
	// 					}
	// 				}
	// 			}
	// 		});
	
	// 		await renderSuspended(Summary);
	
	// 		const expectedResult = {
	// 			"Type": "Closed fireplace with fan",
	// 			"Name": "Closed fireplace",
	// 			"Air supply to appliance": "Room air",
	// 			"Exhaust method from appliance": "Into separate duct",
	// 			"Type of fuel": "Wood"

	// 		};
	
	// 		for (const [key, value] of Object.entries(expectedResult)) {
	// 			const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
	// 			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
	// 			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
	// 		}
	// 	});

	// 	it('should display the correct data for open gas flue balancer', async () => {
	// 		store.$patch({
	// 			infiltrationAndVentilation: {
	// 				combustionAppliances: {
	// 					[CombustionApplianceType.open_gas_flue_balancer]: {
	// 						data: [openGasFlueBalancerData]
	// 					}
	// 				}
	// 			}
	// 		});
	
	// 		await renderSuspended(Summary);
	
	// 		const expectedResult = {
	// 			"Type": "Open gas flue balancer",
	// 			"Name": "Open gas flue balancer 1",
	// 			"Air supply to appliance": "Outside",
	// 			"Exhaust method from appliance": "Into room",
	// 			"Type of fuel": "Gas"

	// 		};
	
	// 		for (const [key, value] of Object.entries(expectedResult)) {
	// 			const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
	// 			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
	// 			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
	// 		}
	// 	});

	// 	it('should display the correct data for open gas kitchen stove', async () => {
	// 		store.$patch({
	// 			infiltrationAndVentilation: {
	// 				combustionAppliances: {
	// 					[CombustionApplianceType.open_gas_kitchen_stove]: {
	// 						data: [openGasKitchenStoveData]
	// 					}
	// 				}
	// 			}
	// 		});
	
	// 		await renderSuspended(Summary);
	
	// 		const expectedResult = {
	// 			"Type": "Open gas kitchen stove",
	// 			"Name": "Open gas kitchen stove 1",
	// 			"Air supply to appliance": "Outside",
	// 			"Exhaust method from appliance": "Into room",
	// 			"Type of fuel": "Oil"
	// 		};
	
	// 		for (const [key, value] of Object.entries(expectedResult)) {
	// 			const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
	// 			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
	// 			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
	// 		}
	// 	});

	// 	it('should display the correct data for open gas fire', async () => {
	// 		store.$patch({
	// 			infiltrationAndVentilation: {
	// 				combustionAppliances: {
	// 					[CombustionApplianceType.open_gas_fire]: {
	// 						data: [openGasFireData]
	// 					}
	// 				}
	// 			}
	// 		});
	
	// 		await renderSuspended(Summary);
	
	// 		const expectedResult = {
	// 			"Type": "Open gas fire",
	// 			"Name": "Open gas fire 1",
	// 			"Air supply to appliance": "Outside",
	// 			"Exhaust method from appliance": "Into mechanical vent",
	// 			"Type of fuel": "Oil"
	// 		};
			
	
	// 		for (const [key, value] of Object.entries(expectedResult)) {
	// 			const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
	// 			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
	// 			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
	// 		}
	// 	});

	// 	it('should display the correct data for closed fire', async () => {
	// 		store.$patch({
	// 			infiltrationAndVentilation: {
	// 				combustionAppliances: {
	// 					[CombustionApplianceType.closed_fire]: {
	// 						data: [closedFireData]
	// 					}
	// 				}
	// 			}
	// 		});
	
	// 		await renderSuspended(Summary);
	
	// 		const expectedResult = {
	// 			"Type": "Closed fire",
	// 			"Name": "Closed fire 1",
	// 			"Air supply to appliance": "Outside",
	// 			"Exhaust method from appliance": "Into mechanical vent",
	// 			"Type of fuel": "Coal"
	// 		};
			
	
	// 		for (const [key, value] of Object.entries(expectedResult)) {
	// 			const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
	// 			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
	// 			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
	// 		}
	// 	});
	// });
});