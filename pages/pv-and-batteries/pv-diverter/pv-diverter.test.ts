import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from '@testing-library/vue';
import PvDiverter from './[diverter].vue';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe('pv diverter', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const state: PvDiverterData = {
		name: "PV Diverter 1",
		energyDivertedToHeatGeneration: 'heatPump_0',
		energyDivertedToStorageTank: '0'
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
							name: 'Heat pump'
						}]
					}
				}
			},
			domesticHotWater: {
				waterHeating: {
					storageTank: {
						data: [{
							name: 'Storage tank'
						}]
					}
				}
			}
		});
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'PV Diverter 1');
		await user.click(screen.getByTestId('energyDivertedToHeatGeneration_heatPump_0'));
		await user.click(screen.getByTestId('energyDivertedToStorageTank_0'));
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
		expect((await screen.findByTestId('energyDivertedToHeatGeneration_heatPump_0')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('energyDivertedToStorageTank_0')).hasAttribute('checked')).toBe(true);
	});
		
	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(PvDiverter);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('energyDivertedToHeatGeneration_error'))).toBeDefined();
		expect((await screen.findByTestId('energyDivertedToStorageTank_error'))).toBeDefined();
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

		const { complete } = store.pvAndBatteries.pvDiverter;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/pv-and-batteries');
	});
});