import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from '@testing-library/vue';
import Summary from "./summary.vue";

const mechanicalVentilationData: MechanicalVentilationObject = {
	name: "Mechanical name 1",
	typeOfMechanicalVentilationOptions: "mvhr",
	controlForSupplyAirflow: "load",
	supplyAirTemperatureControl: "odaComp",
	airFlowRate: 12,
	mvhrLocation: "inside",
	mvhrEfficiency: 0.2,
	ductworkCrossSectionalShape: "circular",
	ductTape: "intake",
	internalDiameterOfDuctwork: 300,
	externalDiameterOfDuctwork: 1000,
	insulationThickness: 100,
	lengthOfDucwork: 100,
	thermalInsulationConductivityOfDuctwork: 10,
	surfaceReflectivity: "reflective",
};

const ventData: VentData = {
	name: 'Vent 1',
	typeOfVent: 'trickle',
	effectiveVentilationArea: 10,
	openingRatio: 1,
	airFlowAtMidHeightLevel: 1,
	pressureDifference: 1,
	orientation: 0,
	pitch: 0
};

const ventilationData: VentilationData = {
	zoneElevationalLevelAtBase: 1,
	crossVentFactor: 'yes',
	maxRequiredAirChangeRate: 1
};

const airPermeabilityData: AirPermeabilityData = {
	zoneHeight: 1,
	zoneEnvelopeArea: 5,
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
		expect(screen.getByRole('link', {name: 'Vents'}));
		expect(screen.getByRole('link', {name: 'Ventilation'}));
		expect(screen.getByRole('link', {name: 'Air permeability'}));
	});

	it('should display the correct data for the mechanical ventilation section', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: {
						mechanicalVentilationObjects: [mechanicalVentilationData]
					}
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
			"Ductwork cross sectional shape": 'circular',
			"Duct tape": 'intake',
			"Internal diameter of ductwork": 300,
			"External diameter of ductwork": 1000,
			"Thermal insulation conductivity of ductwork": 10,
			"Surface reflectivity": 'reflective'
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
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
			"Air flow at mid height level": 1,
			"Pressure difference": 1,
			"Orientation": 0,
			"Pitch": 0
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
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
			"Zone elevational level at base": 1,
			"Cross vent factor": 'Yes',
			"Maximum required air change rate": 1
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
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
			"Zone height": 1,
			"Zone envelope area": 5,
			"Test pressure": 1,
			"Air tightness test result": 1
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
			expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
		}
	});

	describe('Combustion appliances', () => {
		it('should contain the correct tabs for combustion appliances', async () => {
			await renderSuspended(Summary);
		
			expect(screen.getByRole('link', {name: 'Open fireplace'}));
			expect(screen.getByRole('link', {name: 'Closed fireplace with fan'}));
			expect(screen.getByRole('link', {name: 'Open gas flue balancer'}));
			expect(screen.getByRole('link', {name: 'Open gas kitchen stove'}));
			expect(screen.getByRole('link', {name: 'Open gas fire'}));
			expect(screen.getByRole('link', {name: 'Closed fire'}));
		});

		it('should display the correct data for the open fireplace section', async () => {
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
				"Name": 'Open fireplace 1',
				"Air supply to appliance": 'Room air',
				"Exhaust method from appliance": 'Into separate duct',
				"Type of fuel": 'coal'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the closed fireplace with fan section', async () => {
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
				"Name": 'Closed fireplace',
				"Air supply to appliance": 'Room air',
				"Exhaust method from appliance": 'Into separate duct',
				"Type of fuel": 'wood'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the open gas flue balancer section', async () => {
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
				"Name": 'Open gas flue balancer 1',
				"Air supply to appliance": 'Outside',
				"Exhaust method from appliance": 'Into room',
				"Type of fuel": 'gas'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the open gas kitchen stove section', async () => {
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
				"Name": 'Open gas kitchen stove 1',
				"Air supply to appliance": 'Outside',
				"Exhaust method from appliance": 'Into room',
				"Type of fuel": 'oil'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the open gas fire section', async () => {
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
				"Name": 'Open gas fire 1',
				"Air supply to appliance": 'Outside',
				"Exhaust method from appliance": 'Into mechanical vent',
				"Type of fuel": 'oil'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the closed fire section', async () => {
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
				"Name": 'Closed fire 1',
				"Air supply to appliance": 'Outside',
				"Exhaust method from appliance": 'Into mechanical vent',
				"Type of fuel": 'coal'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});
});