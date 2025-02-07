import Appliances from './appliances.vue';
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { AppliancesData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: AppliancesData = {
	appliances: [
		'fridge',
		'freezer',
		'fridgeFreezer',
		'dishwasher',
		'oven',
		'washingMachine',
		'tumbleDryer',
		'hobs',
		'kettle',
		'microwave'
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

		await user.click(screen.getByTestId('appliances_fridge'));
		await user.click(screen.getByTestId('appliances_freezer'));
		await user.click(screen.getByTestId('appliances_fridgeFreezer'));
		await user.click(screen.getByTestId('appliances_dishwasher'));
		await user.click(screen.getByTestId('appliances_oven'));
		await user.click(screen.getByTestId('appliances_washingMachine'));
		await user.click(screen.getByTestId('appliances_tumbleDryer'));
		await user.click(screen.getByTestId('appliances_hobs'));
		await user.click(screen.getByTestId('appliances_kettle'));
		await user.click(screen.getByTestId('appliances_microwave'));
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

		expect((await screen.findByTestId('appliances_fridge')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_freezer')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_fridgeFreezer')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_dishwasher')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_oven')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_washingMachine')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_tumbleDryer')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_hobs')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_kettle')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('appliances_microwave')).hasAttribute('checked')).toBe(true);
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