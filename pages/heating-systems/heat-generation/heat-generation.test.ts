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
	});

	describe('boiler', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const boiler1: BoilerData = {
			name: "boiler 1"
		};

		const boiler2: BoilerData = {
			...boiler1,
			name: "boiler 2",
		};

		const boiler3: BoilerData = {
			...boiler1,
			name: "boiler 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('boiler is removed when remove link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						boiler: {
							data: [boiler1]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);

			expect(screen.getAllByTestId('boiler_items')).toBeDefined();

			await user.click(screen.getByTestId('boiler_remove_0'));

			expect(screen.queryByTestId('boiler_items')).toBeNull();
		});

		it('should only remove the boiler thats is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						boiler: {
							data:[boiler1, boiler2, boiler3]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);
			await user.click(screen.getByTestId('boiler_remove_1'));

			const populatedList = screen.getByTestId('boiler_items');

			expect(within(populatedList).getByText('boiler 1')).toBeDefined();
			expect(within(populatedList).getByText('boiler 3')).toBeDefined();
			expect(within(populatedList).queryByText('boiler 2')).toBeNull();

		});
	});

	describe('heat battery', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatBattery1: HeatBattery = {
			name: "heatBattery 1"
		};

		const heatBattery2: HeatBattery = {
			...heatBattery1,
			name: "heatBattery 2",
		};

		const heatBattery3: HeatBatteryData = {
			...heatBattery1,
			name: "heatBattery 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('heat battery is removed when remove link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatBattery: {
							data: [heatBattery1]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);

			expect(screen.getAllByTestId('heatBattery_items')).toBeDefined();

			await user.click(screen.getByTestId('heatBattery_remove_0'));

			expect(screen.queryByTestId('heatBattery_items')).toBeNull();
		});

		it('should only remove the heat battery that is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatBattery: {
							data:[heatBattery1, heatBattery2, heatBattery3]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);
			await user.click(screen.getByTestId('heatBattery_remove_1'));

			const populatedList = screen.getByTestId('heatBattery_items');

			expect(within(populatedList).getByText('heatBattery 1')).toBeDefined();
			expect(within(populatedList).getByText('heatBattery 3')).toBeDefined();
			expect(within(populatedList).queryByText('heatBattery 2')).toBeNull();

		});
	});

	describe('heat network', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatNetwork1: HeatNetworkData = {
			name: "heatNetwork 1"
		};

		const heatNetwork2: HeatNetworkData = {
			...heatNetwork1,
			name: "heatNetwork 2",
		};

		const heatNetwork3: HeatNetworkData = {
			...heatNetwork1,
			name: "heatNetwork 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('heat network is removed when remove link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatNetwork: {
							data: [heatNetwork1]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);

			expect(screen.getAllByTestId('heatNetwork_items')).toBeDefined();

			await user.click(screen.getByTestId('heatNetwork_remove_0'));

			expect(screen.queryByTestId('heatNetwork_items')).toBeNull();
		});

		it('should only remove the heat network that is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatNetwork: {
							data:[heatNetwork1, heatNetwork2, heatNetwork3]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);
			await user.click(screen.getByTestId('heatNetwork_remove_1'));

			const populatedList = screen.getByTestId('heatNetwork_items');

			expect(within(populatedList).getByText('heatNetwork 1')).toBeDefined();
			expect(within(populatedList).getByText('heatNetwork 3')).toBeDefined();
			expect(within(populatedList).queryByText('heatNetwork 2')).toBeNull();

		});
	});

	describe('heat interface unit', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatInterfaceUnit1: HeatInterfaceUnitData = {
			name: "heatInterfaceUnit 1"
		};

		const heatInterfaceUnit2: HeatInterfaceUnitData = {
			...heatInterfaceUnit1,
			name: "heatInterfaceUnit 2",
		};

		const heatInterfaceUnit3: HeatInterfaceUnitData = {
			...heatInterfaceUnit1,
			name: "heatInterfaceUnit 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('heat interface unit is removed when remove link is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatInterfaceUnit: {
							data: [heatInterfaceUnit1]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);

			expect(screen.getAllByTestId('heatInterfaceUnit_items')).toBeDefined();

			await user.click(screen.getByTestId('heatInterfaceUnit_remove_0'));

			expect(screen.queryByTestId('heatInterfaceUnit_items')).toBeNull();
		});

		it('should only remove the heat interface unit that is clicked', async () => {
			store.$patch({
				heatingSystems: {
					heatGeneration: {
						heatInterfaceUnit: {
							data:[heatInterfaceUnit1, heatInterfaceUnit2, heatInterfaceUnit3]
						}
					}
				}
			});

			await renderSuspended(HeatGeneration);
			await user.click(screen.getByTestId('heatInterfaceUnit_remove_1'));

			const populatedList = screen.getByTestId('heatInterfaceUnit_items');

			expect(within(populatedList).getByText('heatInterfaceUnit 1')).toBeDefined();
			expect(within(populatedList).getByText('heatInterfaceUnit 3')).toBeDefined();
			expect(within(populatedList).queryByText('heatInterfaceUnit 2')).toBeNull();

		});
	});
});

