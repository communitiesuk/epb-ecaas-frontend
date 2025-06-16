import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Floors from './index.vue';
import GroundFloorForm from './ground/[floor].vue';
import InternalFloorForm from './internal/[floor].vue';
import ExposedFloorForm from './exposed/[floor].vue';

import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';
import { FloorType, MassDistributionClass } from "~/schema/api-schema.types";

describe('floors', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	const ground1: GroundFloorData = {
		name: "ground1 name",
		surfaceAreaInZone: 5,
		surfaceAreaAllZones: 0,
		pitch: 0,
		uValue: 1,
		thermalResistanceOfFloorConstruction: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
		perimeter: 0,
		psiOfWallJunction: 0,
		typeOfGroundFloor: FloorType.Slab_no_edge_insulation
	};

	const ground2: GroundFloorData = {
		name: "ground2 name",
		surfaceAreaInZone: 5,
		surfaceAreaAllZones: 0,
		pitch: 0,
		uValue: 1,
		thermalResistanceOfFloorConstruction: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
		perimeter: 0,
		psiOfWallJunction: 0,
		typeOfGroundFloor: FloorType.Slab_no_edge_insulation
	};

	const ground3: GroundFloorData = {
		name: "ground3 name",
		surfaceAreaInZone: 5,
		surfaceAreaAllZones: 0,
		pitch: 0,
		uValue: 1,
		thermalResistanceOfFloorConstruction: 1,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
		perimeter: 0,
		psiOfWallJunction: 0,
		typeOfGroundFloor: FloorType.Slab_no_edge_insulation
	};
	
	const internal1: InternalFloorData = {
		typeOfInternalFloor: 'heatedSpace',
		name: "internal1 name",
		surfaceAreaOfElement: 5,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
	};

	const internal2: InternalFloorData = {
		typeOfInternalFloor: 'heatedSpace',
		name: "internal2 name",
		surfaceAreaOfElement: 5,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
	};

	const internal3: InternalFloorData = {
		typeOfInternalFloor: 'heatedSpace',
		name: "internal3 name",
		surfaceAreaOfElement: 5,
		kappaValue: 100,
		massDistributionClass: MassDistributionClass.I,
	};

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
		massDistributionClass: MassDistributionClass.I
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
		massDistributionClass: MassDistributionClass.I
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
		massDistributionClass: MassDistributionClass.I
	};


	afterEach(() => {
		store.$reset();
	});
	describe('ground floors', () => {

	
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

	describe('mark section as complete', () =>  {
		
		const addFloorsDataToStore = async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceFloors: {
						livingSpaceGroundFloor: { data: [ground1] },
						livingSpaceInternalFloor: { data: [internal1] },
						livingSpaceExposedFloor: { data: [exposed1] },
					},
				}
			});
		};

		beforeEach(async () =>{
			await addFloorsDataToStore();
			await renderSuspended(Floors);
		});

		const getFloorData = async (action: string) => {
			const floors = [
				{
					key: 'livingSpaceGroundFloor',
					testId: `ground_${action}_0`,
					form: GroundFloorForm
				},
				{
					key: 'livingSpaceInternalFloor',
					testId: `internal_${action}_0`,
					form: InternalFloorForm
				},
				{
					key: 'livingSpaceExposedFloor',
					testId: `exposed_${action}_0`,
					form: ExposedFloorForm
				}
			];
			return floors;
		};

		type FloorType = keyof typeof store.livingSpaceFabric.livingSpaceFloors;

	
		it('marks floors as complete when mark section as complete button is clicked', async () => {
	
			expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();
			const completedStatusElement = screen.queryByTestId('completeSectionCompleted');
			expect(completedStatusElement?.style.display).toBe("none");
	
			await user.click(screen.getByTestId('completeSectionButton'));
	
			const {livingSpaceGroundFloor, livingSpaceInternalFloor, livingSpaceExposedFloor
	
			} = store.livingSpaceFabric.livingSpaceFloors;
	
	
			expect(livingSpaceGroundFloor?.complete).toBe(true);
			expect(livingSpaceInternalFloor?.complete).toBe(true);
			expect(livingSpaceExposedFloor?.complete).toBe(true);
			expect(screen.queryByRole("button", {name: "Mark section as complete"})).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
	
			expect(navigateToMock).toHaveBeenCalledWith('/living-space');
		});
	
		it('marks floors as not complete when mark as complete button is clicked then user removes a floor item', async () => {

			const floorsData = await getFloorData("remove");
			const floors = Object.entries(store.livingSpaceFabric.livingSpaceFloors);
			
			for (const [key] of floors) {
				const typedKey = key as FloorType;
		
				await user.click(screen.getByTestId('completeSectionButton'));
				expect(store.livingSpaceFabric.livingSpaceFloors[typedKey]?.complete).toBe(true);
					
				const floorData = floorsData.find(x => x.key === typedKey);
	
				await user.click(screen.getByTestId(floorData!.testId));
				expect(store.livingSpaceFabric.livingSpaceFloors[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();
	
			}
		});

		it('marks floors as not complete when complete button is clicked then user duplicates a floor item', async () => {

			const floorsData = await getFloorData("duplicate");
			const floors = Object.entries(store.livingSpaceFabric.livingSpaceFloors);
		
			for (const [key] of floors) {
				const typedKey = key as FloorType;
	
				await user.click(screen.getByTestId('completeSectionButton'));
				expect(store.livingSpaceFabric.livingSpaceFloors[typedKey]?.complete).toBe(true);
				
				const floorData = floorsData.find(x => x.key === typedKey);

				await user.click(screen.getByTestId(floorData!.testId));
				expect(store.livingSpaceFabric.livingSpaceFloors[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();
			}

		});

		it('marks floors as not complete when user saves a new or edited floor form after marking section as complete', async () => {

			const floorsData = await getFloorData("");

			const floors = Object.entries(store.livingSpaceFabric.livingSpaceFloors);
	
			for(const [key] of floors){
				const typedKey = key as FloorType;
				await user.click(screen.getByTestId('completeSectionButton'));
				expect(store.livingSpaceFabric.livingSpaceFloors[typedKey]?.complete).toBe(true);

				const floorData = floorsData.find(x => x.key === typedKey);

				await renderSuspended(floorData?.form, {
					route: {
						params: {floor: '0'}
					}
				});

				await user.click(screen.getByRole('button', {name: "Save and continue"}));
				
				expect(store.livingSpaceFabric.livingSpaceFloors[typedKey]?.complete).toBe(false);
				await renderSuspended(Floors);
				expect(screen.getByRole("button", {name: "Mark section as complete"})).not.toBeNull();
			}
		});
	});
});
