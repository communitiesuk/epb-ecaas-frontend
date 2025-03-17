import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import MixedShower from './[shower].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('mixed shower', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const mixedShower: MixedShowerData = {
		name: 'Mixed shower 1',
		flowRate: 10
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Mixed shower 1');
		await user.type(screen.getByTestId('flowRate'), '10');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(MixedShower);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.domesticHotWater.hotWaterOutlets.mixedShower;
		
		expect(data[0]).toEqual(mixedShower);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					mixedShower: {
						data: [mixedShower]
					}
				}
			}
		});

		await renderSuspended(MixedShower, {
			route: {
				params: { 'shower': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Mixed shower 1');
		expect((await screen.findByTestId('flowRate') as HTMLInputElement).value).toBe('10');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(MixedShower);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('flowRate_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(MixedShower);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('mixedShowerErrorSummary'))).toBeDefined();
	});

	it('navigates to hot water outlets page when valid form is completed', async () => {
		await renderSuspended(MixedShower);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { mixedShower } = store.domesticHotWater.hotWaterOutlets;
		
		expect(mixedShower?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/hot-water-outlets');
	});
});