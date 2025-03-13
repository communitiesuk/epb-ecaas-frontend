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
});