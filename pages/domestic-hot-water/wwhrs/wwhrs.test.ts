import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, within } from '@testing-library/vue';
import Wwhrs from './index.vue';
import type { WwhrsData } from "~/stores/ecaasStore.types";

describe('wwhrs', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const wwhrs1: WwhrsData = {
		name: "WWHRS 1"
	};

	const wwhrs2: WwhrsData = {
		...wwhrs1,
		name: "WWHRS 2",
	};

	const wwhrs3: WwhrsData = {
		...wwhrs1,
		name: "WWHRS 3"
	};

	afterEach(() => {
		store.$reset();
	});

	it('wwhrs is removed when remove link is clicked', async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrs1]
				}
			}
		});

		await renderSuspended(Wwhrs);

		expect(screen.getAllByTestId('wwhrs_items')).toBeDefined();

		await user.click(screen.getByTestId('wwhrs_remove_0'));

		expect(screen.queryByTestId('wwhrs_items')).toBeNull();
	});

	it('should only remove the wwhrs thats is clicked', async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data:[wwhrs1, wwhrs2, wwhrs3]
				}
			}
		});

		await renderSuspended(Wwhrs);
		await user.click(screen.getByTestId('wwhrs_remove_1'));

		const populatedList = screen.getByTestId('wwhrs_items');

		expect(within(populatedList).getByText('WWHRS 1')).toBeDefined();
		expect(within(populatedList).getByText('WWHRS 3')).toBeDefined();
		expect(within(populatedList).queryByText('WWHRS 2')).toBeNull();

	});

	it('wwhrs is duplicated when duplicate link is clicked', async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [wwhrs1, wwhrs2]
				}
			}
		});

		await renderSuspended(Wwhrs);
		await userEvent.click(screen.getByTestId('wwhrs_duplicate_0'));
		await userEvent.click(screen.getByTestId('wwhrs_duplicate_0'));
		await userEvent.click(screen.getByTestId('wwhrs_duplicate_2'));
		await userEvent.click(screen.getByTestId('wwhrs_duplicate_2'));

		expect(screen.queryAllByTestId('wwhrs_item').length).toBe(6);
		expect(screen.getByText('WWHRS 1')).toBeDefined();
		expect(screen.getByText('WWHRS 1 (1)')).toBeDefined();
		expect(screen.getByText('WWHRS 1 (2)')).toBeDefined();
		expect(screen.getByText('WWHRS 1 (1) (1)')).toBeDefined();
		expect(screen.getByText('WWHRS 1 (1) (2)')).toBeDefined();
	});
});