import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import { v4 as uuidv4 } from 'uuid';
import WaterHeating from './index.vue';
import type { CombiBoilerData, HeatBatteryData, WaterHeatingHeatInterfaceUnitData, HotWaterHeatPumpData, ImmersionHeaterData, PointOfUseData, SmartHotWaterTankData, SolarThermalData, StorageTankData } from "~/stores/ecaasStore.types";

describe('water heating', () => {

	describe('storage tank', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const storageTank1: StorageTankData = {
			id: uuidv4(),
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

		it('should only remove the solar thermal that is clicked', async () => {
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

		it('solar thermal is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						solarThermal: {
							data:[solarThermal1, solarThermal2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await userEvent.click(screen.getByTestId('solarThermal_duplicate_0'));
			await userEvent.click(screen.getByTestId('solarThermal_duplicate_0'));
			await userEvent.click(screen.getByTestId('solarThermal_duplicate_2'));
			await userEvent.click(screen.getByTestId('solarThermal_duplicate_2'));

			expect(screen.queryAllByTestId('solarThermal_item').length).toBe(6);
			expect(screen.getByText('Solar thermal 1')).toBeDefined();
			expect(screen.getByText('Solar thermal 1 (1)')).toBeDefined();
			expect(screen.getByText('Solar thermal 1 (2)')).toBeDefined();
			expect(screen.getByText('Solar thermal 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Solar thermal 1 (1) (2)')).toBeDefined();
		});
	});

	describe('point of use', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const pointOfUse1: PointOfUseData = {
			name: "Point of use 1",
			setpointTemperature: 0,
			heaterEfficiency: 0,
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

		it('should only remove the point of use that is clicked', async () => {
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

		it('point of use is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						pointOfUse: {
							data:[pointOfUse1, pointOfUse2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await userEvent.click(screen.getByTestId('pointOfUse_duplicate_0'));
			await userEvent.click(screen.getByTestId('pointOfUse_duplicate_0'));
			await userEvent.click(screen.getByTestId('pointOfUse_duplicate_2'));
			await userEvent.click(screen.getByTestId('pointOfUse_duplicate_2'));

			expect(screen.queryAllByTestId('pointOfUse_item').length).toBe(6);
			expect(screen.getByText('Point of use 1')).toBeDefined();
			expect(screen.getByText('Point of use 1 (1)')).toBeDefined();
			expect(screen.getByText('Point of use 1 (2)')).toBeDefined();
			expect(screen.getByText('Point of use 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Point of use 1 (1) (2)')).toBeDefined();
		});
	});

	describe('heat pump', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatPump1: HotWaterHeatPumpData = {
			name: "Heat pump 1"
		};

		const heatPump2: HotWaterHeatPumpData = {
			...heatPump1,
			name: "Heat pump 2",
		};

		const heatPump3: HotWaterHeatPumpData = {
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

		it('should only remove the heat pump that is clicked', async () => {
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

		it('heat pump is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						heatPump: {
							data:[heatPump1, heatPump2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
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

		it('should only remove the combi boiler that is clicked', async () => {
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

		it('combi boiler is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						combiBoiler: {
							data:[combiBoiler1, combiBoiler2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await userEvent.click(screen.getByTestId('combiBoiler_duplicate_0'));
			await userEvent.click(screen.getByTestId('combiBoiler_duplicate_0'));
			await userEvent.click(screen.getByTestId('combiBoiler_duplicate_2'));
			await userEvent.click(screen.getByTestId('combiBoiler_duplicate_2'));

			expect(screen.queryAllByTestId('combiBoiler_item').length).toBe(6);
			expect(screen.getByText('Combi boiler 1')).toBeDefined();
			expect(screen.getByText('Combi boiler 1 (1)')).toBeDefined();
			expect(screen.getByText('Combi boiler 1 (2)')).toBeDefined();
			expect(screen.getByText('Combi boiler 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Combi boiler 1 (1) (2)')).toBeDefined();
		});
	});

	describe('heat battery', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatBattery1: HeatBatteryData = {
			id: uuidv4(),
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

		it('should only remove the heat battery that is clicked', async () => {
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

		it('heat battery is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						heatBattery: {
							data:[heatBattery1, heatBattery2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await userEvent.click(screen.getByTestId('heatBattery_duplicate_0'));
			await userEvent.click(screen.getByTestId('heatBattery_duplicate_0'));
			await userEvent.click(screen.getByTestId('heatBattery_duplicate_2'));
			await userEvent.click(screen.getByTestId('heatBattery_duplicate_2'));

			expect(screen.queryAllByTestId('heatBattery_item').length).toBe(6);
			expect(screen.getByText('Heat battery 1')).toBeDefined();
			expect(screen.getByText('Heat battery 1 (1)')).toBeDefined();
			expect(screen.getByText('Heat battery 1 (2)')).toBeDefined();
			expect(screen.getByText('Heat battery 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Heat battery 1 (1) (2)')).toBeDefined();
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

		it('should only remove the smart hot water tank that is clicked', async () => {
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

		it('smart hot water tank is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						smartHotWaterTank: {
							data:[smartHotWaterTank1, smartHotWaterTank2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await userEvent.click(screen.getByTestId('smartHotWaterTank_duplicate_0'));
			await userEvent.click(screen.getByTestId('smartHotWaterTank_duplicate_0'));
			await userEvent.click(screen.getByTestId('smartHotWaterTank_duplicate_2'));
			await userEvent.click(screen.getByTestId('smartHotWaterTank_duplicate_2'));

			expect(screen.queryAllByTestId('smartHotWaterTank_item').length).toBe(6);
			expect(screen.getByText('Smart hot water tank 1')).toBeDefined();
			expect(screen.getByText('Smart hot water tank 1 (1)')).toBeDefined();
			expect(screen.getByText('Smart hot water tank 1 (2)')).toBeDefined();
			expect(screen.getByText('Smart hot water tank 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Smart hot water tank 1 (1) (2)')).toBeDefined();
		});
	});

	describe('heat interface unit', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const heatInterfaceUnit1: WaterHeatingHeatInterfaceUnitData = {
			name: "Heat interface unit 1"
		};

		const heatInterfaceUnit2: WaterHeatingHeatInterfaceUnitData = {
			...heatInterfaceUnit1,
			name: "Heat interface unit 2",
		};

		const heatInterfaceUnit3: WaterHeatingHeatInterfaceUnitData = {
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

		it('should only remove the heat interface unit that is clicked', async () => {
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

		it('heat interface unit is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					waterHeating: {
						heatInterfaceUnit: {
							data:[heatInterfaceUnit1, heatInterfaceUnit2]
						}
					}
				}
			});

			await renderSuspended(WaterHeating);
			await userEvent.click(screen.getByTestId('heatInterfaceUnit_duplicate_0'));
			await userEvent.click(screen.getByTestId('heatInterfaceUnit_duplicate_0'));
			await userEvent.click(screen.getByTestId('heatInterfaceUnit_duplicate_2'));
			await userEvent.click(screen.getByTestId('heatInterfaceUnit_duplicate_2'));

			expect(screen.queryAllByTestId('heatInterfaceUnit_item').length).toBe(6);
			expect(screen.getByText('Heat interface unit 1')).toBeDefined();
			expect(screen.getByText('Heat interface unit 1 (1)')).toBeDefined();
			expect(screen.getByText('Heat interface unit 1 (2)')).toBeDefined();
			expect(screen.getByText('Heat interface unit 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Heat interface unit 1 (1) (2)')).toBeDefined();
		});
	});
});