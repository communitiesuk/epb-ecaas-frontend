import ShadingForm from './[shading].vue'
import type { ShadingObject } from '~/stores/ecaasStore.types'

import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime"
import { userEvent } from '@testing-library/user-event'
import { screen } from '@testing-library/vue'

describe('shading form', () => {
    const store = useEcaasStore()
    const user = userEvent.setup()
    const navigateToMock = vi.hoisted(() => vi.fn())
    mockNuxtImport('navigateTo', () => {
	    return navigateToMock
    })

    it('data is saved to store state when form is valid', async () => {
        await renderSuspended(ShadingForm)

        await user.type(screen.getByTestId('name'), 'Cherry tree back garden')
        await user.click(screen.getByRole('button'))

        const { data, complete } = store.dwellingDetails.shading

        const expected_shading: ShadingObject = {name: 'Cherry tree back garden'}
        console.log({store: store.dwellingDetails.shading})
        expect(complete).toBe(true)
        expect(data.shadingObjects?.[0]).toEqual(expected_shading)
        expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details/shading')
    })
})
