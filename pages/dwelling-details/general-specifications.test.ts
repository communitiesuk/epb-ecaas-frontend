import GeneralSpecifications from './general-specifications.vue';
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { GeneralSpecificationsData } from '~/stores/ecaasStore.types';
import { BuildType } from '~/schema/api-schema.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: GeneralSpecificationsData = {
	typeOfDwelling: BuildType.house,
	storeysInDwelling: 2,
	numOfBedrooms: 3,
	coolingRequired: false,
};

const stateWithFlat: GeneralSpecificationsData = {
	typeOfDwelling: BuildType.flat,
	storeysInDwelling: 7,
	storeyOfFlat: 3,
	numOfBedrooms: 3,
	coolingRequired: false,
};

describe('General specifications', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	describe('When the dwelling type is a house', () => {

		test('data is saved to store state when form is valid', async () => {
			const user = userEvent.setup();
	
			await renderSuspended(GeneralSpecifications);
	
			await user.click(screen.getByTestId('typeOfDwelling_house'));
			await user.type(screen.getByTestId('storeysInDwelling'), '2');
			await user.type(screen.getByTestId('numOfBedrooms'), '3');
			await user.click(screen.getByTestId('coolingRequired_no'));
			await user.click(screen.getByRole('button'));
	
			const { data, complete } = store.dwellingDetails.generalSpecifications;
			
			expect(data).toEqual(state);
			expect(complete).toBe(true);
			expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details');
		});

		test('form is prepopulated when data exists in state', async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: state
					}
				}
			});
	
			await renderSuspended(GeneralSpecifications);
			
			expect((await screen.findByTestId('typeOfDwelling_house')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('storeysInDwelling') as HTMLInputElement).value).toBe('2');
			expect((await screen.queryByTestId('storeyOfFlat') as HTMLInputElement)).toBe(null);
			expect((await screen.findByTestId('numOfBedrooms') as HTMLInputElement).value).toBe('3');
			expect((await screen.findByTestId('coolingRequired_no')).hasAttribute('checked')).toBe(true);
		});
			
		test('required error messages are displayed when empty form is submitted', async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralSpecifications);

			await user.click(screen.getByRole('button'));

			expect((await screen.findByTestId('typeOfDwelling_error'))).toBeDefined();
			expect((await screen.findByTestId('storeysInDwelling_error'))).toBeDefined();
			expect((await screen.findByTestId('numOfBedrooms_error'))).toBeDefined();
			expect((await screen.findByTestId('coolingRequired_error'))).toBeDefined();

			expect((await screen.queryByTestId('storeyOfFlat_error'))).toBe(null);
		});

		test('error summary is displayed when an invalid form in submitted', async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralSpecifications);

			await user.click(screen.getByRole('button'));

			expect((await screen.findByTestId('generalSpecificationsErrorSummary'))).toBeDefined();
		});
	});

	describe('When the type of dwelling is a flat', () => {

		test('data is saved to store state when form is valid', async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralSpecifications);

			await user.click(screen.getByTestId('typeOfDwelling_flat'));
			await user.type(screen.getByTestId('storeysInDwelling'), '7');
			await user.type(screen.getByTestId('storeyOfFlat'), '3');
			await user.type(screen.getByTestId('numOfBedrooms'), '3');
			await user.click(screen.getByTestId('coolingRequired_no'));
			await user.click(screen.getByRole('button'));

			const { data, complete } = store.dwellingDetails.generalSpecifications;
			
			expect(data).toEqual(stateWithFlat);
			expect(complete).toBe(true);
			expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details');
		});

		test('form is prepopulated when data exists in state', async () => {
			store.$patch({
				dwellingDetails: {
					generalSpecifications: {
						data: stateWithFlat
					}
				}
			});

			await renderSuspended(GeneralSpecifications);
			
			expect((await screen.findByTestId('typeOfDwelling_flat')).hasAttribute('checked')).toBe(true);
			expect((await screen.findByTestId('storeysInDwelling') as HTMLInputElement).value).toBe('7');
			expect((await screen.findByTestId('storeyOfFlat') as HTMLInputElement).value).toBe('3');
			expect((await screen.findByTestId('numOfBedrooms') as HTMLInputElement).value).toBe('3');
			expect((await screen.findByTestId('coolingRequired_no')).hasAttribute('checked')).toBe(true);
		});

		test('required error messages are displayed when empty form is submitted', async () => {
			const user = userEvent.setup();

			await renderSuspended(GeneralSpecifications);

			await user.click(screen.getByTestId('typeOfDwelling_flat'));
			await user.click(screen.getByRole('button'));

			expect((await screen.findByTestId('storeyOfFlat_error'))).toBeDefined();

		});
	});

});

