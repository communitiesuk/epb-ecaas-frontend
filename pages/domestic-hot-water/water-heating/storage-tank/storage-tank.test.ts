import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import StorageTank from './[storageTank].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('storageTank', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const storageTank: StorageTankData = {
		name: 'Storage tank 1',
		tankVolume: 5,
		dailyEnergyLoss: 1
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Storage tank 1');
		await user.type(screen.getByTestId('tankVolume'), '5');
		await user.type(screen.getByTestId('dailyEnergyLoss'), '1');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(StorageTank);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.domesticHotWater.waterHeating.storageTank;

		expect(data[0]).toEqual(storageTank);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				waterHeating: {
					storageTank: {
						data: [storageTank]
					}
				}
			}
		});

		await renderSuspended(StorageTank, {
			route: {
				params: { 'storageTank': '0' }
			}
		});
		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Storage tank 1');
		expect((await screen.findByTestId('tankVolume') as HTMLInputElement).value).toBe('5');
		expect((await screen.findByTestId('dailyEnergyLoss') as HTMLInputElement).value).toBe('1');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(StorageTank);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('tankVolume_error'))).toBeDefined();
		expect((await screen.findByTestId('dailyEnergyLoss_error'))).toBeDefined();

	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(StorageTank);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('storageTankErrorSummary'))).toBeDefined();
	});

	it('navigates to hot water outlets page when valid form is completed', async () => {
		await renderSuspended(StorageTank);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { storageTank } = store.domesticHotWater.waterHeating;

		expect(storageTank?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/water-heating');
	});
});