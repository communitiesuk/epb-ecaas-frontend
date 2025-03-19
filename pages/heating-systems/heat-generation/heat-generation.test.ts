import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import HeatGeneration from './index.vue';

describe('heat generation', () => {

	describe('heat pump', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatPump1: HeatPumpData = {
			name: "Heat pump 1"
		};

		const heatPump2: HeatPumpData = {
			...heatPump1,
			name: "Heat pump 2",
		};

		const heatPump3: HeatPumpData = {
			...heatPump1,
			name: "Heat pump 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('heat pump is removed when remove link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data: [heatPump1]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);

			expect(screen.getAllByTestId('heatPump_items')).toBeDefined();

			await user.click(screen.getByTestId('heatPump_remove_0'));

			expect(screen.queryByTestId('heatPump_items')).toBeNull();
		});

		it('should only remove the heat pump thats is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data:[heatPump1, heatPump2, heatPump3]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);
			await user.click(screen.getByTestId('heatPump_remove_1'));

			const populatedList = screen.getByTestId('heatPump_items');

			expect(within(populatedList).getByText('Heat pump 1')).toBeDefined();
			expect(within(populatedList).getByText('Heat pump 3')).toBeDefined();
			expect(within(populatedList).queryByText('Heat pump 2')).toBeNull();

		});

		it('Heat pump is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatPump: {
							data: [heatPump1, heatPump2]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);
			await userEvent.click(screen.getByTestId('heatPump_duplicate_0'));
			await userEvent.click(screen.getByTestId('heatPump_duplicate_0'));
			await userEvent.click(screen.getByTestId('heatPump_duplicate_2'));
			await userEvent.click(screen.getByTestId('heatPump_duplicate_2'));

			expect(screen.queryAllByTestId('heatPump_item').length).toBe(6);
			expect(screen.getByText('Heat pump 1')).toBeDefined();
			expect(screen.getByText('Heat pump 1 (1)')).toBeDefined();
			expect(screen.getByText('Heat pump 1 (2)')).toBeDefined();
			expect(screen.getByText('Heat pump 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Heat pump 1 (1) (2)')).toBeDefined();
		});
	});
});