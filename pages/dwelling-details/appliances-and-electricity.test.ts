import AppliancesAndElectricity from './appliances-and-electricity.vue';
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { AppliancesAndElectricityData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: AppliancesAndElectricityData = {
	fridgeFreezerEnergyRating: 'a',
	dishwasherEnergyRating: 'b',
	ovenCookerEnergyRating: 'c',
	washingMachineEnergyRating: 'd',
	tumbleDryerEnergyRating: 'e',
	electricVehicleCharger: 'no',
	electricityGridConnection: 'none',
	electricityTariff: 'standardTariff'
};

describe('Appliances and electricity', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		const user = userEvent.setup();

		await renderSuspended(AppliancesAndElectricity);

		await user.selectOptions(screen.getByTestId('fridgeFreezerEnergyRating'), 'a');
		await user.selectOptions(screen.getByTestId('dishwasherEnergyRating'), 'b');
		await user.selectOptions(screen.getByTestId('ovenCookerEnergyRating'), 'c');
		await user.selectOptions(screen.getByTestId('washingMachineEnergyRating'), 'd');
		await user.selectOptions(screen.getByTestId('tumbleDryerEnergyRating'), 'e');
		await user.selectOptions(screen.getByTestId('electricVehicleCharger'), 'no');
		await user.click(screen.getByTestId('electricityGridConnection_none'));
		await user.click(screen.getByTestId('electricityTariff_standardTariff'));
		await user.click(screen.getByRole('button'));

		const { data, complete } = store.dwellingDetails.appliancesAndElectricity;
		
		expect(data).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			dwellingDetails: {
				appliancesAndElectricity: {
					data: state
				}
			}
		});

		await renderSuspended(AppliancesAndElectricity);

		expect((await screen.findByTestId('fridgeFreezerEnergyRating') as HTMLInputElement).value).toBe('a');
		expect((await screen.findByTestId('dishwasherEnergyRating') as HTMLInputElement).value).toBe('b');
		expect((await screen.findByTestId('ovenCookerEnergyRating') as HTMLInputElement).value).toBe('c');
		expect((await screen.findByTestId('washingMachineEnergyRating') as HTMLInputElement).value).toBe('d');
		expect((await screen.findByTestId('tumbleDryerEnergyRating') as HTMLInputElement).value).toBe('e');
		expect((await screen.findByTestId('electricVehicleCharger') as HTMLInputElement).value).toBe('no');
		expect((await screen.findByTestId('electricityGridConnection_none')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('electricityTariff_standardTariff')).hasAttribute('checked')).toBe(true);
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		const user = userEvent.setup();

		await renderSuspended(AppliancesAndElectricity);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('fridgeFreezerEnergyRating_error'))).toBeDefined();
		expect((await screen.findByTestId('dishwasherEnergyRating_error'))).toBeDefined();
		expect((await screen.findByTestId('ovenCookerEnergyRating_error'))).toBeDefined();
		expect((await screen.findByTestId('washingMachineEnergyRating_error'))).toBeDefined();
		expect((await screen.findByTestId('tumbleDryerEnergyRating_error'))).toBeDefined();
		expect((await screen.findByTestId('electricVehicleCharger_error'))).toBeDefined();
		expect((await screen.findByTestId('electricityGridConnection_error'))).toBeDefined();
		expect((await screen.findByTestId('electricityTariff_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		const user = userEvent.setup();

		await renderSuspended(AppliancesAndElectricity);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('appliancesAndElectricityErrorSummary'))).toBeDefined();
	});
});