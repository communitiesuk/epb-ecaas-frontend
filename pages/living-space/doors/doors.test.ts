import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Doors from './index.vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';
import UnglazedDoorForm from './external-unglazed/[door].vue';
import glazedDoorForm from './external-glazed/[door].vue';
import internalDoorForm from './internal/[door].vue';


describe('doors', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const externalUnglazed1: ExternalUnglazedDoorData = {
		name: "external unglazed 1 name",
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
		massDistributionClass: 'internal'
	};

	const externalUnglazed2: ExternalUnglazedDoorData = {
		name: "external unglazed 2 name",
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
		massDistributionClass: 'internal'
	};

	const externalUnglazed3: ExternalUnglazedDoorData = {
		name: "external unglazed 3 name",
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
		massDistributionClass: 'internal'
	};

	const externalGlazed1: ExternalGlazedDoorData = {
		name: "externalGlazed1 name",
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
		numberOpenableParts: "none",
	};

	const externalGlazed2: ExternalGlazedDoorData = {
		name: "externalGlazed2 name",
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
		numberOpenableParts: "none",
	};

	const externalGlazed3: ExternalGlazedDoorData = {
		name: "externalGlazed3 name",
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
		numberOpenableParts: "none",
	};
	
	const internal1: InternalDoorData = {
		typeOfCeiling: 'heatedSpace',
		name: "Internal 1",
		surfaceArea: 5,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal',
		pitchOption: '90',
		pitch: 90
	};

	const internal2: InternalDoorData = {
		typeOfCeiling: 'heatedSpace',
		name: "Internal 2",
		surfaceArea: 5,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal',
		pitchOption: '90',
		pitch: 90
	};

	const internal3: InternalDoorData = {
		typeOfCeiling: 'heatedSpace',
		name: "Internal 3",
		surfaceArea: 5,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal',
		pitchOption: '90',
		pitch: 90
	};
	
	describe('external unglazed doors', () => {
	
		it('external unglazed door is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceExternalUnglazedDoor: {
							data:[externalUnglazed1]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
	
			expect(screen.getAllByTestId('externalUnglazed_items')).toBeDefined();
	
			await user.click(screen.getByTestId('externalUnglazed_remove_0'));
	
			expect(screen.queryByTestId('externalUnglazed_items')).toBeNull();
		});
	
		it('should only remove the door object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceExternalUnglazedDoor: {
							data:[externalUnglazed1, externalUnglazed2, externalUnglazed3]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await user.click(screen.getByTestId('externalUnglazed_remove_1'));
	
			const populatedList = screen.getByTestId('externalUnglazed_items');
	
			expect(within(populatedList).getByText('external unglazed 1 name')).toBeDefined();
			expect(within(populatedList).getByText('external unglazed 3 name')).toBeDefined();
			expect(within(populatedList).queryByText('external unglazed 2 name')).toBeNull();
	
		});
		it('door is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceExternalUnglazedDoor: {
							data:[externalUnglazed1, externalUnglazed2]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await userEvent.click(screen.getByTestId('externalUnglazed_duplicate_0'));
			await userEvent.click(screen.getByTestId('externalUnglazed_duplicate_0'));
			await userEvent.click(screen.getByTestId('externalUnglazed_duplicate_2'));
			await userEvent.click(screen.getByTestId('externalUnglazed_duplicate_2'));
	
			expect(screen.queryAllByTestId('externalUnglazed_item').length).toBe(6);
			expect(screen.getByText('external unglazed 1 name')).toBeDefined();
			expect(screen.getByText('external unglazed 1 name (1)')).toBeDefined();
			expect(screen.getByText('external unglazed 1 name (2)')).toBeDefined();
			expect(screen.getByText('external unglazed 1 name (1) (1)')).toBeDefined();
			expect(screen.getByText('external unglazed 1 name (1) (2)')).toBeDefined();
		});
	});

	describe('external glazed doors', () => {
	
		it('iexternal glazed door is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceExternalGlazedDoor: {
							data:[externalGlazed1]
						}
					}
				}
			});
			
			await renderSuspended(Doors);
			
			expect(screen.getAllByTestId('externalGlazed_items')).toBeDefined();
			
			await user.click(screen.getByTestId('externalGlazed_remove_0'));
	
			expect(screen.queryByTestId('externalGlazed_items')).toBeNull();
		});
	
		it('should only remove the internal door object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceExternalGlazedDoor: {
							data:[externalGlazed1, externalGlazed2, externalGlazed3]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await user.click(screen.getByTestId('externalGlazed_remove_1'));
	
			const populatedList = screen.getByTestId('externalGlazed_items');
	
			expect(within(populatedList).getByText('externalGlazed1 name')).toBeDefined();
			expect(within(populatedList).getByText('externalGlazed3 name')).toBeDefined();
			expect(within(populatedList).queryByText('externalGlazed2 name')).toBeNull();
	
		});
	
		it('door is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceExternalGlazedDoor: {
							data:[externalGlazed1, externalGlazed2]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await userEvent.click(screen.getByTestId('externalGlazed_duplicate_0'));
			await userEvent.click(screen.getByTestId('externalGlazed_duplicate_0'));
			await userEvent.click(screen.getByTestId('externalGlazed_duplicate_2'));
			await userEvent.click(screen.getByTestId('externalGlazed_duplicate_2'));
	
			expect(screen.queryAllByTestId('externalGlazed_item').length).toBe(6);
			expect(screen.getByText('externalGlazed1 name')).toBeDefined();
			expect(screen.getByText('externalGlazed1 name (1)')).toBeDefined();
			expect(screen.getByText('externalGlazed1 name (2)')).toBeDefined();
			expect(screen.getByText('externalGlazed1 name (1) (1)')).toBeDefined();
			expect(screen.getByText('externalGlazed1 name (1) (2)')).toBeDefined();
		});
	});

	describe('internal door', () => {
	
		it('internal door is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceInternalDoor: {
							data:[internal1]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
	
			expect(screen.getAllByTestId('internal_items')).toBeDefined();
	
			await user.click(screen.getByTestId('internal_remove_0'));
	
			expect(screen.queryByTestId('internal_items')).toBeNull();
		});
	
		it('should only remove the exposed door object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceInternalDoor: {
							data:[internal1, internal2, internal3]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await user.click(screen.getByTestId('internal_remove_1'));
			const populatedList = screen.getByTestId('internal_items');
	
			expect(within(populatedList).getByText('Internal 1')).toBeDefined();
			expect(within(populatedList).getByText('Internal 3')).toBeDefined();
			expect(within(populatedList).queryByText('Internal 2')).toBeNull();
	
		});
		it('door is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceInternalDoor: {
							data:[internal1, internal2]
						}
					}
				}
			});
	
			await renderSuspended(Doors);
			await userEvent.click(screen.getByTestId('internal_duplicate_0'));
			await userEvent.click(screen.getByTestId('internal_duplicate_0'));
			await userEvent.click(screen.getByTestId('internal_duplicate_2'));
			await userEvent.click(screen.getByTestId('internal_duplicate_2'));
	
			expect(screen.queryAllByTestId('internal_item').length).toBe(6);
			expect(screen.getByText('Internal 1')).toBeDefined();
			expect(screen.getByText('Internal 1 (1)')).toBeDefined();
			expect(screen.getByText('Internal 1 (2)')).toBeDefined();
			expect(screen.getByText('Internal 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Internal 1 (1) (2)')).toBeDefined();
		});
	});

	describe('mark section as complete', () => {

		const addDoorsDataToStore = async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceDoors: {
						livingSpaceExternalUnglazedDoor: { data: [externalUnglazed1] },
						livingSpaceExternalGlazedDoor: { data: [externalGlazed1] },
						livingSpaceInternalDoor: { data: [internal1] },
					},
				}
			});
		};

		it('marks doors as complete when mark section as complete button is clicked', async () => {
			await renderSuspended(Doors);
	
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();
			const completedStatusElement = screen.queryByTestId('completeSectionCompleted');
			expect(completedStatusElement?.style.display).toBe("none");
	
			await user.click(screen.getByTestId('completeSectionButton'));
	
			const {
				livingSpaceExternalGlazedDoor,
				livingSpaceExternalUnglazedDoor,
				livingSpaceInternalDoor,
			} = store.livingSpaceFabric.livingSpaceDoors;
	
	
			expect(livingSpaceExternalGlazedDoor.complete).toBe(true);
			expect(livingSpaceExternalUnglazedDoor.complete).toBe(true);
			expect(livingSpaceInternalDoor.complete).toBe(true);
			expect(screen.queryByRole("button", {name: "Mark section as complete"})).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
	
			expect(navigateToMock).toHaveBeenCalledWith('/living-space');
		});
	
		it('marks doors as not complete when mark as complete button is clicked then user removes a door item', async () => {
			await addDoorsDataToStore();
		
			await renderSuspended(Doors);
			const {livingSpaceExternalUnglazedDoor,livingSpaceExternalGlazedDoor, livingSpaceInternalDoor } = store.livingSpaceFabric.livingSpaceDoors;
	
			await user.click(screen.getByTestId('completeSectionButton'));
			expect(livingSpaceExternalUnglazedDoor.complete).toBe(true);
			await user.click(screen.getByTestId('externalUnglazed_remove_0'));
			expect(livingSpaceExternalUnglazedDoor.complete).toBe(false);
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();

			await user.click(screen.getByTestId('completeSectionButton'));
			expect(livingSpaceExternalGlazedDoor.complete).toBe(true);
			await user.click(screen.getByTestId('externalGlazed_remove_0'));
			expect(livingSpaceExternalGlazedDoor.complete).toBe(false);
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();

			await user.click(screen.getByTestId('completeSectionButton'));
			expect(livingSpaceInternalDoor.complete).toBe(true);
			await user.click(screen.getByTestId('internal_remove_0'));
			expect(livingSpaceInternalDoor.complete).toBe(false);
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();
		});

		it('marks doors as not complete when complete button is clicked then user adds a door item', async () => {
			await addDoorsDataToStore();
			await renderSuspended(Doors);
			const {livingSpaceExternalUnglazedDoor,livingSpaceExternalGlazedDoor, livingSpaceInternalDoor } = store.livingSpaceFabric.livingSpaceDoors;

			await user.click(screen.getByTestId('completeSectionButton'));
			expect(livingSpaceExternalUnglazedDoor.complete).toBe(true);
			await user.click(screen.getByTestId('externalUnglazed_duplicate_0'));
			expect(livingSpaceExternalUnglazedDoor.complete).toBe(false);
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();

			await user.click(screen.getByTestId('completeSectionButton'));
			expect(livingSpaceExternalGlazedDoor.complete).toBe(true);
			await user.click(screen.getByTestId('externalGlazed_duplicate_0'));
			expect(livingSpaceExternalGlazedDoor.complete).toBe(false);
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();

			await user.click(screen.getByTestId('completeSectionButton'));
			expect(livingSpaceInternalDoor.complete).toBe(true);
			await user.click(screen.getByTestId('internal_duplicate_0'));
			expect(livingSpaceInternalDoor.complete).toBe(false);
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();
	
		});

		it('marks doors as not complete when a user marks section as complete but then makes an edit to an unglazed door item', async () => {
			await addDoorsDataToStore();
			const {livingSpaceExternalUnglazedDoor } = store.livingSpaceFabric.livingSpaceDoors;
			await renderSuspended(Doors);

			await user.click(screen.getByTestId('completeSectionButton'));
			expect(livingSpaceExternalUnglazedDoor.complete).toBe(true);

			await renderSuspended(UnglazedDoorForm, {
				route: {
					params: {door: '0'}
				}
			});

			await user.click(screen.getByRole('button'));

			expect(livingSpaceExternalUnglazedDoor.complete).toBe(false);
			await renderSuspended(Doors);
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();

		});

		it('marks doors as not complete when a user marks section as complete but then makes an edit to an glazed door item', async () => {
			await addDoorsDataToStore();
			const {livingSpaceExternalGlazedDoor } = store.livingSpaceFabric.livingSpaceDoors;
			await renderSuspended(Doors);
		
			await user.click(screen.getByTestId('completeSectionButton'));
			expect(livingSpaceExternalGlazedDoor.complete).toBe(true);

			await renderSuspended(glazedDoorForm, {
				route: {
					params: {door: '0'}
				}
			});

			await user.click(screen.getByRole('button'));

			expect(livingSpaceExternalGlazedDoor.complete).toBe(false);
			await renderSuspended(Doors);
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();	
		});

		it('marks doors as not complete when a user marks section as complete but then makes an edit to an internal door item', async () => {
			await addDoorsDataToStore();
			const {livingSpaceInternalDoor } = store.livingSpaceFabric.livingSpaceDoors;
			await renderSuspended(Doors);
	
			await user.click(screen.getByTestId('completeSectionButton'));
			expect(livingSpaceInternalDoor.complete).toBe(true);

			await renderSuspended(internalDoorForm, {
				route: {
					params: {door: '0'}
				}
			});

			await user.click(screen.getByRole('button'));

			expect(livingSpaceInternalDoor.complete).toBe(false);
			await renderSuspended(Doors);
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();
		});
	});
});
