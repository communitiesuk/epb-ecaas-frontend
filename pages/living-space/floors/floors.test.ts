import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Floors from './index.vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';


describe('ground floors', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const ground1: GroundFloorData = {
		name: "ground1 name",
		surfaceAreaInZone: 0,
		surfaceAreaAllZones: 0,
		pitch: 0,
		uValue: 0,
		kappaValue: 0,
		massDistributionClass: "",
		perimeter: 0,
		psiOfWallJunction: 0,
		typeOfGroundFloor: ""
	};

	const ground2: GroundFloorData = {
		name: "ground2 name",
		surfaceAreaInZone: 0,
		surfaceAreaAllZones: 0,
		pitch: 0,
		uValue: 0,
		kappaValue: 0,
		massDistributionClass: "",
		perimeter: 0,
		psiOfWallJunction: 0,
		typeOfGroundFloor: ""
	};

	const ground3: GroundFloorData = {
		name: "ground3 name",
		surfaceAreaInZone: 0,
		surfaceAreaAllZones: 0,
		pitch: 0,
		uValue: 0,
		kappaValue: 0,
		massDistributionClass: "",
		perimeter: 0,
		psiOfWallJunction: 0,
		typeOfGroundFloor: ""
	};

	afterEach(() => {
		store.$reset();
	});

	it('ground floor is removed when remove link is clicked', async () => {

		store.$patch({
			livingSpaceFabric: {
				floors: {
					data: {
						groundFloor: {
							data:[ground1]
						}
             
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
				floors: {
					data: {
						groundFloor: {
							data:[ground1, ground2, ground3]
						}
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

	it('shading is duplicated when duplicate link is clicked', async () => {
	
		store.$patch({
			livingSpaceFabric: {
				floors: {
					data: {
						groundFloor: {
							data:[ground1, ground2]
						}
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
	const store = useEcaasStore();
	const user = userEvent.setup();

	const internal1: InternalFloorData = {
		name: "internal1 name"
	};

	const internal2: InternalFloorData = {
		name: "internal2 name"
	};

	const internal3: InternalFloorData = {
		name: "internal3 name"
	};

	afterEach(() => {
		store.$reset();
	});

	it('internal floor is removed when remove link is clicked', async () => {

		store.$patch({
			livingSpaceFabric: {
				floors: {
					data: {
						internalFloor: {
							data:[internal1]
						}
             
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
				floors: {
					data: {
						internalFloor: {
							data:[internal1, internal2, internal3]
						}
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

	it('shading is duplicated when duplicate link is clicked', async () => {
	
		store.$patch({
			livingSpaceFabric: {
				floors: {
					data: {
						internalFloor: {
							data:[internal1, internal2]
						}
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
	const store = useEcaasStore();
	const user = userEvent.setup();

	const exposed1: ExposedFloorData = {
		name: "exposed1 name"
	};

	const exposed2: ExposedFloorData = {
		name: "exposed2 name"
	};

	const exposed3: ExposedFloorData = {
		name: "exposed3 name"
	};

	afterEach(() => {
		store.$reset();
	});

	it('exposed floor is removed when remove link is clicked', async () => {

		store.$patch({
			livingSpaceFabric: {
				floors: {
					data: {
						exposedFloor: {
							data:[exposed1]
						}
             
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
				floors: {
					data: {
						exposedFloor: {
							data:[exposed1, exposed2, exposed3]
						}
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

	it('shading is duplicated when duplicate link is clicked', async () => {
	
		store.$patch({
			livingSpaceFabric: {
				floors: {
					data: {
						exposedFloor: {
							data:[exposed1, exposed2]
						}
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