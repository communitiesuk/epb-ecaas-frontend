import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import type { CeilingsAndRoofsData, DoorsData, FloorsData, DwellingSpaceZoneParametersData, ThermalBridgingData, WallsData, WindowData } from '~/stores/ecaasStore.types';
import { FloorType, MassDistributionClass, WindowTreatmentType } from '~/schema/api-schema.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const zoneParametersData: DwellingSpaceZoneParametersData = {
	area: 10,
	volume: 10,
	numberOfLEDBulbs: 8,
	numberOfIncandescentBulbs: 3,
	// spaceHeatingSystemForThisZone: 'elec heater',
	// spaceCoolingSystemForThisZone: [],
	// spaceHeatControlSystemForThisZone: []
};

const floorsData: FloorsData = {
	dwellingSpaceGroundFloor: {
		data: [{
			name: "Ground 1",
			surfaceArea: 5,
			pitch: 0,
			uValue: 1,
			thermalResistance: 1,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I,
			perimeter: 0,
			psiOfWallJunction: 0,
			thicknessOfWalls: 0.3,
			typeOfGroundFloor: FloorType.Slab_no_edge_insulation
		}]
	},
	dwellingSpaceInternalFloor: {
		data: [{
			typeOfInternalFloor: AdjacentSpaceType.heatedSpace,
			name: "Internal 1",
			surfaceAreaOfElement: 5,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I,
		}]
	},
	dwellingSpaceExposedFloor: {
		data: [{
			name: "Exposed Floor 1",
			pitch: 0,
			orientation: 0,
			length: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I
		}]
	}
};

const wallsData: WallsData = {
	dwellingSpaceExternalWall: {
		data: [{
			name: "External wall 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			height: 0.5,
			length: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I
		}]
	},
	dwellingSpaceInternalWall: {
		data: [{
			name: "Internal 1",
			surfaceAreaOfElement: 5,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I,
			pitchOption: 'custom',
			pitch: 0
		}]
	},
	dwellingSpaceWallToUnheatedSpace: {
		data: [{
			name: 'Wall to unheated space 1',
			surfaceAreaOfElement: 500,
			uValue: 10,
			arealHeatCapacity:50000,
			massDistributionClass: MassDistributionClass.E,
			pitchOption: '90',
			pitch: 90,
			thermalResistanceOfAdjacentUnheatedSpace: 1
		}]
	},
	dwellingSpacePartyWall: {
		data: [{
			name: "Party wall 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			height: 0.5,
			length: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I
		}]
	}
};

const ceilingsAndRoofsData: CeilingsAndRoofsData = {
	dwellingSpaceCeilings: {
		data: [{
			type: AdjacentSpaceType.heatedSpace,
			name: "Ceiling 1",
			surfaceArea: 5,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I,
			pitchOption: 'custom',
			pitch: 180
		}]
	},
	dwellingSpaceRoofs: {
		data: [{
			name: "Roof 1",
			typeOfRoof: 'flat',
			pitchOption: 'custom',
			pitch: 180,
			orientation: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorptionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I
		}]
	},
	dwellingSpaceUnheatedPitchedRoofs: {
		data: [{
			name: "Roof 1",
			typeOfRoof: 'unheatedPitched',
			pitch: 0,
			orientation: 90,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorptionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: MassDistributionClass.I
		}]
	}
};

const doorsData: DoorsData = {
	dwellingSpaceExternalUnglazedDoor: {
		data: [{
			name: "External unglazed door 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I
		}]
	},
	dwellingSpaceExternalGlazedDoor: {
		data: [{
			name: "External glazed door 1",
			orientation: 1,
			surfaceArea: 1,
			height: 1,
			width: 1,
			uValue: 1,
			pitchOption: '90',
			pitch: 90,
			solarTransmittance: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			numberOpenableParts: '0',
			frameToOpeningRatio: 0.8,
		}]
	},
	dwellingSpaceInternalDoor: {
		data: [{
			typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
			name: "Internal 1",
			surfaceArea: 5,
			kappaValue: 100,
			massDistributionClass: MassDistributionClass.I,
			pitchOption: '90',
			pitch: 90
		}]
	}
};

const windowData: WindowData = {
	name: "Window 1",
	orientation: 1,
	surfaceArea: 1,
	height: 1,
	width: 1,
	uValue: 1,
	pitchOption: '90',
	pitch: 90,
	solarTransmittance: 0.1,
	elevationalHeight: 1,
	midHeight: 1,
	frameToOpeningRatio: 0.8,
	numberOpenableParts: '0',
	overhangDepth: 1,
	overhangDistance: 1,
	sideFinRightDepth: 1,
	sideFinRightDistance: 1,
	sideFinLeftDepth: 1,
	sideFinLeftDistance: 1,
	treatmentType: WindowTreatmentType.blinds,
	thermalResistivityIncrease: 1,
	solarTransmittanceReduction: 0.1,
};

const thermalBridgingData: ThermalBridgingData = {
	dwellingSpaceLinearThermalBridges: {
		data: [{
			name: 'E1: Steel lintel with perforated steel base plate',
			typeOfThermalBridge: 'e1',
			linearThermalTransmittance: 1,
			length: 2
		}]
	},
	dwellingSpacePointThermalBridges: {
		data: [{
			name: 'Point 1',
			heatTransferCoefficient: 1
		}]
	}
};

describe('Living space fabric summary', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	describe('Living space zone parameters', () => {
		it('should contain the correct tabs for dwelling space zone parameters', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Zone parameters'}));
		});

		it('should display the correct data for the ground floor section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceZoneParameters: {
						data: zoneParametersData
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Area": "10",
				"Volume": "10",
				"Number of LED bulbs": "8",
				"Number of incandescent bulbs": "3",
				// "Heat emitting system for this zone": "Elec heater",
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceZoneParameters-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('Living space floors', () => {
		it('should contain the correct tabs for dwelling space floors', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Ground floor'}));
			expect(screen.getByRole('link', {name: 'Internal floor'}));
			expect(screen.getByRole('link', {name: 'Exposed floor'}));
		});
	
		it('should display the correct data for the ground floor section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceGroundFloor: floorsData.dwellingSpaceGroundFloor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Ground 1",
				"Net surface area of this element": "5",
				"Pitch": "0",
				"U-value": "1",
				"Thermal resistance": "1",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal",
				"Perimeter": "0",
				"Psi of wall junction": "0",
				"Thickness of walls for ground floor": "0.3",
				"Type of ground floor": "Slab no edge insulation"

			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceGroundFloors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the internal floor section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceInternalFloor: floorsData.dwellingSpaceInternalFloor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type of internal floor": "Internal floor to heated space",
				"Name": "Internal 1",
				"Net surface area of element": "5",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal",
			};
			
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceInternalFloors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the exposed floor section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceFloors: {
						dwellingSpaceExposedFloor: floorsData.dwellingSpaceExposedFloor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Exposed Floor 1",
				"Pitch": "0",
				"Orientation": "0",
				"Length": "0.5",
				"Width": "20",
				"Elevational height of building element at its base": "20",
				"Net surface area": "10",
				"Solar absorption coefficient": "0.1",
				"U-value": "1",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal"
			};
			
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceExposedFloors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('Living space walls', () => {
		it('should contain the correct tabs for dwelling space walls', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'External wall'}));
			expect(screen.getByRole('link', {name: 'Internal wall'}));
			expect(screen.getByRole('link', {name: 'Wall to unheated space'}));
			expect(screen.getByRole('link', {name: 'Party wall'}));
		});
	
		it('should display the correct data for the external wall section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceExternalWall: wallsData.dwellingSpaceExternalWall
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "External wall 1",
				"Pitch": "90",
				"Orientation": "0",
				"Height": "0.5",
				"Length": "20",
				"Elevational height of building element at its base": "20",
				"Net surface area": "10",
				"Solar absorption coefficient": "0.1",
				"U-value": "1",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal"
			};
			
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceExternalWalls-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the internal wall section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceInternalWall: wallsData.dwellingSpaceInternalWall
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Internal 1",
				"Net surface area of element": "5",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal",
				"Pitch": "0"
			};
			
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceInternalWalls-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the wall to unheated space section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpaceWallToUnheatedSpace: wallsData.dwellingSpaceWallToUnheatedSpace
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Wall to unheated space 1",
				"Net surface area of element": "500",
				"U-value": "10",
				"Areal heat capacity": "Very light",
				"Mass distribution class": "External",
				"Pitch": "90",
				"Thermal resistance of adjacent unheated space": "1"
			};
			
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceUnheatedSpaceWalls-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the party wall section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWalls: {
						dwellingSpacePartyWall: wallsData.dwellingSpacePartyWall
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Party wall 1",
				"Pitch": "90",
				"Orientation": "0",
				"Height": "0.5",
				"Length": "20",
				"Elevational height of building element at its base": "20",
				"Net surface area": "10",
				"Solar absorption coefficient": "0.1",
				"U-value": "1",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal"
			};
			
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpacePartyWalls-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('dwelling space ceilings and roofs', () => {
		it('should contain the correct tabs for dwelling space walls', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Ceiling'}));
			expect(screen.getByRole('link', {name: 'Roof'}));
		});
	
		it('should display the correct data for the ceilings section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: ceilingsAndRoofsData.dwellingSpaceCeilings
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type of ceiling": "Ceiling to heated space",
				"Name": "Ceiling 1",
				"Net surface area": "5",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal",
				"Pitch": "180"
			};
			
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceCeilings-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the roof section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: ceilingsAndRoofsData.dwellingSpaceRoofs
					}
				}
			});
	
			await renderSuspended(Summary);
			const expectedResult = {
				"Name": "Roof 1",
				"Type of roof": "Flat",
				"Pitch": "180",
				"Orientation": "0",
				"Length": "1",
				"Width": "1",
				"Elevational height of building element at its base": "2",
				"Net surface area": "1",
				"Solar absorption coefficient": "0.5",
				"U-value": "1",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal"
			};
			

			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceRoofs-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the unheated pitched roof section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceUnheatedPitchedRoofs: ceilingsAndRoofsData.dwellingSpaceUnheatedPitchedRoofs
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Roof 1",
				"Type of roof": "Unheated pitched",
				"Pitch": "0",
				"Orientation": "90",
				"Length": "1",
				"Width": "1",
				"Elevational height of building element at its base": "2",
				"Net surface area of ceiling": "1",
				"Solar absorption coefficient": "0.5",
				"U-value": "1",
				"Areal heat capacity": "50000",
				"Mass distribution class": "Internal"
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceUnheatedPitchedRoofs-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('dwelling space doors', () => {
		it('should contain the correct tabs for dwelling space doors', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'External unglazed door'}));
			expect(screen.getByRole('link', {name: 'External glazed door'}));
			expect(screen.getByRole('link', {name: 'Internal door'}));
		});
	
		it('should display the correct data for the external unglazed doors section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalUnglazedDoor: doorsData.dwellingSpaceExternalUnglazedDoor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "External unglazed door 1",
				"Pitch": "90",
				"Orientation": "0",
				"Height": "0.5",
				"Width": "20",
				"Elevational height of building element at its base": "20",
				"Net surface area": "10",
				"Solar absorption coefficient": "0.1",
				"U-value": "1",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal"
			};
			
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceUnglazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the external glazed doors section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceExternalGlazedDoor: doorsData.dwellingSpaceExternalGlazedDoor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "External glazed door 1",
				"Orientation": "1",
				"Net surface area": "1",
				"Height": "1",
				"Width": "1",
				"U-value": "1",
				"Pitch": "90",
				"Transmittance of solar energy": "0.1",
				"Elevational height of building element at its base": "1",
				"Mid height": "1",
				"Number of openable parts": "0"
			};
			
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceGlazedDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the internal doors section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceDoors: {
						dwellingSpaceInternalDoor: doorsData.dwellingSpaceInternalDoor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type": "Internal door to heated space",
				"Name": "Internal 1",
				"Net surface area of element": "5",
				"Areal heat capacity": "100",
				"Mass distribution class": "Internal",
				"Pitch": "90"
			};
			
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceInternalDoors-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('dwelling space windows', () => {
		it('should contain the correct tabs for dwelling space windows', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Windows'}));
		});
	
		it('should display the correct data for the windows section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceWindows: {
						data: [windowData]
					}
				}
			});
	
			await renderSuspended(Summary);
			const expectedResult = {
				"Name": "Window 1",
				"Orientation": "1",
				"Net surface area": "1",
				"Height": "1",
				"Width": "1",
				"U-value": "1",
				"Pitch": "90",
				"Transmittance of solar energy": "0.1",
				"Elevational height of building element at its base": "1",
				"Mid height": "1",
				"Number of openable parts": "0",
				"Overhang depth": "1",
				"Overhang distance": "1",
				"Side fin right depth": "1",
				"Side fin right distance": "1",
				"Side fin left depth": "1",
				"Side fin left distance": "1",
				"Type": "Blinds",
				"Thermal resistivity increase": "1",
				"Solar transmittance reduction": "0.1"
			};
			
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceWindows-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('dwelling space thermal bridges', () => {
		it('should contain the correct tabs for dwelling space thermal bridges', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Linear thermal bridges'}));
			expect(screen.getByRole('link', {name: 'Point thermal bridges'}));
		});
	
		it('should display the correct data for the linear thermal bridges section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpaceLinearThermalBridges: thermalBridgingData.dwellingSpaceLinearThermalBridges
					}
				}
			});
	
			await renderSuspended(Summary);
			const expectedResult = {
				"Name": "E1: Steel lintel with perforated steel base plate",
				"Type of thermal bridge": "E1",
				"Linear thermal transmittance": "1",
				"Length of thermal bridge": "2"
			};
			
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpaceLinearThermalBridging-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the point thermal bridges section', async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceThermalBridging: {
						dwellingSpacePointThermalBridges: thermalBridgingData.dwellingSpacePointThermalBridges
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Point 1",
				"Heat transfer coefficient": "1"
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-dwellingSpacePointThermalBridging-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});
});