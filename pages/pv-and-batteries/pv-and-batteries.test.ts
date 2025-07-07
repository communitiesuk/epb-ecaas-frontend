import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import PvAndBatteries from './index.vue';
import PvSystemForm from "./pv-systems/[system].vue";
import ElectricBatteryForm from "./electric-battery/index.vue";
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';
import { BatteryLocation, InverterType, OnSiteGenerationVentilationStrategy } from "~/schema/api-schema.types";

describe('pv systems and electric battery', () => {
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
		inverterType: InverterType.string_inverter,
		// aboveDepth: 20,
		// aboveDistance: 4,
		// leftDepth: 10,
		// leftDistance: 7,
		// rightDepth: 2,
		// rightDistance: 10
	};

	const pvSystem2: PvSystemData = {
		...pvSystem1,
		name: "PV System 2"
	};

	const pvSystem3: PvSystemData = {
		...pvSystem1,
		name: "PV System 3"
	};

	const electricBattery: ElectricBatteryData = {
		name: "Electric Battery 1",
		capacity: 2,
		chargeEfficiency: 0.8,
		batteryAge: 0,
		minimumChargeRate: 0.001,
		maximumChargeRate: 1.5,
		maximumDischargeRate: 1.25,
		location: BatteryLocation.outside,
		gridChargingPossible: false,
	};

	describe('pv systems', () => {
		test('pv system is removed when remove link is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystems: {
						data: [pvSystem1]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
	
			expect(screen.getAllByTestId('pvSystems_items')).toBeDefined();
	
			await user.click(screen.getByTestId('pvSystems_remove_0'));
	
			expect(screen.queryByTestId('pvSystems_items')).toBeNull();
		});
	
		it('should only remove the pv system object that is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystems: {
						data:[pvSystem1, pvSystem2, pvSystem3]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
			await user.click(screen.getByTestId('pvSystems_remove_1'));
	
			const populatedList = screen.getByTestId('pvSystems_items');
	
			expect(within(populatedList).getByText('PV System 1')).toBeDefined();
			expect(within(populatedList).getByText('PV System 3')).toBeDefined();
			expect(within(populatedList).queryByText('PV System 2')).toBeNull();
		});

		test('pv system is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystems: {
						data:[pvSystem1, pvSystem2]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
			await userEvent.click(screen.getByTestId('pvSystems_duplicate_0'));
			await userEvent.click(screen.getByTestId('pvSystems_duplicate_0'));
			await userEvent.click(screen.getByTestId('pvSystems_duplicate_2'));
			await userEvent.click(screen.getByTestId('pvSystems_duplicate_2'));
	
			expect(screen.queryAllByTestId('pvSystems_item').length).toBe(6);
			expect(screen.getByText('PV System 1')).toBeDefined();
			expect(screen.getByText('PV System 1 (1)')).toBeDefined();
			expect(screen.getByText('PV System 1 (2)')).toBeDefined();
			expect(screen.getByText('PV System 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('PV System 1 (1) (2)')).toBeDefined();
		});
	});
	
	describe('electric batteries', () => {
		test('battery is removed when remove link is clicked', async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [electricBattery]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
	
			expect(screen.getAllByTestId('electricBattery_items')).toBeDefined();
			expect(screen.getAllByTestId('electricBattery_item').length).toBe(1);

			await user.click(screen.getByTestId('electricBattery_remove_0'));
	
			expect(screen.queryByTestId('electricBattery_items')).toBeNull();
		});

		test('only one battery can be added', async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [electricBattery]
					}
				}
			});
	
			await renderSuspended(PvAndBatteries);
			expect(screen.queryByTestId('electricBattery_add')).toBeNull();
			expect(screen.queryByTestId('electricBattery_duplicate_0')).toBeNull();
		});
	});

	describe("mark section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		mockNuxtImport("navigateTo", () => {
			return navigateToMock;
		});


		const addPvDataToStore = async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystems: {
						data: [pvSystem1],
					},
				}
			});
		};

		const addElectricBatteryToStore = async () => {
			store.$patch({
				pvAndBatteries: {
					electricBattery: {
						data: [electricBattery],
					},
				}
			});
		};

		const getPvData = async (action: string) => {
			return {
				key: "pvSystem",
				testId: `pvSystems_${action}_0`,
				form: PvSystemForm,
				params: "system",
			};
		};

		const getElectricBatteryData = async (action: string) => {
			return {
				key: "electricBattery",
				testId: `electricBattery_${action}_0`,
				form: ElectricBatteryForm,
				params: "battery",
			};
		};

		beforeEach(async () => {
			await renderSuspended(PvAndBatteries);
		});

		it("marks section as complete when both pv and batteries have been added", async () => {
			await addPvDataToStore();
			await addElectricBatteryToStore();

			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completeStatus = screen.queryByTestId("completeSectionCompleted");
			expect(completeStatus?.style.display).toBe("none");

			await user.click(screen.getByTestId("completeSectionButton"));

			expect(store.pvAndBatteries.pvSystems?.complete).toBe(true);
			expect(store.pvAndBatteries.electricBattery?.complete).toBe(true);

			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completeStatus?.style.display).not.toBe("none");

			expect(navigateToMock).toHaveBeenCalledWith("/");
		});

		it("marks section as complete when just batteries have been added", async () => {
			await addElectricBatteryToStore();

			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completeStatus = screen.queryByTestId("completeSectionCompleted");
			expect(completeStatus?.style.display).toBe("none");

			await user.click(screen.getByTestId("completeSectionButton"));

			expect(store.pvAndBatteries.pvSystems?.complete).toBe(true);
			expect(store.pvAndBatteries.electricBattery?.complete).toBe(true);

			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completeStatus?.style.display).not.toBe("none");

			expect(navigateToMock).toHaveBeenCalledWith("/");
		});


		it("marks section as complete when nothing has been added", async () => {
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completeStatus = screen.queryByTestId("completeSectionCompleted");
			expect(completeStatus?.style.display).toBe("none");

			await user.click(screen.getByTestId("completeSectionButton"));

			expect(store.pvAndBatteries.pvSystems?.complete).toBe(true);
			expect(store.pvAndBatteries.electricBattery?.complete).toBe(true);

			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completeStatus?.style.display).not.toBe("none");

			expect(navigateToMock).toHaveBeenCalledWith("/");
		});

		it("marks as not complete if pv system is removed", async () => {
			await addPvDataToStore();

			const items = await getPvData("remove");

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries.pvSystems.complete).toBe(true);

			await user.click(screen.getByTestId(items.testId));
			expect(store.pvAndBatteries.pvSystems.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();	
		});

		it("marks as not complete if battery is removed", async () => {
			await addElectricBatteryToStore();

			const items = await getElectricBatteryData("remove");

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries.electricBattery.complete).toBe(true);

			await user.click(screen.getByTestId(items.testId));
			expect(store.pvAndBatteries.electricBattery.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});

		it("marks as not complete if item is duplicated", async () => {
			await addPvDataToStore();

			const items = await getPvData("duplicate");

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries.pvSystems.complete).toBe(true);

			await user.click(screen.getByTestId(items.testId));
			expect(store.pvAndBatteries.pvSystems.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});

		it("marks as not complete after pv form save", async () => {
			await addPvDataToStore();

			const items = await getPvData("");

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries.pvSystems.complete).toBe(true);

			const param = items.params;
			await renderSuspended(items.form, {
				route: { params: { [param]: "0" } },
			});
			await user.click(screen.getByRole("button", { name: "Save and continue" }));
			expect(store.pvAndBatteries.pvSystems.complete).toBe(false);

			await renderSuspended(PvAndBatteries);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});

		it("marks as not complete after electric battery form save", async () => {
			await addElectricBatteryToStore();
			
			const items = await getElectricBatteryData("");

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries.electricBattery.complete).toBe(true);

			const param = items.params;
			await renderSuspended(items.form, {
				route: { params: { [param]: "0" } },
			});
			await user.click(screen.getByRole("button", { name: "Save and continue" }));
			expect(store.pvAndBatteries.electricBattery.complete).toBe(false);

			await renderSuspended(PvAndBatteries);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});
	});
});
