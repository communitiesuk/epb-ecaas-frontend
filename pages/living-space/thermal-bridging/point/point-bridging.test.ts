import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import PointBridging from './[bridging].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('point thermal bridges', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: PointThermalBridgeData = {
		name: 'Point 1',
		heatTransferCoefficient: 1
	};

	afterEach(() => {
		store.$reset();
	});

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Point 1');
		await user.type(screen.getByTestId('heatTransferCoefficient'), '1');
		await user.tab();
	};
	
	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(PointBridging);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { livingSpacePointThermalBridges } = store.livingSpaceFabric.livingSpaceThermalBridging;
		
		expect(livingSpacePointThermalBridges?.data[0]).toEqual(state);
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			livingSpaceFabric: {
				livingSpaceThermalBridging: {
					livingSpacePointThermalBridges: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(PointBridging, {
			route: {
				params: { bridging: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Point 1');
		expect((await screen.findByTestId('heatTransferCoefficient') as HTMLInputElement).value).toBe('1');
	});

	it('shows required error messages when empty form is submitted', async () => {
		await renderSuspended(PointBridging);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('heatTransferCoefficient_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(PointBridging);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pointBridgeErrorSummary'))).toBeDefined();
	});

	it('navigates to thermal bridging page when valid form is completed', async () => {
		await renderSuspended(PointBridging);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { livingSpacePointThermalBridges } = store.livingSpaceFabric.livingSpaceThermalBridging;
		
		expect(livingSpacePointThermalBridges?.complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/living-space/thermal-bridging');
	});
});