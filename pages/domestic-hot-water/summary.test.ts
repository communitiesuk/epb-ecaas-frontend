import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import { WaterPipeContentsType, WaterPipeworkLocation } from '~/schema/api-schema.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('Domestic hot water summary', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	describe('water heating', () => {
		const heatPumpId = '463c94f6-566c-49b2-af27-57e5c68b5c30';

		const storageTank: StorageTankData = {
			id: 'c84528bb-f805-4f1e-95d3-2bd17384fdbe',
			name: 'Storage tank 1',
			heatSource: heatPumpId,
			tankVolume: 5,
			dailyEnergyLoss: 1,
		};

		const immersionHeater: ImmersionHeaterData = {
			name: 'Immersion heater',
			ratedPower: 10,
			heaterPosition: 1,
			thermostatPosition: 1
		};

		const pointOfUse: PointOfUseData = {
			name: 'Point of use',
			setpointTemperature: 25,
			heaterEfficiency: 0.5,
		};

		const addStorageTankData = () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						storageTank: {
							data: [storageTank]
						}
					},
				},
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data: [{
								id: heatPumpId,
								name: 'Heat pump'
							}]
						}
					}
				}
			});
		};

		it('should contain the correct tabs for water heating when data is present', async () => {
			addStorageTankData();
			await renderSuspended(Summary);
	  
			expect(screen.queryByRole('link', {name: 'Storage tank'})).toBeDefined();
			expect(screen.queryByRole('link', {name: 'Immersion heater'})).toBeNull();
			expect(screen.queryByRole('link', {name: 'Solar thermal'})).toBeNull();
			expect(screen.queryByRole('link', {name: 'Point of use'})).toBeNull();
			expect(screen.queryByRole('link', {name: 'Heat pump'})).toBeNull();
			expect(screen.queryByRole('link', {name: 'Combi boiler'})).toBeNull();
			expect(screen.queryByRole('link', {name: 'Heat battery'})).toBeNull();
			expect(screen.queryByRole('link', {name: 'Smart hot water tank'})).toBeNull();
			expect(screen.queryByRole('link', {name: 'Heat interface unit'})).toBeNull();
		});

		it('should display an empty state when no water heating data is present', async () => {
			await renderSuspended(Summary);

			const addWaterHeatingLink = screen.queryByRole('link', {name: 'Add water heating'}) as HTMLAnchorElement;

			expect(screen.queryByText('No water heating added')).toBeDefined();
			expect(new URL(addWaterHeatingLink.href).pathname).toBe(getUrl('waterHeating'));
		});

		it('should display the correct data for the storage tank section', async () => {
			addStorageTankData();
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Storage tank 1",
				"Heat source": "Heat pump",
				"Tank volume": "5",
				"Daily energy loss": "1",
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-storageTank-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the immersion heater section', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						immersionHeater: {
							data: [immersionHeater]
						}
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Immersion heater",
				"Rated power": "10",
				"Heater position": "1",
				"Thermostat position": "1",
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-immersionHeater-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the point of use section', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						pointOfUse: {
							data: [pointOfUse]
						}
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Point of use",
				"Setpoint temperature": "25",
				"Heater efficiency": "0.5"
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-pointOfUse-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('hot water outlets', () => {
		const mixedShower: MixedShowerData = {
			id: '4a93532e-a370-4015-9778-854661bf1627',
			name: 'Mixed shower 1',
			flowRate: 10
		};

		const electricShower: ElectricShowerData = {
			id: '0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e',
			name: 'Electric shower 1',
			ratedPower: 10
		};

		const bathData: BathData = {
			id: 'd3883380-885b-48fd-9425-9f9fac7587fb',
			name: 'Bath 1',
			size: 170,
			flowRate: 10
		};

		const otherOutletsData: OtherHotWaterOutletData = {
			id: '0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e',
			name: "Basin tap 1",
			flowRate: 10
		};

		it('should contain the correct tabs for hot water outlets', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Mixed shower'})).toBeDefined();
			expect(screen.getByRole('link', {name: 'Electric shower'})).toBeDefined();
			expect(screen.getByRole('link', {name: 'Bath'})).toBeDefined();
			expect(screen.getByRole('link', {name: 'Other'})).toBeDefined();
		});

		it('should display the correct data for the mixed shower section', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						mixedShower: {
							data: [mixedShower]
						}
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Mixed shower 1",
				"Flow rate": "10"
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-mixedShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the electric shower section', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						electricShower: {
							data: [electricShower]
						}
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Electric shower 1",
				"Rated power": "10"
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-electricShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the bath section', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						bath: {
							data: [bathData]
						}
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Bath 1",
				"Size": "170",
				"Flow rate": "10"
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-bath-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the other outlets section', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						otherOutlets: {
							data: [otherOutletsData]
						}
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Basin tap 1",
				"Flow rate": "10"
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-otherOutlets-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('pipework', () => {
		const storageTankId = 'c84528bb-f805-4f1e-95d3-2bd17384fdbe';

		const primaryPipework: PrimaryPipeworkData = {
			name: 'Pipework Kitchen Sink Primary',
			internalDiameter: 10,
			externalDiameter: 10,
			length: 3,
			insulationThickness: 5,
			thermalConductivity: 1,
			surfaceReflectivity: true,
			pipeContents: WaterPipeContentsType.water,
			storageTank: storageTankId,
			location: WaterPipeworkLocation.internal
		};

		const secondaryPipework: SecondaryPipeworkData = {
			name: 'Pipework Kitchen Sink Secondary',
			length: 3,
			location: WaterPipeworkLocation.internal,
			internalDiameter: 0.09
		};

		it('should contain the correct tabs for pipework details', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Primary pipework'})).toBeDefined();
			expect(screen.getByRole('link', {name: 'Secondary pipework'})).toBeDefined();
		});
	
		it('should display the correct data for the primary pipework section', async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						primaryPipework: {
							data: [primaryPipework]
						}
					},
					waterHeating: {
						storageTank: {
							data: [{
								id: storageTankId,
								name: 'Storage tank 1'
							}]
						}
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Pipework Kitchen Sink Primary",
				"Internal diameter": "10",
				"External diameter": "10",
				"Length": "3",
				"Insulation thickness": "5",
				"Thermal conductivity": "1",
				"Surface reflectivity": "Reflective",
				"Pipe contents": "Water",
				"Storage tank": 'Storage tank 1',
				"Location": "Internal",
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-primaryPipework-${hyphenate(key)}`));

				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});

		it('should display the correct data for the secondary pipework section', async () => {
			store.$patch({
				domesticHotWater: {
					pipework: {
						secondaryPipework: {
							data: [secondaryPipework]
						}
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Pipework Kitchen Sink Secondary",
				"Length": "3",
				"Location": "Internal",
				"Internal diameter": "0.09"
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-secondaryPipework-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('waste water heat recovery', () => {
		const mixedShowerId = 'cd127960-16d5-4c5a-8b32-94af1ac313a5';

		const wwhrs: WwhrsData = {
			name: 'WWHRS 1',
			outlet: mixedShowerId,
			type: 'a',
			flowRate: 10,
			efficiency: 10,
			proportionOfUse: 0.5
		};

		it('should contain the correct tabs for WWHRS', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'WWHRS'})).toBeDefined();
		});

		it('should display the correct data for the WWHRS section', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						mixedShower: {
							data: [{
								id: mixedShowerId,
								name: 'Mixed shower 1'
							}]
						}
					},
					wwhrs: {
						data: [wwhrs]
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "WWHRS 1",
				"Outlet": "Mixed shower 1",
				"Type": "A",
				"Flow rate": "10",
				"Efficiency": "10",
				"Proportion of use": "0.5"
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-wwhrs-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});
});