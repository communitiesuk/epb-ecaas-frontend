import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from '@testing-library/vue';
import Summary from "./summary.vue";
import MechanicalVentilationOverview from "../infiltration-and-ventilation/mechanical-ventilation/index.vue";
import userEvent from "@testing-library/user-event";


vi.mock('uuid');

const mechanicalVentilationData: MechanicalVentilationData = {
	name: "Mechanical name 1",
	typeOfMechanicalVentilationOptions: "mvhr",
	controlForSupplyAirflow: "load",
	supplyAirTemperatureControl: "odaComp",
	airFlowRate: 12,
	mvhrLocation: "inside",
	mvhrEfficiency: 0.2,
	id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506g"
};
const ductworkData: DuctworkData = {
	name: "Ducktwork 1",
	mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506g",
	ductworkCrossSectionalShape: "circular",
	ductType: "intake",
	internalDiameterOfDuctwork: 300,
	externalDiameterOfDuctwork: 1000,
	insulationThickness: 100,
	lengthOfDuctwork: 100,
	thermalInsulationConductivityOfDuctwork: 10,
	surfaceReflectivity: "reflective",
};

const ventData: VentData = {
	name: 'Vent 1',
	typeOfVent: 'trickle',
	effectiveVentilationArea: 10,
	openingRatio: 1,
	midHeightOfZone: 1,
	pressureDifference: 1,
	orientation: 0,
	pitch: 0
};

const ventilationData: VentilationData = {
	dwellingElevationalLevelAtBase: 1,
	crossVentFactor: 'yes',
	maxRequiredAirChangeRate: 1
};

const airPermeabilityData: AirPermeabilityData = {
	testPressure: 1,
	airTightnessTestResult: 1
};

const openFireplaceData: CombustionApplianceData = {
	name: 'Open fireplace 1',
	airSupplyToAppliance: 'roomAir',
	exhaustMethodFromAppliance: 'intoSeparateDuct',
	typeOfFuel: 'coal'
};

const closedFireplaceWithFanData: CombustionApplianceData = {
	name: 'Closed fireplace',
	airSupplyToAppliance: 'roomAir',
	exhaustMethodFromAppliance: 'intoSeparateDuct',
	typeOfFuel: 'wood'
};

const openGasFlueBalancerData: CombustionApplianceData = {
	name: 'Open gas flue balancer 1',
	airSupplyToAppliance: 'outside',
	exhaustMethodFromAppliance: 'intoRoom',
	typeOfFuel: 'gas'
};

const openGasKitchenStoveData: CombustionApplianceData = {
	name: 'Open gas kitchen stove 1',
	airSupplyToAppliance: 'outside',
	exhaustMethodFromAppliance: 'intoRoom',
	typeOfFuel: 'oil',
};

const openGasFireData: CombustionApplianceData = {
	name: 'Open gas fire 1',
	airSupplyToAppliance: 'outside',
	exhaustMethodFromAppliance: 'intoMechanicalVent',
	typeOfFuel: 'oil'
};

const closedFireData: CombustionApplianceData = {
	name: 'Closed fire 1',
	airSupplyToAppliance: 'outside',
	exhaustMethodFromAppliance: 'intoMechanicalVent',
	typeOfFuel: 'coal'
};

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
		expect(screen.getByRole('link', {name: 'Ventilation'}));
		expect(screen.getByRole('link', {name: 'Air permeability'}));
		expect(screen.getByRole('link', {name: 'Combustion appliances'}));
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
			"Name": 'Mechanical name 1',
			"Type of mechanical ventilation": 'mvhr',
			"Control for the supply airflow": 'load',
			"Supply air temperature control": 'odaComp',
			"Air flow rate": 12,
			"MVHR location": 'inside',
			"MVHR efficiency": 0.2,
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-mechanicalVentilation-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
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
			"MVHR unit": "Mechanical name 1",
			"Ductwork cross sectional shape": 'Circular',
			"Duct type": 'Intake',
			"Internal diameter of ductwork": "300",
			"External diameter of ductwork": "1000",
			"Thermal insulation conductivity of ductwork": "10",
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
			"Name": 'Vent 1',
			"Type of vent": 'trickle',
			"Effective ventilation area": 10,
			"Vent opening ratio": 1,
			"Mid height of zone": 1,
			"Pressure difference": 1,
			"Orientation": 0,
			"Pitch": 0
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-vents-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});

	it('should display the correct data for the ventilation section', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ventilation: {
					data: ventilationData
				}
			}
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Elevational height of dwelling at its base": 1,
			"Cross vent factor": 'Yes',
			"Maximum required air change rate": 1
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-ventilation-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
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
			"Test pressure": 1,
			"Air tightness test result": 1
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-airPermeability-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});

	describe('Combustion appliances', () => {

		it('should display the correct data for the open fireplace', async () => {
			store.$patch({
				infiltrationAndVentilation: {
					combustionAppliances: {
						openFireplace: {
							data: [openFireplaceData]
						}
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type": 'Open fireplace',
				"Name": 'Open fireplace 1',
				"Air supply to appliance": 'Room air',
				"Exhaust method from appliance": 'Into separate duct',
				"Type of fuel": 'coal'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for closed fireplace with fan', async () => {
			store.$patch({
				infiltrationAndVentilation: {
					combustionAppliances: {
						closedFireplaceWithFan: {
							data: [closedFireplaceWithFanData]
						}
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type": 'Closed fireplace',
				"Name": 'Closed fireplace',
				"Air supply to appliance": 'Room air',
				"Exhaust method from appliance": 'Into separate duct',
				"Type of fuel": 'wood'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for open gas flue balancer', async () => {
			store.$patch({
				infiltrationAndVentilation: {
					combustionAppliances: {
						openGasFlueBalancer: {
							data: [openGasFlueBalancerData]
						}
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type": 'Open gas flue balancer',
				"Name": 'Open gas flue balancer 1',
				"Air supply to appliance": 'Outside',
				"Exhaust method from appliance": 'Into room',
				"Type of fuel": 'gas'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for open gas kitchen stove', async () => {
			store.$patch({
				infiltrationAndVentilation: {
					combustionAppliances: {
						openGasKitchenStove: {
							data: [openGasKitchenStoveData]
						}
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type": 'Open gas kitchen stove',
				"Name": 'Open gas kitchen stove 1',
				"Air supply to appliance": 'Outside',
				"Exhaust method from appliance": 'Into room',
				"Type of fuel": 'oil'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for open gas fire', async () => {
			store.$patch({
				infiltrationAndVentilation: {
					combustionAppliances: {
						openGasFire: {
							data: [openGasFireData]
						}
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type": 'Open gas fire',
				"Name": 'Open gas fire 1',
				"Air supply to appliance": 'Outside',
				"Exhaust method from appliance": 'Into mechanical vent',
				"Type of fuel": 'oil'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for closed fire', async () => {
			store.$patch({
				infiltrationAndVentilation: {
					combustionAppliances: {
						closedFire: {
							data: [closedFireData]
						}
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type": 'Closed fire',
				"Name": 'Closed fire 1',
				"Air supply to appliance": 'Outside',
				"Exhaust method from appliance": 'Into mechanical vent',
				"Type of fuel": 'coal'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-combustionAppliances-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});
});