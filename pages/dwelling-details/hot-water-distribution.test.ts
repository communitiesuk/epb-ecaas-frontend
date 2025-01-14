import { screen } from '@testing-library/vue'
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime'
import { userEvent } from '@testing-library/user-event'
import HotWaterDistribution from './hot-water-distribution.vue'
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

describe('Hot water distribution', () => {
  const store = useEcaasStore()

  afterEach(() => {
    store.$reset()
  })

  it('data is saved to store state when form is valid', async () => {
    const user = userEvent.setup()

    await renderSuspended(HotWaterDistribution)

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

    expect(data).toEqual(state)
    expect(complete).toBe(true)
    expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details')
  })
})
