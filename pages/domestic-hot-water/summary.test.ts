import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import Summary from './summary.vue';
import { screen } from '@testing-library/vue';
import { WaterPipeContentsType, WaterPipeworkLocation } from '~/schema/api-schema.types';
import { litre } from '~/utils/units/volume';
import { metre, millimetre } from '~/utils/units/length';
import { wattsPerMeterKelvin } from '~/utils/units/thermalConductivity';
import { litrePerHour, litrePerMinute } from '~/utils/units/flowRate';
import { kilowatt, kilowattHour } from '~/utils/units/power';
import { celsius } from '~/utils/units/temperature';
import { unitValue } from '~/utils/units/types';

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

		const hotWaterCylinder: HotWaterCylinderData = {
			id: 'c84528bb-f805-4f1e-95d3-2bd17384fdbe',
			name: 'Hot water cylinder 1',
			heatSource: heatPumpId,
			storageCylinderVolume: 5,
			dailyEnergyLoss: 1,
		};

		const immersionHeater: ImmersionHeaterData = {
			name: 'Immersion heater',
			ratedPower: 10,
			heaterPosition: 'top',
			thermostatPosition: 'top'
		};

		const pointOfUse: PointOfUseData = {
			name: 'Point of use',
			setpointTemperature: 25,
			heaterEfficiency: 0.5,
		};

		const addHotWaterCylinderData = () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						hotWaterCylinder: {
							data: [hotWaterCylinder]
						}
					},
				},
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data: [{
								data: {
									id: heatPumpId,
									name: 'Heat pump'
								}
							}]
						}
					}
				}
			});
		};

		it('should contain the correct tabs for water heating when data is present', async () => {
			addHotWaterCylinderData();
			await renderSuspended(Summary);
	  
			expect(screen.queryByRole('link', { name: 'Hot water cylinder' })).toBeDefined();
			expect(screen.queryByRole('link', { name: 'Immersion heater' })).toBeNull();
			expect(screen.queryByRole('link', { name: 'Solar thermal' })).toBeNull();
			expect(screen.queryByRole('link', { name: 'Point of use' })).toBeNull();
			expect(screen.queryByRole('link', { name: 'Heat pump' })).toBeNull();
			expect(screen.queryByRole('link', { name: 'Combi boiler' })).toBeNull();
			expect(screen.queryByRole('link', { name: 'Heat battery' })).toBeNull();
			expect(screen.queryByRole('link', { name: 'Smart hot water tank' })).toBeNull();
			expect(screen.queryByRole('link', { name: 'Heat interface unit' })).toBeNull();
		});

		it('should display an empty state when no water heating data is present', async () => {
			await renderSuspended(Summary);

			const addWaterHeatingLink = screen.queryByRole('link', { name: 'Add water heating' }) as HTMLAnchorElement;

			expect(screen.queryByText('No water heating added')).toBeDefined();
			expect(new URL(addWaterHeatingLink.href).pathname).toBe(getUrl('waterHeating'));
		});

		it('should display the correct data for the hot water cylinder section', async () => {
			addHotWaterCylinderData();
			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Hot water cylinder 1",
				"Heat source": "Heat pump",
				"Storage cylinder volume": `5 ${litre.suffix}`,
				"Daily energy loss": `1 ${kilowattHour.suffix}`,
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-hotWaterCylinder-${hyphenate(key)}`));
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
				"Rated power": `10 ${kilowatt.suffix}`,
				"Heater position": "Top (1)",
				"Thermostat position": "Top (1)",
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
				"Setpoint temperature": `25 ${celsius.suffix}`,
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
		const mixedShower: EcaasForm<MixedShowerData> = {
			data: {
				id: '4a93532e-a370-4015-9778-854661bf1627',
				name: 'Mixer shower 1',
				flowRate: 10
			}
		};

		const electricShower: EcaasForm<ElectricShowerData> = {
			data: {
				id: '0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e',
				name: 'Electric shower 1',
				ratedPower: 10
			}
		};

		const bathData: EcaasForm<BathData> = {
			data: {
				id: 'd3883380-885b-48fd-9425-9f9fac7587fb',
				name: 'Bath 1',
				size: 170,
				flowRate: 10
			}
		};

		const otherOutletsData: EcaasForm<OtherHotWaterOutletData> = {
			data: {
				id: '0b77e247-53c5-42b8-9dbd-83cbfc8c8a9e',
				name: "Basin tap 1",
				flowRate: 10
			}
		};

		it('should contain the correct tabs for hot water outlets', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', { name: 'Mixer shower' })).toBeDefined();
			expect(screen.getByRole('link', { name: 'Electric shower' })).toBeDefined();
			expect(screen.getByRole('link', { name: 'Bath' })).toBeDefined();
			expect(screen.getByRole('link', { name: 'Other' })).toBeDefined();
		});

		it('should display the correct data for the mixer shower section', async () => {
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
				"Name": "Mixer shower 1",
				"Flow rate": `10 ${litrePerHour.suffix}`
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
				"Rated power": `10 ${kilowatt.suffix}`
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
				"Size": `170 ${litre.suffix}`,
				"Flow rate": `10 ${litrePerMinute.suffix}`
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
				"Flow rate": `10 ${litrePerMinute.suffix}`
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-otherOutlets-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});

	describe('pipework', () => {
		const hotWaterCylinderId = 'c84528bb-f805-4f1e-95d3-2bd17384fdbe';

		const primaryPipework: EcaasForm<Partial<PrimaryPipeworkData>> = {
			data: {
				name: 'Pipework Kitchen Sink Primary',
				internalDiameter: 10,
				externalDiameter: 10,
				length: 3,
				insulationThickness: 5,
				thermalConductivity: 1,
				surfaceReflectivity: true,
				pipeContents: WaterPipeContentsType.water,
				hotWaterCylinder: hotWaterCylinderId,
				location: WaterPipeworkLocation.internal
			}
		};

		const secondaryPipework: EcaasForm<Partial<SecondaryPipeworkData>> = {
			data: {
				name: 'Pipework Kitchen Sink Secondary',
				length: 3,
				location: WaterPipeworkLocation.internal,
				internalDiameter: 9
			}
		};

		it('should contain the correct tabs for pipework details', async () => {
			await renderSuspended(Summary);
	  
			expect(screen.getByRole('link', { name: 'Primary pipework' })).toBeDefined();
			expect(screen.getByRole('link', { name: 'Secondary pipework' })).toBeDefined();
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
						hotWaterCylinder: {
							data: [{
								id: hotWaterCylinderId,
								name: 'Hot water cylinder 1',
								storageCylinderVolume: unitValue(100, litre)
							}]
						}
					}
				}
			});

			await renderSuspended(Summary);
	
			const expectedResult = {
				"Name": "Pipework Kitchen Sink Primary",
				"Internal diameter": `10 ${millimetre.suffix}`,
				"External diameter": `10 ${millimetre.suffix}`,
				"Length": `3 ${metre.suffix}`,
				"Insulation thickness": `5 ${millimetre.suffix}`,
				"Thermal conductivity": `1 ${wattsPerMeterKelvin.suffix}`,
				"Surface reflectivity": "Reflective",
				"Pipe contents": "Water",
				"Hot water cylinder": 'Hot water cylinder 1',
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
				"Length": `3 ${metre.suffix}`,
				"Location": "Internal",
				"Internal diameter": `9 ${millimetre.suffix}`
			};
	
			for (const [key, value] of Object.entries(expectedResult)) {
				const lineResult = (await screen.findByTestId(`summary-secondaryPipework-${hyphenate(key)}`));
				expect(lineResult.querySelector("dt")?.textContent).toBe(key);
				expect(lineResult.querySelector("dd")?.textContent).toBe(value);
			}
		});
	});
});