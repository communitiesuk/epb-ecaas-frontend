import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import ThermalBridges from './index.vue';
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

	describe('linear thermal bridges', () => {
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

	it('marks shading as complete when complete button is clicked', async () => {
		await renderSuspended(ThermalBridges);

		await user.click(screen.getByTestId('completeSection'));

		const {
			livingSpaceLinearThermalBridges,
			livingSpacePointThermalBridges
		} = store.livingSpaceFabric.livingSpaceThermalBridging;

		expect(navigateToMock).toHaveBeenCalledWith('/living-space');
		expect(livingSpaceLinearThermalBridges.complete).toBe(true);
		expect(livingSpacePointThermalBridges.complete).toBe(true);
	});
});
