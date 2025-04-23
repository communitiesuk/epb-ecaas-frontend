import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Floors from './index.vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';

describe('floors', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	describe('ground floors', () => {
		const ground1: GroundFloorData = {
			name: "ground1 name",
			surfaceAreaInZone: 5,
			surfaceAreaAllZones: 0,
			pitch: 0,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			perimeter: 0,
			psiOfWallJunction: 0,
			typeOfGroundFloor: 'slabNoEdgeInsulation'
		};
	
		const ground2: GroundFloorData = {
			name: "ground2 name",
			surfaceAreaInZone: 5,
			surfaceAreaAllZones: 0,
			pitch: 0,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			perimeter: 0,
			psiOfWallJunction: 0,
			typeOfGroundFloor: 'slabNoEdgeInsulation'
		};
	
		const ground3: GroundFloorData = {
			name: "ground3 name",
			surfaceAreaInZone: 5,
			surfaceAreaAllZones: 0,
			pitch: 0,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			perimeter: 0,
			psiOfWallJunction: 0,
			typeOfGroundFloor: 'slabNoEdgeInsulation'
		};
	
		it('ground floor is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: {
							data:[ground1]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
	
			expect(screen.getAllByTestId('ground_items')).toBeDefined();
	
			await user.click(screen.getByTestId('ground_remove_0'));
	
			expect(screen.queryByTestId('ground_items')).toBeNull();
		});
	
		it('should only remove the ground floor object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: {
							data:[ground1, ground2, ground3]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await user.click(screen.getByTestId('ground_remove_1'));
	
			const populatedList = screen.getByTestId('ground_items');
	
			expect(within(populatedList).getByText('ground1 name')).toBeDefined();
			expect(within(populatedList).getByText('ground3 name')).toBeDefined();
			expect(within(populatedList).queryByText('ground2 name')).toBeNull();
	
		});
		it('floor is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: {
							data:[ground1, ground2]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await userEvent.click(screen.getByTestId('ground_duplicate_0'));
			await userEvent.click(screen.getByTestId('ground_duplicate_0'));
			await userEvent.click(screen.getByTestId('ground_duplicate_2'));
			await userEvent.click(screen.getByTestId('ground_duplicate_2'));
	
			expect(screen.queryAllByTestId('ground_item').length).toBe(6);
			expect(screen.getByText('ground1 name')).toBeDefined();
			expect(screen.getByText('ground1 name (1)')).toBeDefined();
			expect(screen.getByText('ground1 name (2)')).toBeDefined();
			expect(screen.getByText('ground1 name (1) (1)')).toBeDefined();
			expect(screen.getByText('ground1 name (1) (2)')).toBeDefined();
		});
	});

	describe('internal floors', () => {
		const internal1: InternalFloorData = {
			typeOfInternalFloor: 'heatedSpace',
			name: "internal1 name",
			surfaceAreaOfElement: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitch: 0
		};
	
		const internal2: InternalFloorData = {
			typeOfInternalFloor: 'heatedSpace',
			name: "internal2 name",
			surfaceAreaOfElement: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitch: 0
		};
	
		const internal3: InternalFloorData = {
			typeOfInternalFloor: 'heatedSpace',
			name: "internal3 name",
			surfaceAreaOfElement: 5,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal',
			pitch: 0
		};
	
		it('internal floor is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceInternalFloor: {
							data:[internal1]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
	
			expect(screen.getAllByTestId('internal_items')).toBeDefined();
	
			await user.click(screen.getByTestId('internal_remove_0'));
	
			expect(screen.queryByTestId('internal_items')).toBeNull();
		});
	
		it('should only remove the internal floor object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceInternalFloor: {
							data:[internal1, internal2, internal3]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await user.click(screen.getByTestId('internal_remove_1'));
	
			const populatedList = screen.getByTestId('internal_items');
	
			expect(within(populatedList).getByText('internal1 name')).toBeDefined();
			expect(within(populatedList).getByText('internal3 name')).toBeDefined();
			expect(within(populatedList).queryByText('internal2 name')).toBeNull();
	
		});
	
		it('floor is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceInternalFloor: {
							data:[internal1, internal2]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await userEvent.click(screen.getByTestId('internal_duplicate_0'));
			await userEvent.click(screen.getByTestId('internal_duplicate_0'));
			await userEvent.click(screen.getByTestId('internal_duplicate_2'));
			await userEvent.click(screen.getByTestId('internal_duplicate_2'));
	
			expect(screen.queryAllByTestId('internal_item').length).toBe(6);
			expect(screen.getByText('internal1 name')).toBeDefined();
			expect(screen.getByText('internal1 name (1)')).toBeDefined();
			expect(screen.getByText('internal1 name (2)')).toBeDefined();
			expect(screen.getByText('internal1 name (1) (1)')).toBeDefined();
			expect(screen.getByText('internal1 name (1) (2)')).toBeDefined();
		});
	});

	describe('exposed floors', () => {
		const exposed1: ExposedFloorData = {
			name: "exposed1 name",
			pitch: 0,
			orientation: 0,
			length: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		};
	
		const exposed2: ExposedFloorData = {
			name: "exposed2 name",
			pitch: 0,
			orientation: 0,
			length: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		};
	
		const exposed3: ExposedFloorData = {
			name: "exposed3 name",
			pitch: 0,
			orientation: 0,
			length: 0.5,
			width: 20,
			elevationalHeight: 20,
			surfaceArea: 10,
			solarAbsorption: 0.1,
			uValue: 1,
			kappaValue: 100,
			massDistributionClass: 'internal'
		};
	
		it('exposed floor is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceExposedFloor: {
							data:[exposed1]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
	
			expect(screen.getAllByTestId('exposed_items')).toBeDefined();
	
			await user.click(screen.getByTestId('exposed_remove_0'));
	
			expect(screen.queryByTestId('exposed_items')).toBeNull();
		});
	
		it('should only remove the exposed floor object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceExposedFloor: {
							data:[exposed1, exposed2, exposed3]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await user.click(screen.getByTestId('exposed_remove_1'));
			const populatedList = screen.getByTestId('exposed_items');
	
			expect(within(populatedList).getByText('exposed1 name')).toBeDefined();
			expect(within(populatedList).getByText('exposed3 name')).toBeDefined();
			expect(within(populatedList).queryByText('exposed2 name')).toBeNull();
	
		});
		
		it('floor is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceExposedFloor: {
							data:[exposed1, exposed2]
						}
					}
				}
			});
	
			await renderSuspended(Floors);
			await userEvent.click(screen.getByTestId('exposed_duplicate_0'));
			await userEvent.click(screen.getByTestId('exposed_duplicate_0'));
			await userEvent.click(screen.getByTestId('exposed_duplicate_2'));
			await userEvent.click(screen.getByTestId('exposed_duplicate_2'));
	
			expect(screen.queryAllByTestId('exposed_item').length).toBe(6);
			expect(screen.getByText('exposed1 name')).toBeDefined();
			expect(screen.getByText('exposed1 name (1)')).toBeDefined();
			expect(screen.getByText('exposed1 name (2)')).toBeDefined();
			expect(screen.getByText('exposed1 name (1) (1)')).toBeDefined();
			expect(screen.getByText('exposed1 name (1) (2)')).toBeDefined();
		});
	});

	it('marks shading as complete when complete button is clicked', async () => {
		await renderSuspended(Floors);

		await user.click(screen.getByTestId('completeSection'));

		const {
			livingSpaceGroundFloor,
			livingSpaceExposedFloor,
			livingSpaceInternalFloor
		} = store.livingSpaceFabric.livingSpaceFloors;

		expect(navigateToMock).toHaveBeenCalledWith('/living-space');
		expect(livingSpaceGroundFloor.complete).toBe(true);
		expect(livingSpaceExposedFloor?.complete).toBe(true);
		expect(livingSpaceInternalFloor?.complete).toBe(true);
	});
});