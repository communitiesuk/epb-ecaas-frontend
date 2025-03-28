import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Doors from './index.vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';

describe('external unglazed doors', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const externalUnglazed1: ExternalUnglazedDoorData = {
		name: "external unglazed 1 name",
		pitchOption: '90',
		pitch: 90,
		orientation: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorbtion: 0.1,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal'
	};

	const externalUnglazed2: ExternalUnglazedDoorData = {
		name: "external unglazed 2 name",
		pitchOption: '90',
		pitch: 90,
		orientation: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorbtion: 0.1,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal'
	};

	const externalUnglazed3: ExternalUnglazedDoorData = {
		name: "external unglazed 3 name",
		pitchOption: '90',
		pitch: 90,
		orientation: 0,
		length: 0.5,
		width: 20,
		elevationalHeight: 20,
		surfaceArea: 10,
		solarAbsorbtion: 0.1,
		uValue: 1,
		kappaValue: 100,
		massDistributionClass: 'internal'
	};

	afterEach(() => {
		store.$reset();
	});

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
	const store = useEcaasStore();
	const user = userEvent.setup();

	const externalGlazed1: ExternalGlazedDoorData = {
		name: "externalGlazed1 name",
		orientation: 1,
		surfaceArea: 1,
		length: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittence: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: "none",
	};

	const externalGlazed2: ExternalGlazedDoorData = {
		name: "externalGlazed2 name",
		orientation: 1,
		surfaceArea: 1,
		length: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittence: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: "none",
	};

	const externalGlazed3: ExternalGlazedDoorData = {
		name: "externalGlazed3 name",
		orientation: 1,
		surfaceArea: 1,
		length: 1,
		width: 1,
		uValue: 1,
		pitchOption: '90',
		pitch: 90,
		solarTransmittence: 0.1,
		elevationalHeight: 1,
		midHeight: 1,
		numberOpenableParts: "none",
	};

	afterEach(() => {
		store.$reset();
	});

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
	const store = useEcaasStore();
	const user = userEvent.setup();

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

	afterEach(() => {
		store.$reset();
	});

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