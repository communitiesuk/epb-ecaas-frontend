import { screen } from '@testing-library/vue'
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime'
import { userEvent } from '@testing-library/user-event'
import HotWaterDistributionForm from './[distribution].vue'
import type { HotWaterDistributionData } from '~/stores/ecaasStore.types'

const navigateToMock = vi.hoisted(() => vi.fn())
mockNuxtImport('navigateTo', () => {
	return navigateToMock
})

const state: HotWaterDistributionData = {
	name: 'Pipework Kitchen Sink',
	length: 3,
	location: 'internal',
	internalDiameter: 30,
	externalDiameter: 33,
	insulationThickness: 10,
	insulationThermalConductivity: 35,
	pipeContents: 'air',
	surfaceReflectivity: 'yes',
}

describe('Hot water distribution form', () => {
	const store = useEcaasStore()
	const user = userEvent.setup()

	afterEach(() => {
		store.$reset()
	})

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(HotWaterDistributionForm)

		await user.type(screen.getByTestId('name'), 'Pipework Kitchen Sink')
		await user.click(screen.getByTestId('location_internal'))
		await user.type(screen.getByTestId('length'), '3')
		await user.type(screen.getByTestId('internalDiameter'), '30')
		await user.type(screen.getByTestId('externalDiameter'), '33')
		await user.type(screen.getByTestId('insulationThickness'), '10')
		await user.type(screen.getByTestId('insulationThermalConductivity'), '35')
		await user.click(screen.getByTestId('pipeContents_air'))
		await user.click(screen.getByTestId('surfaceReflectivity_yes'))
		await user.click(screen.getByRole('button'))

		const { data, complete } = store.dwellingDetails.hotWaterDistribution

		expect(data.distributions?.[0]).toEqual(state)
		expect(complete).toBe(true)
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details/hot-water-distribution')
	})

	it('form is prepopulated when data exists in state', async () => {
		store.$patch({
			dwellingDetails: {
				hotWaterDistribution: {
					data: {
						distributions: [state]
					}
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
		expect((await screen.findByTestId('internalDiameter') as HTMLInputElement).value).toBe('30');
		expect((await screen.findByTestId('externalDiameter') as HTMLInputElement).value).toBe('33');
		expect((await screen.findByTestId('insulationThickness') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('insulationThermalConductivity') as HTMLInputElement).value).toBe('35');
		expect((await screen.findByTestId('pipeContents_air')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('surfaceReflectivity_yes')).hasAttribute('checked')).toBe(true);
	})

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
})
