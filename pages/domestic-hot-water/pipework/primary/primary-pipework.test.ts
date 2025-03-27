import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import PipeworkForm from './[pipe].vue';
import type { PrimaryPipeworkData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: PrimaryPipeworkData = {
	name: 'Pipework Kitchen Sink',
	internalDiameter: 10,
	externalDiameter: 10,
	length: 3,
	insulationThickness: 5,
	thermalConductivity: 1,
	surfaceReflectivity: 'reflective',
	pipeContents: 'water',
	storageTank: '0',
	location: 'internal'
};

describe('Primary pipework form', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const addStorageTank = () => {
		store.$patch({
			domesticHotWater: {
				waterHeating: {
					storageTank: {
						data: [{
							name: 'Storage tank 1',
							tankVolume: 5,
							dailyEnergyLoss: 1,
							heatSource: '0'
						}]
					}
				}
			}
		});
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'Pipework Kitchen Sink');
		await user.type(screen.getByTestId('internalDiameter'), '10');
		await user.type(screen.getByTestId('externalDiameter'), '10');
		await user.type(screen.getByTestId('length'), '3');
		await user.type(screen.getByTestId('insulationThickness'), '5');
		await user.type(screen.getByTestId('thermalConductivity'), '1');
		await user.click(screen.getByTestId('surfaceReflectivity_reflective'));
		await user.click(screen.getByTestId('pipeContents_water'));
		await user.click(screen.getByTestId('storageTank_0'));
		await user.click(screen.getByTestId('location_internal'));
	};

	it('data is saved to store state when form is valid', async () => {
		addStorageTank();
		await renderSuspended(PipeworkForm);
		
		await populateValidForm();
		await user.click(screen.getByRole('button'));
		
		const { data } = store.domesticHotWater.pipework.primaryPipework;

		expect(data[0]).toEqual(state);
	});

	it('form is prepopulated when data exists in state', async () => {
		addStorageTank();

		store.$patch({
			domesticHotWater: {
				pipework: {
					primaryPipework: {
						data: [state]
					}
				}
			}
		});

		await renderSuspended(PipeworkForm, {
			route: {
				params: { pipe: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Pipework Kitchen Sink');
		expect((await screen.findByTestId('internalDiameter') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('externalDiameter') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('length') as HTMLInputElement).value).toBe('3');
		expect((await screen.findByTestId('insulationThickness') as HTMLInputElement).value).toBe('5');
		expect((await screen.findByTestId('thermalConductivity') as HTMLInputElement).value).toBe('1');
		expect((await screen.findByTestId('surfaceReflectivity_reflective')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('pipeContents_water')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('storageTank_0')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('location_internal')).hasAttribute('checked')).toBe(true);
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(PipeworkForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('internalDiameter_error'))).toBeDefined();
		expect((await screen.findByTestId('externalDiameter_error'))).toBeDefined();
		expect((await screen.findByTestId('length_error'))).toBeDefined();
		expect((await screen.findByTestId('insulationThickness_error'))).toBeDefined();
		expect((await screen.findByTestId('thermalConductivity_error'))).toBeDefined();
		expect((await screen.findByTestId('surfaceReflectivity_error'))).toBeDefined();
		expect((await screen.findByTestId('pipeContents_error'))).toBeDefined();
		expect((await screen.findByTestId('storageTank_error'))).toBeDefined();
		expect((await screen.findByTestId('location_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(PipeworkForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pipeworkErrorSummary'))).toBeDefined();
	});

	it('navigates to pipework page when valid form is completed', async () => {
		addStorageTank();
		await renderSuspended(PipeworkForm);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { complete } = store.domesticHotWater.pipework.primaryPipework;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/pipework');
	});
});
