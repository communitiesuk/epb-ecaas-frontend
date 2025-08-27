import AirPermeability from './air-permeability.vue';
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { AirPermeabilityData } from '~/stores/ecaasStore.schema';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('Air permeability', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const state: AirPermeabilityData = {
		testPressure: 1,
		airTightnessTestResult: 1
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('testPressure'), '1');
		await user.type(screen.getByTestId('airTightnessTestResult'), '1');
		await user.tab();
	};

	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(AirPermeability);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.infiltrationAndVentilation.airPermeability;
		
		expect(data).toEqual(state);
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				airPermeability: {
					data: state
				}
			}
		});

		await renderSuspended(AirPermeability);

		expect((await screen.findByTestId('testPressure') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('airTightnessTestResult') as HTMLInputElement).value).toBe('1');
	});
		
	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(AirPermeability);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('testPressure_error'))).toBeDefined();
		expect((await screen.findByTestId('airTightnessTestResult_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(AirPermeability);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('airPermeabilityErrorSummary'))).toBeDefined();
	});

	it('navigates to infiltration and ventilation page when valid form is completed', async () => {
		await renderSuspended(AirPermeability);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { complete } = store.infiltrationAndVentilation.airPermeability;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation');
	});
});
