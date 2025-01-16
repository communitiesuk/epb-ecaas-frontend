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

        expect(complete).toBe(true)
        expect(data.shadingObjects?.[0]).toEqual(expected_shading)
        expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details/shading')
    })

    it('form is prepopulated correctly when data exists in state', async () => {
        const shading_1: ShadingObject = {
            name: "Big Tree"
        };
        const shading_2: ShadingObject = {
            name: "Small Tree"
        };

        store.$patch({dwellingDetails: {
            shading: {
                data: {
                    shadingObjects: [shading_1, shading_2]
                }
            }
        }})

        await renderSuspended(ShadingForm, {
            route: {
                params: { shading: '0' }
            }
        });
        expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Big Tree');

        await renderSuspended(ShadingForm, {
            route: {
                params: { shading: '1' }
            }
        });

        expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Small Tree');
    })
})
