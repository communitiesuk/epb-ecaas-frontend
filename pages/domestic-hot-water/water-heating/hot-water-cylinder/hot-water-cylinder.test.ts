import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import HotWaterCylinder from './[hotWaterCylinder].vue';
import { v4 as uuidv4 } from 'uuid';
import { Volume, liter } from "~/utils/units/volume";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

vi.mock('uuid');

describe('hot water cylinder', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatPumpId = '463c94f6-566c-49b2-af27-57e5c68b5c30';

	const hotWaterCylinder: HotWaterCylinderData = {
		id: 'c84528bb-f805-4f1e-95d3-2bd17384fdbe',
		name: 'Hot water cylinder 1',
		heatSource: heatPumpId,
		tankVolume: new Volume(5, liter),
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
		await user.type(screen.getByTestId('name'), 'Hot water cylinder 1');
		await user.click(screen.getByTestId(`heatSource_${heatPumpId}`));
		await user.type(screen.getByTestId('tankVolume'), '5');
		await user.type(screen.getByTestId('dailyEnergyLoss'), '1');
		await user.tab();
	};

	test('data is saved to store state when form is valid', async () => {
		addStoreData();

		vi.mocked(uuidv4).mockReturnValue(hotWaterCylinder.id as unknown as Buffer);
		await renderSuspended(HotWaterCylinder);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.domesticHotWater.waterHeating.hotWaterCylinder;

		expect(data[0]).toEqual(hotWaterCylinder);
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				waterHeating: {
					hotWaterCylinder: {
						data: [hotWaterCylinder]
					}
				}
			}
		});

		addStoreData();
		await renderSuspended(HotWaterCylinder, {
			route: {
				params: { 'hotWaterCylinder': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Hot water cylinder 1');
		expect((await screen.findByTestId('tankVolume') as HTMLInputElement).value).toBe('5');
		expect((await screen.findByTestId('dailyEnergyLoss') as HTMLInputElement).value).toBe('1');
	});

	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(HotWaterCylinder);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('tankVolume_error'))).toBeDefined();
		expect((await screen.findByTestId('dailyEnergyLoss_error'))).toBeDefined();

	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(HotWaterCylinder);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('hotWaterCylinderErrorSummary'))).toBeDefined();
	});

	it('navigates to hot water outlets page when valid form is completed', async () => {
		addStoreData();
		await renderSuspended(HotWaterCylinder);

		await populateValidForm();
		await user.click(screen.getByRole('button'));
		
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/water-heating');
	});
});