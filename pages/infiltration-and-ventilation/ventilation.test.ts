import Ventilation from './ventilation.vue';
import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import type { VentilationData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('Ventilation', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const state: VentilationData = {
		zoneElevationalLevelAtBase: 1,
		crossVentFactor: 'yes',
		maxRequiredAirChangeRate: 2
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('zoneElevationalLevelAtBase'), '1');
		await user.click(screen.getByTestId('crossVentFactor_yes'));
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(Ventilation);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.infiltrationAndVentilation.ventilation;
		
		expect(data).toEqual(state);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ventilation: {
					data: state
				}
			}
		});

		await renderSuspended(Ventilation);
		
		expect((await screen.findByTestId('zoneElevationalLevelAtBase') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('crossVentFactor_yes')).hasAttribute('checked')).toBe(true);
	});
		
	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(Ventilation);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('zoneElevationalLevelAtBase_error'))).toBeDefined();
		expect((await screen.findByTestId('crossVentFactor_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(Ventilation);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('ventilationErrorSummary'))).toBeDefined();
	});

	it('navigates to infiltration and ventilation page when valid form is completed', async () => {
		await renderSuspended(Ventilation);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { complete } = store.infiltrationAndVentilation.ventilation;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation');
	});
});
