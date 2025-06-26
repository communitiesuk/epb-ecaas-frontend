import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import PvSystem from './index.vue';
import PvSystemForm from "./[system].vue";
import {screen } from '@testing-library/vue';
import {within} from '@testing-library/dom';
import { InverterType, OnSiteGenerationVentilationStrategy } from "~/schema/api-schema.types";

describe('pv system', () => {
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

	test('pv system is removed when remove link is clicked', async () => {
		store.$patch({
			pvAndBatteries: {
				pvSystem: {
					data: [pvSystem1]
				}
			}
		});
	
		await renderSuspended(PvSystem);
	
		expect(screen.getAllByTestId('pvSystems_items')).toBeDefined();
	
		await user.click(screen.getByTestId('pvSystems_remove_0'));
	
		expect(screen.queryByTestId('pvSystems_items')).toBeNull();
	});
	
	it('should only remove the pv system object that is clicked', async () => {
		store.$patch({
			pvAndBatteries: {
				pvSystem: {
					data:[pvSystem1, pvSystem2, pvSystem3]
				}
			}
		});
	
		await renderSuspended(PvSystem);
		await user.click(screen.getByTestId('pvSystems_remove_1'));
	
		const populatedList = screen.getByTestId('pvSystems_items');
	
		expect(within(populatedList).getByText('PV System 1')).toBeDefined();
		expect(within(populatedList).getByText('PV System 3')).toBeDefined();
		expect(within(populatedList).queryByText('PV System 2')).toBeNull();
	});

	test('pv system is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			pvAndBatteries: {
				pvSystem: {
					data:[pvSystem1, pvSystem2]
				}
			}
		});
	
		await renderSuspended(PvSystem);
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

	describe("mark section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		mockNuxtImport("navigateTo", () => {
			return navigateToMock;
		});


		const addPvDataToStore = async () => {
			store.$patch({
				pvAndBatteries: {
					pvSystem: {
						data: [pvSystem1],
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


		beforeEach(async () => {
			await addPvDataToStore();
			await renderSuspended(PvSystem);
		});

		it("marks pv systems section as complete", async () => {
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completeStatus = screen.queryByTestId("completeSectionCompleted");
			expect(completeStatus?.style.display).toBe("none");

			await user.click(screen.getByTestId("completeSectionButton"));

			const pvSystemItems = store.pvAndBatteries.pvSystem;
			expect(pvSystemItems?.complete).toBe(true);
			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completeStatus?.style.display).not.toBe("none");

			expect(navigateToMock).toHaveBeenCalledWith("/pv-and-batteries");
		});

		it("marks as not complete if item is removed", async () => {
			const items = await getPvData("remove");

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries.pvSystem.complete).toBe(true);

			await user.click(screen.getByTestId(items.testId));
			expect(store.pvAndBatteries.pvSystem.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			
		});

		it("marks as not complete if item is duplicated", async () => {
			const items = await getPvData("duplicate");

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries.pvSystem.complete).toBe(true);

			await user.click(screen.getByTestId(items.testId));
			expect(store.pvAndBatteries.pvSystem.complete).toBe(false);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
		});

		it("marks as not complete after save", async () => {
			const items = await getPvData("");

			await user.click(screen.getByTestId("completeSectionButton"));
			expect(store.pvAndBatteries.pvSystem.complete).toBe(true);

			const param = items.params;
			await renderSuspended(items.form, {
				route: { params: { [param]: "0" } },
			});
			await user.click(screen.getByRole("button", { name: "Save and continue" }));
			expect(store.pvAndBatteries.pvSystem.complete).toBe(false);

			await renderSuspended(PvSystem);
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			
		});
	});
});
