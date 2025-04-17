import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import HeatInterfaceUnit from './[interface].vue';
import { v4 as uuidv4 } from 'uuid';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

vi.mock('uuid');

describe('heatInterfaceUnit', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatInterfaceUnit: HeatInterfaceUnitData = {
		id: '463c94f6-566c-49b2-af27-57e5c68b5c30',
		name: 'Heat interface unit 1'
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Heat interface unit 1');
		await user.tab();
	};

	it('data is saved to store state when form is valid', async () => {
		vi.mocked(uuidv4).mockReturnValue(heatInterfaceUnit.id as unknown as Buffer);

		await renderSuspended(HeatInterfaceUnit);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.heatingSystems.heatGeneration.heatInterfaceUnit;
		
		expect(data[0]).toEqual(heatInterfaceUnit);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatInterfaceUnit: {
						data: [heatInterfaceUnit]
					}
				}
			}
		});

		await renderSuspended(HeatInterfaceUnit, {
			route: {
				params: { 'interface': '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Heat interface unit 1');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(HeatInterfaceUnit);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(HeatInterfaceUnit);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('heatInterfaceUnitErrorSummary'))).toBeDefined();
	});

	it('navigates to hot water outlets page when valid form is completed', async () => {
		await renderSuspended(HeatInterfaceUnit);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { heatInterfaceUnit } = store.heatingSystems.heatGeneration;
		
		expect(heatInterfaceUnit?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/heating-systems/heat-generation');
	});
});