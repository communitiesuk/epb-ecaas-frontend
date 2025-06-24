import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import LinearBridging from './[bridging].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('linear thermal bridges', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: LinearThermalBridgeData = {
		name: 'E1: Steel lintel with perforated steel base plate',
		typeOfThermalBridge: 'e1',
		linearThermalTransmittance: 1,
		length: 2
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.selectOptions(screen.getByTestId('typeOfThermalBridge'), 'e1');
		await user.type(screen.getByTestId('linearThermalTransmittance'), '1');
		await user.type(screen.getByTestId('length'), '2');
		await user.tab();
	};
	
	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(LinearBridging);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { livingSpaceLinearThermalBridges } = store.livingSpaceFabric.livingSpaceThermalBridging;
		
		expect(livingSpaceLinearThermalBridges?.data[0]).toEqual(state);
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceThermalBridging: {
					livingSpaceLinearThermalBridges: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(LinearBridging, {
			route: {
				params: { bridging: '0' }
			}
		});

		expect((await screen.findByTestId('typeOfThermalBridge') as HTMLSelectElement).value).toBe('e1');
		expect((await screen.findByTestId('linearThermalTransmittance') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('length') as HTMLInputElement).value).toBe('2');
	});

	it('shows required error messages when empty form is submitted', async () => {
		await renderSuspended(LinearBridging);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('typeOfThermalBridge_error'))).toBeDefined();
		expect((await screen.findByTestId('linearThermalTransmittance_error'))).toBeDefined();
		expect((await screen.findByTestId('length_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(LinearBridging);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('linearBridgeErrorSummary'))).toBeDefined();
	});

	it('navigates to thermal bridging page when valid form is completed', async () => {
		await renderSuspended(LinearBridging);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		expect(navigateToMock).toHaveBeenCalledWith('/living-space/thermal-bridging');
	});
});