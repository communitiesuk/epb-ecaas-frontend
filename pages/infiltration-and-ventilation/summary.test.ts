import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen } from "@testing-library/vue";
import Summary from "./summary.vue";
import MechanicalVentilationOverview from "../infiltration-and-ventilation/mechanical-ventilation/index.vue";
import userEvent from "@testing-library/user-event";
import { cubicMetrePerHourPerSquareMetre, litrePerSecond } from "~/utils/units/flowRate";
import { centimetresSquare, metresSquare } from "~/utils/units/area";
import { metre, millimetre } from "~/utils/units/length";
import { degrees } from "~/utils/units/angle";
import { wattsPerMeterKelvin } from "~/utils/units/thermalConductivity";

vi.mock("uuid");

const mechanicalVentilationData: MechanicalVentilationData = {
	id: "5124f2fe-f15b-4a56-ba5a-1a7751ac506g",
	name: "Mechanical name 1",
	typeOfMechanicalVentilationOptions: "MVHR",
	airFlowRate: 12,
	mvhrLocation: "inside",
	mvhrEfficiency: 0.2,
	productReference: "1000",
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
	surfaceReflectivity: true,
};

const externalWall: ExternalWallData = {
	id: "0b77e247-53c5-42b8-9dbd-83cbfc8ccccc",
	name: "External wall 1",
	pitchOption: "90",
	pitch: 90,
	orientation: 0,
	length: 20,
	height: 0.5,
	elevationalHeight: 20,
	surfaceArea: 10,
	uValue: 1,
	colour: "Intermediate",
	arealHeatCapacity: "Very light",
	massDistributionClass: "I",
};
const ventData: VentData = {
	name: "Vent 1",
	typeOfVent: "trickle",
	associatedItemId: externalWall.id,
	effectiveVentilationArea: 10,
	openingRatio: 1,
	midHeightOfZone: 1,
};

const ventilationData: VentilationData = {
	dwellingElevationalLevelAtBase: 1,
	crossVentilationPossible: true,
	maxRequiredAirChangeRate: 1,
	ventilationZoneHeight: 1,
	dwellingEnvelopeArea: 1,
};

const airPermeabilityData: AirPermeabilityData = {
	testPressure: "Standard",
	airTightnessTestResult: 1,
};

describe("Infiltration and ventilation summary", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it("should contain the correct tabs for infiltration and ventilation", async () => {
		await renderSuspended(Summary);

		expect(screen.queryByRole("link", { name: "Mechanical ventilation" })).toBeDefined();
		expect(screen.queryByRole("link", { name: "Ductwork" })).toBeNull();
		expect(screen.queryByRole("link", { name: "Vents" })).toBeDefined();
		expect(screen.queryByRole("link", { name: "Natural ventilation" })).toBeDefined();
		expect(screen.queryByRole("link", { name: "Air permeability" })).toBeDefined();
		expect(screen.queryByRole("link", { name: "Combustion appliances" })).toBeNull();
	});

	it("should display the correct data for the mechanical ventilation section", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						{ data: mechanicalVentilationData },
					],
				},
			},
		});

		await renderSuspended(Summary);
		const expectedResult = {
			"Name": "Mechanical name 1",
			"Type of mechanical ventilation": "MVHR",
			"Air flow rate": `12 ${litrePerSecond.suffix}`,
			"MVHR location": "Inside",
			"MVHR efficiency": "0.2",
		};


		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-mechanicalVentilation-${hyphenate(key)}`));
			expect((lineResult).querySelector("dt")?.textContent).toBe(key);
			expect((lineResult).querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the ductwork section", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						{ data: mechanicalVentilationData },
					],
				},
				ductwork: {
					data: [
						{ data: ductworkData },
					],
				},
			},
		});

		await renderSuspended(Summary);
		const expectedResult = {
			"Name": "Ducktwork 1",
			"MVHR unit": "Mechanical name 1",
			"Duct type": "Intake",
			"Ductwork cross sectional shape": "Circular",
			"Internal diameter of ductwork": `300 ${millimetre.suffix}`,
			"External diameter of ductwork": `1000 ${millimetre.suffix}`,
			"Length of ductwork": `100 ${metre.suffix}`,
			"Insulation thickness": `100 ${millimetre.suffix}`,
			"Thermal conductivity of ductwork insulation": `10 ${wattsPerMeterKelvin.suffix}`,
			"Surface reflectivity": "Reflective",
		};

		for (const [key, value] of Object.entries(expectedResult)) {

			const lineResult = (await screen.findByTestId(`summary-ductwork-${hyphenate(key)}`));

			expect((lineResult).querySelector("dt")?.textContent).toBe(key);
			expect((lineResult).querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should not display the ductwork section when there are no mechanical ventilations created of type mvhr", async () => {
		const user = userEvent.setup();
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [
						{ data: mechanicalVentilationData },
					],
				},
				ductwork: {
					data: [
						{ data: ductworkData },
					],
				},
			},
		});

		await renderSuspended(MechanicalVentilationOverview);
		await user.click(screen.getByTestId("mechanicalVentilation_remove_0"));
		await renderSuspended(Summary);
		expect(screen.queryByText("No ductwork added")).toBeNull();
	});

	it("should display the correct data for the vents section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [{ data: externalWall }],
					},
				},
			},
			infiltrationAndVentilation: {
				vents: {
					data: [{ data: ventData }],
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			Name: "Vent 1",
			"Type of vent": "Trickle",
			"Effective ventilation area": `10 ${centimetresSquare.suffix}`,
			"Mid height of zone": `1 ${metre.suffix}`,
			Orientation: `0 ${degrees.suffix}`,
			Pitch: `90 ${degrees.suffix}`,
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = await screen.findByTestId(
				`summary-vents-${hyphenate(key)}`,
			);
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("displays the correct data for the vents section when tagged with an item which is tagged with another item", async () => {
		const externalWall: Partial<ExternalWallData> = {
			id: "0b77e247-53c5-42b8-9dbd-83cbfc8ccccc",
			name: "External wall 1",
			pitchOption: "custom",
			pitch: 66,
			orientation: 77,
		};

		const window1: Partial<WindowData> = {
			id: "0b77e247-53c5-42b8-9dbd-83cbfc8ffffff",
			name: "Window 1",
			taggedItem: externalWall.id,
		};

		const ventData: Partial<VentData> = {
			name: "Vent 1",
			typeOfVent: "trickle",
			associatedItemId: window1.id,
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [{ data: window1 }],
				},
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {
						data: [{ data: externalWall }],
					},
				},
			},
			infiltrationAndVentilation: {
				vents: {
					data: [{ data: ventData }],
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			Name: "Vent 1",
			"Type of vent": "Trickle",
			Orientation: `77 ${degrees.suffix}`,
			Pitch: `66 ${degrees.suffix}`,
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = await screen.findByTestId(
				`summary-vents-${hyphenate(key)}`,
			);
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the ventilation section", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				naturalVentilation: {
					data: ventilationData,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Ventilation zone height": `1 ${metre.suffix}`,
			"Dwelling envelope area": `1 ${metresSquare.suffix}`,
			"Elevational height of dwelling at its base": `1 ${metre.suffix}`,
			"Cross ventilation possible": "Yes",
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-ventilation-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the air permeability section", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				airPermeability: {
					data: airPermeabilityData,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Type of infiltration pressure test": "Blower door (test pressure is 50Pa)",
			"Air tightness test result": `1 ${cubicMetrePerHourPerSquareMetre.suffix}`,
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-airPermeability-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});
});
