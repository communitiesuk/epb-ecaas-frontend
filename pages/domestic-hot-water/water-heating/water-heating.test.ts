import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import { v4 as uuidv4 } from 'uuid';
import WaterHeating from './index.vue';
import type { ImmersionHeaterData, StorageTankData } from "~/stores/ecaasStore.types";

describe('water heating', () => {

	describe('storage tank', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const storageTank1: StorageTankData = {
			id: uuidv4(),
			heatSource: "🥕",
			tankVolume: 5,
			dailyEnergyLoss: 1,
			name: "Storage tank 1"
		};

		const storageTank2: StorageTankData = {
			...storageTank1,
			name: "Storage tank 2",
		};

		const storageTank3: StorageTankData = {
			...storageTank1,
			name: "Storage tank 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('storage tank is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						storageTank: {
							data: [storageTank1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('storageTank_items')).toBeDefined();

			await user.click(screen.getByTestId('storageTank_remove_0'));

			expect(screen.queryByTestId('storageTank_items')).toBeNull();
		});

		it('should only remove the storage tank that is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						storageTank: {
							data:[storageTank1, storageTank2, storageTank3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('storageTank_remove_1'));

			const populatedList = screen.getByTestId('storageTank_items');

			expect(within(populatedList).getByText('Storage tank 1')).toBeDefined();
			expect(within(populatedList).getByText('Storage tank 3')).toBeDefined();
			expect(within(populatedList).queryByText('Storage tank 2')).toBeNull();
		});

		it('storage tank is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						storageTank: {
							data:[storageTank1, storageTank2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await userEvent.click(screen.getByTestId('storageTank_duplicate_0'));
			await userEvent.click(screen.getByTestId('storageTank_duplicate_0'));
			await userEvent.click(screen.getByTestId('storageTank_duplicate_2'));
			await userEvent.click(screen.getByTestId('storageTank_duplicate_2'));

			expect(screen.queryAllByTestId('storageTank_item').length).toBe(6);
			expect(screen.getByText('Storage tank 1')).toBeDefined();
			expect(screen.getByText('Storage tank 1 (1)')).toBeDefined();
			expect(screen.getByText('Storage tank 1 (2)')).toBeDefined();
			expect(screen.getByText('Storage tank 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Storage tank 1 (1) (2)')).toBeDefined();
		});
	});

	describe('immersion heater', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const immersionHeater1: ImmersionHeaterData = {
			name: "Immersion heater 1",
			ratedPower: 10,
			heaterPosition: 1,
			thermostatPosition: 1
		};

		const immersionHeater2: ImmersionHeaterData = {
			...immersionHeater1,
			name: "Immersion heater 2",
		};

		const immersionHeater3: ImmersionHeaterData = {
			...immersionHeater1,
			name: "Immersion heater 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('immersion heater is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						immersionHeater: {
							data: [immersionHeater1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('immersionHeater_items')).toBeDefined();

			await user.click(screen.getByTestId('immersionHeater_remove_0'));

			expect(screen.queryByTestId('immersionHeater_items')).toBeNull();
		});

		it('should only remove the immersion heater that is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						immersionHeater: {
							data:[immersionHeater1, immersionHeater2, immersionHeater3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('immersionHeater_remove_1'));

			const populatedList = screen.getByTestId('immersionHeater_items');

			expect(within(populatedList).getByText('Immersion heater 1')).toBeDefined();
			expect(within(populatedList).getByText('Immersion heater 3')).toBeDefined();
			expect(within(populatedList).queryByText('Immersion heater 2')).toBeNull();
		});

		it('immersion heater is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						immersionHeater: {
							data:[immersionHeater1, immersionHeater2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await userEvent.click(screen.getByTestId('immersionHeater_duplicate_0'));
			await userEvent.click(screen.getByTestId('immersionHeater_duplicate_0'));
			await userEvent.click(screen.getByTestId('immersionHeater_duplicate_2'));
			await userEvent.click(screen.getByTestId('immersionHeater_duplicate_2'));

			expect(screen.queryAllByTestId('immersionHeater_item').length).toBe(6);
			expect(screen.getByText('Immersion heater 1')).toBeDefined();
			expect(screen.getByText('Immersion heater 1 (1)')).toBeDefined();
			expect(screen.getByText('Immersion heater 1 (2)')).toBeDefined();
			expect(screen.getByText('Immersion heater 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Immersion heater 1 (1) (2)')).toBeDefined();
		});
	});
});