import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import PvAndBatteries from './index.vue';
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';

describe('pv and batteries', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	describe('pv system', () => {
		const pvSystem1: PvSystemData = {
			name: "PV System 1",
			peakPower: 4,
			ventilationStrategy: 'unventilated',
			pitch: 45,
			orientation: 20,
			elevationalHeight: 100,
			lengthOfPV: 20,
			widthOfPV: 20,
			inverterPeakPowerAC: 4,
			inverterPeakPowerDC: 5,
			inverterLocation: 'inside',
			inverterType: 'central',
			aboveDepth: 20,
			aboveDistance: 4,
			leftDepth: 10,
			leftDistance: 7,
			rightDepth: 2,
			rightDistance: 10
		};
	
		const pvSystem2: PvSystemData = {
			...pvSystem1,
			name: "PV System 2"
		};
	
		const pvSystem3: PvSystemData = {
			...pvSystem1,
			name: "PV System 3"
		};
	
		it('pv system is removed when remove link is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystem: {
						data: [pvSystem1]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
	
			expect(screen.getAllByTestId('pvSystem_items')).toBeDefined();
	
			await user.click(screen.getByTestId('pvSystem_remove_0'));
	
			expect(screen.queryByTestId('pvSystem_items')).toBeNull();
		});
	
		it('should only remove the pv system object that is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystem: {
						data:[pvSystem1, pvSystem2, pvSystem3]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
			await user.click(screen.getByTestId('pvSystem_remove_1'));
	
			const populatedList = screen.getByTestId('pvSystem_items');
	
			expect(within(populatedList).getByText('PV System 1')).toBeDefined();
			expect(within(populatedList).getByText('PV System 3')).toBeDefined();
			expect(within(populatedList).queryByText('PV System 2')).toBeNull();
		});

		it('pv system is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystem: {
						data:[pvSystem1, pvSystem2]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
			await userEvent.click(screen.getByTestId('pvSystem_duplicate_0'));
			await userEvent.click(screen.getByTestId('pvSystem_duplicate_0'));
			await userEvent.click(screen.getByTestId('pvSystem_duplicate_2'));
			await userEvent.click(screen.getByTestId('pvSystem_duplicate_2'));
	
			expect(screen.queryAllByTestId('pvSystem_item').length).toBe(6);
			expect(screen.getByText('PV System 1')).toBeDefined();
			expect(screen.getByText('PV System 1 (1)')).toBeDefined();
			expect(screen.getByText('PV System 1 (2)')).toBeDefined();
			expect(screen.getByText('PV System 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('PV System 1 (1) (2)')).toBeDefined();
		});
	});

	describe('electric battery', () => {
		const electricBattery1: ElectricBatteryData = {
			name: 'Electric battery 1',
			capacity: 40,
			batteryAge: 12,
			chargeEfficiency: 0.9,
			location: 'inside',
			gridChargingPossible: 'no',
			maximumChargeRate: 30,
			minimumChargeRate: 20,
			maximumDischargeRate: 35
		};
	
		const electricBattery2: ElectricBatteryData = {
			...electricBattery1,
			name: 'Electric battery 2'
		};

		const electricBattery3: ElectricBatteryData = {
			...electricBattery1,
			name: 'Electric battery 3'
		};
	
		it('electric battery is removed when remove link is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data:[electricBattery1]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
	
			expect(screen.getAllByTestId('electricBattery_items')).toBeDefined();
	
			await user.click(screen.getByTestId('electricBattery_remove_0'));
	
			expect(screen.queryByTestId('electricBattery_items')).toBeNull();
		});
	
		it('should only remove the electric battery object that is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [electricBattery1, electricBattery2, electricBattery3]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
			await user.click(screen.getByTestId('electricBattery_remove_1'));
	
			const populatedList = screen.getByTestId('electricBattery_items');
	
			expect(within(populatedList).getByText('Electric battery 1')).toBeDefined();
			expect(within(populatedList).getByText('Electric battery 3')).toBeDefined();
			expect(within(populatedList).queryByText('Electric battery 2')).toBeNull();
	
		});
	
		it('electric battery is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [electricBattery1, electricBattery2]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
			await userEvent.click(screen.getByTestId('electricBattery_duplicate_0'));
			await userEvent.click(screen.getByTestId('electricBattery_duplicate_0'));
			await userEvent.click(screen.getByTestId('electricBattery_duplicate_2'));
			await userEvent.click(screen.getByTestId('electricBattery_duplicate_2'));
	
			expect(screen.queryAllByTestId('electricBattery_item').length).toBe(6);
			expect(screen.getByText('Electric battery 1')).toBeDefined();
			expect(screen.getByText('Electric battery 1 (1)')).toBeDefined();
			expect(screen.getByText('Electric battery 1 (2)')).toBeDefined();
			expect(screen.getByText('Electric battery 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Electric battery 1 (1) (2)')).toBeDefined();
		});
	});

	describe('pv diverter', () => {
		const pvDiverter1: PvDiverterData = {
			name: "PV Diverter 1",
			energyDivertedToHeatGeneration: 'heatPump_0',
			energyDivertedToStorageTank: '0'
		};
	
		const pvDiverter2: PvDiverterData = {
			...pvDiverter1,
			name: "PV Diverter 2"
		};

		const pvDiverter3: PvDiverterData = {
			...pvDiverter1,
			name: "PV Diverter 3"
		};
	
		it('pv diverter is removed when remove link is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					pvDiverter: {
						data: [pvDiverter1]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
	
			expect(screen.getAllByTestId('pvDiverter_items')).toBeDefined();
	
			await user.click(screen.getByTestId('pvDiverter_remove_0'));
	
			expect(screen.queryByTestId('pvDiverter_items')).toBeNull();
		});
	
		it('should only remove the pv diverter object that is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					pvDiverter: {
						data: [pvDiverter1, pvDiverter2, pvDiverter3]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
			await user.click(screen.getByTestId('pvDiverter_remove_1'));
			const populatedList = screen.getByTestId('pvDiverter_items');
	
			expect(within(populatedList).getByText('PV Diverter 1')).toBeDefined();
			expect(within(populatedList).getByText('PV Diverter 3')).toBeDefined();
			expect(within(populatedList).queryByText('PV Diverter 2')).toBeNull();
	
		});
		
		it('floor is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					pvDiverter: {
						data: [pvDiverter1, pvDiverter2]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
			await userEvent.click(screen.getByTestId('pvDiverter_duplicate_0'));
			await userEvent.click(screen.getByTestId('pvDiverter_duplicate_0'));
			await userEvent.click(screen.getByTestId('pvDiverter_duplicate_2'));
			await userEvent.click(screen.getByTestId('pvDiverter_duplicate_2'));
	
			expect(screen.queryAllByTestId('pvDiverter_item').length).toBe(6);
			expect(screen.getByText('PV Diverter 1')).toBeDefined();
			expect(screen.getByText('PV Diverter 1 (1)')).toBeDefined();
			expect(screen.getByText('PV Diverter 1 (2)')).toBeDefined();
			expect(screen.getByText('PV Diverter 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('PV Diverter 1 (1) (2)')).toBeDefined();
		});
	});
});