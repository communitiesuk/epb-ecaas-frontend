import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import Summary from "./summary.vue";
import { screen } from "@testing-library/vue";
import type { CeilingsAndRoofsData, DoorsData, FloorsData, DwellingSpaceZoneParametersData, ThermalBridgingData, WallsData, WindowData, DwellingSpaceLightingData } from "~/stores/ecaasStore.schema";
import { metre, millimetre } from "~/utils/units/length";
import { squareMeterKelvinPerWatt, wattsPerKelvin, wattsPerMeterKelvin, wattsPerSquareMeterKelvin } from "~/utils/units/thermalConductivity";
import { degrees } from "~/utils/units/angle";
import { metresSquare } from "~/utils/units/area";
import { cubicMetre } from "~/utils/units/volume";
import { unitValue } from "~/utils/units";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
	return navigateToMock;
});

const zoneParametersData: DwellingSpaceZoneParametersData = {
	area: 10,
	volume: 10,
	// spaceHeatingSystemForThisZone: 'elec heater',
	// spaceCoolingSystemForThisZone: [],
	// spaceHeatControlSystemForThisZone: []
};

const lightingData: DwellingSpaceLightingData = {
	numberOfBulbs: 8,
};

const floorsData: FloorsData = {
	dwellingSpaceGroundFloor: {
		data: [{
			data: {
				name: "Ground 1",
				surfaceArea: 5,
				uValue: 1,
				thermalResistance: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				perimeter: 0,
				psiOfWallJunction: 0,
				thicknessOfWalls: 0.3,
				typeOfGroundFloor: "Slab_no_edge_insulation",
			},
		}],
	},
	dwellingSpaceInternalFloor: {
		data: [{
			data: {
				typeOfInternalFloor: AdjacentSpaceType.heatedSpace,
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
				orientation: 0,
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
};

const wallsData: WallsData = {
	dwellingSpaceExternalWall: {
		data: [{
			data: {
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
				name: "Internal 1",
				surfaceAreaOfElement: 5,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				pitchOption: "custom",
				pitch: 0,
			},
		}],
	},
	dwellingSpaceWallToUnheatedSpace: {
		data: [{
			data: {
				name: "Wall to unheated space 1",
				surfaceAreaOfElement: 500,
				uValue: 10,
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
				name: "Party wall 1",
				pitchOption: "90",
				pitch: 90,
				surfaceArea: 10,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
			},
		}],
	},
};

const ceilingsAndRoofsData: CeilingsAndRoofsData = {
	dwellingSpaceCeilings: {
		data: [{
			data: {
				type: AdjacentSpaceType.heatedSpace,
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
				typeOfRoof: "flat",
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

const doorsData: DoorsData = {
	dwellingSpaceExternalUnglazedDoor: {
		data: [{
			data:
			{
				name: "External unglazed door 1",
				pitchOption: "90",
				pitch: 90,
				orientation: 0,
				height: 0.5,
				width: 20,
				elevationalHeight: 20,
				surfaceArea: 10,
				uValue: 1,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				colour: "Intermediate",
			},
		}],
	},
	dwellingSpaceExternalGlazedDoor: {
		data: [{
			data: {
				name: "External glazed door 1",
				orientation: 1,
				height: 1,
				width: 1,
				uValue: 1,
				pitchOption: "90",
				pitch: 90,
				solarTransmittance: 0.1,
				elevationalHeight: 1,
				midHeight: 1,
				openingToFrameRatio: 0.2,
				maximumOpenableArea: 1,
				midHeightOpenablePart1: 1,
				heightOpenableArea: 1,
			},
		}],
	},
	dwellingSpaceInternalDoor: {
		data: [{
			data: {
				typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
				name: "Internal 1",
				surfaceArea: 5,
				arealHeatCapacity: "Very light",
				massDistributionClass: "I",
				pitchOption: "90",
				pitch: 90,
			},
		}],
	},
};

const windowData: EcaasForm<WindowData> = {
	data: {
		name: "Window 1",
		orientation: 1,
		height: 1,
		width: 1,
		uValue: 1,
		pitchOption: "90",
		pitch: 90,
		securityRisk: true,
		solarTransmittance: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		openingToFrameRatio: 0.2,
		numberOpenableParts: "0",
		overhangDepth: unitValue(100, millimetre),
		overhangDistance: unitValue(100, millimetre),
		sideFinRightDepth: unitValue(100, millimetre),
		sideFinRightDistance: unitValue(100, millimetre),
		sideFinLeftDepth: unitValue(100, millimetre),
		sideFinLeftDistance: unitValue(100, millimetre),
		curtainsOrBlinds: true,
		treatmentType: "blinds",
		thermalResistivityIncrease: 1,
		solarTransmittanceReduction: 0.1,
	},
};

const thermalBridgingData: ThermalBridgingData = {
	dwellingSpaceLinearThermalBridges: {
		data: [{
			data: {
				name: "E1: Steel lintel with perforated steel base plate",
				typeOfThermalBridge: "E1",
				linearThermalTransmittance: 1,
				length: 2,
			},
		}],
	},
	dwellingSpacePointThermalBridges: {
		data: [{
			data: {
				name: "Point 1",
				heatTransferCoefficient: 1,
			},
		}],
	},
};

describe("Dwelling space fabric summary", () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

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
				"Area": `10 ${metresSquare.suffix}`,
				"Volume": `10 ${cubicMetre.suffix}`,
				// "Heat emitting system for this zone": "Elec heater",
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
						data: lightingData,
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Number of bulbs": "8",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceLighting-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe("Dwelling space floors", () => {
		it("should contain the correct tabs for dwelling space floors", async () => {
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "Ground floors" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Internal floors" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Exposed floors" })).not.toBeNull();
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
				"Net surface area of this element": `5 ${metresSquare.suffix}`,
				"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
				"Thermal resistance": `1 ${squareMeterKelvinPerWatt.suffix}`,
				"Areal heat capacity": "Very light",
				"Mass distribution class": "Internal",
				"Perimeter": `0 ${metre.suffix}`,
				"Psi of wall junction": `0 ${wattsPerMeterKelvin.suffix}`,
				"Thickness of walls at the edge of the floor": `0.3 ${millimetre.suffix}`,
				"Type of ground floor": "Slab no edge insulation",
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceGroundFloors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
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
				"Solar absorption coefficient": "0.1",
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
	});

	describe("Dwelling space walls", () => {
		it("should contain the correct tabs for dwelling space walls", async () => {
			await renderSuspended(Summary);

			expect(screen.getByRole("link", { name: "External walls" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Internal walls" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Walls to unheated spaces" })).not.toBeNull();
			expect(screen.getByRole("link", { name: "Party walls" })).not.toBeNull();
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
				"Solar absorption coefficient": "0.1",
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
				"Pitch": `0 ${degrees.suffix}`,
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
				"U-value": `10 ${wattsPerSquareMeterKelvin.suffix}`,
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
				"Type of roof": "Flat",
				"Pitch": `180 ${degrees.suffix}`,
				"Length": `1 ${metre.suffix}`,
				"Width": `1 ${metre.suffix}`,
				"Elevational height of building element at its base": `2 ${metre.suffix}`,
				"Net surface area": `1 ${metresSquare.suffix}`,
				"Solar absorption coefficient": "0.5",
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
				"Solar absorption coefficient": "0.5",
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

		it("should display the correct data for the external unglazed doors section", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: doorsData.dwellingSpaceExternalUnglazedDoor,
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "External unglazed door 1",
				"Pitch": `90 ${degrees.suffix}`,
				"Orientation": `0 ${degrees.suffix}`,
				"Height": `0.5 ${metre.suffix}`,
				"Width": `20 ${metre.suffix}`,
				"Elevational height of building element at its base": `20 ${metre.suffix}`,
				"Net surface area": `10 ${metresSquare.suffix}`,
				"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
				"Areal heat capacity": "Very light",
				"Mass distribution class": "Internal",
			};


			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceUnglazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the external glazed doors section", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: doorsData.dwellingSpaceExternalGlazedDoor,
					},
				},
			});

			await renderSuspended(Summary);

			const expectedResult = {
				"Name": "External glazed door 1",
				"Orientation": `1 ${degrees.suffix}`,
				"Height": `1 ${metre.suffix}`,
				"Width": `1 ${metre.suffix}`,
				"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
				"Pitch": `90 ${degrees.suffix}`,
				"Transmittance of solar energy": "0.1",
				"Elevational height of building element at its base": `1 ${metre.suffix}`,
				"Mid height": `1 ${metre.suffix}`,
			};

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceGlazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it("should display the correct data for the internal doors section", async () => {
			store.$patch({
				dwellingFabric: {
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
				"Pitch": `90 ${degrees.suffix}`,
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
						data: [windowData],
						complete: true,
					},
				},
			});

			await renderSuspended(Summary);
			const expectedResult = {
				"Name": "Window 1",
				"Orientation": `1 ${degrees.suffix}`,
				"Height": `1 ${metre.suffix}`,
				"Width": `1 ${metre.suffix}`,
				"U-value": `1 ${wattsPerSquareMeterKelvin.suffix}`,
				"Pitch": `90 ${degrees.suffix}`,
				"Security risk": "Yes",
				"Transmittance of solar energy": "0.1",
				"Elevational height of building element at its base": `1 ${metre.suffix}`,
				"Mid height": `1 ${metre.suffix}`,
				"Number of openable parts": "0",
				"Overhang depth": `100 ${millimetre.suffix}`,
				"Overhang distance from glass": `100 ${millimetre.suffix}`,
				"Side fin right depth": `100 ${millimetre.suffix}`,
				"Side fin right distance from glass": `100 ${millimetre.suffix}`,
				"Side fin left depth": `100 ${millimetre.suffix}`,
				"Side fin left distance from glass": `100 ${millimetre.suffix}`,
				"Type": "Blinds",
				"Thermal resistivity increase": `1 ${wattsPerSquareMeterKelvin.suffix}`,
				"Solar transmittance reduction": "0.1",
			};


			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceWindows-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
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
});