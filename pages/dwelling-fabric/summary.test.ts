import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import Summary from "./summary.vue";
import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import type {
	CeilingsAndRoofsData,
	DoorsData,
	FloorsData,
	DwellingSpaceZoneParametersData,
	ThermalBridgingData,
	WallsData,
	WindowData,
	DwellingSpaceLightingData,
	ExternalGlazedDoorData,
} from "~/stores/ecaasStore.schema";
import { metre, millimetre } from "~/utils/units/length";
import {
	squareMeterKelvinPerWatt,
	wattsPerKelvin,
	wattsPerMeterKelvin,
	wattsPerSquareMeterKelvin,
} from "~/utils/units/thermalConductivity";
import { degrees } from "~/utils/units/angle";
import { metresSquare } from "~/utils/units/area";
import { cubicMetre } from "~/utils/units/volume";

const user = userEvent.setup();

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

async function assertValueInSummaryColumn(label: string, value: string, columnIndex = 0) {
	const lineResult = (await screen.findByTestId(`summary-dwellingSpaceGroundFloors-${hyphenate(label)}`));
	expect(lineResult.querySelectorAll("dd")[columnIndex]?.textContent).toBe(value);
}

const zoneParametersData: DwellingSpaceZoneParametersData = {
	volume: 250,
	livingZoneArea: 40,
	groundFloorArea: 50,
	restOfDwellingArea: 60,
};

const bulbData: DwellingSpaceLightingData = {
	name: "Bulb 1",
	numberOfBulbs: 8,
	power: 5,
	efficacy: 120,
};

const floorsData: FloorsData = {
	dwellingSpaceGroundFloor: {
		data: [{
			data: {
				name: "Ground 1",
				surfaceArea: 5,
				totalArea: 5,
				uValue: 1,
				thermalResistance: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				perimeter: 0,
				psiOfWallJunction: 0,
				thicknessOfWalls: 0.3,
				typeOfGroundFloor: "Slab_no_edge_insulation",
			},
		},
		{
			data: {
				name: "Ground 2 with slab edge insulation",
				surfaceArea: 5,
				totalArea: 5,
				uValue: 0.5,
				thermalResistance: 2,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				perimeter: 0,
				psiOfWallJunction: 0,
				thicknessOfWalls: 0.3,
				typeOfGroundFloor: "Slab_edge_insulation",
				horizontalEdgeInsulationWidth: {
					amount: 0.5,
					unit: "metres" as const,
				},
				horizontalEdgeInsulationThermalResistance: 2,
				verticalEdgeInsulationDepth: {
					amount: 0.3,
					unit: "metres" as const,
				},
				verticalEdgeInsulationThermalResistance: 2,


			},
		}],
	},
	dwellingSpaceInternalFloor: {
		data: [{
			data: {
				typeOfInternalFloor: "heatedSpace",
				name: "Internal 1",
				surfaceAreaOfElement: 5,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
			},
		}],
	},
	dwellingSpaceExposedFloor: {
		data: [{
			data: {
				name: "Exposed Floor 1",
				pitch: 0,
				length: 0.5,
				width: 20,
				elevationalHeight: 20,
				surfaceArea: 10,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
			},
		}],
	},
	dwellingSpaceFloorOfHeatedBasement: {
		data: [{
			data: {
				id: "heated-basement-floor-id",
				name: "Floor of heated basement 1",
				netSurfaceArea: 45,
				totalArea: 20,
				uValue: 0.25,
				thermalResistance: 4,
				arealHeatCapacity: "Medium",
				massDistributionClass: "I",
				depthOfBasementFloor: 2.5,
				psiOfWallJunction: 0.08,
				thicknessOfWalls: 0.3,
			},
		}],
	},
	dwellingSpaceFloorAboveUnheatedBasement: {
		data: [{
			data: {
				name: "Floor above unheated basement 1",
				surfaceArea: 45,
				uValue: 0.25,
				thermalResistance: 4,
				arealHeatCapacity: "Medium",
				massDistributionClass: "I",
				perimeter: 30,
				psiOfWallJunction: 0.08,
				thicknessOfWalls: 0.3,
				depthOfBasementFloor: 0.5,
				heightOfBasementWalls: 1,
				thermalResistanceOfBasementWalls: 0.5,
				thermalTransmittanceOfBasementWalls: 1,
				thermalTransmittanceOfFoundations: 1.5,
			},
		}],
	},
};

const externalWallId = "47689878-2f16-414f-92c1-64b5cee844f6";
const internalWallId = "0b159e36-96ac-4ac9-8d97-57e69af11658";

const wallsData: WallsData = {
	dwellingSpaceExternalWall: {
		data: [{
			data: {
				id: externalWallId,
				name: "External wall 1",
				pitchOption: "90",
				pitch: 90,
				orientation: 0,
				height: 0.5,
				length: 20,
				elevationalHeight: 20,
				surfaceArea: 10,
				uValue: 1,
				colour: "Dark",
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
			},
		}],
	},
	dwellingSpaceInternalWall: {
		data: [{
			data: {
				id: internalWallId,
				name: "Internal 1",
				surfaceAreaOfElement: 5,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				pitchOption: "custom",
				pitch: 10,
				uValue: 1,
			},
		}],
	},
	dwellingSpaceWallToUnheatedSpace: {
		data: [{
			data: {
				id: "a6865ced-8495-41c4-a193-4ff08902892a",
				name: "Wall to unheated space 1",
				surfaceAreaOfElement: 500,
				uValue: 0.1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "E",
				pitchOption: "90",
				pitch: 90,
				thermalResistanceOfAdjacentUnheatedSpace: 1,
			},
		}],
	},
	dwellingSpacePartyWall: {
		data: [{
			data: {
				id: "96dcfa21-edec-4318-bbca-7e92b1d7c02c",
				name: "Party wall 1",
				pitchOption: "90",
				pitch: 90,
				surfaceArea: 10,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				partyWallCavityType: "unfilled_sealed",
				partyWallLiningType: "wet_plaster",
			},
		}],
	},
	dwellingSpaceWallOfHeatedBasement: {
		data: [{
			data: {
				id: "heated-basement-wall-id",
				name: "Wall of heated basement 1",
				netSurfaceArea: 60,
				uValue: 0.35,
				thermalResistance: 2.86,
				arealHeatCapacity: "Medium",
				massDistributionClass: "E",
				perimeter: 32,
				associatedBasementFloorId: "heated-basement-floor-id",
			},
		}],
	},
};

const ceilingsAndRoofsData: CeilingsAndRoofsData = {
	dwellingSpaceCeilings: {
		data: [{
			data: {
				type: "heatedSpace",
				name: "Ceiling 1",
				surfaceArea: 5,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				pitchOption: "custom",
				pitch: 180,
			},
		}],
	},
	dwellingSpaceRoofs: {
		data: [{
			data: {
				name: "Flat roof",
				typeOfRoof: "flatAboveHeatedSpace",
				pitchOption: "custom",
				pitch: 180,
				length: 1,
				width: 1,
				elevationalHeightOfElement: 2,
				surfaceArea: 1,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
			},
		},
		{
			data: {
				name: "Pitched roof",
				typeOfRoof: "pitchedInsulatedAtRoof",
				pitchOption: "custom",
				pitch: 180,
				orientation: 30,
				length: 1,
				width: 1,
				elevationalHeightOfElement: 2,
				surfaceArea: 1,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
			},
		},
		],
	},
};

const externalGlazedDoorData = {
	name: "External glazed door 1",
	associatedItemId: externalWallId,
	height: 1,
	width: 1,
	solarTransmittance: 0.1,
	elevationalHeight: 1,
	openingToFrameRatio: 0.2,
	numberOpenableParts: "1",
	maximumOpenableArea: 1,
	midHeightOpenablePart1: 1,
	uValue: 10,
	securityRisk: false,
	heightOpenableArea: 2,
	curtainsOrBlinds: true,
	treatmentType: "blinds",
	treatmentControls: "manual",
	thermalResistivityIncrease: 1,
	solarTransmittanceReduction: 0.1,
	hasShading: false,
} satisfies ExternalGlazedDoorData;

const doorsData: DoorsData = {
	dwellingSpaceExternalUnglazedDoor: {
		data: [{
			data:
			{
				name: "External unglazed door 1",
				associatedItemId: externalWallId,
				height: 0.5,
				width: 20,
				elevationalHeight: 20,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				colour: "Intermediate",
				uValue: 9,
				isTheFrontDoor: true,

			},
		}],
	},
	dwellingSpaceExternalGlazedDoor: {
		data: [{
			data: externalGlazedDoorData,
		}],
	},
	dwellingSpaceInternalDoor: {
		data: [{
			data: {
				typeOfInternalDoor: "heatedSpace",
				name: "Internal 1",
				associatedItemId: internalWallId,
				surfaceArea: 5,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				isTheFrontDoor: true,
				orientation: 45,
			},
		}],
	},
};

const windowData: EcaasForm<WindowData> = {
	data: {
		id: "test-id-1",
		name: "Window 1",
		taggedItem: externalWallId,
		height: 1,
		width: 1,
		uValue: 1,
		securityRisk: true,
		solarTransmittance: 0.1,
		elevationalHeight: 1,
		openingToFrameRatio: 0.2,
		numberOpenableParts: "0",
		curtainsOrBlinds: true,
		treatmentType: "blinds",
		treatmentControls: "manual",
		thermalResistivityIncrease: 1,
		solarTransmittanceReduction: 0.1,
		hasShading: false,
	},
};

const windowDataWithShading: EcaasForm<WindowData> = {
	data: {
		...windowData.data,
		hasShading: true,
		shading: [
			{ name: "Test 1", typeOfShading: "obstacle", distance: 1, height: 11, transparency: 11 },
			{ name: "Test 2", typeOfShading: "left_side_fin", distance: 2, depth: 22 },
			{ name: "Test 3", typeOfShading: "right_side_fin", distance: 3, depth: 33 },
			{ name: "Test 4", typeOfShading: "overhang", distance: 4, depth: 44 },
			{ name: "Test 5", typeOfShading: "frame_or_reveal", distance: 5, depth: 55 },
		],
	},
};

const thermalBridgingData: ThermalBridgingData = {
	dwellingSpaceLinearThermalBridges: {
		data: [
			{
				data: {
					name: "E1: Steel lintel with perforated steel base plate",
					typeOfThermalBridge: "E1",
					linearThermalTransmittance: 1,
					length: 2,
				},
			},
		],
	},
	dwellingSpacePointThermalBridges: {
		data: [
			{
				data: {
					name: "Point 1",
					heatTransferCoefficient: 1,
				},
			},
		],
	},
};
const store = useEcaasStore();

afterEach(() => {
	store.$reset();
	navigateToMock.mockClear();
});
describe("Dwelling space fabric summary", () => {


	describe("Dwelling space zone parameters", () => {
		it("should contain the correct tabs for dwelling space zone parameters", async () => {
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "Zone parameters" }));
		});

		it("should display the correct data for the zone parameters section", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceZoneParameters: {
						data: zoneParametersData,
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Volume": `250 ${cubicMetre.suffix}`,
				"Living zone floor area": dim(40, "metres square"),
				"Ground floor area": dim(50, "metres square"),
				"Rest of dwelling floor area": dim(60, "metres square"),
			};
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceZoneParameters-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe("Dwelling space lighting", () => {
		it("should contain the correct tabs for dwelling space lighting", async () => {
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "Lighting" }));
		});

		it("should display the correct data for the lighting section", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceLighting: {
						data: [{ data: bulbData }],
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "Bulb 1",
				"Number of bulbs": "8",
				"Power": "5 W",
				"Efficacy": "120 lm/W",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceLighting-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display multiple bulbs in the lighting section", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceLighting: {
						data: [
							{ data: bulbData },
							{ data: { name: "Bulb 2", numberOfBulbs: 3, power: 7, efficacy: 110 } },
						],
					},
				},
			});

			await renderSuspended(Summary);

			const nameRow = await screen.findByTestId(`summary-dwellingSpaceLighting-name`);
			const nameDds = nameRow.querySelectorAll("dd");
			expect(nameDds[0]?.textContent?.trim()).toBe("Bulb 1");
			expect(nameDds[1]?.textContent?.trim()).toBe("Bulb 2");

			const countRow = await screen.findByTestId(`summary-dwellingSpaceLighting-number-of-bulbs`);
			const countDds = countRow.querySelectorAll("dd");
			expect(countDds[0]?.textContent?.trim()).toBe("8");
			expect(countDds[1]?.textContent?.trim()).toBe("3");
		});
	});

	describe("Dwelling space floors", () => {
		it("should contain the correct tabs for dwelling space floors", async () => {
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "Ground floors" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Internal floors" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Exposed floors" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Floors above an unheated basement" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Floors of a heated basement" })).not.toBeNull();
		});
	});

	it("should display the correct data for the heated basement section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: floorsData.dwellingSpaceFloorOfHeatedBasement,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Floor of heated basement 1",
			"Net surface area of this element": `45 ${metresSquare.suffix}`,
			"Total area": `20 ${metresSquare.suffix}`,
			"U-value": `0.25 ${wattsPerSquareMeterKelvin.suffix}`,
			"Thermal resistance": `4 ${squareMeterKelvinPerWatt.suffix}`,
			"Areal heat capacity": "Medium",
			"Mass distribution class": "Internal",
			"Depth of basement floor below ground": `2.5 ${metre.suffix}`,
			"Psi of wall junction": `0.08 ${wattsPerMeterKelvin.suffix}`,
			"Thickness of walls": `0.3 ${millimetre.suffix}`,
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceFloorOfHeatedBasement-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should render '-' for missing values in heated basement section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: { data: [{ data: { name: "Empty basement" } }] },
				},
			},
		});

		await renderSuspended(Summary);

		const tab = await screen.findByRole("link", { name: "Floors of a heated basement" });
		await user.click(tab);

		const lineResult = (await screen.findByTestId(`summary-dwellingSpaceFloorOfHeatedBasement-${hyphenate("U-value")}`));
		expect(lineResult.querySelector("dd")?.textContent).toBe("-");
	});

	it("should display the correct data for the ground floor section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: floorsData.dwellingSpaceGroundFloor,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Ground 1",
			"Net surface area": `5 ${metresSquare.suffix}`,
			"Total area": `5 ${metresSquare.suffix}`,
			"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
			"Thermal resistance": `1 ${squareMeterKelvinPerWatt.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
			"Perimeter": `0 ${metre.suffix}`,
			"Psi of wall junction": `0 ${wattsPerMeterKelvin.suffix}`,
			"Thickness of walls at the edge of the floor": `0.3 ${metre.suffix}`,
			"Type of ground floor": "Slab no edge insulation",
			"Horizontal edge insulation width": `-`,
			"Horizontal edge insulation thermal resistance": `-`,
			"Vertical edge insulation depth": `-`,
			"Vertical edge insulation thermal resistance": `-`,
		};

		const expectedResultWithEdgeInsulation = {
			"Name": "Ground 2 with slab edge insulation",
			"Net surface area": `5 ${metresSquare.suffix}`,
			"Total area": `5 ${metresSquare.suffix}`,
			"U-value": `0.5 ${wattsPerSquareMeterKelvin.suffix}`,
			"Thermal resistance": `2 ${squareMeterKelvinPerWatt.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
			"Perimeter": `0 ${metre.suffix}`,
			"Psi of wall junction": `0 ${wattsPerMeterKelvin.suffix}`,
			"Thickness of walls at the edge of the floor": `0.3 ${metre.suffix}`,
			"Type of ground floor": "Slab edge insulation",
			"Horizontal edge insulation width": `0.5 ${metre.suffix}`,
			"Horizontal edge insulation thermal resistance": `2 ${squareMeterKelvinPerWatt.suffix}`,
			"Vertical edge insulation depth": `0.3 ${metre.suffix}`,
			"Vertical edge insulation thermal resistance": `2 ${squareMeterKelvinPerWatt.suffix}`,
		};
		for (const [key, value] of Object.entries(expectedResult)) {
			await assertValueInSummaryColumn(key, value);
		}
		for (const [key, value] of Object.entries(expectedResultWithEdgeInsulation)) {
			await assertValueInSummaryColumn(key, value, 1);
		}
	});

	it("should display the correct data for the internal floor section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceInternalFloor: floorsData.dwellingSpaceInternalFloor,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Type of internal floor": "Internal floor to heated space",
			"Name": "Internal 1",
			"Net surface area of element": `5 ${metresSquare.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceInternalFloors-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the exposed floor section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceExposedFloor: floorsData.dwellingSpaceExposedFloor,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Exposed Floor 1",
			"Length": `0.5 ${metre.suffix}`,
			"Width": `20 ${metre.suffix}`,
			"Elevational height of building element at its base": `20 ${metre.suffix}`,
			"Net surface area": `10 ${metresSquare.suffix}`,
			"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
		};


		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceExposedFloors-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the floors above an unheated basement section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceFloorAboveUnheatedBasement: floorsData.dwellingSpaceFloorAboveUnheatedBasement,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Floor above unheated basement 1",
			"Net surface area": `45 ${metresSquare.suffix}`,
			"U-value": `0.25 ${wattsPerSquareMeterKelvin.suffix}`,
			"Thermal resistance": `4 ${squareMeterKelvinPerWatt.suffix}`,
			"Areal heat capacity": "Medium",
			"Mass distribution class": "Internal",
			"Perimeter": `30 ${metre.suffix}`,
			"PSI value of E6 junction": `0.08 ${wattsPerMeterKelvin.suffix}`,
			"Thickness of walls at the edge of the floor": `0.3 ${millimetre.suffix}`,
			"Depth of the basement floor": `0.5 ${metre.suffix}`,
			"Height of the basement walls": `1 ${metre.suffix}`,
			"Thermal resistance of basement walls": `0.5 ${squareMeterKelvinPerWatt.suffix}`,
			"Thermal transmittance of the basement walls": `1 ${squareMeterKelvinPerWatt.suffix}`,
			"Thermal transmittance of the foundations": `1.5 ${wattsPerSquareMeterKelvin.suffix}`,
		};


		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceFloorOfHeatedBasement-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});
});

describe("Dwelling space walls", () => {
	it("should contain the correct tabs for dwelling space walls", async () => {
		await renderSuspended(Summary);

		expect(screen.getByRole("link", { name: "External walls" })).not.toBeNull();
		expect(screen.getByRole("link", { name: "Internal walls" })).not.toBeNull();
		expect(screen.getByRole("link", { name: "Walls to unheated spaces" })).not.toBeNull();
		expect(screen.getByRole("link", { name: "Party walls" })).not.toBeNull();
		expect(screen.getByRole("link", { name: "Walls of a heated basement" })).not.toBeNull();
	});

	it("should display the correct data for the external wall section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: wallsData.dwellingSpaceExternalWall,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "External wall 1",
			"Pitch": `90 ${degrees.suffix}`,
			"Orientation": `0 ${degrees.suffix}`,
			"Height": `0.5 ${metre.suffix}`,
			"Length": `20 ${metre.suffix}`,
			"Elevational height of building element at its base": `20 ${metre.suffix}`,
			"Net surface area": `10 ${metresSquare.suffix}`,
			"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceExternalWalls-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the internal wall section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceInternalWall: wallsData.dwellingSpaceInternalWall,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Internal 1",
			"Net surface area of element": `5 ${metresSquare.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
			"Pitch": `10 ${degrees.suffix}`,
		};


		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceInternalWalls-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the wall to unheated space section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallToUnheatedSpace: wallsData.dwellingSpaceWallToUnheatedSpace,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Wall to unheated space 1",
			"Net surface area of element": `500 ${metresSquare.suffix}`,
			"U-value": `0.1 ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "External",
			"Pitch": `90 ${degrees.suffix}`,
			"Thermal resistance of adjacent unheated space": `1 ${squareMeterKelvinPerWatt.suffix}`,
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceUnheatedSpaceWalls-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the party wall section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpacePartyWall: wallsData.dwellingSpacePartyWall,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Party wall 1",
			"Pitch": `90 ${degrees.suffix}`,
			"Net surface area": `10 ${metresSquare.suffix}`,
			"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpacePartyWalls-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the wall of heated basement section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: wallsData.dwellingSpaceWallOfHeatedBasement,
				},
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: floorsData.dwellingSpaceFloorOfHeatedBasement,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Wall of heated basement 1",
			"Net surface area": `60 ${metresSquare.suffix}`,
			"U-value": `0.35 ${wattsPerSquareMeterKelvin.suffix}`,
			"Thermal resistance": `2.86 ${squareMeterKelvinPerWatt.suffix}`,
			"Areal heat capacity": "Medium",
			"Mass distribution class": "External",
			"Perimeter": `32 ${metre.suffix}`,
			"Associated floor": "Floor of heated basement 1",
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceWallOfHeatedBasement-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display '-' for associated floor when floor does not exist", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: {
						data: [{
							data: {
								id: "wall-id",
								name: "Wall without floor",
								netSurfaceArea: 60,
								uValue: 0.35,
								thermalResistance: 2.86,
								arealHeatCapacity: "Medium",
								massDistributionClass: "E",
								associatedBasementFloorId: "non-existent-floor-id",
							},
						}],
					},
				},
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: { data: [] },
				},
			},
		});

		await renderSuspended(Summary);

		const lineResult = (await screen.findByTestId(`summary-dwellingSpaceWallOfHeatedBasement-${hyphenate("Associated floor")}`));
		expect(lineResult.querySelector("dd")?.textContent).toBe("-");
	});

	it("displays 'No walls of heated basement added' when no walls of heated basement are provided", async () => {
		await renderSuspended(Summary);

		expect(screen.getByText("No walls of heated basement added")).not.toBeNull();
	});

	it("navigates to create page when 'Add walls of heated basement' link is clicked", async () => {
		await renderSuspended(Summary);

		const wallsTab = screen.getByRole("link", { name: "External walls" });
		await user.click(wallsTab);

		const heatedBasementTab = screen.getByRole("link", { name: "Walls of a heated basement" });
		await user.click(heatedBasementTab);

		const addLink: HTMLAnchorElement = screen.getByRole("link", {
			name: "Add walls of heated basement",
		});

		expect(new URL(addLink.href).pathname).toBe(
			getUrl("dwellingSpaceWallOfHeatedBasementCreate"),
		);
	});

	it("should display data for multiple walls of heated basement", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: {
						data: [
							{
								data: {
									id: "wall-1",
									name: "Wall of heated basement 1",
									netSurfaceArea: 60,
									uValue: 0.35,
									thermalResistance: 2.86,
									arealHeatCapacity: "Medium",
									massDistributionClass: "E",
									associatedBasementFloorId: "heated-basement-floor-id",
								},
							},
							{
								data: {
									id: "wall-2",
									name: "Wall of heated basement 2",
									netSurfaceArea: 50,
									uValue: 0.4,
									thermalResistance: 2.5,
									arealHeatCapacity: "Light",
									massDistributionClass: "I",
									associatedBasementFloorId: "heated-basement-floor-id",
								},
							},
						],
					},
				},
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: floorsData.dwellingSpaceFloorOfHeatedBasement,
				},
			},
		});

		await renderSuspended(Summary);

		const wallsTab2 = screen.getByRole("link", { name: "External walls" });
		await user.click(wallsTab2);
		const heatedBasementTab2 = screen.getByRole("link", { name: "Walls of a heated basement" });
		await user.click(heatedBasementTab2);

		const nameRow = await screen.findByTestId(`summary-dwellingSpaceWallOfHeatedBasement-${hyphenate("Name")}`);
		const nameDds = nameRow.querySelectorAll("dd");
		expect(nameDds[0]?.textContent?.trim()).toBe("Wall of heated basement 1");
		expect(nameDds[1]?.textContent?.trim()).toBe("Wall of heated basement 2");

		const areaRow = await screen.findByTestId(`summary-dwellingSpaceWallOfHeatedBasement-${hyphenate("Net surface area")}`);
		const areaDds = areaRow.querySelectorAll("dd");
		expect(areaDds[0]?.textContent?.trim()).toBe(`60 ${metresSquare.suffix}`);
		expect(areaDds[1]?.textContent?.trim()).toBe(`50 ${metresSquare.suffix}`);
	});

	it("should have section edit link that navigates to the walls edit page", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: {
						data: [
							{
								data: {
									id: "wall-1",
									name: "Wall of heated basement 1",
									netSurfaceArea: 60,
									uValue: 0.35,
									thermalResistance: 2.86,
									arealHeatCapacity: "Medium",
									massDistributionClass: "E",
									associatedBasementFloorId: "heated-basement-floor-id",
								},
							},
						],
					},
				},
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: floorsData.dwellingSpaceFloorOfHeatedBasement,
				},
			},
		});

		await renderSuspended(Summary);

		const wallsTab3 = screen.getByRole("link", { name: "External walls" });
		await user.click(wallsTab3);
		const heatedBasementTab3 = screen.getByRole("link", { name: "Walls of a heated basement" });
		await user.click(heatedBasementTab3);

		const panel = screen.getByTestId("dwellingSpaceWallOfHeatedBasement");
		const editLink = panel.querySelector("a.govuk-link") as HTMLAnchorElement;
		expect(new URL(editLink.href).pathname).toBe(getUrl("dwellingSpaceWalls"));
	});

	it("should show walls of heated basement tab content when tab is selected", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceWallOfHeatedBasement: wallsData.dwellingSpaceWallOfHeatedBasement,
				},
				dwellingSpaceFloors: {
					dwellingSpaceFloorOfHeatedBasement: floorsData.dwellingSpaceFloorOfHeatedBasement,
				},
			},
		});

		await renderSuspended(Summary);

		const wallsOfHeatedBasementTab = screen.getByRole("link", { name: "Walls of a heated basement" });
		await user.click(wallsOfHeatedBasementTab);

		const wallNameResult = await screen.findByTestId(`summary-dwellingSpaceWallOfHeatedBasement-${hyphenate("Name")}`);
		expect(wallNameResult.querySelector("dd")?.textContent).toBe("Wall of heated basement 1");
	});
});

describe("dwelling space ceilings and roofs", () => {
	it("should contain the correct tabs for dwelling space walls", async () => {
		await renderSuspended(Summary);

		expect(screen.getByRole("link", { name: "Ceilings" })).not.toBeNull();
		expect(screen.getByRole("link", { name: "Roofs" })).not.toBeNull();
	});

	it("should display the correct data for the ceilings section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceCeilings: ceilingsAndRoofsData.dwellingSpaceCeilings,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Type of ceiling": "Ceiling to heated space",
			"Name": "Ceiling 1",
			"Net surface area": `5 ${metresSquare.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
			"Pitch": `180 ${degrees.suffix}`,
		};


		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceCeilings-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the roof section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceRoofs: ceilingsAndRoofsData.dwellingSpaceRoofs,
				},
			},
		});

		await renderSuspended(Summary);
		const expectedFlatRoof = {
			"Name": "Flat roof",
			"Type of roof": "Flat above heated space",
			"Pitch": `180 ${degrees.suffix}`,
			"Length": `1 ${metre.suffix}`,
			"Width": `1 ${metre.suffix}`,
			"Elevational height of building element at its base": `2 ${metre.suffix}`,
			"Net surface area": `1 ${metresSquare.suffix}`,
			"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
		};

		for (const [key, value] of Object.entries(expectedFlatRoof)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceRoofs-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}

		const expectedPitchedRoof = {
			"Name": "Pitched roof",
			"Type of roof": "Pitched insulated at roof",
			"Pitch": `180 ${degrees.suffix}`,
			"Orientation": `30 ${degrees.suffix}`,
			"Length": `1 ${metre.suffix}`,
			"Width": `1 ${metre.suffix}`,
			"Elevational height of building element at its base": `2 ${metre.suffix}`,
			"Net surface area": `1 ${metresSquare.suffix}`,
			"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
		};

		for (const [key, value] of Object.entries(expectedPitchedRoof)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceRoofs-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.lastElementChild?.textContent).toBe(value);
		}
	});
});

describe("dwelling space doors", () => {
	it("should contain the correct tabs for dwelling space doors", async () => {
		await renderSuspended(Summary);

		expect(screen.getByRole("link", { name: "External unglazed doors" })).not.toBeNull();
		expect(screen.getByRole("link", { name: "External glazed doors" })).not.toBeNull();
		expect(screen.getByRole("link", { name: "Internal doors" })).not.toBeNull();
	});

	describe("external unglazed doors section", () => {
		it("should display the correct data for the external unglazed doors section", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: {
							data: [{
								data: {
									name: "External unglazed door 1",
									pitch: 72,
									orientation: 24,
									height: 0.5,
									width: 20,
									elevationalHeight: 20,
									arealHeatCapacity: "Very light",
									massDistributionClass: "I",
									colour: "Intermediate",
									uValue: 9,
								},
							}],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "External unglazed door 1",
				"Pitch": `72 ${degrees.suffix}`,
				"Orientation": `24 ${degrees.suffix}`,
				"Height": `0.5 ${metre.suffix}`,
				"Width": `20 ${metre.suffix}`,
				"Elevational height of building element at its base": `20 ${metre.suffix}`,
				"Areal heat capacity": "Very light",
				"Mass distribution class": "Internal",
				"U-value": `9 ${wattsPerSquareMeterKelvin.suffix}`,
				"Is this the front door?": "-",
			};


			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceUnglazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data when external door has tagged item", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: wallsData.dwellingSpaceExternalWall,
					},
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor:
							doorsData.dwellingSpaceExternalUnglazedDoor,
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "External unglazed door 1",
				"Pitch": `${wallsData.dwellingSpaceExternalWall.data[0]?.data.pitch} ${degrees.suffix}`,
				"Orientation": `${wallsData.dwellingSpaceExternalWall.data[0]?.data.orientation} ${degrees.suffix}`,
				"Height": `0.5 ${metre.suffix}`,
				"Width": `20 ${metre.suffix}`,
				"Elevational height of building element at its base": `20 ${metre.suffix}`,
				"Areal heat capacity": "Very light",
				"Mass distribution class": "Internal",
				"U-value": `9 ${wattsPerSquareMeterKelvin.suffix}`,
				"Is this the front door?": "Yes",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceUnglazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe("external glazed doors section", () => {
		it("should display the correct data for an item without a tagged wall ", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{
								data: {
									name: "External glazed door 1",
									pitch: 72,
									orientation: 24,
									height: 1,
									width: 1,
									solarTransmittance: 0.1,
									elevationalHeight: 1,
									openingToFrameRatio: 0.2,
									maximumOpenableArea: 1,
									midHeightOpenablePart1: 1,
									uValue: 10,
									isTheFrontDoor: true,
									securityRisk: false,
									heightOpenableArea: 2,
									curtainsOrBlinds: true,
									treatmentType: "blinds",
									thermalResistivityIncrease: 1,
									solarTransmittanceReduction: 0.1,
									hasShading: false,
								},
							}],
						},
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "External glazed door 1",
				"Orientation": `24 ${degrees.suffix}`,
				"Height": `1 ${metre.suffix}`,
				"Width": `1 ${metre.suffix}`,
				"Pitch": `72 ${degrees.suffix}`,
				"Transmittance of solar energy": "0.1",
				"Elevational height of building element at its base": `1 ${metre.suffix}`,
				"U-value": `10 ${wattsPerSquareMeterKelvin.suffix}`,
				"Is this the front door?": "Yes",
				"Curtains or blinds": "Blinds",
				"Thermal resistivity increase": `1 ${wattsPerSquareMeterKelvin.suffix}`,
				"Solar transmittance reduction": "0.1",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceGlazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for an item with a tagged wall ", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: wallsData.dwellingSpaceExternalWall,
					},
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor:
							doorsData.dwellingSpaceExternalGlazedDoor,
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "External glazed door 1",
				"Orientation": `0 ${degrees.suffix}`,
				"Height": `1 ${metre.suffix}`,
				"Width": `1 ${metre.suffix}`,
				"Pitch": `90 ${degrees.suffix}`,
				"Transmittance of solar energy": "0.1",
				"Elevational height of building element at its base": `1 ${metre.suffix}`,
				"U-value": `10 ${wattsPerSquareMeterKelvin.suffix}`,
				"Is this the front door?": "-",
				"Curtains or blinds": "Blinds",
				"Thermal resistivity increase": `1 ${wattsPerSquareMeterKelvin.suffix}`,
				"Solar transmittance reduction": "0.1",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceGlazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays the correct data when shading is added", async () => {
			const store = useEcaasStore();
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: wallsData.dwellingSpaceExternalWall,
					},
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{
								data: {
									...externalGlazedDoorData,
									hasShading: true,
									shading: [
										{ name: "Test 1", typeOfShading: "obstacle", distance: 1, height: 11, transparency: 11 },
										{ name: "Test 2", typeOfShading: "left_side_fin", distance: 2, depth: 22 },
										{ name: "Test 3", typeOfShading: "right_side_fin", distance: 3, depth: 33 },
										{ name: "Test 4", typeOfShading: "overhang", distance: 4, depth: 44 },
										{ name: "Test 5", typeOfShading: "frame_or_reveal", distance: 5, depth: 55 },
									] satisfies ShadingObjectData[],
								} satisfies ExternalGlazedDoorData,
							}],
						},
					},
				},
			});
			const baseExpected = {
				"Name": "External glazed door 1",
				"Orientation": `0 ${degrees.suffix}`,
				"Height": `1 ${metre.suffix}`,
				"Width": `1 ${metre.suffix}`,
				"Pitch": `90 ${degrees.suffix}`,
				"Transmittance of solar energy": "0.1",
				"Elevational height of building element at its base": `1 ${metre.suffix}`,
				"U-value": `10 ${wattsPerSquareMeterKelvin.suffix}`,
				"Is this the front door?": "-",
				"Curtains or blinds": "Blinds",
				"Thermal resistivity increase": `1 ${wattsPerSquareMeterKelvin.suffix}`,
				"Solar transmittance reduction": "0.1",
			};
			const shading1Expected = {
				"Name of shading 1": "Test 1",
				"Type of shading 1": "Obstacle",
				"Distance of shading 1 from glass": `1 ${metre.suffix}`,
				"Height of shading 1": `11 ${metre.suffix}`,
				"Transparency of shading 1": "11 %",
			};
			const shading2Expected = {
				"Name of shading 2": "Test 2",
				"Type of shading 2": "Left side fin",
				"Distance of shading 2 from glass": `2 ${metre.suffix}`,
				"Depth of shading 2": `22 ${metre.suffix}`,
			};
			const shading3Expected = {
				"Name of shading 3": "Test 3",
				"Type of shading 3": "Right side fin",
				"Distance of shading 3 from glass": `3 ${metre.suffix}`,
				"Depth of shading 3": `33 ${metre.suffix}`,
			};
			const shading4Expected = {
				"Name of shading 4": "Test 4",
				"Type of shading 4": "Overhang",
				"Distance of shading 4 from glass": `4 ${metre.suffix}`,
				"Depth of shading 4": `44 ${metre.suffix}`,
			};
			const shading5Expected = {
				"Name of shading 5": "Test 5",
				"Type of shading 5": "Frame or reveal",
				"Distance of shading 5 from glass": `5 ${metre.suffix}`,
				"Depth of shading 5": `55 ${metre.suffix}`,
			};
			await renderSuspended(Summary);

			for (const [key, value] of Object.entries({
				...baseExpected,
				...shading1Expected,
				...shading2Expected,
				...shading3Expected,
				...shading4Expected,
				...shading5Expected,
			})) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceGlazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("displays transparency for obstacle when non-obstacle shading is added first", async () => {
			const store = useEcaasStore();
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: {
							data: [{
								data: {
									...doorsData.dwellingSpaceExternalGlazedDoor.data,
									hasShading: true,
									shading: [
										{ name: "Test 1", typeOfShading: "left_side_fin", distance: 1, depth: 11 },
									],
								},
							},
							{
								data: {
									...doorsData.dwellingSpaceExternalGlazedDoor.data,
									hasShading: true,
									shading: [
										{ name: "Test 2", typeOfShading: "obstacle", distance: 2, height: 22, transparency: 22 },
									],
								},
							}],
						},
					},
				},
			});

			await renderSuspended(Summary);
			const transparencyExpected = {
				"Name of shading 1": "Test 2",
				"Type of shading 1": "Obstacle",
				"Distance of shading 1 from glass": `2 ${metre.suffix}`,
				"Height of shading 1": `22 ${metre.suffix}`,
				"Transparency of shading 1": "22 %",
				"Depth of shading 1": "-",
			};
			for (const [key, value] of Object.entries(transparencyExpected)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceGlazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				const ddCells = lineResult.querySelectorAll("dd");
				expect(ddCells[1]?.textContent).toBe(value);
			}
		});
	});

	it("should display the correct data for the internal doors section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceInternalWall: wallsData.dwellingSpaceInternalWall,
				},
				dwellingSpaceDoors: {
					dwellingSpaceInternalDoor: doorsData.dwellingSpaceInternalDoor,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Type": "Internal door to heated space",
			"Name": "Internal 1",
			"Net surface area of element": `5 ${metresSquare.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
			"Pitch": `10 ${degrees.suffix}`,
		};


		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceInternalDoors-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("when internal door can be the front door", async () => {
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data:
					{
						typeOfDwelling: "flat",
					},
				},
			}, dwellingFabric: {
				dwellingSpaceWalls: {
					dwellingSpaceInternalWall: wallsData.dwellingSpaceInternalWall,
				},
				dwellingSpaceDoors: {
					dwellingSpaceInternalDoor: doorsData.dwellingSpaceInternalDoor,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Type": "Internal door to heated space",
			"Name": "Internal 1",
			"Pitch": `10 ${degrees.suffix}`,
			"Net surface area of element": `5 ${metresSquare.suffix}`,
			"Areal heat capacity": "Very light",
			"Mass distribution class": "Internal",
			"Is this the front door?": "Yes",
			"Orientation": "45",
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceInternalDoors-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});
});

describe("dwelling space windows", () => {
	it("should contain the correct tabs for dwelling space windows", async () => {
		await renderSuspended(Summary);

		expect(screen.getByRole("link", { name: "Windows" })).not.toBeNull();
	});

	it("should display the correct data for the windows section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [windowDataWithShading],
					complete: true,
				},
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: wallsData.dwellingSpaceExternalWall,
				},
			},
		});

		await renderSuspended(Summary);
		const baseExpected = {
			"Name": "Window 1",
			"Orientation": `0 ${degrees.suffix}`,
			"Height": `1 ${metre.suffix}`,
			"Width": `1 ${metre.suffix}`,
			"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
			"Pitch": `90 ${degrees.suffix}`,
			"Security risk": "Yes",
			"Transmittance of solar energy": "0.1",
			"Elevational height of building element at its base": `1 ${metre.suffix}`,
			"Number of openable parts": "0",
			"Type": "Blinds",
			"Thermal resistivity increase": `1 ${wattsPerSquareMeterKelvin.suffix}`,
			"Solar transmittance reduction": "0.1",
		};

		const shading1Expected = {
			"Name of shading 1": "Test 1",
			"Type of shading 1": "Obstacle",
			"Distance of shading 1 from glass": `1 ${metre.suffix}`,
			"Height of shading 1": `11 ${metre.suffix}`,
			"Transparency of shading 1": "11 %",
		};
		const shading2Expected = {
			"Name of shading 2": "Test 2",
			"Type of shading 2": "Left side fin",
			"Distance of shading 2 from glass": `2 ${metre.suffix}`,
			"Depth of shading 2": `22 ${metre.suffix}`,
		};
		const shading3Expected = {
			"Name of shading 3": "Test 3",
			"Type of shading 3": "Right side fin",
			"Distance of shading 3 from glass": `3 ${metre.suffix}`,
			"Depth of shading 3": `33 ${metre.suffix}`,
		};
		const shading4Expected = {
			"Name of shading 4": "Test 4",
			"Type of shading 4": "Overhang",
			"Distance of shading 4 from glass": `4 ${metre.suffix}`,
			"Depth of shading 4": `44 ${metre.suffix}`,
		};
		const shading5Expected = {
			"Name of shading 5": "Test 5",
			"Type of shading 5": "Frame or reveal",
			"Distance of shading 5 from glass": `5 ${metre.suffix}`,
			"Depth of shading 5": `55 ${metre.suffix}`,
		};

		for (const [key, value] of Object.entries({
			...baseExpected,
			...shading1Expected,
			...shading2Expected,
			...shading3Expected,
			...shading4Expected,
			...shading5Expected,
		})) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceWindows-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("displays transparency for obstacle when non-obstacle shading is added first", async () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: [{
						data: {
							...doorsData.dwellingSpaceExternalGlazedDoor.data,
							hasShading: true,
							shading: [
								{ name: "Test 1", typeOfShading: "left_side_fin", distance: 1, depth: 11 },
							],
						},
					},
					{
						data: {
							...doorsData.dwellingSpaceExternalGlazedDoor.data,
							hasShading: true,
							shading: [
								{ name: "Test 2", typeOfShading: "obstacle", distance: 2, height: 22, transparency: 22 },
							],
						},
					}],
				},
			},
		});

		await renderSuspended(Summary);
		const transparencyExpected = {
			"Name of shading 1": "Test 2",
			"Type of shading 1": "Obstacle",
			"Distance of shading 1 from glass": `2 ${metre.suffix}`,
			"Height of shading 1": `22 ${metre.suffix}`,
			"Transparency of shading 1": "22 %",
			"Depth of shading 1": "-",
		};
		for (const [key, value] of Object.entries(transparencyExpected)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceWindows-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			const ddCells = lineResult.querySelectorAll("dd");
			expect(ddCells[1]?.textContent).toBe(value);
		}
	});
});

describe("dwelling space thermal bridges", () => {
	it("should contain the correct tabs for dwelling space thermal bridges", async () => {
		await renderSuspended(Summary);

		expect(screen.getByRole("link", { name: "Linear thermal bridges" })).not.toBeNull();
		expect(screen.getByRole("link", { name: "Point thermal bridges" })).not.toBeNull();
	});

	it("should display the correct data for the linear thermal bridges section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceThermalBridging: {
					dwellingSpaceLinearThermalBridges: thermalBridgingData.dwellingSpaceLinearThermalBridges,
				},
			},
		});

		await renderSuspended(Summary);
		const expectedResult = {
			"Type of thermal bridge": "E1",
			"Linear thermal transmittance": `1 ${wattsPerMeterKelvin.suffix}`,
			"Length of thermal bridge": `2 ${metre.suffix}`,
		};


		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpaceLinearThermalBridging-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});

	it("should display the correct data for the point thermal bridges section", async () => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceThermalBridging: {
					dwellingSpacePointThermalBridges: thermalBridgingData.dwellingSpacePointThermalBridges,
				},
			},
		});

		await renderSuspended(Summary);

		const expectedResult = {
			"Name": "Point 1",
			"Heat transfer coefficient": `1 ${wattsPerKelvin.suffix}`,
		};

		for (const [key, value] of Object.entries(expectedResult)) {
			const lineResult = (await screen.findByTestId(`summary-dwellingSpacePointThermalBridging-${hyphenate(key)}`));
			expect(lineResult.querySelector("dt")?.textContent).toBe(key);
			expect(lineResult.querySelector("dd")?.textContent).toBe(value);
		}
	});
});

