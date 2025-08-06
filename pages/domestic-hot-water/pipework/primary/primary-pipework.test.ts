import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import PipeworkForm from './[pipe].vue';
import type { PrimaryPipeworkData } from '~/stores/ecaasStore.types';
import { WaterPipeContentsType, WaterPipeworkLocation } from '~/schema/api-schema.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const hotWaterCylinderId = 'c84528bb-f805-4f1e-95d3-2bd17384fdbe';

const state: PrimaryPipeworkData = {
	name: 'Pipework Kitchen Sink',
	internalDiameter: 10,
	externalDiameter: 10,
	length: 3,
	insulationThickness: 5,
	thermalConductivity: 1,
	surfaceReflectivity: true,
	pipeContents: WaterPipeContentsType.water,
	hotWaterCylinder: hotWaterCylinderId,
	location: WaterPipeworkLocation.internal
};

describe('Primary pipework form', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	const addHotWaterCylinder = () => {
		store.$patch({
			domesticHotWater: {
				waterHeating: {
					hotWaterCylinder: {
						data: [{
							id: hotWaterCylinderId,
							name: 'Hot water cylinder 1',
							storageCylinderVolume: 5,
							dailyEnergyLoss: 1,
							heatSource: '463c94f6-566c-49b2-af27-57e5c68b5c30'
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
		await user.click(screen.getByTestId('surfaceReflectivity_yes'));
		await user.click(screen.getByTestId('pipeContents_water'));
		await user.click(screen.getByTestId(`hotWaterCylinder_${hotWaterCylinderId}`));
		await user.click(screen.getByTestId('location_internal'));
	};

	test('data is saved to store state when form is valid', async () => {
		addHotWaterCylinder();
		await renderSuspended(PipeworkForm);
		
		await populateValidForm();
		await user.click(screen.getByRole('button'));
		
		const { data } = store.domesticHotWater.pipework.primaryPipework;

		expect(data[0]).toEqual(state);
	});

	test('form is prepopulated when data exists in state', async () => {
		addHotWaterCylinder();

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
		expect((await screen.findByTestId('surfaceReflectivity_yes')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('pipeContents_water')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId(`hotWaterCylinder_${hotWaterCylinderId}`)).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('location_internal')).hasAttribute('checked')).toBe(true);
	});

	test('required error messages are displayed when empty form is submitted', async () => {
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
		expect((await screen.findByTestId('hotWaterCylinder_error'))).toBeDefined();
		expect((await screen.findByTestId('location_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(PipeworkForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pipeworkErrorSummary'))).toBeDefined();
	});

	it('navigates to pipework page when valid form is completed', async () => {
		addHotWaterCylinder();
		await renderSuspended(PipeworkForm);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));
		
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/pipework');
	});
});
