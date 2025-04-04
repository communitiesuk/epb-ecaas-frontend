import AirConditioning from './[airConditioning].vue';
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { AirConditioningData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('Air conditioning', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const state: AirConditioningData = {
		name: 'Air conditioner 1',
		coolingCapacity: 10,
		seasonalEnergyEfficiencyRatio: 10,
		convectionFraction: 1
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Air conditioner 1');
		await user.type(screen.getByTestId('coolingCapacity'), '10');
		await user.type(screen.getByTestId('seasonalEnergyEfficiencyRatio'), '10');
		await user.type(screen.getByTestId('convectionFraction'), '1');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(AirConditioning);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.cooling.airConditioning;
		
		expect(data[0]).toEqual(state);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			cooling: {
				airConditioning: {
					data: [state]
				}
			}
		});

		await renderSuspended(AirConditioning, {
			route: {
				params: { airConditioning: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Air conditioner 1');
		expect((await screen.findByTestId('coolingCapacity') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('seasonalEnergyEfficiencyRatio') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('convectionFraction') as HTMLInputElement).value).toBe('1');
	});
		
	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(AirConditioning);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('coolingCapacity_error'))).toBeDefined();
		expect((await screen.findByTestId('seasonalEnergyEfficiencyRatio_error'))).toBeDefined();
		expect((await screen.findByTestId('convectionFraction_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(AirConditioning);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('airConditioningErrorSummary'))).toBeDefined();
	});

	it('navigates to cooling page when valid form is completed', async () => {
		await renderSuspended(AirConditioning);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { complete } = store.cooling.airConditioning;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/cooling');
	});
});
