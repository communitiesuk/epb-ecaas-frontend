import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';

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

		const addWaterHeatingData = () => {
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
			addWaterHeatingData();
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

		it('should display the correct data for the storage tank section', async () => {
			addWaterHeatingData();
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Storage tank 1",
				"Heat source": "Heat pump",
				"Tank volume": 5,
				"Daily energy loss": 1,
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-storageTank-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});

	describe('hot water outlets', () => {
		const mixedShower: MixedShowerData = {
			id: '4a93532e-a370-4015-9778-854661bf1627',
			name: 'Mixed shower 1',
			flowRate: 10
		};

		const addHotWaterData = () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						mixedShower: {
							data: [mixedShower]
						}
					}
				}
			});
		};
		

		it('should contain the correct tabs for hot water outlets', async () => {
			addHotWaterData();
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Mixed shower'})).toBeDefined();
			expect(screen.getByRole('link', {name: 'Electric shower'})).toBeDefined();
			expect(screen.getByRole('link', {name: 'Bath'})).toBeDefined();
			expect(screen.getByRole('link', {name: 'Other'})).toBeDefined();
		});

		it('should display the correct data for the mixed shower section', async () => {
			addHotWaterData();
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Mixed shower 1",
				"Flow rate": 10
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-mixedShower-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});

	describe('pipework', () => {
		const storageTankId = 'c84528bb-f805-4f1e-95d3-2bd17384fdbe';

		const primaryPipework: PrimaryPipeworkData = {
			name: 'Pipework Kitchen Sink',
			internalDiameter: 10,
			externalDiameter: 10,
			length: 3,
			insulationThickness: 5,
			thermalConductivity: 1,
			surfaceReflectivity: 'reflective',
			pipeContents: 'water',
			storageTank: storageTankId,
			location: 'internal'
		};

		const addPipeworkData = () => {
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
		};

		it('should contain the correct tabs for pipework details', async () => {
			addPipeworkData();
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'Primary pipework'})).toBeDefined();
			expect(screen.getByRole('link', {name: 'Secondary pipework'})).toBeDefined();
		});
	
		it('should display the correct data for the primary pipework section', async () => {
			addPipeworkData();
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Pipework 1",
				"Internal diameter": 10,
				"External diameter": 10,
				"Length": 2,
				"Insulation thickness": 5,
				"Thermal conductivity": 1,
				"Surface reflectivity": "Reflective",
				"Pipe contents": "Water",
				"Storage tank": 'Storage tank 1',
				"Location": "Internal",
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-primaryPipework-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
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

		const addWwhrsData = () => {
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
		};

		it('should contain the correct tabs for WWHRS', async () => {
			addWwhrsData();
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', {name: 'WWHRS'})).toBeDefined();
		});

		it('should display the correct data for the WWHRS section', async () => {
			addWwhrsData();
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "WWHRS 1",
				"Outlet": "Mixed shower 1",
				"Type": "A",
				"Flow rate": 10,
				"Efficiency": 50,
				"Proportion of use": 1
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-wwhrs-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.getHTML() == `${key}`);
				expect(lineResult.querySelector("dd")?.getHTML() == `${value}`);
			}
		});
	});
});