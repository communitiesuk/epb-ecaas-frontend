import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import Boiler from './[boiler].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('boiler', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const boiler: BoilerData = {
		name: 'boiler 1'
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'boiler 1');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(Boiler);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.heatingSystems.heatGeneration.boiler;
		
		expect(data[0]).toEqual(boiler);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					boiler: {
						data: [boiler]
					}
				}
			}
		});

		await renderSuspended(Boiler, {
			route: {
				params: { 'boiler': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('boiler 1');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(Boiler);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(Boiler);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('boilerErrorSummary'))).toBeDefined();
	});

	it('navigates to heat generation page when valid form is completed', async () => {
		await renderSuspended(Boiler);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { boiler } = store.heatingSystems.heatGeneration;
		
		expect(boiler?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/heating-systems/heat-generation');
	});
});