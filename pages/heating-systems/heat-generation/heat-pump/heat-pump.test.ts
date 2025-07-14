import { mockNuxtImport, renderSuspended, registerEndpoint  } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import HeatPump from './[pump].vue';
import { v4 as uuidv4 } from 'uuid';
import { productsInCategory } from "~/server/services/products";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

vi.mock('uuid');

registerEndpoint('/api/products', async () => productsInCategory('heatPump'));

describe('heatPump', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatPump: HeatPumpData = {
		id: '463c94f6-566c-49b2-af27-57e5c68b5c30',
		name: 'Heat pump 1',
		productReference: "HEATPUMP-LARGE"
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Heat pump 1');
		await user.click(screen.getByTestId("productReference_HEATPUMP-LARGE"));
		await user.tab();
	};

	test('data is saved to store state when form is valid', async () => {
		vi.mocked(uuidv4).mockReturnValue(heatPump.id as unknown as Buffer);

		await renderSuspended(HeatPump);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.heatingSystems.heatGeneration.heatPump;
		
		expect(data[0]).toEqual(heatPump);
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [heatPump]
					}
				}
			}
		});

		await renderSuspended(HeatPump, {
			route: {
				params: { 'pump': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Heat pump 1');
	});

	test('heat pump is updated when data with id exists in store', async () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [heatPump]
					}
				}
			}
		});

		await renderSuspended(HeatPump, {
			route: {
				params: { 'pump': '0' }
			}
		});

		await user.clear(screen.getByTestId('name'));
		await user.type(screen.getByTestId('name'), 'Heat pump 2');
		await user.click(screen.getByTestId('productReference_HEATPUMP-SMALL'));
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { data } = store.heatingSystems.heatGeneration.heatPump;
		
		expect(data[0]?.id).toBe(heatPump.id);
		expect(data[0]?.name).toBe('Heat pump 2');
		expect(data[0]?.productReference).toBe('HEATPUMP-SMALL');
	});

	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(HeatPump);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(HeatPump);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('heatPumpErrorSummary'))).toBeDefined();
	});

	it('navigates to hot water outlets page when valid form is completed', async () => {
		await renderSuspended(HeatPump);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));
		
		expect(navigateToMock).toHaveBeenCalledWith('/heating-systems/heat-generation');
	});
});