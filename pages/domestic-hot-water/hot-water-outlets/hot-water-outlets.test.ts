import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import { v4 as uuidv4 } from 'uuid';
import HotWaterOutlets from './index.vue';
import  MixerShowerForm from "./mixer-shower/[shower].vue";
import  ElectricShowerForm from "./electric-shower/[shower].vue";
import  BathForm from "./bath/[bath].vue";
import  OtherHotWaterOutletForm  from "./other/[outlet].vue";


describe('hot water outlets', () => {

	describe('mixer shower', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const mixedShower1: MixedShowerData = {
			id: uuidv4(),
			name: "Mixer shower 1",
			flowRate: 10
		};

		const mixedShower2: MixedShowerData = {
			...mixedShower1,
			name: "Mixer shower 2",
		};

		const mixedShower3: MixedShowerData = {
			...mixedShower1,
			name: "Mixer shower 3"
		};

		afterEach(() => {
			store.$reset();
		});

		test('mixer shower is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						mixedShower: {
							data: [mixedShower1]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);

			expect(screen.getAllByTestId('mixedShower_items')).toBeDefined();

			await user.click(screen.getByTestId('mixedShower_remove_0'));

			expect(screen.queryByTestId('mixedShower_items')).toBeNull();
		});

		it('should only remove the mixer shower thats is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						mixedShower: {
							data:[mixedShower1, mixedShower2, mixedShower3]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);
			await user.click(screen.getByTestId('mixedShower_remove_1'));

			const populatedList = screen.getByTestId('mixedShower_items');

			expect(within(populatedList).getByText('Mixer shower 1')).toBeDefined();
			expect(within(populatedList).getByText('Mixer shower 3')).toBeDefined();
			expect(within(populatedList).queryByText('Mixer shower 2')).toBeNull();

		});

		test('mixer shower is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						mixedShower: {
							data: [mixedShower1, mixedShower2]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);
			await userEvent.click(screen.getByTestId('mixedShower_duplicate_0'));
			await userEvent.click(screen.getByTestId('mixedShower_duplicate_0'));
			await userEvent.click(screen.getByTestId('mixedShower_duplicate_2'));
			await userEvent.click(screen.getByTestId('mixedShower_duplicate_2'));

			expect(screen.queryAllByTestId('mixedShower_item').length).toBe(6);
			expect(screen.getByText('Mixer shower 1')).toBeDefined();
			expect(screen.getByText('Mixer shower 1 (1)')).toBeDefined();
			expect(screen.getByText('Mixer shower 1 (2)')).toBeDefined();
			expect(screen.getByText('Mixer shower 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Mixer shower 1 (1) (2)')).toBeDefined();
		});
	});

	describe('electric shower', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const electricShower1: ElectricShowerData = {
			id: uuidv4(),
			name: "Electric shower 1",
			ratedPower: 10
		};

		const electricShower2: ElectricShowerData = {
			...electricShower1,
			name: "Electric shower 2"
		};

		const electricShower3: ElectricShowerData = {
			...electricShower1,
			name: "Electric shower 3"
		};

		afterEach(() => {
			store.$reset();
		});

		test('electric shower is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						electricShower: {
							data: [electricShower1]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);

			expect(screen.getAllByTestId('electricShower_items')).toBeDefined();

			await user.click(screen.getByTestId('electricShower_remove_0'));

			expect(screen.queryByTestId('electricShower_items')).toBeNull();
		});

		it('should only remove the electric shower thats is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						electricShower: {
							data:[electricShower1, electricShower2, electricShower3]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);
			await user.click(screen.getByTestId('electricShower_remove_1'));

			const populatedList = screen.getByTestId('electricShower_items');

			expect(within(populatedList).getByText('Electric shower 1')).toBeDefined();
			expect(within(populatedList).getByText('Electric shower 3')).toBeDefined();
			expect(within(populatedList).queryByText('Electric shower 2')).toBeNull();

		});

		test('electric shower is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						electricShower: {
							data: [electricShower1, electricShower2]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);
			await userEvent.click(screen.getByTestId('electricShower_duplicate_0'));
			await userEvent.click(screen.getByTestId('electricShower_duplicate_0'));
			await userEvent.click(screen.getByTestId('electricShower_duplicate_2'));
			await userEvent.click(screen.getByTestId('electricShower_duplicate_2'));

			expect(screen.queryAllByTestId('electricShower_item').length).toBe(6);
			expect(screen.getByText('Electric shower 1')).toBeDefined();
			expect(screen.getByText('Electric shower 1 (1)')).toBeDefined();
			expect(screen.getByText('Electric shower 1 (2)')).toBeDefined();
			expect(screen.getByText('Electric shower 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Electric shower 1 (1) (2)')).toBeDefined();
		});
	});

	describe('bath', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const bath1: BathData = {
			id: uuidv4(),
			name: "Bath 1",
			size: 100,
			flowRate: 10
		};

		const bath2: BathData = {
			...bath1,
			name: "Bath 2"
		};

		const bath3: BathData = {
			...bath1,
			name: "Bath 3"
		};

		afterEach(() => {
			store.$reset();
		});

		test('bath is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						bath: {
							data: [bath1]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);

			expect(screen.getAllByTestId('bath_items')).toBeDefined();

			await user.click(screen.getByTestId('bath_remove_0'));

			expect(screen.queryByTestId('bath_items')).toBeNull();
		});

		it('should only remove the bath thats is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						bath: {
							data:[bath1, bath2, bath3]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);
			await user.click(screen.getByTestId('bath_remove_1'));

			const populatedList = screen.getByTestId('bath_items');

			expect(within(populatedList).getByText('Bath 1')).toBeDefined();
			expect(within(populatedList).getByText('Bath 3')).toBeDefined();
			expect(within(populatedList).queryByText('Bath 2')).toBeNull();

		});

		test('bath is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						bath: {
							data: [bath1, bath2]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);
			await userEvent.click(screen.getByTestId('bath_duplicate_0'));
			await userEvent.click(screen.getByTestId('bath_duplicate_0'));
			await userEvent.click(screen.getByTestId('bath_duplicate_2'));
			await userEvent.click(screen.getByTestId('bath_duplicate_2'));

			expect(screen.queryAllByTestId('bath_item').length).toBe(6);
			expect(screen.getByText('Bath 1')).toBeDefined();
			expect(screen.getByText('Bath 1 (1)')).toBeDefined();
			expect(screen.getByText('Bath 1 (2)')).toBeDefined();
			expect(screen.getByText('Bath 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Bath 1 (1) (2)')).toBeDefined();
		});
	});

	describe('other outlets', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const basinTap1: OtherHotWaterOutletData = {
			id: uuidv4(),
			name: "Basin tap 1",
			flowRate: 10
		};

		const basinTap2: OtherHotWaterOutletData = {
			...basinTap1,
			name: "Basin tap 2"
		};

		const basinTap3: OtherHotWaterOutletData = {
			...basinTap1,
			name: "Basin tap 3"
		};

		afterEach(() => {
			store.$reset();
		});

		test('outlet is removed when remove link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						otherOutlets: {
							data: [basinTap1]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);

			expect(screen.getAllByTestId('otherOutlets_items')).toBeDefined();

			await user.click(screen.getByTestId('otherOutlets_remove_0'));

			expect(screen.queryByTestId('otherOutlets_items')).toBeNull();
		});

		it('should only remove the outlet thats is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						otherOutlets: {
							data:[basinTap1, basinTap2, basinTap3]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);
			await user.click(screen.getByTestId('otherOutlets_remove_1'));

			const populatedList = screen.getByTestId('otherOutlets_items');

			expect(within(populatedList).getByText('Basin tap 1')).toBeDefined();
			expect(within(populatedList).getByText('Basin tap 3')).toBeDefined();
			expect(within(populatedList).queryByText('Basin tap 2')).toBeNull();

		});

		test('outlet is duplicated when duplicate link is clicked', async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						otherOutlets: {
							data: [basinTap1, basinTap2]
						}
					}
				}
			});

			await renderSuspended(HotWaterOutlets);
			await userEvent.click(screen.getByTestId('otherOutlets_duplicate_0'));
			await userEvent.click(screen.getByTestId('otherOutlets_duplicate_0'));
			await userEvent.click(screen.getByTestId('otherOutlets_duplicate_2'));
			await userEvent.click(screen.getByTestId('otherOutlets_duplicate_2'));

			expect(screen.queryAllByTestId('otherOutlets_item').length).toBe(6);
			expect(screen.getByText('Basin tap 1')).toBeDefined();
			expect(screen.getByText('Basin tap 1 (1)')).toBeDefined();
			expect(screen.getByText('Basin tap 1 (2)')).toBeDefined();
			expect(screen.getByText('Basin tap 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Basin tap 1 (1) (2)')).toBeDefined();
		});
	});
	describe("mark section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();
	
		const navigateToMock = vi.hoisted(() => vi.fn());
		mockNuxtImport("navigateTo", () => {
			return navigateToMock;
		});
	
		const mixedShower1: MixedShowerData = {
			id: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a3",
			name: "Mixer Shower 1",
			flowRate: 10,
		};
		const electricShower1: ElectricShowerData = {
			id: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a4",
			name: "Electric Shower 1",
			ratedPower: 8,
		};
		const bath1: BathData = {
			id: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a35",
			name: "Bath 1",
			size: 200,
			flowRate: 15,
		};
		const otherHotWaterOutlet1: OtherHotWaterOutletData = {
			id: "4346aa5c-c8c7-41ea-99d4-a3cf5e3d21a36",
			name: "Other Outlet 1",
			flowRate: 5,
		};
	
		const addHotWaterOutletsDataToStore = async () => {
			store.$patch({
				domesticHotWater: {
					hotWaterOutlets: {
						mixedShower: { data: [mixedShower1] },
						electricShower: { data: [electricShower1] },
						bath: { data: [bath1] },
						otherOutlets: { data: [otherHotWaterOutlet1] },
					},
				},
			});
		};
	
		beforeEach(async () => {
			await addHotWaterOutletsDataToStore();
			await renderSuspended(HotWaterOutlets);
		});
	
		const getHotWaterOutletsData = async (action: string) => {
			return [
				{
					key: "mixedShower",
					testId: `mixedShower_${action}_0`,
					form: MixerShowerForm,
					params: "shower",
				},
				{
					key: "electricShower",
					testId: `electricShower_${action}_0`,
					form: ElectricShowerForm,
					params: "shower",
				},
				{
					key: "bath",
					testId: `bath_${action}_0`,
					form: BathForm,
					params: "bath",
				},
				{
					key: "otherOutlets",
					testId: `otherOutlets_${action}_0`,
					form: OtherHotWaterOutletForm,
					params: "outlet",
				},
			];
		};
	
		type HotWaterOutletsType = keyof typeof store.domesticHotWater.hotWaterOutlets;
	
		it("marks hot water outlets section as complete when button is clicked", async () => {
			expect(
				screen.getByRole("button", { name: "Mark section as complete" })
			).not.toBeNull();
			const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
			expect(completedStatusElement?.style.display).toBe("none");
	
			await user.click(screen.getByTestId("completeSectionButton"));
	
			const { mixedShower, electricShower, bath, otherOutlets } = store.domesticHotWater.hotWaterOutlets;
	
			expect(mixedShower?.complete).toBe(true);
			expect(electricShower?.complete).toBe(true);
			expect(bath?.complete).toBe(true);
			expect(otherOutlets?.complete).toBe(true);
			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
	
			expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water");
		});
	
		it("marks as not complete if an item is removed after marking complete", async () => {
			const outlets = await getHotWaterOutletsData("remove");
	
			for (const [key] of Object.entries(store.domesticHotWater.hotWaterOutlets)) {
				const typedKey = key as HotWaterOutletsType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.domesticHotWater.hotWaterOutlets[typedKey]?.complete).toBe(true);
	
				const outletData = outlets.find((e) => e.key === typedKey);
				await user.click(screen.getByTestId(outletData!.testId));
				expect(store.domesticHotWater.hotWaterOutlets[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	
		it("marks as not complete if an item is duplicated after marking complete", async () => {
			const outlets = await getHotWaterOutletsData("duplicate");
	
			for (const [key] of Object.entries(store.domesticHotWater.hotWaterOutlets)) {
				const typedKey = key as HotWaterOutletsType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.domesticHotWater.hotWaterOutlets[typedKey]?.complete).toBe(true);
	
				const outletData = outlets.find((e) => e.key === typedKey);
				await user.click(screen.getByTestId(outletData!.testId));
				expect(store.domesticHotWater.hotWaterOutlets[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	
		it("marks as not complete after saving a new or edited hot water outlet item", async () => {
			for (const [key] of Object.entries(store.domesticHotWater.hotWaterOutlets)) {
				const outlets = await getHotWaterOutletsData("");
				const typedKey = key as HotWaterOutletsType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.domesticHotWater.hotWaterOutlets[typedKey]?.complete).toBe(true);
	
				const outletData = outlets.find((e) => e.key === typedKey);
				const params: string = outletData!.params;
				await renderSuspended(outletData?.form, {
					route: {
						params: { [params]: "0" },
					},
				});
				await user.click(screen.getByRole("button", { name: "Save and continue" }));
				expect(store.domesticHotWater.hotWaterOutlets[typedKey].complete).toBe(false);
	
				await renderSuspended(HotWaterOutlets);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	});
});