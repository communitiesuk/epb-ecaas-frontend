import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import PipeworkForm from './[pipe].vue';
import type { SecondaryPipeworkData } from '~/stores/ecaasStore.types';
import { WaterPipeworkLocation } from '~/schema/api-schema.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: SecondaryPipeworkData = {
	name: 'Pipework Kitchen Sink',
	length: 3,
	location: WaterPipeworkLocation.internal,
	internalDiameter: 9
};

describe('Secondary pipework form', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	test('data is saved to store state when form is valid', async () => {
		await renderSuspended(PipeworkForm);

		await user.type(screen.getByTestId('name'), 'Pipework Kitchen Sink');
		await user.click(screen.getByTestId('location_internal'));
		await user.type(screen.getByTestId('length'), '3');
		await user.type(screen.getByTestId('internalDiameter'), '9');
		
		await user.tab();
		
		await user.click(screen.getByRole('button'));
		
		const { data } = store.domesticHotWater.pipework.secondaryPipework;

		expect(data[0]).toEqual(state);
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/pipework');
	});

	test('form is prepopulated when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				pipework: {
					secondaryPipework: {
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
		expect((await screen.findByTestId('location_internal')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('length') as HTMLInputElement).value).toBe('3');
		expect((await screen.findByTestId('internalDiameter') as HTMLInputElement).value).toBe('9');
	});

	test('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(PipeworkForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('location_error'))).toBeDefined();
		expect((await screen.findByTestId('length_error'))).toBeDefined();
	});

	test('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(PipeworkForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('pipeworkErrorSummary'))).toBeDefined();
	});
});
