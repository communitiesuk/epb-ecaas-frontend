import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import HeatNetwork from './[network].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('heatNetwork', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatNetwork: HeatNetworkData = {
		name: 'Heat network 1'
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Heat network 1');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(HeatNetwork);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.heatingSystems.heatGeneration.heatNetwork;
		
		expect(data[0]).toEqual(heatNetwork);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatNetwork: {
						data: [heatNetwork]
					}
				}
			}
		});

		await renderSuspended(HeatNetwork, {
			route: {
				params: { 'network': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Heat network 1');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(HeatNetwork);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(HeatNetwork);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('heatNetworkErrorSummary'))).toBeDefined();
	});

	it('navigates to heat generation page when valid form is completed', async () => {
		await renderSuspended(HeatNetwork);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { heatNetwork } = store.heatingSystems.heatGeneration;
		
		expect(heatNetwork?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/heating-systems/heat-generation');
	});
});