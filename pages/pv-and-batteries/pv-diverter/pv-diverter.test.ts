import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import PvDiverter from './[diverter].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

vi.mock('uuid');

describe('pv diverter', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const heatPumpId = '463c94f6-566c-49b2-af27-57e5c68b5c30';
	const hotWaterCylinderId = 'c84528bb-f805-4f1e-95d3-2bd17384fdbe';

	const state: PvDiverterData = {
		name: "PV Diverter 1",
		energyDivertedToHeatGeneration: heatPumpId,
		energyDivertedToHotWaterCylinder: hotWaterCylinderId
	};

	afterEach(() => {
		store.$reset();
	});

	const addStoreData = () => {
		store.$patch({
			heatingSystems: {
				heatGeneration: {
					heatPump: {
						data: [{
							id: heatPumpId,
							name: 'Heat pump'
						}]
					}
				}
			},
			domesticHotWater: {
				waterHeating: {
					hotWaterCylinder: {
						data: [{
							id: hotWaterCylinderId,
							name: 'Hot water cylinder'
						}]
					}
				}
			}
		});
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'PV Diverter 1');
		await user.click(screen.getByTestId(`energyDivertedToHeatGeneration_${heatPumpId}`));
		await user.click(screen.getByTestId(`energyDivertedToHotWaterCylinder_${hotWaterCylinderId}`));
	};

	it('data is saved to store state when form is valid', async () => {
		addStoreData();
		await renderSuspended(PvDiverter);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data = [] } = store.pvAndBatteries.pvDiverter;
		
		expect(data[0]).toEqual(state);
	});
	
	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			pvAndBatteries: {
				pvDiverter: {
					data: [state]
				}
			}
		});

		addStoreData();
		await renderSuspended(PvDiverter, {
			route: {
				params: { diverter: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('PV Diverter 1');
		expect((await screen.findByTestId(`energyDivertedToHeatGeneration_${heatPumpId}`)).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId(`energyDivertedToHotWaterCylinder_${hotWaterCylinderId}`)).hasAttribute('checked')).toBe(true);
	});
		
	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(PvDiverter);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('energyDivertedToHeatGeneration_error'))).toBeDefined();
		expect((await screen.findByTestId('energyDivertedToHotWaterCylinder_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(PvDiverter);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pvDiverterErrorSummary'))).toBeDefined();
	});

	it('navigates to pv and batteries page when valid form is completed', async () => {
		addStoreData();
		await renderSuspended(PvDiverter);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));
		;
		expect(navigateToMock).toHaveBeenCalledWith('/pv-and-batteries');
	});
});