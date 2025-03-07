import { screen } from '@testing-library/vue';
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime';
import { userEvent } from '@testing-library/user-event';
import HotWaterDistributionForm from './[distribution].vue';
import type { HotWaterDistributionData } from '~/stores/ecaasStore.types';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

const state: HotWaterDistributionData = {
	name: 'Pipework Kitchen Sink',
	length: 3,
	location: 'internal',
	internalDiameter: 0.09
};

describe('Hot water distribution form', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(HotWaterDistributionForm);

		await user.type(screen.getByTestId('name'), 'Pipework Kitchen Sink');
		await user.click(screen.getByTestId('location_internal'));
		await user.type(screen.getByTestId('length'), '3');
		await user.type(screen.getByTestId('internalDiameter'), '0.09');
		
		await user.tab();
		
		await user.click(screen.getByRole('button'));
		
		const { data, complete } = store.hotWaterOutlets.hotWaterDistribution;

		expect(data[0]).toEqual(state);
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/hot-water-outlets/hot-water-distribution');
	});

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			hotWaterOutlets: {
				hotWaterDistribution: {
					data: [state]
				}
			}
		});

		await renderSuspended(HotWaterDistributionForm, {
			route: {
				params: { distribution: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Pipework Kitchen Sink');
		expect((await screen.findByTestId('location_internal')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('length') as HTMLInputElement).value).toBe('3');
		expect((await screen.findByTestId('internalDiameter') as HTMLInputElement).value).toBe('0.09');

	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(HotWaterDistributionForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('location_error'))).toBeDefined();
		expect((await screen.findByTestId('length_error'))).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(HotWaterDistributionForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('hotWaterDistributionErrorSummary'))).toBeDefined();
	});
});
