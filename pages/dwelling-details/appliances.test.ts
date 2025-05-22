import Appliances from './appliances.vue';
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { AppliancesData } from '~/stores/ecaasStore.types';
import { ApplianceKey } from '~/schema/api-schema.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: AppliancesData = {
	appliances: [
		ApplianceKey.Fridge,
		ApplianceKey.Freezer,
		ApplianceKey.Fridge_Freezer,
		ApplianceKey.Dishwasher,
		ApplianceKey.Oven,
		ApplianceKey.Clothes_washing,
		ApplianceKey.Clothes_drying,
		ApplianceKey.Hobs,
		ApplianceKey.Kettle,
		ApplianceKey.Microwave
	]
};

describe('Appliances', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		const user = userEvent.setup();

		await renderSuspended(Appliances);

		await user.click(screen.getByTestId('appliances_Fridge'));
		await user.click(screen.getByTestId('appliances_Freezer'));
		await user.click(screen.getByTestId('appliances_Fridge-Freezer'));
		await user.click(screen.getByTestId('appliances_Dishwasher'));
		await user.click(screen.getByTestId('appliances_Oven'));
		await user.click(screen.getByTestId('appliances_Clothes_washing'));
		await user.click(screen.getByTestId('appliances_Clothes_drying'));
		await user.click(screen.getByTestId('appliances_Hobs'));
		await user.click(screen.getByTestId('appliances_Kettle'));
		await user.click(screen.getByTestId('appliances_Microwave'));
		await user.click(screen.getByRole('button'));

		const { data, complete } = store.dwellingDetails.appliances;
		
		expect(data).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			dwellingDetails: {
				appliances: {
					data: state
				}
			}
		});

		await renderSuspended(Appliances);

		expect((await screen.findByTestId('appliances_Fridge')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_Freezer')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_Fridge-Freezer')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_Dishwasher')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_Oven')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_Clothes_washing')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_Clothes_drying')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_Hobs')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_Kettle')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_Microwave')).hasAttribute('checked')).toBe(true);
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		const user = userEvent.setup();

		await renderSuspended(Appliances);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('appliances_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		const user = userEvent.setup();

		await renderSuspended(Appliances);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('appliancesErrorSummary'))).toBeDefined();
	});
});