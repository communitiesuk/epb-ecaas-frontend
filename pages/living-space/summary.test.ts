import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import type { CeilingsAndRoofsData, DoorsData, FloorsData, LivingSpaceZoneParametersData, ThermalBridgingData, WallsData, WindowData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const zoneParametersData: LivingSpaceZoneParametersData = {
	area: 10,
	volume: 10,
	heatingControlType: 'seperateTempControl'
};

const floorsData: FloorsData = {
	livingSpaceGroundFloor: {
		data: [{
			name: "Ground 1",
			surfaceAreaInZone: 5,
			surfaceAreaAllZones: 0,
			pitchOption: '0',
			pitch: 0,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			perimeter: 0,
			psiOfWallJunction: 0,
			typeOfGroundFloor: 'slabNoEdgeInsulation'
		}]
	},
	livingSpaceInternalFloor: {
		data: [{
			typeOfInternalFloor: 'heatedSpace',
			name: "Internal 1",
			surfaceAreaOfElement: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitchOption: '0',
			pitch: 0
		}]
	},
	livingSpaceExposedFloor: {
		data: [{
			name: "Exposed Floor 1",
			pitchOption: '0',
			pitch: 0,
			orientation: 0,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorbtion: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		}]
	}
};

const wallsData: WallsData = {
	livingSpaceExternalWall: {
		data: [{
			name: "External wall 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorbtion: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		}]
	},
	livingSpaceInternalWall: {
		data: [{
			name: "Internal 1",
			surfaceAreaOfElement: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitchOption: '0',
			pitch: 0
		}]
	},
	livingSpaceWallToUnheatedSpace: {
		data: [{
			name: 'Wall to unheated space 1',
			surfaceAreaOfElement: 500,
			uValue: 10,
			arealHeatCapacity:40000,
			massDistributionClass: 'external',
			pitchOption: '90',
			pitch: 90,
			thermalResistanceOfAdjacentUnheatedSpace: 1
		}]
	},
	livingSpacePartyWall: {
		data: [{
			name: "Party wall 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorbtion: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		}]
	}
};

const ceilingsAndRoofsData: CeilingsAndRoofsData = {
	livingSpaceCeilings: {
		data: [{
			type: 'heatedSpace',
			name: "Ceiling 1",
			surfaceArea: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitchOption: '180',
			pitch: 180
		}]
	},
	livingSpaceRoofs: {
		data: [{
			name: "Roof 1",
			typeOfRoof: 'flat',
			pitchOption: '180',
			pitch: 180,
			orientation: 0,
			height: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorbtionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		}]
	}
};

const doorsData: DoorsData = {
	livingSpaceExternalUnglazedDoor: {
		data: [{
			name: "External unglazed door 1",
			pitchOption: '90',
			pitch: 90,
			orientation: 0,
			height: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorbtion: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		}]
	},
	livingSpaceExternalGlazedDoor: {
		data: [{
			name: "External glazed door 1",
			orientation: 1,
			surfaceArea: 1,
			height: 1,
			width: 1,
			uValue: 1,
			pitchOption: '90',
			pitch: 90,
			solarTransmittence: 0.1,
			elevationalHeight: 1,
			midHeight: 1,
			numberOpenableParts: "none",
		}]
	},
	livingSpaceInternalDoor: {
		data: [{
			typeOfCeiling: 'heatedSpace',
			name: "Internal 1",
			surfaceArea: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
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
	solarTransmittence: 0.1,
	elevationalHeight: 1,
	midHeight: 1,
	numberOpenableParts: "none",
	overhangDepth: 1,
	overhangDistance: 1,
	sideFinRightDepth: 1,
	sideFinRightDistance: 1,
	sideFinLeftDepth: 1,
	sideFinLeftDistance: 1,
	type: "blinds",
	thermalResistivityIncrease: 1,
	solarTransmittenceReduction: 0.1,
};

const thermalBridgingData: ThermalBridgingData = {
	livingSpaceLinearThermalBridges: {
		data: [{
			name: 'E1: Steel lintel with perforated steel base plate',
			typeOfThermalBridge: 'e1',
			linearThermalTransmittance: 1,
			length: 2
		}]
	},
	livingSpacePointThermalBridges: {
		data: [{
			name: 'Point 1',
			heatTransferCoefficient: 1
		}]
	}
};

describe('Living space fabric summary', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	describe('Living space zone parameters', () => {
		it('should contain the correct tabs for living space zone parameters', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Zone parameters'}));
		});

		it('should display the correct data for the ground floor section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceZoneParameters: {
						data: zoneParametersData
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Area": 10,
				"Volume": 10,
				"Heating control type": 'Seperate temp control'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});

	describe('Living space floors', () => {
		it('should contain the correct tabs for living space floors', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Ground floor'}));
			expect(screen.getByRole('link', {name: 'Internal floor'}));
			expect(screen.getByRole('link', {name: 'Exposed floor'}));
		});
	
		it('should select the clicked tab', async () => {
			const summaryPage = await renderSuspended(Summary);
	
			await user.click(screen.getByRole('link', {name: 'Internal floor'}));
	
			expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#livingSpaceFloors">Internal floor</a></li>`);
		});
	
		it('should display the correct data for the ground floor section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: floorsData.livingSpaceGroundFloor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Ground 1",
				"Surface area in zone": 5,
				"Surface area in all zones": 0,
				"Pitch": 0,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal',
				"Perimeter": 0,
				"Psi of wall junction": 0,
				"Type of ground floor": 'Slab no edge insulation',
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the internal floor section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceInternalFloor: floorsData.livingSpaceInternalFloor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type of internal floor": 'Heated space',
				"Name": 'Internal 1',
				"Surface area of element": 5,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal',
				"Pitch": 0
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the exposed floor section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceExposedFloor: floorsData.livingSpaceExposedFloor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'Exposed Floor 1',
				"Pitch": 0,
				"Orientation": 0,
				"Height": 0.5,
				"Width": 20,
				"Elevational height of building element at its base": 20,
				"Surface area": 10,
				"Solar absorption coefficient": 0.1,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});

	describe('Living space walls', () => {
		it('should contain the correct tabs for living space walls', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'External wall'}));
			expect(screen.getByRole('link', {name: 'Internal wall'}));
			expect(screen.getByRole('link', {name: 'Wall to unheated space'}));
			expect(screen.getByRole('link', {name: 'Party wall'}));
		});
	
		it('should select the clicked tab', async () => {
			const summaryPage = await renderSuspended(Summary);
	
			await user.click(screen.getByRole('link', {name: 'Internal wall'}));
	
			expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#livingSpaceWalls">Internal wall</a></li>`);
		});
	
		it('should display the correct data for the external wall section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceExternalWall: wallsData.livingSpaceExternalWall
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'External wall 1',
				"Pitch": 90,
				"Orientation": 0,
				"Height": 0.5,
				"Width": 20,
				"Elevational height of building element at its base": 20,
				"Surface area": 10,
				"Solar absorption coefficient": 0.1,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the internal wall section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceInternalWall: wallsData.livingSpaceInternalWall
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'Internal 1',
				"Surface area of element": 5,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal',
				"Pitch": 0
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the wall to unheated space section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpaceWallToUnheatedSpace: wallsData.livingSpaceWallToUnheatedSpace
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'Wall to unheated space 1',
				"Surface area of element": 500,
				"U-value": 10,
				"Areal heat capacity": 40000,
				"Mass distribution class": 'External',
				"Pitch": 90,
				"Thermal resistance of adjacent unheated space": 1
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the party wall section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWalls: {
						livingSpacePartyWall: wallsData.livingSpacePartyWall
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'Party wall 1',
				"Pitch": 90,
				"Orientation": 0,
				"Height": 0.5,
				"Width": 20,
				"Elevational height of building element at its base": 20,
				"Surface area": 10,
				"Solar absorption coefficient": 0.1,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});

	describe('living space ceilings and roofs', () => {
		it('should contain the correct tabs for living space walls', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Ceiling'}));
			expect(screen.getByRole('link', {name: 'Roof'}));
		});
	
		it('should select the clicked tab', async () => {
			const summaryPage = await renderSuspended(Summary);
	
			await user.click(screen.getByRole('link', {name: 'Roof'}));
	
			expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#livingSpaceCeilingsAndRoofs">Roof</a></li>`);
		});
	
		it('should display the correct data for the ceilings section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceCeilingsAndRoofs: {
						livingSpaceCeilings: ceilingsAndRoofsData.livingSpaceCeilings
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type of ceiling": 'Heated space',
				"Name": 'Ceiling 1',
				"Surface area": 5,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal',
				"Pitch": 180
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the roof section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceCeilingsAndRoofs: {
						livingSpaceRoofs: ceilingsAndRoofsData.livingSpaceRoofs
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'Roof 1',
				"Type of roof": 'Flat',
				"Pitch": 180,
				"Orientation": 0,
				"Height": 1,
				"Width": 1,
				"Elevational height of building element at its base": 2,
				"Surface area": 1,
				"Solar absorption coefficient": 0.5,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});

	describe('living space doors', () => {
		it('should contain the correct tabs for living space doors', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'External unglazed door'}));
			expect(screen.getByRole('link', {name: 'External glazed door'}));
			expect(screen.getByRole('link', {name: 'Internal door'}));
		});
	
		it('should select the clicked tab', async () => {
			const summaryPage = await renderSuspended(Summary);
	
			await user.click(screen.getByRole('link', {name: 'External glazed door'}));
	
			expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#livingSpaceDoors">External glazed door</a></li>`);
		});
	
		it('should display the correct data for the external unglazed doors section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceExternalUnglazedDoor: doorsData.livingSpaceExternalUnglazedDoor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'External unglazed door 1',
				"Pitch": 90,
				"Orientation": 0,
				"Height": 0.5,
				"Width": 20,
				"Elevational height of building element at its base": 20,
				"Surface area": 10,
				"Solar absorption coefficient": 0.1,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the external glazed doors section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceExternalGlazedDoor: doorsData.livingSpaceExternalGlazedDoor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'External glazed door 1',
				"Orientation": 1,
				"Surface area": 1,
				"Height": 1,
				"Width": 1,
				"U-value": 1,
				"Pitch": 90,
				"Transmittance of solar energy": 0.1,
				"Elevational height of building element at its base": 1,
				"Mid height": 1,
				"Number of openable parts": 'None'
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the internal doors section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceInternalDoor: doorsData.livingSpaceInternalDoor
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Type": 'Heated space',
				"Name": 'Internal 1',
				"Surface area of element": 5,
				"U-value": 1,
				"Areal heat capacity": 100,
				"Mass distribution class": 'Internal',
				"Pitch": 90
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});

	describe('living space windows', () => {
		it('should contain the correct tabs for living space windows', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Windows'}));
		});
	
		it('should display the correct data for the windows section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceWindows: {
						data: [windowData]
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'Window 1',
				"Orientation": 1,
				"Surface area": 1,
				"Height": 1,
				"Width": 1,
				"U-value": 1,
				"Pitch": 90,
				"Transmittance of solar energy": 0.1,
				"Elevational height of building element at its base": 1,
				"Mid height": 1,
				"Number of openable parts": 'None',
				"Overhang depth": 1,
				"Overhang distance": 1,
				"Side fin right depth": 1,
				"Side fin right distance": 1,
				"Side fin left depth": 1,
				"Side fin left distance": 1,
				"Type": 'Blinds',
				"Thermal resistivity increase": 1,
				"Solar transmittance reduction": 0.1
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});

	describe('living space thermal bridges', () => {
		it('should contain the correct tabs for living space thermal bridges', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Linear thermal bridges'}));
			expect(screen.getByRole('link', {name: 'Point thermal bridges'}));
		});
	
		it('should select the clicked tab', async () => {
			const summaryPage = await renderSuspended(Summary);
	
			await user.click(screen.getByRole('link', {name: 'Point thermal bridges'}));
	
			expect(summaryPage.html()).toContain(`<li class="govuk-tabs__list-item govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#livingSpaceThermalBridging">Point thermal bridges</a></li>`);
		});
	
		it('should display the correct data for the linear thermal bridges section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceThermalBridging: {
						livingSpaceLinearThermalBridges: thermalBridgingData.livingSpaceLinearThermalBridges
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'E1: Steel lintel with perforated steel base plate',
				"Type of thermal bridge": 'E1',
				"Linear thermal transmittance": 1,
				"Length of thermal bridge": 2
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});

		it('should display the correct data for the point thermal bridges section', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceThermalBridging: {
						livingSpacePointThermalBridges: thermalBridgingData.livingSpacePointThermalBridges
					}
				}
			});
	
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": 'Point 1',
				"Heat transfer coefficient": 1
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});
});