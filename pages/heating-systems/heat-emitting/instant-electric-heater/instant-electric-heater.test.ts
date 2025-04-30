import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import InstantElectricHeater from './[heater].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('instantElectricHeater', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const instantElectricHeater: InstantElectricStorageData = {
		name: 'Instant electric heater 1',
		ratedPower: 3,
		convectionFractionInstant: 0.2
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Instant electric heater 1');
		await user.type(screen.getByTestId('ratedPower'), '3');
		await user.type(screen.getByTestId('convectionFractionInstant'), '0.2');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(InstantElectricHeater);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.heatingSystems.heatEmitting.instantElectricHeater;
		
		expect(data[0]).toEqual(instantElectricHeater);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			heatingSystems: {
				heatEmitting: {
					instantElectricHeater: {
						data: [instantElectricHeater]
					}
				}
			}
		});

		await renderSuspended(InstantElectricHeater, {
			route: {
				params: { 'heater': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Instant electric heater 1');
		expect((await screen.findByTestId('ratedPower') as HTMLInputElement).value).toBe('3');
		expect((await screen.findByTestId('convectionFractionInstant') as HTMLInputElement).value).toBe('0.2');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(InstantElectricHeater);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('ratedPower_error'))).toBeDefined();
		expect((await screen.findByTestId('convectionFractionInstant_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(InstantElectricHeater);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('instantElectricHeaterErrorSummary'))).toBeDefined();
	});

	it('navigates to hot heat emitting page when valid form is completed', async () => {
		await renderSuspended(InstantElectricHeater);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { instantElectricHeater } = store.heatingSystems.heatEmitting;
		
		expect(instantElectricHeater?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/heating-systems/heat-emitting');
	});
});