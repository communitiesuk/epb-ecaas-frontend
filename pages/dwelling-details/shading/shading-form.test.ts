import ShadingForm from './[shading].vue';
import type { ShadingData } from '~/stores/ecaasStore.types';

import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/vue';

describe('shading form', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	const shading1: ShadingData = {
		name: "Big Tree",
		startAngle: 10,
		endAngle: 20,
		objectType: "obstacle",
		height: 3,
		distance: 2
	};

	const shading2: ShadingData = {
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
		await user.type(screen.getByTestId('startAngle'), '10');
		await user.type(screen.getByTestId('endAngle'), '20');
		await user.click(screen.getByTestId('objectType_obstacle'));
		await user.type(screen.getByTestId('height'), '3');
		await user.type(screen.getByTestId('distance'), '2');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { data } = store.dwellingDetails.shading;

		expect(data[0]).toEqual(shading1);
		expect(navigateToMock).toHaveBeenCalledWith('/dwelling-details/shading');
	});

	it('data is saved to correct object in store state when form is valid', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1, shading2]
				}
			}}
		);

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: '1' }
			}
		});

		await user.tab();
		await user.clear(screen.getByTestId('name'));
		await user.type(screen.getByTestId('name'), 'Wall');
		await user.tab();
		await user.click(screen.getByRole('button'));

		const { data } = store.dwellingDetails.shading;

		expect(data[0]).toEqual(shading1);
		expect(data[1].name).toBe('Wall');
	});

	it('form is prepopulated correctly when data exists in state', async () => {
		store.$patch({
			dwellingDetails: {
				shading: {
					data: [shading1, shading2]
				}
			}}
		);

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Big Tree');
		expect((await screen.findByTestId('startAngle') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('endAngle') as HTMLInputElement).value).toBe('20');
		expect(((await screen.findByTestId('objectType_obstacle')).hasAttribute('checked'))).toBe(true);
		expect((await screen.findByTestId('height') as HTMLInputElement).value).toBe('3');
		expect((await screen.findByTestId('distance') as HTMLInputElement).value).toBe('2');

		await renderSuspended(ShadingForm, {
			route: {
				params: { shading: '1' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('Small Tree');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(ShadingForm);

		await user.click(screen.getByRole('button'));

		expect(await screen.findByTestId('name_error')).toBeDefined();
		expect(await screen.findByTestId('startAngle_error')).toBeDefined();
		expect(await screen.findByTestId('endAngle_error')).toBeDefined();
		expect(await screen.findByTestId('objectType_error')).toBeDefined();
		expect(await screen.findByTestId('height_error')).toBeDefined();
		expect(await screen.findByTestId('distance_error')).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(ShadingForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('ShadingErrorSummary'))).toBeDefined();
	});
});
