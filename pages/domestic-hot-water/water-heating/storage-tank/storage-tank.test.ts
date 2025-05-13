import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import StorageTank from './[storageTank].vue';
import { v4 as uuidv4 } from 'uuid';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

vi.mock('uuid');

describe('storageTank', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatPumpId = '463c94f6-566c-49b2-af27-57e5c68b5c30';

	const storageTank: StorageTankData = {
		id: 'c84528bb-f805-4f1e-95d3-2bd17384fdbe',
		name: 'Storage tank 1',
		heatSource: heatPumpId,
		tankVolume: 5,
		dailyEnergyLoss: 1,
	};

	afterEach(() => {
		store.$reset();
	});

	const addStoreData = () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [{
							id: heatPumpId,
							name: 'Heat pump'
						}]
					}
				}
			}
		});
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Storage tank 1');
		await user.click(screen.getByTestId(`heatSource_${heatPumpId}`));
		await user.type(screen.getByTestId('tankVolume'), '5');
		await user.type(screen.getByTestId('dailyEnergyLoss'), '1');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		addStoreData();

		vi.mocked(uuidv4).mockReturnValue(storageTank.id as unknown as Buffer);
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

		addStoreData();
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
		addStoreData();
		await renderSuspended(StorageTank);

		await populateValidForm();
		await user.click(screen.getByRole('button'));
		
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/water-heating');
	});
});