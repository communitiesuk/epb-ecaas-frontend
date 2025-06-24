import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import { v4 as uuidv4 } from 'uuid';
import WaterHeating from './index.vue';
import type { HotWaterCylinderData } from "~/stores/ecaasStore.types";

describe('water heating', () => {

	describe('hot water cylinder', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const hotWaterCylinder1: HotWaterCylinderData = {
			id: uuidv4(),
			heatSource: "🥕",
			tankVolume: 5,
			dailyEnergyLoss: 1,
			name: "Hot water cylinder 1"
		};

		const hotWaterCylinder2: HotWaterCylinderData = {
			...hotWaterCylinder1,
			name: "Hot water cylinder 2",
		};

		const hotWaterCylinder3: HotWaterCylinderData = {
			...hotWaterCylinder1,
			name: "Hot water cylinder 3"
		};

		afterEach(() => {
			store.$reset();
		});

		test('hot water cylinder is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						hotWaterCylinder: {
							data: [hotWaterCylinder1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('hotWaterCylinder_items')).toBeDefined();

			await user.click(screen.getByTestId('hotWaterCylinder_remove_0'));

			expect(screen.queryByTestId('hotWaterCylinder_items')).toBeNull();
		});

		it('should only remove the hot water cylinder that is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						hotWaterCylinder: {
							data:[hotWaterCylinder1, hotWaterCylinder2, hotWaterCylinder3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('hotWaterCylinder_remove_1'));

			const populatedList = screen.getByTestId('hotWaterCylinder_items');

			expect(within(populatedList).getByText('Hot water cylinder 1')).toBeDefined();
			expect(within(populatedList).getByText('Hot water cylinder 3')).toBeDefined();
			expect(within(populatedList).queryByText('Hot water cylinder 2')).toBeNull();
		});

		test('hot water cylinder is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						hotWaterCylinder: {
							data:[hotWaterCylinder1, hotWaterCylinder2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await userEvent.click(screen.getByTestId('hotWaterCylinder_duplicate_0'));
			await userEvent.click(screen.getByTestId('hotWaterCylinder_duplicate_0'));
			await userEvent.click(screen.getByTestId('hotWaterCylinder_duplicate_2'));
			await userEvent.click(screen.getByTestId('hotWaterCylinder_duplicate_2'));

			expect(screen.queryAllByTestId('hotWaterCylinder_item').length).toBe(6);
			expect(screen.getByText('Hot water cylinder 1')).toBeDefined();
			expect(screen.getByText('Hot water cylinder 1 (1)')).toBeDefined();
			expect(screen.getByText('Hot water cylinder 1 (2)')).toBeDefined();
			expect(screen.getByText('Hot water cylinder 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Hot water cylinder 1 (1) (2)')).toBeDefined();
		});
	});
});