import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import Vent from './[vent].vue';
import type { VentData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('vent', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const state: VentData = {
		name: 'Vent 1',
		typeOfVent: 'trickle',
		effectiveVentilationArea: 10,
		openingRatio: 1,
		midHeightOfZone: 1,
		pressureDifference: 1,
		orientation: 0,
		pitch: 0
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Vent 1');
		await user.click(screen.getByTestId('typeOfVent_trickle'));
		await user.type(screen.getByTestId('effectiveVentilationArea'), '10');
		await user.type(screen.getByTestId('midHeightOfZone'), '1');
		await user.type(screen.getByTestId('pressureDifference'), '1');
		await user.type(screen.getByTestId('orientation'), '0');
		await user.type(screen.getByTestId('pitch'), '0');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(Vent);
		
		await populateValidForm();
		await user.click(screen.getByRole('button'));
		
		const { data } = store.infiltrationAndVentilation.vents;

		expect(data[0]).toEqual(state);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			infiltrationAndVentilation: {
				vents: {
					data: [state]
				}
			}
		});

		await renderSuspended(Vent, {
			route: {
				params: { vent: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Vent 1');
		expect((await screen.findByTestId('typeOfVent_trickle')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('effectiveVentilationArea') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('midHeightOfZone') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('pressureDifference') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('orientation') as HTMLInputElement).value).toBe('0');
		expect((await screen.findByTestId('pitch') as HTMLInputElement).value).toBe('0');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(Vent);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('typeOfVent_error'))).toBeDefined();
		expect((await screen.findByTestId('effectiveVentilationArea_error'))).toBeDefined();
		expect((await screen.findByTestId('midHeightOfZone_error'))).toBeDefined();
		expect((await screen.findByTestId('pressureDifference_error'))).toBeDefined();
		expect((await screen.findByTestId('orientation_error'))).toBeDefined();
		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(Vent);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('ventErrorSummary'))).toBeDefined();
	});

	it('navigates to vents page when valid form is completed', async () => {
		await renderSuspended(Vent);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { complete } = store.infiltrationAndVentilation.vents;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/infiltration-and-ventilation/vents');
	});
});
