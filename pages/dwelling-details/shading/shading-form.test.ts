import ShadingForm from './[shading].vue';
import type { ShadingObject } from '~/stores/ecaasStore.types';

import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/vue';

describe('shading form', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	const shading1: ShadingObject = {
		name: "Big Tree",
		direction: 30,
		objectType: "obstacle",
		height: 3
	};

	const shading2: ShadingObject = {
		...shading1,
		name: 'Small Tree'
	};

	mockNuxtImport('navigateTo', () => {
	    return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		await renderSuspended(ShadingForm);

		await user.type(screen.getByTestId('name'), 'Big Tree');
		await user.type(screen.getByTestId('direction'), '30');
		await user.click(screen.getByTestId('objectType_obstacle'));
		await user.type(screen.getByTestId('height'), '3'),
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { data, complete } = store.dwellingDetails.shading;

		expect(complete).toBe(true);
		expect(data.shadingObjects?.[0]).toEqual(shading1);
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details/shading');
	});

	it('form is prepopulated correctly when data exists in state', async () => {
		store.$patch({dwellingDetails: {
			shading: {
				data: {
					shadingObjects: [shading1, shading2]
				}
			}
		}});

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Big Tree');
		expect((await screen.findByTestId('direction') as HTMLInputElement).value).toBe('30');
		expect(((await screen.findByTestId('objectType_obstacle')).hasAttribute('checked'))).toBe(true);
		expect((await screen.findByTestId('height') as HTMLInputElement).value).toBe('3');

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: '1' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Small Tree');
	});

	it('data is saved to correct object in store state when form is valid', async () => {
		store.$patch({dwellingDetails: {
			shading: {
				data: {
					shadingObjects: [shading1, shading2]
				}
			}
		}});

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: '1' }
			}
		});
		await user.clear(screen.getByTestId('name'));
		await user.type(screen.getByTestId('name'), 'Wall');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { data } = store.dwellingDetails.shading;

		expect(data.shadingObjects?.[0]).toEqual(shading1);
		expect(data.shadingObjects?.[1].name).toBe('Wall');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ShadingForm);

		await user.click(screen.getByRole('button'));

		const nameErrorMessage = await screen.findByTestId('name_error');
		const directionErrorMessage = await screen.findByTestId('direction_error');
		const objectTypeErrorMessage = await screen.findByTestId('objectType_error');
		const heightErrorMessage = await screen.findByTestId('height_error');

		expect(nameErrorMessage).toBeDefined();
		expect(directionErrorMessage).toBeDefined();
		expect(objectTypeErrorMessage).toBeDefined();
		expect(heightErrorMessage).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(ShadingForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('ShadingErrorSummary'))).toBeDefined();
	});
});
