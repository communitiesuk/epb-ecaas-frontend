import GeneralSpecifications from './general-specifications.vue';
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { GeneralSpecificationsData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: GeneralSpecificationsData = {
	typeOfDwelling: 'house',
	storeysInDwelling: 2,
	numOfBedrooms: 3,
	levelOfShelter: 'normal',
	numOfShelteredSides: 0,
	heatingControlType: 'seperateTempControl',
	cookingFuelType: 'electricity',
	coldWaterSource: 'mainsWater',
	numOfADFWetRooms: 2
};

describe('General specifications', () => {
	const store = useEcaasStore();

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		const user = userEvent.setup();

		await renderSuspended(GeneralSpecifications);

		await user.click(screen.getByTestId('typeOfDwelling_house'));
		await user.type(screen.getByTestId('storeysInDwelling'), '2');
		await user.type(screen.getByTestId('numOfBedrooms'), '3');
		await user.click(screen.getByTestId('levelOfShelter_normal'));
		await user.type(screen.getByTestId('numOfShelteredSides'), '0');
		await user.click(screen.getByTestId('heatingControlType_seperateTempControl'));
		await user.click(screen.getByTestId('cookingFuelType_electricity'));
		await user.click(screen.getByTestId('coldWaterSource_mainsWater'));
		await user.type(screen.getByTestId('numOfADFWetRooms'), '2');
		await user.click(screen.getByRole('button'));

		const { data, complete } = store.dwellingDetails.generalSpecifications;
		
		expect(data).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details');
	});

	it('form is prepopulated when data exists in state', async () => {
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
		expect((await screen.findByTestId('numOfBedrooms') as HTMLInputElement).value).toBe('3');
		expect((await screen.findByTestId('levelOfShelter_normal')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('numOfShelteredSides') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('heatingControlType_seperateTempControl')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('cookingFuelType_electricity')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('coldWaterSource_mainsWater')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('numOfADFWetRooms') as HTMLInputElement).value).toBe('2');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		const user = userEvent.setup();

		await renderSuspended(GeneralSpecifications);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('typeOfDwelling_error'))).toBeDefined();
		expect((await screen.findByTestId('storeysInDwelling_error'))).toBeDefined();
		expect((await screen.findByTestId('numOfBedrooms_error'))).toBeDefined();
		expect((await screen.findByTestId('levelOfShelter_error'))).toBeDefined();
		expect((await screen.findByTestId('numOfShelteredSides_error'))).toBeDefined();
		expect((await screen.findByTestId('heatingControlType_error'))).toBeDefined();
		expect((await screen.findByTestId('cookingFuelType_error'))).toBeDefined();
		expect((await screen.findByTestId('coldWaterSource_error'))).toBeDefined();
		expect((await screen.findByTestId('numOfADFWetRooms_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		const user = userEvent.setup();

		await renderSuspended(GeneralSpecifications);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('generalSpecificationsErrorSummary'))).toBeDefined();
	});
});
