import ExternalFactors from './external-factors.vue';
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { ExternalFactorsData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: ExternalFactorsData = {
	altitude: 3,
	typeOfExposure: 'shielded',
	terrainType: 'suburban',
	noiseNuisance: 'no'
};

describe('External factors', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		const user = userEvent.setup();

		await renderSuspended(ExternalFactors);

		await user.type(screen.getByTestId('altitude'), '3');
		await user.click(screen.getByTestId('typeOfExposure_shielded'));
		await user.click(screen.getByTestId('terrainType_suburban'));
		await user.click(screen.getByTestId('noiseNuisance_no'));
		await user.click(screen.getByRole('button'));

		const { data, complete } = store.dwellingDetails.externalFactors;
		
		expect(data).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			dwellingDetails: {
				externalFactors: {
					data: state
				}
			}
		});

		await renderSuspended(ExternalFactors);
		
		expect((await screen.findByTestId('altitude') as HTMLInputElement).value).toBe('3');
		expect((await screen.findByTestId('typeOfExposure_shielded')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('terrainType_suburban')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('noiseNuisance_no')).hasAttribute('checked')).toBe(true);
	});
		
	it('required error messages are displayed when empty form is submitted', async () => {
		const user = userEvent.setup();

		await renderSuspended(ExternalFactors);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('altitude_error'))).toBeDefined();
		expect((await screen.findByTestId('typeOfExposure_error'))).toBeDefined();
		expect((await screen.findByTestId('terrainType_error'))).toBeDefined();
		expect((await screen.findByTestId('noiseNuisance_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		const user = userEvent.setup();

		await renderSuspended(ExternalFactors);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('externalFactorsErrorSummary'))).toBeDefined();
	});
});
