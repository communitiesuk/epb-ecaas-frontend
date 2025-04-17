import { createPinia, setActivePinia } from 'pinia';
import formStatus from '~/constants/formStatus';
import pagesData from '~/data/pages/pages';

describe('Ecaas Store', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('getStatus of section returns not started status when no forms are complete', () => {
		const store = useEcaasStore();
		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.notStarted);
	});

	it('getStatus of section returns in progress status when some forms are complete', () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				},
				appliances: {
					complete: false
				}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.inProgress);
	});

	it('getStatus of section returns in progress status when forms have saved data', () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: {
						typeOfDwelling: 'house'
					}
				}
			}
		});

		const page = pagesData.find(p => p.id === 'dwellingDetails');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.inProgress);
	});

	it('getStatus of a section containing grouped tasks returns in progress status when one of the grouped tasks is complete', () => {
		const store = useEcaasStore();
		store.$patch({
			livingSpaceFabric: {
				livingSpaceFloors: {
					livingSpaceExposedFloor: {complete: true},
					livingSpaceInternalFloor: {complete: true},
					livingSpaceGroundFloor: {complete: true}
				},
				livingSpaceWalls: {
					livingSpaceExternalWall: {complete: false},
					livingSpaceInternalWall: {complete: false},
					livingSpaceWallToUnheatedSpace: {complete: false},
					livingSpacePartyWall: {complete: false}
				}
			}
		});

		const page = pagesData.find(p => p.id === 'livingSpaceFabric');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.inProgress);
	});

	it('getStatus of section returns complete status when all forms are complete', () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				},
				appliances: {
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

		expect(status).toBe(formStatus.complete);
	});

	it('getStatus of a section containing a grouped tasks returns complete when all forms are complete', () => {
		const store = useEcaasStore();
		store.$patch({
			livingSpaceFabric: {
				livingSpaceFloors: {
					livingSpaceExposedFloor: {complete: true},
					livingSpaceInternalFloor: {complete: true},
					livingSpaceGroundFloor: {complete: true}
				},
				livingSpaceWalls: {
					livingSpaceExternalWall: {complete: true},
					livingSpaceInternalWall: {complete: true},
					livingSpaceWallToUnheatedSpace: {complete: true},
					livingSpacePartyWall: {complete: true}
				},
				livingSpaceCeilingsAndRoofs: {
					livingSpaceCeilings: {complete: true},
					livingSpaceRoofs: {complete: true}
				},
				livingSpaceDoors: {
					livingSpaceExternalUnglazedDoor: {complete: true},
					livingSpaceExternalGlazedDoor: {complete: true},
					livingSpaceInternalDoor: {complete: true}
				},
				livingSpaceWindows: {complete: true},
				livingSpaceThermalBridging: {
					livingSpaceLinearThermalBridges: {complete: true},
					livingSpacePointThermalBridges: {complete: true}
				}, 
				livingSpaceZoneParameters: {complete: true}
			}
		});

		const page = pagesData.find(p => p.id === 'livingSpaceFabric');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.complete);
	});

	it('getStatus of task returns not started status when form has no data', () => {
		const store = useEcaasStore();
		const page = pagesData.find(p => p.id === 'generalSpecifications');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.notStarted);
	});

	it('getStatus of task returns in progress status when form has saved data', () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					data: {
						typeOfDwelling: 'house'
					}
				}
			}
		});

		const page = pagesData.find(p => p.id === 'generalSpecifications');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.inProgress);
	});

	it('getStatus of task returns complete status when form is complete', () => {
		const store = useEcaasStore();
		store.$patch({
			dwellingDetails: {
				generalSpecifications: {
					complete: true
				}
			}
		});

		const page = pagesData.find(p => p.id === 'generalSpecifications');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.complete);
	});

	it('getStatus of task returns complete status when required forms are complete', () => {
		const store = useEcaasStore();
		store.$patch({
			livingSpaceFabric: {
				livingSpaceFloors: {
					livingSpaceGroundFloor: {
						complete: true
					}
				}
			}
		});

		const page = pagesData.find(p => p.id === 'livingSpaceFloors');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.complete);
	});

	it('getStatus returns notStarted when there is a mvhr present but no ductwork', () => {
		const store = useEcaasStore();

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{
						name: 'MVHR_1',
						id: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
						typeOfMechanicalVentilationOptions: 'mvhr',
						complete: true
					},
					{
						name: 'MVHR_2',
						id: '7184f2fe-a78f-4a56-ba5a-1a7751ac506d',
						typeOfMechanicalVentilationOptions: 'mvhr',
						complete: true
					}]
				}
			}
		});

		const page = pagesData.find(p => p.id === 'ductwork');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.notStarted);
	});

	it('getStatus returns incomplete when not all mvhrs have a ductwork', () => {
		const store = useEcaasStore();

		const ductwork1: DuctworkData = {
			name: "Ductwork 1",
			mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
			ductworkCrossSectionalShape: "circular",
			ductType: "intake",
			internalDiameterOfDuctwork: 300,
			externalDiameterOfDuctwork: 1000,
			insulationThickness: 100,
			lengthOfDuctwork: 100,
			thermalInsulationConductivityOfDuctwork: 10,
			surfaceReflectivity: "reflective",
			complete: true
		};

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{
						name: 'MVHR_1',
						id: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
						typeOfMechanicalVentilationOptions: 'mvhr',
						complete: true
					},
					{
						name: 'MVHR_2',
						id: '7184f2fe-a78f-4a56-ba5a-1a7751ac506d',
						typeOfMechanicalVentilationOptions: 'mvhr',
						complete: true
					}]
				},
				ductwork:{
					data: [ductwork1]
				}
			}
		});

		const page = pagesData.find(p => p.id === 'ductwork');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.inProgress);
	});

	it('getStatus returns complete when all mvhrs have a ductwork', () => {
		const store = useEcaasStore();

		const ductwork1: DuctworkData = {
			name: "Ductwork 1",
			mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
			ductworkCrossSectionalShape: "circular",
			ductType: "intake",
			internalDiameterOfDuctwork: 300,
			externalDiameterOfDuctwork: 1000,
			insulationThickness: 100,
			lengthOfDuctwork: 100,
			thermalInsulationConductivityOfDuctwork: 10,
			surfaceReflectivity: "reflective",
			complete: true
		};

		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{
						name: 'MVHR_1',
						id: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
						typeOfMechanicalVentilationOptions: 'mvhr',
						complete: true
					}]
				},
				ductwork:{
					data: [ductwork1]
				}
			}
		});

		const page = pagesData.find(p => p.id === 'ductwork');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.complete);
	});
});
