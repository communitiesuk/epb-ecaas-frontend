import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import ImmersionHeater from './[immersionHeater].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('immersion heater', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const immersionHeater: ImmersionHeaterData = {
		name: 'Immersion heater',
		ratedPower: 10,
		heaterPosition: 1,
		thermostatPosition: 1
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Immersion heater');
		await user.type(screen.getByTestId('ratedPower'), '10');
		await user.click(screen.getByTestId('heaterPosition_1'));
		await user.click(screen.getByTestId('thermostatPosition_1'));
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(ImmersionHeater);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.domesticHotWater.waterHeating.immersionHeater;
		
		expect(data[0]).toEqual(immersionHeater);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				waterHeating: {
					immersionHeater: {
						data: [immersionHeater]
					}
				}
			}
		});

		await renderSuspended(ImmersionHeater, {
			route: {
				params: { 'immersionHeater': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Immersion heater');
		expect((await screen.findByTestId('ratedPower') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('heaterPosition_1')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('thermostatPosition_1')).hasAttribute('checked')).toBe(true);
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ImmersionHeater);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('ratedPower_error'))).toBeDefined();
		expect((await screen.findByTestId('heaterPosition_error'))).toBeDefined();
		expect((await screen.findByTestId('thermostatPosition_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(ImmersionHeater);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('immersionHeaterErrorSummary'))).toBeDefined();
	});

	it('navigates to water heating page when valid form is completed', async () => {
		await renderSuspended(ImmersionHeater);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/water-heating');
	});
});