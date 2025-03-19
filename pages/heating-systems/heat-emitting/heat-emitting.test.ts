import { renderSuspended } from "@nuxt/test-utils/runtime";
import HeatEmitting from './index.vue';
import {screen} from '@testing-library/vue';
import userEvent from "@testing-library/user-event";

describe("heat emitting", () => {

	describe('wet distribution', async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const wetDistribution1 = {
			name: 'Wet Distribution 1',
		};
		const wetDistribution2 = {
			name: 'Wet Distribution 2',
		};
		const wetDistribution3 = {
			name: 'Wet Distribution 3',
		};
		afterEach(() => {
			store.$reset();
		});

		it('should remove wet distribution when remove link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			expect(screen.getAllByTestId('wetDistribution_items')).toBeDefined();

			await user.click(screen.getByTestId('wetDistribution_remove_0'));
			expect(screen.queryByTestId('wetDistribution_items')).toBeNull();
		});

		it('should only remove the wet distribution that is clicked if there are multiple wet distributions', async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1, wetDistribution2, wetDistribution3],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await user.click(screen.getByTestId('wetDistribution_remove_1'));

			expect(screen.getByText('Wet Distribution 1')).toBeDefined();
			expect(screen.getByText('Wet Distribution 3')).toBeDefined();
			expect(screen.queryByText('Wet Distribution 2')).toBeNull();
		});

		it('should duplicate the correct wet distribution when duplicate link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						wetDistribution: {
							data: [wetDistribution1, wetDistribution2],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await userEvent.click(screen.getByTestId('wetDistribution_duplicate_0'));
			await userEvent.click(screen.getByTestId('wetDistribution_duplicate_0'));
			await userEvent.click(screen.getByTestId('wetDistribution_duplicate_2'));
			await userEvent.click(screen.getByTestId('wetDistribution_duplicate_2'));

			expect(screen.queryAllByTestId('wetDistribution_item').length).toBe(6);
			expect(screen.getByText('Wet Distribution 1')).toBeDefined();
			expect(screen.getByText('Wet Distribution 1 (1)')).toBeDefined();
			expect(screen.getByText('Wet Distribution 1 (2)')).toBeDefined();
			expect(screen.getByText('Wet Distribution 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Wet Distribution 1 (1) (2)')).toBeDefined();
		});
	});

	describe('instant electric heater', async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const instantElectricHeater1 = {
			name: 'Instant Electric Heater 1',
		};
		const instantElectricHeater2 = {
			name: 'Instant Electric Heater 2',
		};
		const instantElectricHeater3 = {
			name: 'Instant Electric Heater 3',
		};

		it('should remove instant electric heater when remove link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						instantElectricHeater: {
							data: [instantElectricHeater1],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			expect(screen.getAllByTestId('instantElectricHeater_items')).toBeDefined();

			await user.click(screen.getByTestId('instantElectricHeater_remove_0'));
			expect(screen.queryByTestId('instantElectricHeater_items')).toBeNull();
		});

		it('should only remove the instant electric heater that is clicked if there are multiple instant electric heaters', async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						instantElectricHeater: {
							data: [instantElectricHeater1, instantElectricHeater2, instantElectricHeater3],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await user.click(screen.getByTestId('instantElectricHeater_remove_1'));

			expect(screen.getByText('Instant Electric Heater 1')).toBeDefined();
			expect(screen.getByText('Instant Electric Heater 3')).toBeDefined();
			expect(screen.queryByText('Instant Electric Heater 2')).toBeNull();
		});

		it('should duplicate the correct instant electric heater when duplicate link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						instantElectricHeater: {
							data: [instantElectricHeater1, instantElectricHeater2],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await userEvent.click(screen.getByTestId('instantElectricHeater_duplicate_0'));
			await userEvent.click(screen.getByTestId('instantElectricHeater_duplicate_0'));
			await userEvent.click(screen.getByTestId('instantElectricHeater_duplicate_2'));
			await userEvent.click(screen.getByTestId('instantElectricHeater_duplicate_2'));

			expect(screen.queryAllByTestId('instantElectricHeater_item').length).toBe(6);
			expect(screen.getByText('Instant Electric Heater 1')).toBeDefined();
			expect(screen.getByText('Instant Electric Heater 1 (1)')).toBeDefined();
			expect(screen.getByText('Instant Electric Heater 1 (2)')).toBeDefined();
			expect(screen.getByText('Instant Electric Heater 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Instant Electric Heater 1 (1) (2)')).toBeDefined();
		});
	});

	describe("electric storage heater", async () => {

		const store = useEcaasStore();
		const user = userEvent.setup();

		const storageHeater1 = {
			name: "Storage heater 1",
		};
		const storageHeater2 = {
			name: "Storage heater 2",
		};
		const storageHeater3 = {
			name: "Storage heater 3",
		};
		afterEach(() => {
			store.$reset();
		});

		it("should remove electric storage heater when remove link is clicked", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						electricStorageHeater: {
							data: [storageHeater1],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			expect(screen.getAllByTestId('electricStorageHeater_items')).toBeDefined();

			await user.click(screen.getByTestId('electricStorageHeater_remove_0'));
			expect(screen.queryByTestId('electricStorageHeater_items')).toBeNull();

		});

		it("should only remove the heater thats is clicked if there are multiple heaters", async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						electricStorageHeater: {
							data: [storageHeater1, storageHeater2, storageHeater3]
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await user.click(screen.getByTestId('electricStorageHeater_remove_1'));

			expect(screen.getByText('Storage heater 1')).toBeDefined();
			expect(screen.getByText('Storage heater 3')).toBeDefined();
			expect(screen.queryByText('Storage heater 2')).toBeNull();

		});
		it("should duplicate the correct heater when duplicate link is clicked", async () => 	{
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						electricStorageHeater: {
							data: [storageHeater1, storageHeater2]
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await userEvent.click(screen.getByTestId('electricStorageHeater_duplicate_0'));
			await userEvent.click(screen.getByTestId('electricStorageHeater_duplicate_0'));
			await userEvent.click(screen.getByTestId('electricStorageHeater_duplicate_2'));
			await userEvent.click(screen.getByTestId('electricStorageHeater_duplicate_2'));

			expect(screen.queryAllByTestId('electricStorageHeater_item').length).toBe(6);
			expect(screen.getByText('Storage heater 1')).toBeDefined();
			expect(screen.getByText('Storage heater 1 (1)')).toBeDefined();
			expect(screen.getByText('Storage heater 1 (2)')).toBeDefined();
			expect(screen.getByText('Storage heater 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Storage heater 1 (1) (2)')).toBeDefined();
		});
	});
	describe('warm air heat pump', async () => {
		const store = useEcaasStore();
		const user = userEvent.setup();
	
		const warmAirHeatPump1 = {
			name: 'Warm Air Heat Pump 1',
		};
		const warmAirHeatPump2 = {
			name: 'Warm Air Heat Pump 2',
		};
		const warmAirHeatPump3 = {
			name: 'Warm Air Heat Pump 3',
		};
		afterEach(() => {
			store.$reset();
		});
		it('should remove warm air heat pump when remove link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						warmAirHeatPump: {
							data: [warmAirHeatPump1],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			expect(screen.getAllByTestId('warmAirHeatPump_items')).toBeDefined();
	
			await user.click(screen.getByTestId('warmAirHeatPump_remove_0'));
			expect(screen.queryByTestId('warmAirHeatPump_items')).toBeNull();
		});
	
		it('should only remove the heat pump that is clicked if there are multiple heat pumps', async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						warmAirHeatPump: {
							data: [warmAirHeatPump1, warmAirHeatPump2, warmAirHeatPump3],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await user.click(screen.getByTestId('warmAirHeatPump_remove_1'));
	
			expect(screen.getByText('Warm Air Heat Pump 1')).toBeDefined();
			expect(screen.getByText('Warm Air Heat Pump 3')).toBeDefined();
			expect(screen.queryByText('Warm Air Heat Pump 2')).toBeNull();
		});
	
		it('should duplicate the correct heat pump when duplicate link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatEmitting: {
						warmAirHeatPump: {
							data: [warmAirHeatPump1, warmAirHeatPump2],
						},
					},
				},
			});
			await renderSuspended(HeatEmitting);
			await userEvent.click(screen.getByTestId('warmAirHeatPump_duplicate_0'));
			await userEvent.click(screen.getByTestId('warmAirHeatPump_duplicate_0'));
			await userEvent.click(screen.getByTestId('warmAirHeatPump_duplicate_2'));
			await userEvent.click(screen.getByTestId('warmAirHeatPump_duplicate_2'));
	
			expect(screen.queryAllByTestId('warmAirHeatPump_item').length).toBe(6);
			expect(screen.getByText('Warm Air Heat Pump 1')).toBeDefined();
			expect(screen.getByText('Warm Air Heat Pump 1 (1)')).toBeDefined();
			expect(screen.getByText('Warm Air Heat Pump 1 (2)')).toBeDefined();
			expect(screen.getByText('Warm Air Heat Pump 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Warm Air Heat Pump 1 (1) (2)')).toBeDefined();
		});
	});
	
});

