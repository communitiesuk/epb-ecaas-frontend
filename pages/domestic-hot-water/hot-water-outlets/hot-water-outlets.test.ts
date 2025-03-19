import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import {screen, within } from '@testing-library/vue';
import HotWaterOutlets from './index.vue';

describe('hot water outlets', () => {

	describe('mixed shower', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const mixedShower1: MixedShowerData = {
			name: "Mixed shower 1",
			flowRate: 10
		};

		const mixedShower2: MixedShowerData = {
			...mixedShower1,
			name: "Mixed shower 2",
		};

		const mixedShower3: MixedShowerData = {
			...mixedShower1,
			name: "Mixed shower 3"
		};

		afterEach(() => {
			store.$reset();
		});

		it('mixed shower is removed when remove link is clicked', async () => {
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

		it('should only remove the mixed shower thats is clicked', async () => {
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

			expect(within(populatedList).getByText('Mixed shower 1')).toBeDefined();
			expect(within(populatedList).getByText('Mixed shower 3')).toBeDefined();
			expect(within(populatedList).queryByText('Mixed shower 2')).toBeNull();

		});

		it('mixed shower is duplicated when duplicate link is clicked', async () => {
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
			expect(screen.getByText('Mixed shower 1')).toBeDefined();
			expect(screen.getByText('Mixed shower 1 (1)')).toBeDefined();
			expect(screen.getByText('Mixed shower 1 (2)')).toBeDefined();
			expect(screen.getByText('Mixed shower 1 (1) (1)')).toBeDefined();
			expect(screen.getByText('Mixed shower 1 (1) (2)')).toBeDefined();
		});
	});

	describe('electric shower', () => {
		const store = useEcaasStore();
		const user = userEvent.setup();

		const electricShower1: ElectricShowerData = {
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

		it('electric shower is removed when remove link is clicked', async () => {
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

		it('electric shower is duplicated when duplicate link is clicked', async () => {
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

		it('bath is removed when remove link is clicked', async () => {
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

		it('bath is duplicated when duplicate link is clicked', async () => {
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

		it('outlet is removed when remove link is clicked', async () => {
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

		it('outlet is duplicated when duplicate link is clicked', async () => {
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
});