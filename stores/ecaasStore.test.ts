import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { createPinia, setActivePinia } from 'pinia';
import formStatus from '~/constants/formStatus';
import pagesData from '~/data/pages/pages';
import  MechanicalOverview  from '~/pages/infiltration-and-ventilation/mechanical-ventilation/index.vue';
import { BuildType, DuctShape, DuctType, MVHRLocation, VentType } from '~/schema/api-schema.types';
const store = useEcaasStore();

describe('Ecaas Store', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});
	afterEach(()=> {
		store.$reset();
	});

	test('getStatus of section returns not started status when no forms are complete', () => {

		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.notStarted);
	});

	test('getStatus of section returns in progress status when some forms are complete', () => {

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.inProgress);
	});

	test('getStatus of section returns in progress status when forms have saved data', () => {

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: {
						typeOfDwelling: BuildType.house
					}
				}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.inProgress);
	});

	test('getStatus of a section containing grouped tasks returns in progress status when one of the grouped tasks is complete', () => {

		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceExposedFloor: {complete: true},
					dwellingSpaceInternalFloor: {complete: true},
					dwellingSpaceGroundFloor: {complete: true}
				},
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {complete: false},
					dwellingSpaceInternalWall: {complete: false},
					dwellingSpaceWallToUnheatedSpace: {complete: false},
					dwellingSpacePartyWall: {complete: false}
				}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingFabric');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.inProgress);
	});

	test('getStatus of section returns complete status when all forms are complete', () => {

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				},
				shading: {
					complete: true
				},
				externalFactors: {
					complete: true
				}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.complete);
	});

	test('getStatus of a section containing a grouped tasks returns complete when all forms are complete', () => {

		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceExposedFloor: {complete: true},
					dwellingSpaceInternalFloor: {complete: true},
					dwellingSpaceGroundFloor: {complete: true}
				},
				dwellingSpaceWalls: {
					dwellingSpaceExternalWall: {complete: true},
					dwellingSpaceInternalWall: {complete: true},
					dwellingSpaceWallToUnheatedSpace: {complete: true},
					dwellingSpacePartyWall: {complete: true}
				},
				dwellingSpaceCeilingsAndRoofs: {
					dwellingSpaceCeilings: {complete: true},
					dwellingSpaceRoofs: {complete: true}
				},
				dwellingSpaceDoors: {
					dwellingSpaceExternalUnglazedDoor: {complete: true},
					dwellingSpaceExternalGlazedDoor: {complete: true},
					dwellingSpaceInternalDoor: {complete: true}
				},
				dwellingSpaceWindows: {complete: true},
				dwellingSpaceThermalBridging: {
					dwellingSpaceLinearThermalBridges: {complete: true},
					dwellingSpacePointThermalBridges: {complete: true}
				}, 
				dwellingSpaceZoneParameters: {complete: true}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingFabric');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.complete);
	});

	test('getStatus of task returns not started status when form has no data', () => {

		const page = pagesData.find(p => p.id === 'generalSpecifications');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.notStarted);
	});

	test('getStatus of task returns in progress status when form has saved data', () => {

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: {
						typeOfDwelling: BuildType.house
					}
				}
			}
		});

		const page = pagesData.find(p => p.id === 'generalSpecifications');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.inProgress);
	});

	test('getStatus of task returns complete status when form is complete', () => {

		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				}
			}
		});

		const page = pagesData.find(p => p.id === 'generalSpecifications');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.complete);
	});

	test('getStatus of task returns complete status when required forms are complete', () => {

		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: {
						complete: true
					},
					dwellingSpaceExposedFloor: {
						complete: true
					},
					dwellingSpaceInternalFloor: {
						complete: true
					}
				}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingSpaceFloors');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.complete);
	});

	const mechanicalVentilation1: MechanicalVentilationData = {
		id: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
		name: "Mechanical name 1",
		typeOfMechanicalVentilationOptions: VentType.MVHR,
		airFlowRate: 12,
		mvhrLocation: MVHRLocation.inside,
		mvhrEfficiency: 0.2,
	};
	const mechanicalVentilation2: MechanicalVentilationData = {
		id: "6746f2fe-f15b-4a56-ba5a-1a7751ac89hh",
		name: "Mechanical name 2",
		typeOfMechanicalVentilationOptions: VentType.MVHR,
		airFlowRate: 12,
		mvhrLocation: MVHRLocation.inside,
		mvhrEfficiency: 0.1,
	};
	const ductwork1: DuctworkData = {
		name: 'Ductwork 1',
		mvhrUnit: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
		ductworkCrossSectionalShape: DuctShape.circular,
		ductType: DuctType.intake,
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: true,
	};
	const ductwork2: DuctworkData = {
		name: 'Ductwork 2',
		mvhrUnit: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
		ductworkCrossSectionalShape: DuctShape.circular,
		ductType: DuctType.intake,
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: true,
	};
	test('getStatus of ductwork task returns not started status when mvhr and ductwork is added then mvhr is removed', async() => {

		const user = userEvent.setup();
		
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1],
					complete: true
				},
				ductwork: {
					data: [ductwork1],
					complete: true
				}
			}
		});
		await renderSuspended(MechanicalOverview);

		await user.click(screen.getByTestId('mechanicalVentilation_remove_0'));

		const page = pagesData.find(p => p.id === 'ductwork');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.notStarted);
	});

	test('getStatus of ductwork task returns in progress status when multiple mvhrs are added but they dont all have an associated ductwork', async() => {

		
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1, mechanicalVentilation2],
					complete: true
				},
				ductwork: {
					data: [ductwork1, ductwork2],
					complete: true 
				}
			}
		});

		const page = pagesData.find(p => p.id === 'ductwork');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.inProgress);
	});

	test('getStatus of ductwork task returns complete status when a mvhr has an associated ductwork', async() => {

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [mechanicalVentilation1],
					complete: true
				},
				ductwork: {
					data: [ductwork1],
					complete: true
				}
			}
		});

		const page = pagesData.find(p => p.id === 'ductwork');
		const status = store.getStatus(page!);

		expect(status).toStrictEqual(formStatus.complete);
	});
});

describe('extractPitch', () => {
	it('should return the pitch from a string with a pitch', () => {
		const result = extractPitch({
			pitch: 45,
			pitchOption: 'custom',
		});
		expect(result).toBe(45);
	});

	it('should return undefined when no pitch is present', () => {
		const result = extractPitch({
			pitchOption: 'custom',
		});
		expect(result).toBeUndefined();
	});

	it('should return number 90 when selected as pitchOption', () => {
		const result = extractPitch({
			pitchOption: '90',
		});
		expect(result).toBe(90);
	});
});

describe("postEcaasState", () => {
	const store = useEcaasStore();
	
	it("should post ecaas state to setState endpoint", async () => {
		global.$fetch = vi.fn() as unknown as typeof global.$fetch;
		const fetchSpy = vi.spyOn(global, "$fetch");
		await store.postEcaasState();

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(fetchSpy).toHaveBeenCalledWith("/api/setState", {
			body: store.$state,
			method: "POST",
		});
	});
	// it("should log an error if fetch fails", async () => {
	// 	const consoleSpy = vi.spyOn(console, "error");
	// 	global.$fetch = vi.fn(() =>
	// 		Promise.reject("Network error")
	// 	) as unknown as typeof global.$fetch;
	// 	await store.postEcaasState();

	// 	expect(consoleSpy).toHaveBeenCalledWith("Failed to post data: Network error");
	// });
});
