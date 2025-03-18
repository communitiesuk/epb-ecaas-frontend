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

	it('getStatus of subsection returns not started status when form has no data', () => {
		const store = useEcaasStore();
		const page = pagesData.find(p => p.id === 'generalSpecifications');
		const status = store.getStatus(page!);

		expect(status).toBe(formStatus.notStarted);
	});

	it('getStatus of subsection returns complete status when form is complete', () => {
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

	it('getStatus of subsection returns complete status when required forms are complete', () => {
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
});
