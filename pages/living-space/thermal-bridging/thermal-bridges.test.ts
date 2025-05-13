import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import ThermalBridges from './index.vue';
import LinearThermalBridgeForm from './linear/[bridging].vue';
import PointThermalBridgeForm from './point/[bridging].vue';

import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';

describe('thermal bridges', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const linear1: LinearThermalBridgeData = {
		name: "Linear 1",
		typeOfThermalBridge: 'e1',
		linearThermalTransmittance: 1,
		length: 2
	};

	const linear2: LinearThermalBridgeData = {
		...linear1,
		name: "Linear 2"
	};

	const linear3: LinearThermalBridgeData = {
		...linear1,
		name: "Linear 3"
	};
	const point1: PointThermalBridgeData = {
		name: "Point 1",
		heatTransferCoefficient: 1
	};

	const point2: PointThermalBridgeData = {
		...point1,
		name: "Point 2"
	};

	const point3: PointThermalBridgeData = {
		...point1,
		name: "Point 3"
	};

	describe('linear thermal bridges', () => {
	
		it('linear thermal bridge is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceThermalBridging: {
						livingSpaceLinearThermalBridges: {
							data:[linear1]
						}
					}
				}
			});
	
			await renderSuspended(ThermalBridges);
	
			expect(screen.getAllByTestId('linearThermalBridges_items')).toBeDefined();
	
			await user.click(screen.getByTestId('linearThermalBridges_remove_0'));
	
			expect(screen.queryByTestId('linearThermalBridges_items')).toBeNull();
		});
	
		it('should only remove the linear thermal bridge object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceThermalBridging: {
						livingSpaceLinearThermalBridges: {
							data:[linear1, linear2, linear3]
						}
					}
				}
			});
	
			await renderSuspended(ThermalBridges);
			await user.click(screen.getByTestId('linearThermalBridges_remove_1'));
	
			const populatedList = screen.getByTestId('linearThermalBridges_items');
	
			expect(within(populatedList).getByText('Linear 1')).toBeDefined();
			expect(within(populatedList).getByText('Linear 3')).toBeDefined();
			expect(within(populatedList).queryByText('Linear 2')).toBeNull();
		});
	
		it('linear thermal bridge is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceThermalBridging: {
						livingSpaceLinearThermalBridges: {
							data:[linear1, linear2]
						}
					}
				}
			});
	
			await renderSuspended(ThermalBridges);
			await userEvent.click(screen.getByTestId('linearThermalBridges_duplicate_0'));
			await userEvent.click(screen.getByTestId('linearThermalBridges_duplicate_0'));
			await userEvent.click(screen.getByTestId('linearThermalBridges_duplicate_2'));
			await userEvent.click(screen.getByTestId('linearThermalBridges_duplicate_2'));
	
			expect(screen.queryAllByTestId('linearThermalBridges_item').length).toBe(6);
			expect(screen.getByText('Linear 1')).toBeDefined();
			expect(screen.getByText('Linear 1 (1)')).toBeDefined();
			expect(screen.getByText('Linear 1 (2)')).toBeDefined();
			expect(screen.getByText('Linear 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Linear 1 (1) (2)')).toBeDefined();
		});
	});

	describe('point thermal bridges', () => {

		it('point thermal bridge is removed when remove link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceThermalBridging: {
						livingSpacePointThermalBridges: {
							data:[point1]
						}
					}
				}
			});
	
			await renderSuspended(ThermalBridges);
	
			expect(screen.getAllByTestId('pointThermalBridges_items')).toBeDefined();
	
			await user.click(screen.getByTestId('pointThermalBridges_remove_0'));
	
			expect(screen.queryByTestId('pointThermalBridges_items')).toBeNull();
		});
	
		it('should only remove the point thermal bridge object thats is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceThermalBridging: {
						livingSpacePointThermalBridges: {
							data:[point1, point2, point3]
						}
					}
				}
			});
	
			await renderSuspended(ThermalBridges);
			await user.click(screen.getByTestId('pointThermalBridges_remove_1'));
	
			const populatedList = screen.getByTestId('pointThermalBridges_items');
	
			expect(within(populatedList).getByText('Point 1')).toBeDefined();
			expect(within(populatedList).getByText('Point 3')).toBeDefined();
			expect(within(populatedList).queryByText('Point 2')).toBeNull();
		});
	
		it('point thermal bridge is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceThermalBridging: {
						livingSpacePointThermalBridges: {
							data:[point1, point2]
						}
					}
				}
			});
	
			await renderSuspended(ThermalBridges);
			await userEvent.click(screen.getByTestId('pointThermalBridges_duplicate_0'));
			await userEvent.click(screen.getByTestId('pointThermalBridges_duplicate_0'));
			await userEvent.click(screen.getByTestId('pointThermalBridges_duplicate_2'));
			await userEvent.click(screen.getByTestId('pointThermalBridges_duplicate_2'));
	
			expect(screen.queryAllByTestId('pointThermalBridges_item').length).toBe(6);
			expect(screen.getByText('Point 1')).toBeDefined();
			expect(screen.getByText('Point 1 (1)')).toBeDefined();
			expect(screen.getByText('Point 1 (2)')).toBeDefined();
			expect(screen.getByText('Point 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Point 1 (1) (2)')).toBeDefined();
		});
	});

	describe("mark section as complete", () => {

		const store = useEcaasStore();
		const user = userEvent.setup();

		const navigateToMock = vi.hoisted(() => vi.fn());
		mockNuxtImport("navigateTo", () => navigateToMock);

		const addThermalBridgingDataToStore = async () => {
			store.$patch({
				livingSpaceFabric: {
					livingSpaceThermalBridging: {
						livingSpaceLinearThermalBridges: { data: [linear1] },
						livingSpacePointThermalBridges: { data: [point1] },
					},
				},
			});
		};
		beforeEach(async () => {
			await addThermalBridgingDataToStore();
			await renderSuspended(ThermalBridges);
		});

		const getBridgeData = async (action: string) => {
			return [
				{
					key: "livingSpaceLinearThermalBridges",
					testId: `linearThermalBridges_${action}_0`,
					form: LinearThermalBridgeForm,
					params: "linear"
				},
				{
					key: "livingSpacePointThermalBridges",
					testId: `pointThermalBridges_${action}_0`,
					form: PointThermalBridgeForm,
					params: "point"
				}
			];
		};
	type ThermalBridgingType = keyof typeof store.livingSpaceFabric.livingSpaceThermalBridging;

	beforeEach(async () => {
		await addThermalBridgingDataToStore();
		await renderSuspended(ThermalBridges);
	});

	it("marks thermal bridging section as complete when button is clicked", async () => {
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
		expect(completedStatusElement?.style.display).toBe("none");

		await user.click(screen.getByTestId("completeSectionButton"));

		const thermal = store.livingSpaceFabric.livingSpaceThermalBridging;
		for (const key in thermal) {
			expect(thermal[key as ThermalBridgingType]?.complete).toBe(true);
		}

		expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
		expect(completedStatusElement?.style.display).not.toBe("none");
		expect(navigateToMock).toHaveBeenCalledWith("/living-space");
	});

	it("marks as not complete if an item is removed after marking complete", async () => {
		const bridges = await getBridgeData("remove");

		for (const [key] of Object.entries(store.livingSpaceFabric.livingSpaceThermalBridging)) {
			const typedKey = key as ThermalBridgingType;

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.livingSpaceFabric.livingSpaceThermalBridging[typedKey]?.complete).toBe(true);

			const bridgeData = bridges.find((b) => b.key === typedKey);
			await user.click(screen.getByTestId(bridgeData!.testId));
			expect(store.livingSpaceFabric.livingSpaceThermalBridging[typedKey]?.complete).toBe(false);

			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		}
	});

	it("marks as not complete after saving a new or edited thermal bridge item", async () => {
		const bridges = await getBridgeData("");

		for (const [key] of Object.entries(store.livingSpaceFabric.livingSpaceThermalBridging)) {
			const typedKey = key as ThermalBridgingType;

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.livingSpaceFabric.livingSpaceThermalBridging[typedKey]?.complete).toBe(true);

			const bridgeData = bridges.find((b) =>b.key === typedKey);
			await renderSuspended(bridgeData!.form, {
				route: {
					params: { bridging: "0" }
				}
			});

			await user.click(screen.getByRole("button", { name: "Save and continue" }));
			expect(store.livingSpaceFabric.livingSpaceThermalBridging[typedKey]?.complete).toBe(false);

			await renderSuspended(ThermalBridges);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		}
	});
	});

});
