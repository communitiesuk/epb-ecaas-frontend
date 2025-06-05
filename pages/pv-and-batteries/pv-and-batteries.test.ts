import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import PvAndBatteries from './index.vue';
import PvSystemForm from "./pv-system/[system].vue";
import ElectricBatteryForm from "./electric-battery/[battery].vue";
import PvDiverterForm from "./pv-diverter/[diverter].vue";
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';
import { BatteryLocation, OnSiteGenerationVentilationStrategy } from "~/schema/api-schema.types";

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
	const pvSystem1: PvSystemData = {
		name: "PV System 1",
		peakPower: 4,
		ventilationStrategy: OnSiteGenerationVentilationStrategy.unventilated,
		pitch: 45,
		orientation: 20,
		elevationalHeight: 100,
		lengthOfPV: 20,
		widthOfPV: 20,
		inverterPeakPowerAC: 4,
		inverterPeakPowerDC: 5,
		inverterIsInside: true,
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
	const electricBattery1: ElectricBatteryData = {
		name: 'Electric battery 1',
		capacity: 40,
		batteryAge: 12,
		chargeEfficiency: 0.9,
		location: BatteryLocation.inside,
		gridChargingPossible: false,
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

	const pvDiverter1: PvDiverterData = {
		name: "PV Diverter 1",
		energyDivertedToHeatGeneration: 'heatPump_0',
		energyDivertedToHotWaterCylinder: '0'
	};

	const pvDiverter2: PvDiverterData = {
		...pvDiverter1,
		name: "PV Diverter 2"
	};

	const pvDiverter3: PvDiverterData = {
		...pvDiverter1,
		name: "PV Diverter 3"
	};
	describe('pv system', () => {
	
	
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

	describe("mark section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const navigateToMock = vi.hoisted(() => vi.fn());
		mockNuxtImport("navigateTo", () => {
			return navigateToMock;
		});


		const addPvDataToStore = async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystem: { data: [pvSystem1] },
					electricBattery: { data: [electricBattery1] },
					pvDiverter: { data: [pvDiverter1] },
				},
			});
		};

		const getPvData = async (action: string) => {
			return [
				{
					key: "pvSystem",
					testId: `pvSystem_${action}_0`,
					form: PvSystemForm,
					params: "system",
				},
				{
					key: "electricBattery",
					testId: `electricBattery_${action}_0`,
					form: ElectricBatteryForm,
					params: "battery",
				},
				{
					key: "pvDiverter",
					testId: `pvDiverter_${action}_0`,
					form: PvDiverterForm,
					params: "diverter",
				},
			];
		};

	type PvType = keyof typeof store.pvAndBatteries;

	beforeEach(async () => {
		await addPvDataToStore();
		await renderSuspended(PvAndBatteries);
	});

	it("marks pv and batteries section as complete", async () => {
		expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		const completeStatus = screen.queryByTestId("completeSectionCompleted");
		expect(completeStatus?.style.display).toBe("none");

		await user.click(screen.getByTestId("completeSectionButton"));

		const PvAndBatteryItems = store.pvAndBatteries;
		for (const key in PvAndBatteryItems) {
			expect(PvAndBatteryItems[key as PvType]?.complete).toBe(true);
		}
		expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
		expect(completeStatus?.style.display).not.toBe("none");

		expect(navigateToMock).toHaveBeenCalledWith("/");
	});

	it("marks as not complete if item is removed", async () => {
		const items = await getPvData("remove");

		for (const [key] of Object.entries(store.pvAndBatteries)) {
			const typedKey = key as PvType;

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries[typedKey]?.complete).toBe(true);

			const itemData = items.find(i => i.key === typedKey);
			await user.click(screen.getByTestId(itemData!.testId));
			expect(store.pvAndBatteries[typedKey]?.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		}
	});

	it("marks as not complete if item is duplicated", async () => {
		const items = await getPvData("duplicate");

		for (const [key] of Object.entries(store.pvAndBatteries)) {
			const typedKey = key as PvType;

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries[typedKey]?.complete).toBe(true);

			const itemData = items.find(i => i.key === typedKey);
			await user.click(screen.getByTestId(itemData!.testId));
			expect(store.pvAndBatteries[typedKey]?.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		}
	});

	it("marks as not complete after save", async () => {
		for (const [key] of Object.entries(store.pvAndBatteries)) {
			const items = await getPvData("");
			const typedKey = key as PvType;

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries[typedKey]?.complete).toBe(true);

			const itemData = items.find(i => i.key === typedKey);
			const param = itemData!.params;
			await renderSuspended(itemData!.form, {
				route: { params: { [param]: "0" } },
			});
			await user.click(screen.getByRole("button", { name: "Save and continue" }));
			expect(store.pvAndBatteries[typedKey].complete).toBe(false);

			await renderSuspended(PvAndBatteries);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		}
	});
	});

});