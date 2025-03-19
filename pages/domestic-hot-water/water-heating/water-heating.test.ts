import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import WaterHeating from './index.vue';
import type { CombiBoilerData, HeatBatteryData, HeatInterfaceUnitData, HeatPumpData, ImmersionHeaterData, PointOfUseData, SmartHotWaterTankData, SolarThermalData, StorageTankData } from "~/stores/ecaasStore.types";

describe('water heating', () => {

	describe('storage tank', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const storageTank1: StorageTankData = {
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

		it('should only remove the storage tank thats is clicked', async () => {
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
	});

	describe('immersion heater', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const immersionHeater1: ImmersionHeaterData = {
			name: "Immersion heater 1"
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

		it('should only remove the immersion heater that\'s is clicked', async () => {
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
	});

	describe('solar thermal', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const solarThermal1: SolarThermalData = {
			name: "Solar thermal 1"
		};

		const solarThermal2: SolarThermalData = {
			...solarThermal1,
			name: "Solar thermal 2",
		};

		const solarThermal3: SolarThermalData = {
			...solarThermal1,
			name: "Solar thermal 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('solar thermal is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						solarThermal: {
							data: [solarThermal1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('solarThermal_items')).toBeDefined();

			await user.click(screen.getByTestId('solarThermal_remove_0'));

			expect(screen.queryByTestId('solarThermal_items')).toBeNull();
		});

		it('should only remove the solar thermal that\'s is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						solarThermal: {
							data:[solarThermal1, solarThermal2, solarThermal3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('solarThermal_remove_1'));

			const populatedList = screen.getByTestId('solarThermal_items');

			expect(within(populatedList).getByText('Solar thermal 1')).toBeDefined();
			expect(within(populatedList).getByText('Solar thermal 3')).toBeDefined();
			expect(within(populatedList).queryByText('Solar thermal 2')).toBeNull();
		});
	});

	describe('point of use', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const pointOfUse1: PointOfUseData = {
			name: "Point of use 1"
		};

		const pointOfUse2: PointOfUseData = {
			...pointOfUse1,
			name: "Point of use 2",
		};

		const pointOfUse3: PointOfUseData = {
			...pointOfUse1,
			name: "Point of use 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('point of use is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						pointOfUse: {
							data: [pointOfUse1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('pointOfUse_items')).toBeDefined();

			await user.click(screen.getByTestId('pointOfUse_remove_0'));

			expect(screen.queryByTestId('pointOfUse_items')).toBeNull();
		});

		it('should only remove the solar thermal that\'s is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						pointOfUse: {
							data:[pointOfUse1, pointOfUse2, pointOfUse3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('pointOfUse_remove_1'));

			const populatedList = screen.getByTestId('pointOfUse_items');

			expect(within(populatedList).getByText('Point of use 1')).toBeDefined();
			expect(within(populatedList).getByText('Point of use 3')).toBeDefined();
			expect(within(populatedList).queryByText('Point of use 2')).toBeNull();
		});
	});

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
				domesticHotWater: {
					waterHeating: {
						heatPump: {
							data: [heatPump1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('heatPump_items')).toBeDefined();

			await user.click(screen.getByTestId('heatPump_remove_0'));

			expect(screen.queryByTestId('heatPump_items')).toBeNull();
		});

		it('should only remove the heat pump that\'s is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						heatPump: {
							data:[heatPump1, heatPump2, heatPump3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('heatPump_remove_1'));

			const populatedList = screen.getByTestId('heatPump_items');

			expect(within(populatedList).getByText('Heat pump 1')).toBeDefined();
			expect(within(populatedList).getByText('Heat pump 3')).toBeDefined();
			expect(within(populatedList).queryByText('Heat pump 2')).toBeNull();
		});
	});

	describe('combi boiler', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const combiBoiler1: CombiBoilerData = {
			name: "Combi boiler 1"
		};

		const combiBoiler2: CombiBoilerData = {
			...combiBoiler1,
			name: "Combi boiler 2",
		};

		const combiBoiler3: CombiBoilerData = {
			...combiBoiler1,
			name: "Combi boiler 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('combi boiler is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						combiBoiler: {
							data: [combiBoiler1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('combiBoiler_items')).toBeDefined();

			await user.click(screen.getByTestId('combiBoiler_remove_0'));

			expect(screen.queryByTestId('combiBoiler_items')).toBeNull();
		});

		it('should only remove the combi boiler that\'s is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						combiBoiler: {
							data:[combiBoiler1, combiBoiler2, combiBoiler3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('combiBoiler_remove_1'));

			const populatedList = screen.getByTestId('combiBoiler_items');

			expect(within(populatedList).getByText('Combi boiler 1')).toBeDefined();
			expect(within(populatedList).getByText('Combi boiler 3')).toBeDefined();
			expect(within(populatedList).queryByText('Combi boiler 2')).toBeNull();
		});
	});

	describe('heat battery', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatBattery1: HeatBatteryData = {
			name: "Heat battery 1"
		};

		const heatBattery2: HeatBatteryData = {
			...heatBattery1,
			name: "Heat battery 2",
		};

		const heatBattery3: HeatBatteryData = {
			...heatBattery1,
			name: "Heat battery 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('heat battery is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						heatBattery: {
							data: [heatBattery1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('heatBattery_items')).toBeDefined();

			await user.click(screen.getByTestId('heatBattery_remove_0'));

			expect(screen.queryByTestId('heatBattery_items')).toBeNull();
		});

		it('should only remove the heat battery that\'s is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						heatBattery: {
							data:[heatBattery1, heatBattery2, heatBattery3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('heatBattery_remove_1'));

			const populatedList = screen.getByTestId('heatBattery_items');

			expect(within(populatedList).getByText('Heat battery 1')).toBeDefined();
			expect(within(populatedList).getByText('Heat battery 3')).toBeDefined();
			expect(within(populatedList).queryByText('Heat battery 2')).toBeNull();
		});
	});

	describe('smart hot water tank', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const smartHotWaterTank1: SmartHotWaterTankData = {
			name: "Smart hot water tank 1"
		};

		const smartHotWaterTank2: SmartHotWaterTankData = {
			...smartHotWaterTank1,
			name: "Smart hot water tank 2",
		};

		const smartHotWaterTank3: SmartHotWaterTankData = {
			...smartHotWaterTank1,
			name: "Smart hot water tank 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('smart hot water tank is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						smartHotWaterTank: {
							data: [smartHotWaterTank1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('smartHotWaterTank_items')).toBeDefined();

			await user.click(screen.getByTestId('smartHotWaterTank_remove_0'));

			expect(screen.queryByTestId('smartHotWaterTank_items')).toBeNull();
		});

		it('should only remove the smart hot water tank that\'s is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						smartHotWaterTank: {
							data:[smartHotWaterTank1, smartHotWaterTank2, smartHotWaterTank3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('smartHotWaterTank_remove_1'));

			const populatedList = screen.getByTestId('smartHotWaterTank_items');

			expect(within(populatedList).getByText('Smart hot water tank 1')).toBeDefined();
			expect(within(populatedList).getByText('Smart hot water tank 3')).toBeDefined();
			expect(within(populatedList).queryByText('Smart hot water tank 2')).toBeNull();
		});
	});

	describe('heat interface unit', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatInterfaceUnit1: HeatInterfaceUnitData = {
			name: "Heat interface unit 1"
		};

		const heatInterfaceUnit2: HeatInterfaceUnitData = {
			...heatInterfaceUnit1,
			name: "Heat interface unit 2",
		};

		const heatInterfaceUnit3: HeatInterfaceUnitData = {
			...heatInterfaceUnit1,
			name: "Heat interface unit 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('heat interface unit is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						heatInterfaceUnit: {
							data: [heatInterfaceUnit1]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);

			expect(screen.getAllByTestId('heatInterfaceUnit_items')).toBeDefined();

			await user.click(screen.getByTestId('heatInterfaceUnit_remove_0'));

			expect(screen.queryByTestId('heatInterfaceUnit_items')).toBeNull();
		});

		it('should only remove the heat interface unit that\'s is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						heatInterfaceUnit: {
							data:[heatInterfaceUnit1, heatInterfaceUnit2, heatInterfaceUnit3]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await user.click(screen.getByTestId('heatInterfaceUnit_remove_1'));

			const populatedList = screen.getByTestId('heatInterfaceUnit_items');

			expect(within(populatedList).getByText('Heat interface unit 1')).toBeDefined();
			expect(within(populatedList).getByText('Heat interface unit 3')).toBeDefined();
			expect(within(populatedList).queryByText('Heat interface unit 2')).toBeNull();
		});
	});
});