import WwhrsForm from './[wwhrs].vue';
import type { WwhrsData } from '~/stores/ecaasStore.types';
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/vue';

describe('wwhrs form', () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport('navigateTo', () => {
		return navigateToMock;
	});

	const state: WwhrsData = {
		name: 'WWHRS 1',
		outlet: 'mixedShower_0',
		type: 'a',
		flowRate: 10,
		efficiency: 10,
		proportionOfUse: 0.5
	};

	const addStoreData = () => {
		store.$patch({
			domesticHotWater: {
				hotWaterOutlets: {
					mixedShower: {
						data: [{
							name: 'Mixed shower 1'
						}]
					}
				}
			}}
		);
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'WWHRS 1');
		await user.click(screen.getByTestId('outlet_mixedShower_0'));
		await user.click(screen.getByTestId('type_a'));
		await user.type(screen.getByTestId('flowRate'), '10');
		await user.type(screen.getByTestId('efficiency'), '10');
		await user.type(screen.getByTestId('proportionOfUse'), '0.5');
		await user.tab();
	};

	afterEach(() => {
		store.$reset();
	});

	it('data is saved to store state when form is valid', async () => {
		addStoreData();
		await renderSuspended(WwhrsForm);

		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data } = store.domesticHotWater.wwhrs;

		expect(data[0]).toEqual(state);
	});

	it('form is prepopulated correctly when data exists in state', async () => {
		store.$patch({
			domesticHotWater: {
				wwhrs: {
					data: [state]
				}
			}}
		);

		addStoreData();
		await renderSuspended(WwhrsForm, {
			route: {
				params: { wwhrs: '0' }
			}
		});

		expect((await screen.findByTestId('name') as HTMLInputElement).value).toBe('WWHRS 1');
		expect((await screen.findByTestId('outlet_mixedShower_0')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('type_a')).hasAttribute('checked')).toBe(true);
		expect((await screen.findByTestId('flowRate') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('efficiency') as HTMLInputElement).value).toBe('10');
		expect((await screen.findByTestId('proportionOfUse') as HTMLInputElement).value).toBe('0.5');
	});

	it('required error messages are displayed when empty form is submitted', async () => {
		await renderSuspended(WwhrsForm);

		await user.click(screen.getByRole('button'));

		expect(await screen.findByTestId('name_error')).toBeDefined();
		expect(await screen.findByTestId('outlet_error')).toBeDefined();
		expect(await screen.findByTestId('type_error')).toBeDefined();
		expect(await screen.findByTestId('flowRate_error')).toBeDefined();
		expect(await screen.findByTestId('efficiency_error')).toBeDefined();
		expect(await screen.findByTestId('proportionOfUse_error')).toBeDefined();
	});

	it('error summary is displayed when an invalid form in submitted', async () => {
		await renderSuspended(WwhrsForm);

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('wwhrsErrorSummary'))).toBeDefined();
	});

	it('navigates to WWHRS page when valid form is completed', async () => {
		addStoreData();
		await renderSuspended(WwhrsForm);
	
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { complete } = store.domesticHotWater.wwhrs;
		
		expect(complete).toBe(true);
		expect(navigateToMock).toHaveBeenCalledWith('/domestic-hot-water/wwhrs');
	});
});
